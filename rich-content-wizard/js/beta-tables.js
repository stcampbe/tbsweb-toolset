document.addEventListener('DOMContentLoaded', function() {
/**
 * AutoTabler™ - HTML Table Wizard Script
 *
 * This script powers the AutoTabler tool, providing functionality for formatting,
 * styling, and enhancing the accessibility of HTML tables within a Monaco editor interface.
 */

// ===================================================================================
// I. GLOBAL VARIABLES & STATE MANAGEMENT
// ===================================================================================

let entityDecorations = []; // Stores Monaco decorations for highlighting HTML entities.
let messageTimeoutId; // Holds the timeout ID for the notification message box.
let tableDataMap = new Map(); // Maps dropdown option values to table data { outerHTML, range }.
let currentHighlightDecorationId = []; // Stores the ID of the current editor line highlight decoration.
let originalTableHtmlForCancel = ''; // Stores a table's state to revert on modal cancel.

// --- Universal Formatting Options State (for "Format ALL Tables" modal) ---
window.captionAlignment = 'left';
window.colHeaderAlignment = 'none';
window.rowHeaderAlignment = 'none';
window.colspanHeaderAlignment = 'none';
window.dataCellsAlignment = 'none';

// --- Custom Formatting Options State (for "Custom Format" modal) ---
window.customizeCaptionAlignment = 'none';
window.customizeColHeaderAlignment = 'none';
window.customizeRowHeaderAlignment = 'none';
window.customizeColspanHeaderAlignment = 'none';
window.customizeDataCellsAlignment = 'none';
window.isCustomizeManualDataAlign = false;
window.isCustomizeManualColHeaderAlign = false;
window.isCustomizeManualRowHeaderAlign = false;
window.isCustomizeManualColspanAlign = false;
window.originalTableState = null; // Stores table state when custom modal opens.

// ===================================================================================
// II. EDITOR & CORE UTILITY FUNCTIONS
// ===================================================================================

/**
 * Gets the current HTML content from the Monaco editor.
 * @returns {string} The editor's content.
 */
function getEditorContent() {
    return window.monacoEditorInstance ? window.monacoEditorInstance.getValue() : '';
}

/**
 * Sets the HTML content in the Monaco editor, preserving the cursor position.
 * @param {string} content - The HTML content to set.
 */
function setEditorContent(content) {
    if (window.monacoEditorInstance) {
        const currentPosition = window.monacoEditorInstance.getPosition();
        window.monacoEditorInstance.setValue(content);
        window.monacoEditorInstance.setPosition(currentPosition);
    }
}

/**
 * Displays a temporary message in the top-center message box.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message ('success', 'error', 'info').
 */
function showMessage(message, type) {
    const messageBox = document.getElementById('tbl-message-box');
    if (!messageBox) return;

    if (messageTimeoutId) {
        clearTimeout(messageTimeoutId);
        messageBox.classList.remove('tbl-message-box-fade-in', 'tbl-message-box-fade-out');
        messageBox.removeEventListener('animationend', messageBoxAnimationHandler);
        messageTimeoutId = null;
    }

    function messageBoxAnimationHandler() {
        messageBox.classList.remove('tbl-message-box-fade-out');
        messageBox.classList.add('hidden');
        messageBox.removeEventListener('animationend', messageBoxAnimationHandler);
    }

    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'bg-green-700', 'bg-red-700', 'bg-blue-700', 'bg-gray-400', 'text-white');
    messageBox.classList.add('text-white');

    if (type === 'success') messageBox.classList.add('bg-green-700');
    else if (type === 'error') messageBox.classList.add('bg-red-700');
    else messageBox.classList.add('bg-blue-700');

    messageBox.classList.add('tbl-message-box-fade-in');

    messageTimeoutId = setTimeout(() => {
        messageBox.classList.remove('tbl-message-box-fade-in');
        messageBox.classList.add('tbl-message-box-fade-out');
        messageBox.addEventListener('animationend', messageBoxAnimationHandler);
    }, 4500);
}

/**
 * Applies syntax highlighting for HTML character entities within the editor.
 */
function applyEntityHighlighting() {
    if (!window.monacoEditorInstance) return;
    const model = window.monacoEditorInstance.getModel();
    if (!model) return;

    const newDecorations = [];
    const text = model.getValue();
    const regex = /&[a-zA-Z0-9#]+;/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
        const startPos = model.getPositionAt(match.index);
        const endPos = model.getPositionAt(match.index + match[0].length);
        newDecorations.push({
            range: new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column),
            options: {
                inlineClassName: 'entity-highlight',
                hoverMessage: {
                    value: 'HTML Character Entity'
                }
            }
        });
    }
    entityDecorations = model.deltaDecorations(entityDecorations, newDecorations);
}

/**
 * Clears any active line highlighting decorations in the Monaco editor.
 */
function clearMonacoHighlight() {
    if (window.monacoEditorInstance && currentHighlightDecorationId.length > 0) {
        window.monacoEditorInstance.getModel().deltaDecorations(currentHighlightDecorationId, []);
        currentHighlightDecorationId = [];
    }
}

/**
 * Encodes a string to Base64.
 * @param {string} str - The string to encode.
 * @returns {string} The Base64 encoded string.
 */
function encodeBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

/**
 * Decodes a Base64 string.
 * @param {string} str - The Base64 string to decode.
 * @returns {string} The decoded string.
 */
function decodeBase64(str) {
    return decodeURIComponent(escape(atob(str)));
}

/**
 * Protects `data-` attributes by Base64 encoding their values.
 * This prevents beautifiers from corrupting complex attribute values (e.g., JSON).
 * @param {string} htmlString - The HTML content to process.
 * @returns {string} The HTML with protected data attributes.
 */
function protectDataAttributes(htmlString) {
    const regex = /(data-[a-zA-Z0-9-]+)="([^"]*)"/g;
    return htmlString.replace(regex, (match, attrName, value) => {
        const encodedValue = encodeBase64(value);
        return `data-temp-protected-${attrName}="${encodedValue}"`;
    });
}

/**
 * Restores protected `data-` attributes by decoding their values.
 * @param {string} htmlString - The HTML content with protected attributes.
 * @returns {string} The HTML with original data attributes restored.
 */
function restoreDataAttributes(htmlString) {
    const regex = /data-temp-protected-(data-[a-zA-Z0-9-]+)="([^"]*)"/g;
    return htmlString.replace(regex, (match, originalAttrName, encodedValue) => {
        try {
            let decodedValue = decodeBase64(encodedValue);
            let safeValue = decodedValue.replace(/"/g, '&quot;');
            safeValue = safeValue.replace(/&#34;/g, '&quot;');
            return `${originalAttrName}="${safeValue}"`;
        } catch (e) {
            console.error("Error decoding Base64 data-attribute:", e);
            return '';
        }
    });
}

/**
 * Converts common named and literal character entities to their numeric HTML entity equivalents.
 * @param {string} htmlString - The HTML content to process.
 * @returns {string} The processed HTML string.
 */
function convertAllEntitiesToNumeric(htmlString) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;

    const walker = document.createTreeWalker(
        tempDiv,
        NodeFilter.SHOW_TEXT, {
            acceptNode: function(textNode) {
                let parent = textNode.parentNode;
                while (parent) {
                    const tagName = parent.tagName ? parent.tagName.toLowerCase() : '';
                    if (['script', 'style', 'time'].includes(tagName)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    parent = parent.parentNode;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );

    const textNodesToProcess = [];
    let currentNode;
    while (currentNode = walker.nextNode()) {
        textNodesToProcess.push(currentNode);
    }

    textNodesToProcess.forEach(textNode => {
        let text = textNode.nodeValue;
        text = text.replace(/’/g, '&#8217;');
        text = text.replace(/&rsquo;/g, '&#8217;');
        text = text.replace(/“/g, '&#8220;');
        text = text.replace(/&ldquo;/g, '&#8220;');
        text = text.replace(/”/g, '&#8221;');
        text = text.replace(/&rdquo;/g, '&#8221;');
        text = text.replace(/«/g, '&#171;');
        text = text.replace(/&laquo;/g, '&#171;');
        text = text.replace(/»/g, '&#187;');
        text = text.replace(/&raquo;/g, '&#187;');
        text = text.replace(/\u00A0/g, '&#160;');
        text = text.replace(/&nbsp;/g, '&#160;');
        textNode.nodeValue = text;
    });

    let processedHtml = tempDiv.innerHTML;
    processedHtml = processedHtml.replace(/&nbsp;/g, '&#160;');
    processedHtml = processedHtml.replace(/&rsquo;/g, '&#8217;');
    processedHtml = processedHtml.replace(/&ldquo;/g, '&#8220;');
    processedHtml = processedHtml.replace(/&rdquo;/g, '&#8221;');
    processedHtml = processedHtml.replace(/&laquo;/g, '&#171;');
    processedHtml = processedHtml.replace(/&raquo;/g, '&#187;');
    processedHtml = processedHtml.replace(/&amp;#(\d+);/g, '&#$1;');

    return processedHtml;
}

/**
 * Removes the `class` attribute from elements where it is empty.
 * @param {HTMLElement} containerElement - The element to clean.
 */
function cleanupEmptyClassAttributes(containerElement) {
    if (!containerElement) return;
    const elements = [containerElement, ...containerElement.querySelectorAll('[class]')];
    elements.forEach(el => {
        if (el.hasAttribute('class') && el.classList.length === 0) {
            el.removeAttribute('class');
        }
    });
}

/**
 * Calculates the effective number of columns in a row, accounting for `colspan`.
 * @param {HTMLTableRowElement} row - The table row element.
 * @returns {number} The total column span of the row.
 */
function getEffectiveColumnCount(row) {
    if (!row) return 0;
    return Array.from(row.children).reduce((count, cell) => {
        return count + parseInt(cell.getAttribute('colspan') || '1', 10);
    }, 0);
}

/**
 * Robustly finds the end index of a `<table>` tag, accounting for nested tables.
 * @param {string} html - The full HTML string to search within.
 * @param {number} startIndex - The starting index of the `<table` tag.
 * @returns {number} The index immediately after the matching `</table>` tag.
 */
function findTableEndIndex(html, startIndex) {
    let depth = 1;
    let currentIndex = html.indexOf('>', startIndex);
    if (currentIndex === -1) return -1;
    currentIndex += 1;

    while (depth > 0 && currentIndex < html.length) {
        const nextClose = html.indexOf('</table', currentIndex);
        const nextOpen = html.indexOf('<table', currentIndex);

        if (nextClose === -1) return -1; // Malformed HTML.

        if (nextOpen !== -1 && nextOpen < nextClose) {
            depth++;
            currentIndex = html.indexOf('>', nextOpen) + 1;
        } else {
            depth--;
            currentIndex = html.indexOf('>', nextClose) + 1;
        }

        if (currentIndex === 0) return -1; // Unclosed tag, prevent infinite loop.
    }
    return currentIndex;
}
/**
 * Updates the enabled/disabled state of table control buttons based on dropdown selection.
 * @param {boolean} isTableSelected - True if a specific table is selected, false otherwise.
 */
function updateTableButtonStates(isTableSelected) {
    const universalButtons = [
        document.getElementById('open-tbl-options-tbl-modal-btn'),
        document.getElementById('reset-universal-btn')
    ];
    const specificButtons = [
        document.getElementById('tbl-customize-button'),
        document.getElementById('reset-tableformat-btn'),
        document.getElementById('force-scope-button'),
        document.getElementById('force-id-button'),
        document.getElementById('reset-tablescopeid-btn'),
        document.getElementById('tbl-toggle-interactive')
    ];

    // These buttons are ENABLED when NO table is selected.
    universalButtons.forEach(btn => {
        if (btn) {
            btn.disabled = isTableSelected;
            btn.classList.toggle('opacity-50', isTableSelected);
            btn.classList.toggle('cursor-not-allowed', isTableSelected);
        }
    });

    // These buttons are ENABLED when A table IS selected.
    specificButtons.forEach(btn => {
        if (btn) {
            btn.disabled = !isTableSelected;
            btn.classList.toggle('opacity-50', !isTableSelected);
            btn.classList.toggle('cursor-not-allowed', !isTableSelected);
        }
    });
}

// ===================================================================================
// III. UI & MODAL MANAGEMENT
// ===================================================================================

/**
 * Opens the "Format ALL Tables" options modal.
 */
function openOptionsModal() {
    const optionsModalOverlay = document.getElementById('tbl-options-tbl-modal-overlay');
    optionsModalOverlay.classList.remove('hidden');
    initializeToggleSwitchesVisuals(optionsModalOverlay);
}

/**
 * Closes the "Format ALL Tables" options modal.
 */
function closeOptionsModal() {
    const optionsModalOverlay = document.getElementById('tbl-options-tbl-modal-overlay');
    optionsModalOverlay.classList.add('hidden');
}

/**
 * Closes the "Custom Format" modal and restores the table's original state if not saved.
 */
function closeCustomizeModal() {
    const customizeModalOverlay = document.getElementById('tbl-customize-modal-overlay');
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    const selectedValue = tableSearchDropdown.value;

    // Restore original table state if the user is canceling.
    if (selectedValue && window.originalTableState) {
        const tableInfo = tableDataMap.get(selectedValue);
        if (tableInfo) {
            tableInfo.outerHTML = window.originalTableState;
        }
    }
    window.originalTableState = null; // Clear the stored state.

    customizeModalOverlay.classList.add('hidden');

    // Send a message to the preview iframe to reset its cell selection states.
    const customizePreviewIframe = document.getElementById('tbl-customize-preview-iframe');
    if (customizePreviewIframe && customizePreviewIframe.contentWindow) {
        customizePreviewIframe.contentWindow.postMessage({
            type: 'resetCellStates'
        }, '*');
    }
}

/**
 * Sets up click handlers for a button group (e.g., alignment controls).
 * @param {string} groupId - The ID of the button group container.
 * @param {string} alignmentVarName - The name of the global window variable to update.
 * @param {HTMLElement} [parentContainer=document] - The parent element for the querySelector.
 * @param {Function} [callback] - Optional callback to execute after state update.
 */
function setupButtonGroup(groupId, alignmentVarName, parentContainer = document, callback = null) {
    const group = parentContainer.querySelector('#' + groupId);
    if (!group) return;

    const alignmentButtons = group.querySelectorAll('button[data-align]');
    const resetButton = group.querySelector('.trash-button');

    const clickHandler = (alignValue) => {
        // Update visual state.
        alignmentButtons.forEach(btn => btn.classList.remove('active'));
        if (alignValue !== 'none') {
            const clickedButton = Array.from(alignmentButtons).find(btn => btn.dataset.align === alignValue);
            if (clickedButton) clickedButton.classList.add('active');
        }

        // Update the global state variable.
        if (alignmentVarName) {
            window[alignmentVarName] = alignValue;
        }

        // Exit manual mode for customize modal when a global choice is made.
        if (groupId === 'tbl-customize-data-cells-tbl-alignment-group') window.isCustomizeManualDataAlign = false;
        if (groupId === 'tbl-customize-col-headers-tbl-alignment-group') window.isCustomizeManualColHeaderAlign = false;
        if (groupId === 'tbl-customize-row-headers-tbl-alignment-group') window.isCustomizeManualRowHeaderAlign = false;
        if (groupId === 'tbl-customize-colspan-headers-tbl-alignment-group') window.isCustomizeManualColspanAlign = false;

        if (callback) callback();
    };

    alignmentButtons.forEach(button => {
        button.addEventListener('click', () => clickHandler(button.dataset.align));
    });

    if (resetButton) {
        resetButton.addEventListener('click', () => clickHandler('none'));
    }
}

/**
 * Populates the table selection dropdown by scanning the editor's content.
 * @param {string} [keepSelectionValue] - Optional value to re-select after populating.
 */
function populateTableSearchDropdown(keepSelectionValue) {
    if (!window.monacoEditorInstance) return;
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    if (!tableSearchDropdown) return;

    const model = window.monacoEditorInstance.getModel();
    const currentSelectedValue = keepSelectionValue !== undefined ? keepSelectionValue : tableSearchDropdown.value;
    const htmlContent = getEditorContent();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const tablesFromDom = Array.from(doc.querySelectorAll('table'));

    tableSearchDropdown.innerHTML = '<option value="">-- Select a table --</option>';
    tableDataMap.clear();

    let searchStartIndex = 0;
    let unidCounter = 1;

    // Correlate DOM tables with their string positions to build the map.
    tablesFromDom.forEach(tableDom => {
        const startIndex = htmlContent.indexOf('<table', searchStartIndex);
        if (startIndex === -1) return;

        const endIndex = findTableEndIndex(htmlContent, startIndex);
        if (endIndex === -1) {
            searchStartIndex = startIndex + 1; // Skip malformed table and continue.
            return;
        }

        const tableOuterHtml = htmlContent.substring(startIndex, endIndex);
        const startPosition = model.getPositionAt(startIndex);
        const endPosition = model.getPositionAt(endIndex);

        const tableId = tableDom.id;
        const captionElement = tableDom.querySelector('caption');
        const tableCaption = captionElement ? captionElement.textContent.trim() : '';

        const optionValue = tableId ? `id:${tableId}` : `unid:${unidCounter++}`;
        const optionText = `${tableCaption ? tableCaption + ' ' : ''}${tableId ? '(' + tableId + ')' : '(Table ' + (tableDataMap.size + 1) + ')'}`;

        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionText;
        tableSearchDropdown.appendChild(option);

        tableDataMap.set(optionValue, {
            outerHTML: tableOuterHtml,
            range: new monaco.Range(startPosition.lineNumber, startPosition.column, endPosition.lineNumber, endPosition.column)
        });

        searchStartIndex = endIndex;
    });

    // Restore the previously selected value if it still exists.
    if (currentSelectedValue && Array.from(tableSearchDropdown.options).some(opt => opt.value === currentSelectedValue)) {
        tableSearchDropdown.value = currentSelectedValue;
        const customizeModalOverlay = document.getElementById('tbl-customize-modal-overlay');
        const customizeButton = document.getElementById('tbl-customize-button');
        if (!customizeModalOverlay.classList.contains('hidden') && !customizeButton.disabled) {
            updateCustomizeModalPreview();
        }
    } else {
        tableSearchDropdown.value = '';
        clearMonacoHighlight();
        updateCustomizeModalPreview('');
    }
    updateInteractiveButtonState();
}

/**
 * Updates the visual state of all toggle switches in a given container.
 * @param {HTMLElement} [container=document] - The container to search within.
 */
function initializeToggleSwitchesVisuals(container = document) {
    container.querySelectorAll('.tbl-toggle-switch input[type="checkbox"]').forEach(checkbox => {
        const parentLabel = checkbox.closest('.tbl-toggle-switch');
        if (parentLabel) {
            parentLabel.classList.toggle('is-checked', checkbox.checked);
        }
    });
}

/**
 * Updates the disabled state of all interactive buttons.
 */
function updateAllInteractiveButtonStates() {
    // This function needs the `allInteractiveButtons` array, which is populated
    // after the DOM is loaded. It is called from various event handlers.
    if (typeof allInteractiveButtons === 'undefined' || allInteractiveButtons.length === 0) return;

    const anyButtonActive = allInteractiveButtons.some(btn => btn.getAttribute('data-temp-active') === 'true');

    allInteractiveButtons.forEach(btn => {
        btn.disabled = anyButtonActive;
    });

    // Specific handling for modal close buttons.
    const closeOptionsModalButton = document.getElementById('close-tbl-options-tbl-modal-btn');
    const closeCustomizeModalButton = document.getElementById('close-tbl-customize-modal-btn');
    if (closeOptionsModalButton) closeOptionsModalButton.disabled = anyButtonActive;
    if (closeCustomizeModalButton) closeCustomizeModalButton.disabled = anyButtonActive;
}

/**
 * Updates the visual state of the 'Toggle Interactive' button based on the selected table.
 */
function updateInteractiveButtonState() {
    const toggleBtn = document.getElementById('tbl-toggle-interactive');
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    if (!toggleBtn || !tableSearchDropdown) return;

    // Reset to default style.
    toggleBtn.classList.remove('bg-yellow-400', 'text-black', 'font-bold');
    toggleBtn.classList.add('bg-gray-700', 'text-white', 'font-bold');

    const selectedValue = tableSearchDropdown.value;
    if (!selectedValue) return;

    const tableInfo = tableDataMap.get(selectedValue);
    if (!tableInfo) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableInfo.outerHTML;
    const table = tempDiv.querySelector('table');

    // Apply active style if the class is present.
    if (table && table.classList.contains('wb-tables')) {
        toggleBtn.classList.add('bg-yellow-400', 'text-black', 'font-bold');
        toggleBtn.classList.remove('bg-gray-700', 'text-white');
    }
}


// ===================================================================================
// IV. CORE FORMATTING & ACCESSIBILITY LOGIC
// ===================================================================================

/**
 * Applies a text alignment class to an element, removing any conflicting ones.
 * @param {HTMLElement} element - The element to style.
 * @param {string} alignment - The alignment to apply ('left', 'center', 'right', 'none').
 * @param {string[]} alignmentClasses - Array of possible alignment classes to manage.
 */
function applyAlignment(element, alignment, alignmentClasses) {
    if (!element) return;
    alignmentClasses.forEach(cls => element.classList.remove(cls));
    if (alignment !== 'none') {
        element.classList.add(`text-${alignment}`);
    }
    cleanupEmptyClassAttributes(element);
}

/**
 * The core engine for formatting a single HTML table based on a set of options.
 * @param {HTMLElement} table - The table DOM element to format.
 * @param {object} options - An object containing all formatting options.
 * @returns {HTMLElement} The formatted table element.
 */
function formatTableLogic(table, options) {
    const globallyManagedClasses = ['table', 'table-condensed', 'table-bordered', 'table-striped', 'table-hover', 'small'];
    const financeRegex = /^\s*([-+]?(?:\d{1,3}(?:[,\s]\d{3})*|\d+)(?:[.,]\d+)?|\((?:\d{1,3}(?:[,\s]\d{3})*|\d+)(?:[.,]\d+)?\))\s*$/;
    const smallClass = 'small';
    const alignmentClasses = ['text-left', 'text-center', 'text-right'];

    // --- Cleanup ---
    table.classList.remove(...globallyManagedClasses);
    Array.from(table.querySelectorAll('*')).forEach(el => {
        el.classList.remove('wb-fnote-inited', 'wb-init');
        if (!options.specificTableId) {
            el.removeAttribute('headers');
            el.removeAttribute('scope');
        }
    });

    // --- Apply Table-level ID and Classes ---
    if (options.specificTableId) {
        let customId = options.tableIdPrefix;
        // Apply the custom ID if provided, otherwise remove the ID if the input is empty.
        if (customId && customId.trim() !== '') {
            table.id = customId.trim();
        } else {
            table.removeAttribute('id');
        }
    } else if (options.applyId) {
        let prefix = options.tableIdPrefix || 'tbl';
        if (options.isFigureTable) {
            prefix = options.figureDataIdPrefix || 'ftbl';
        }
        table.id = `${prefix}${options.assignedIdCounter}`;
    }

    if (options.applyClassTables) table.classList.add('table', 'table-condensed');
    if (options.applyBordered) table.classList.add('table-bordered');
    if (options.applyStriped) table.classList.add('table-striped');
    if (options.applyHover) table.classList.add('table-hover');
    if (options.applyClassSmall) table.classList.add(smallClass);


    // --- Handle Caption ---
    let existingCaptionElement = table.querySelector('caption');
    const shouldHaveCaption = options.applyCaption || options.applyAutoCaption;

    if (shouldHaveCaption) {
        if (!existingCaptionElement) {
            existingCaptionElement = document.createElement('caption');
            table.insertBefore(existingCaptionElement, table.firstChild);
        }

        if (options.applyRemovePTags) {
            Array.from(existingCaptionElement.querySelectorAll('p')).forEach(p => {
                while (p.firstChild) existingCaptionElement.insertBefore(p.firstChild, p);
                p.remove();
            });
        }

        existingCaptionElement.classList.remove('wb-inv');
        if (options.applyInvisibleCaption) {
            existingCaptionElement.classList.add('wb-inv');
        }

        if (options.currentCaptionAlignment !== 'manual') {
            applyAlignment(existingCaptionElement, options.currentCaptionAlignment, alignmentClasses);
        }

        if (options.applyAutoCaption) {
            const captionContent = existingCaptionElement.textContent.trim();
            const isPlaceholderCaption = captionContent === '' || captionContent === '[insert table caption]';

            if (isPlaceholderCaption) {
                let extractedContent = '';
                if (options.specificTableId) {
                    const firstRow = table.querySelector('tr');
                    if (firstRow) {
                        const firstCell = firstRow.firstElementChild;
                        if (firstCell && ['TH', 'TD'].includes(firstCell.tagName)) {
                            const colspan = parseInt(firstCell.getAttribute('colspan') || '1', 10);
                            const totalColumns = getEffectiveColumnCount(firstRow);
                            if (colspan === totalColumns && firstCell.textContent.trim() !== '') {
                                extractedContent = firstCell.textContent.trim();
                            }
                        }
                    }
                } else {
                    let prevSibling = (table.parentNode.classList.contains('table-responsive') ? table.parentNode : table).previousElementSibling;
                    while (prevSibling) {
                        if (['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(prevSibling.tagName)) {
                            extractedContent = prevSibling.textContent.trim();
                            prevSibling.remove();
                            break;
                        }
                        if (prevSibling.nodeType === Node.TEXT_NODE && prevSibling.textContent.trim() !== '') break;
                        prevSibling = prevSibling.previousElementSibling;
                    }
                }
                existingCaptionElement.textContent = extractedContent || `[insert table caption]`;
            }
        } else if (!existingCaptionElement.textContent.trim() || existingCaptionElement.textContent.trim() === '[insert table caption]') {
            existingCaptionElement.textContent = options.preservedCaptionText || `[insert table caption]`;
        }
    } else {
        if (existingCaptionElement) existingCaptionElement.remove();
    }


    // --- Reconstruct thead, tbody, tfoot ---
    const rowsForThead = [],
        rowsForTbody = [],
        rowsForTfoot = [];
    const allDirectChildren = Array.from(table.children).filter(child => ['THEAD', 'TBODY', 'TFOOT', 'TR', 'CAPTION', 'COLGROUP'].includes(child.tagName));
    allDirectChildren.forEach(child => {
        if (child.tagName === 'THEAD') {
            rowsForThead.push(...Array.from(child.querySelectorAll('tr')));
            child.remove();
        } else if (child.tagName === 'TFOOT') {
            rowsForTfoot.push(...Array.from(child.querySelectorAll('tr')));
            child.remove();
        } else if (child.tagName === 'TBODY') {
            rowsForTbody.push(...Array.from(child.querySelectorAll('tr')));
            child.remove();
        } else if (child.tagName === 'TR') {
            rowsForTbody.push(child);
            child.remove();
        }
    });

    if (options.applyHeader) { // Toggled ON
        let headerRowCount = 0;
        if (rowsForThead.length === 0) {
            const potentialHeaderRows = [...rowsForTbody];
            let maxRowSpanEnd = -1;
            for (let i = 0; i < potentialHeaderRows.length; i++) {
                headerRowCount = i + 1;
                potentialHeaderRows[i].querySelectorAll('th, td').forEach(cell => {
                    const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);
                    maxRowSpanEnd = Math.max(maxRowSpanEnd, i + rowspan - 1);
                });
                if (i >= maxRowSpanEnd) break;
            }
        }

        if (headerRowCount > 0) {
            const headerRowsToMove = rowsForTbody.splice(0, headerRowCount);
            headerRowsToMove.forEach(row => {
                const clonedRow = row.cloneNode(true);
                Array.from(clonedRow.querySelectorAll('td')).forEach(td => {
                    const newTh = document.createElement('th');
                    Array.from(td.attributes).forEach(attr => newTh.setAttribute(attr.name, attr.value));
                    newTh.innerHTML = td.innerHTML;
                    td.parentNode.replaceChild(newTh, td);
                });
                rowsForThead.push(clonedRow);
            });
        }
    } else { // Toggled OFF
        if (rowsForThead.length > 0) {
            const rowsToMove = [...rowsForThead];
            rowsForThead.length = 0; // Clear rowsForThead so no thead is created

            rowsToMove.forEach(row => {
                Array.from(row.querySelectorAll('th')).forEach(th => {
                    const newTd = document.createElement('td');
                    Array.from(th.attributes).forEach(attr => newTd.setAttribute(attr.name, attr.value));
                    newTd.innerHTML = th.innerHTML;
                    th.parentNode.replaceChild(newTd, th);
                });
            });

            rowsForTbody.unshift(...rowsToMove); // Prepend rows to tbody
        }
    }

    if (options.applyMakeTfootFromColspan && rowsForTfoot.length === 0 && rowsForTbody.length > 0) {
        const lastRowInTbodyTemp = rowsForTbody[rowsForTbody.length - 1];
        const firstRowForColCount = rowsForThead.length > 0 ? rowsForThead[0] : (rowsForTbody.length > 0 ? rowsForTbody[0] : null);
        if (firstRowForColCount) {
            const totalColumns = getEffectiveColumnCount(firstRowForColCount);
            if (totalColumns > 0 && lastRowInTbodyTemp.cells.length === 1) {
                const singleCell = lastRowInTbodyTemp.firstElementChild;
                const colspan = parseInt(singleCell.getAttribute('colspan') || '1', 10);
                if (colspan >= totalColumns) {
                    rowsForTfoot.push(rowsForTbody.pop());
                }
            }
        }
    }

    const newTheadElement = document.createElement('thead');
    rowsForThead.forEach(row => newTheadElement.appendChild(row));
    const newTbodyElement = document.createElement('tbody');
    rowsForTbody.forEach(row => newTbodyElement.appendChild(row));
    const newTfootElement = document.createElement('tfoot');
    rowsForTfoot.forEach(row => newTfootElement.appendChild(row));


    // --- Apply Row Header (only to tbody rows) ---
    Array.from(newTbodyElement.querySelectorAll('tr')).forEach(row => {
        const firstCell = row.firstElementChild;
        if (firstCell) {
            if (options.applyRowHeader && firstCell.tagName !== 'TH') {
                const newTh = document.createElement('th');
                Array.from(firstCell.attributes).forEach(attr => newTh.setAttribute(attr.name, attr.value));
                newTh.innerHTML = firstCell.innerHTML;
                row.replaceChild(newTh, firstCell);
            } else if (!options.applyRowHeader && firstCell.tagName !== 'TD') {
                const newTd = document.createElement('td');
                Array.from(firstCell.attributes).forEach(attr => newTd.setAttribute(attr.name, attr.value));
                newTd.innerHTML = firstCell.innerHTML;
                row.replaceChild(newTd, firstCell);
            }
        }
    });


    // --- Apply Alignment, Fix Empty Cells, Remove P Tags ---
    const a1CellRef = newTheadElement.querySelector('tr:first-child > *:first-child');
    const allCells = [...newTheadElement.querySelectorAll('th, td'), ...newTbodyElement.querySelectorAll('th, td'), ...newTfootElement.querySelectorAll('th, td')];
    allCells.forEach(cell => {
        if (options.applyFixEmptyCells && cell.textContent.trim() === '' && !cell.innerHTML.includes('&nbsp;') && !cell.innerHTML.includes('&#160;')) {
            // Ignore the A1 cell, which has its own special handling later.
            if (cell !== a1CellRef) {
                cell.innerHTML = '&#160;';
            }
        }

        if (options.applyRemovePTags && !cell.closest('tfoot')) {
            Array.from(cell.querySelectorAll('p')).forEach(p => {
                while (p.firstChild) p.parentNode.insertBefore(p.firstChild, p);
                p.remove();
            });
        }

        if (cell.closest('tfoot')) return;

        if (cell.tagName === 'TD') {
            cell.classList.remove('nowrap', 'text-right');
            if (options.applyFinanceTable && financeRegex.test(cell.textContent.trim())) {
                applyAlignment(cell, 'right', alignmentClasses);
                cell.classList.add('nowrap');
            } else if (options.currentDataCellsAlignment !== 'manual') {
                applyAlignment(cell, options.currentDataCellsAlignment, alignmentClasses);
            }
        } else if (cell.tagName === 'TH') {
            const isTheadCell = cell.closest('thead');
            const isTbodyCell = cell.closest('tbody');
            const isStandardRowHeader = isTbodyCell && cell.parentElement.firstElementChild === cell && !cell.hasAttribute('colspan');

            if (isTheadCell && options.currentColHeaderAlignment !== 'manual') {
                applyAlignment(cell, options.currentColHeaderAlignment, alignmentClasses);
            } else if (isTbodyCell && cell.hasAttribute('colspan') && options.currentColspanHeaderAlignment !== 'manual') {
                applyAlignment(cell, options.currentColspanHeaderAlignment, alignmentClasses);
            } else if (isStandardRowHeader && options.currentRowHeaderAlignment !== 'manual') {
                applyAlignment(cell, options.currentRowHeaderAlignment, alignmentClasses);
            }
        }
    });

    // --- Append structural elements to table in correct order ---
    if (newTheadElement.children.length > 0) table.appendChild(newTheadElement);
    if (options.applyTfootBeforeTbody) {
        if (newTfootElement.children.length > 0) table.appendChild(newTfootElement);
        if (newTbodyElement.children.length > 0) table.appendChild(newTbodyElement);
    } else {
        if (newTbodyElement.children.length > 0) table.appendChild(newTbodyElement);
        if (newTfootElement.children.length > 0) table.appendChild(newTfootElement);
    }

    // --- Apply 'small' class to all TRs if toggled ---
    Array.from(table.querySelectorAll('tr')).forEach(tr => tr.classList.remove(smallClass));
    if (options.applyAddSmallToTr) {
        Array.from(table.querySelectorAll('tr')).forEach(tr => tr.classList.add(smallClass));
    }


    // --- Apply 'active' class based on options ---
    const theadRows = Array.from(table.querySelectorAll('thead tr'));
    theadRows.forEach(tr => tr.classList.toggle('active', options.applyActiveColHeaders));

    const tbodyColspanHeaders = Array.from(table.querySelectorAll('tbody th[colspan]'));
    if (options.activeColspanHeadersCheckboxValue) {
        tbodyColspanHeaders.forEach(th => th.classList.add('active'));
    } else {
        tbodyColspanHeaders.forEach(th => {
            if (!th.hasAttribute('data-manually-set-active')) {
                th.classList.remove('active');
            }
        });
    }

    const tbodyRowHeaders = Array.from(table.querySelectorAll('tbody tr > th:first-child:not([colspan])'));
    if (options.activeRowHeadersCheckboxValue) {
        tbodyRowHeaders.forEach(th => th.classList.add('active'));
    } else {
        tbodyRowHeaders.forEach(th => {
            if (!th.hasAttribute('data-manually-set-active')) {
                th.classList.remove('active');
            }
        });
    }

    // --- Final A1 cell override ---
    const finalThead = table.querySelector('thead');
    if (finalThead) {
        const firstRow = finalThead.querySelector('tr');
        if (firstRow) {
            let a1Cell = firstRow.firstElementChild;
            if (a1Cell) {
                // Condition: cell is empty or just contains a non-breaking space
                const isEmpty = a1Cell.textContent.trim() === '' || a1Cell.innerHTML.trim() === '&nbsp;' || a1Cell.innerHTML.trim() === '&#160;';

                if (isEmpty) {
                    if (a1Cell.tagName === 'TH') {
                        const newTd = document.createElement('td');
                        Array.from(a1Cell.attributes).forEach(attr => {
                            // Don't copy scope if it exists, as it will be a td
                            if (attr.name.toLowerCase() !== 'scope') {
                                newTd.setAttribute(attr.name, attr.value);
                            }
                        });
                        newTd.innerHTML = ''; // Ensure it's truly empty
                        firstRow.replaceChild(newTd, a1Cell);
                    } else if (a1Cell.tagName === 'TD') {
                        // It's already a TD, just make sure it's empty.
                        a1Cell.innerHTML = '';
                    }
                } else if (a1Cell.tagName === 'TD') {
                    // It has content but is a TD, should be a TH
                     const newTh = document.createElement('th');
                     Array.from(a1Cell.attributes).forEach(attr => newTh.setAttribute(attr.name, attr.value));
                     newTh.innerHTML = a1Cell.innerHTML;
                     firstRow.replaceChild(newTh, a1Cell);
                }
            }
        }
    }
    // --- Unwrap <strong> tags inside <th> elements ---
    table.querySelectorAll('th').forEach(th => {
        // If the <th> has the 'fnt-nrml' class, do not unwrap its <strong> tags.
        if (th.classList.contains('fnt-nrml')) {
            return; // Skip this th and move to the next one.
        }

        th.querySelectorAll('strong').forEach(strongTag => {
            const parent = strongTag.parentNode;
            if (parent) {
                // Move all content out of the <strong> tag
                while (strongTag.firstChild) {
                    parent.insertBefore(strongTag.firstChild, strongTag);
                }
                // Remove the now-empty <strong> tag
                parent.removeChild(strongTag);
            }
        });
    });
    // --- Final cleanup ---
    cleanupEmptyClassAttributes(table);
    return table;
}

/**
 * Applies scopes and/or IDs/headers to a table element for accessibility.
 * @param {HTMLElement} tableElement - The table to process.
 * @param {number} tableIndex - The index of the table on the page.
 * @param {string} [forceComplexity] - Optional: 'simple' or 'complex' to override auto-detection.
 * @returns {string} The outerHTML of the processed table.
 */
function autoScopeTableIDs(tableElement, tableIndex, forceComplexity = undefined) {
    if (!tableElement || tableElement.tagName !== 'TABLE') {
        console.error("Invalid input: autoScopeTableIDs requires a TABLE element.");
        return "";
    }

    let tableBaseId = tableElement.id || `t${tableIndex + 1}`;
    tableElement.id = tableBaseId;

    // --- A1 Cell Handling ---
    let a1Cell = tableElement.rows[0] ? tableElement.rows[0].cells[0] : null;
    if (a1Cell) {
        const isA1EffectivelyEmpty = (a1Cell.textContent.trim() === '' || a1Cell.innerHTML.trim() === '&nbsp;' || a1Cell.innerHTML.trim() === '&#160;');
        if (isA1EffectivelyEmpty) {
            if (a1Cell.tagName === 'TH') {
                const newTd = document.createElement('td');
                Array.from(a1Cell.attributes).forEach(attr => newTd.setAttribute(attr.name, attr.value));
                a1Cell.parentNode.replaceChild(newTd, a1Cell);
                a1Cell = newTd;
            }
            a1Cell.innerHTML = '';
        } else if (a1Cell.tagName === 'TD') {
            const newTh = document.createElement('th');
            Array.from(a1Cell.attributes).forEach(attr => newTh.setAttribute(attr.name, attr.value));
            newTh.innerHTML = a1Cell.innerHTML;
            a1Cell.parentNode.replaceChild(newTh, a1Cell);
            a1Cell = newTh;
        }
    }

    // Now, clean attributes from all cells.
    Array.from(tableElement.querySelectorAll('thead th, thead td, tbody th, tbody td')).forEach(cell => {
        cell.removeAttribute('id');
        cell.removeAttribute('headers');
        cell.removeAttribute('scope');
    });

    const firstRowForColCount = tableElement.querySelector('tr');
    const totalColumns = firstRowForColCount ? getEffectiveColumnCount(firstRowForColCount) : 0;

    let isComplexTable;
    if (forceComplexity === 'simple') isComplexTable = false;
    else if (forceComplexity === 'complex') isComplexTable = true;
    else {
        isComplexTable = Array.from(tableElement.querySelectorAll('tbody th, tbody td')).some(cell => cell.hasAttribute('rowspan') || cell.hasAttribute('colspan'));
    }

    if (!isComplexTable) {
        // Simple table: use 'scope' attribute.
        Array.from(tableElement.querySelectorAll('thead th, tbody th')).forEach(th => {
            const parentSection = th.closest('thead, tbody');
            if (parentSection && parentSection.tagName === 'THEAD') {
                th.setAttribute('scope', th.hasAttribute('colspan') ? 'colgroup' : 'col');
            } else if (parentSection && parentSection.tagName === 'TBODY') {
                if (th.hasAttribute('rowspan')) th.setAttribute('scope', 'rowgroup');
                else if (th.hasAttribute('colspan')) {
                    const colspanVal = parseInt(th.getAttribute('colspan') || '1', 10);
                    th.setAttribute('scope', (totalColumns > 0 && colspanVal >= totalColumns) ? 'colgroup' : 'row');
                } else {
                    th.setAttribute('scope', 'row');
                }
            }
        });
    } else {
        // Complex table: use 'id' and 'headers' attributes.
        let counters = { ch: 0, csh: 0, rh: 0, rsh: 0, rcsh: 0, th: 0 };
        Array.from(tableElement.querySelectorAll('thead th, tbody th')).forEach(cell => {
            const parentSection = cell.closest('thead, tbody');
            let prefixKey = '';
            if (parentSection && parentSection.tagName === 'THEAD') {
                prefixKey = cell.hasAttribute('colspan') ? 'csh' : 'ch';
            } else if (parentSection && parentSection.tagName === 'TBODY') {
                if (cell.hasAttribute('colspan')) {
                    const colspanVal = parseInt(cell.getAttribute('colspan') || '1', 10);
                    prefixKey = (totalColumns > 0 && colspanVal >= totalColumns) ? 'rcsh' : 'rh';
                } else {
                    prefixKey = cell.hasAttribute('rowspan') ? 'rsh' : 'rh';
                }
            } else {
                prefixKey = 'th';
            }
            cell.id = `${tableBaseId}-${prefixKey}-${counters[prefixKey]++}`;
        });

        const rows = Array.from(tableElement.rows);
        const grid = [];

        // 1. Build a grid representation of the table.
        rows.forEach((row, rowIndex) => {
            let currentCol = 0;
            Array.from(row.cells).forEach(cell => {
                while (grid[rowIndex] && grid[rowIndex][currentCol]) currentCol++;
                if (!grid[rowIndex]) grid[rowIndex] = [];
                const colspan = parseInt(cell.getAttribute('colspan') || '1', 10);
                const rowspan = parseInt(cell.getAttribute('rowspan') || '1', 10);
                for (let r = 0; r < rowspan; r++) {
                    if (!grid[rowIndex + r]) grid[rowIndex + r] = [];
                    for (let c = 0; c < colspan; c++) grid[rowIndex + r][currentCol + c] = cell;
                }
                currentCol += colspan;
            });
        });

        // 2. Iterate through the grid to apply `headers` attributes.
        grid.forEach((gridRow, r) => {
            if (!gridRow) return;
            gridRow.forEach((cell, c) => {
                const isCellOrigin = (r === 0 || grid[r - 1][c] !== cell) && (c === 0 || grid[r][c - 1] !== cell);
                if (!cell || !isCellOrigin || cell.closest('tfoot')) return;

                const isFullWidthHeader = cell.tagName === 'TH' && parseInt(cell.getAttribute('colspan') || '1', 10) >= totalColumns;
                if (isFullWidthHeader) {
                    cell.removeAttribute('headers');
                    return;
                }

                const headers = new Set();

                // A. Find all column headers from the THEAD vertically above the current cell.
                // This is now restricted to the thead to prevent incorrect associations in the tbody.
                for (let i = r - 1; i >= 0; i--) {
                    const headerAbove = grid[i][c];
                    if (headerAbove && headerAbove.tagName === 'TH' && headerAbove.id && headerAbove.closest('thead')) {
                        headers.add(headerAbove.id);
                    }
                }

                // B. For data cells or tbody row headers, find row headers to the left.
                if (cell.tagName === 'TD' || cell.closest('tbody')) {
                    for (let j = c - 1; j >= 0; j--) {
                        const headerLeft = grid[r][j];
                        if (headerLeft && headerLeft.tagName === 'TH' && headerLeft.id && parseInt(headerLeft.getAttribute('colspan') || '1', 10) < totalColumns) {
                            headers.add(headerLeft.id);
                        }
                    }
                }

                // C. For cells within the tbody, find the MOST RECENT full-width section header from any row above.
                if (cell.closest('tbody')) {
                    for (let i = r - 1; i >= 0; i--) {
                        const potentialSectionHeader = grid[i][0];
                        if (potentialSectionHeader && potentialSectionHeader.tagName === 'TH' && potentialSectionHeader.id && parseInt(potentialSectionHeader.getAttribute('colspan') || '1', 10) >= totalColumns) {
                            headers.add(potentialSectionHeader.id);
                            break; // Found the nearest one, so stop.
                        }
                    }
                }

                if (headers.size > 0) {
                    cell.setAttribute('headers', Array.from(headers).join(' '));
                } else {
                    cell.removeAttribute('headers');
                }
            });
        });
    }
    cleanupEmptyClassAttributes(tableElement);
    return tableElement.outerHTML;
}

/**
 * Removes empty `headers=""` attributes from an HTML string.
 * @param {string} htmlString - The HTML to clean.
 * @returns {string} The cleaned HTML string.
 */
function cleanEmptyHeadersAttribute(htmlString) {
    return htmlString.replace(/\sheaders=["']{2}/gi, '');
}

/**
 * Formats a string containing numbers according to language-specific conventions.
 * @param {string} text - The string to format.
 * @param {string} lang - The target language ('eng' or 'fra').
 * @returns {string} The formatted string.
 */
function formatNumberString(text, lang) {
    const regex = /([+\-]?)\s*([\$€]?)\s*([\d][\d\s,.'&#160;&nbsp;]*)\s*([\$€%]?)/g;
    return text.replace(regex, (match, sign, preSymbol, numberStr, postSymbol) => {
        if (!/\d/.test(numberStr)) return match;
        if ((numberStr.match(/\./g) || []).length > 1 && (numberStr.match(/,/g) || []).length === 0) return match;

        let parsableStr = numberStr.replace(/&nbsp;|&#160;/g, ' ').trim();
        const hasComma = parsableStr.includes(','),
            hasPeriod = parsableStr.includes('.');

        if (hasComma && hasPeriod) {
            parsableStr = (parsableStr.indexOf(',') > parsableStr.indexOf('.')) ?
                parsableStr.replace(/\./g, '').replace(',', '.') :
                parsableStr.replace(/,/g, '');
        } else if (hasComma) {
            const parts = parsableStr.split(',');
            if (parts[parts.length - 1].length <= 2) {
                parsableStr = parsableStr.replace(/,/g, (m, offset, str) => (offset === str.lastIndexOf(',')) ? '.' : '');
            } else {
                parsableStr = parsableStr.replace(/,/g, '');
            }
        } else if (hasPeriod && parsableStr.split('.').length > 1 && parsableStr.split('.').pop().length === 3) {
            parsableStr = parsableStr.replace(/\./g, '');
        }
        parsableStr = parsableStr.replace(/\s/g, '');

        const num = parseFloat(parsableStr);
        if (isNaN(num)) return match;

        const symbol = preSymbol || postSymbol;
        const originalDecimalPartLength = (parsableStr.split('.')[1] || '').length;
        let minFractions = 0,
            maxFractions = 0;

        if (num % 1 !== 0) {
            minFractions = originalDecimalPartLength;
            maxFractions = Math.max(2, originalDecimalPartLength);
        }

        const localeOptions = {
            minimumFractionDigits: minFractions,
            maximumFractionDigits: maxFractions
        };
        if (num % 1 === 0 && originalDecimalPartLength === 0) {
            localeOptions.minimumFractionDigits = 0;
            localeOptions.maximumFractionDigits = 0;
        }

        if (lang === 'eng') {
            let formattedNum = num.toLocaleString('en-CA', localeOptions);
            if (symbol === '$' || symbol === '€') return `${sign}${symbol}${formattedNum}`;
            if (symbol === '%') return `${sign}${formattedNum}${symbol}`;
            return `${sign}${formattedNum}`;
        } else if (lang === 'fra') {
            let formattedNum = num.toLocaleString('fr-CA', localeOptions);
            formattedNum = formattedNum.replace(/\s/g, '\u00A0');
            if (symbol) return `${sign}${formattedNum}\u00A0${symbol}`;
            return `${sign}${formattedNum}`;
        }
        return match;
    });
}

// ===================================================================================
// V. MAIN FEATURE FUNCTIONS (BIND TO BUTTONS)
// ===================================================================================

/**
 * Iterates through all tables in the editor and applies universal formatting options.
 */
function formatHtmlTables() {
    closeOptionsModal();
    if (!window.monacoEditorInstance) {
        showMessage('Editor is not ready.', 'info');
        return;
    }
    const htmlText = getEditorContent();
    if (!htmlText.trim()) {
        showMessage('No HTML content to format.', 'info');
        return;
    }

    const formatButton = document.getElementById('format-tbl-button-modal');
    formatButton.textContent = 'Formatting...';
    formatButton.setAttribute('data-temp-active', 'true');
    updateAllInteractiveButtonStates();

    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlText;
        const tables = tempDiv.querySelectorAll('table');

        if (tables.length === 0) {
            showMessage('No HTML tables found to format.', 'info');
        } else {
            let tblCounter = 1,
                ftblCounter = 1;
            tables.forEach(table => {
                const oldTableId = table.id; // Capture the original ID before it's changed.
                const isFigureTable = table.closest('figure') !== null;
                const options = {
                    applyId: document.getElementById('id-checkbox').checked,
                    tableIdPrefix: document.getElementById('page-id-prefix-input').value.trim(),
                    figureDataIdPrefix: document.getElementById('figure-data-id-prefix-input').value.trim(),
                    applyClassTables: document.getElementById('class-tables-checkbox').checked,
                    applyCaption: document.getElementById('caption-checkbox').checked,
                    applyAutoCaption: document.getElementById('auto-caption-checkbox').checked,
                    applyInvisibleCaption: document.getElementById('inv-caption-checkbox').checked,
                    applyFixEmptyCells: document.getElementById('fix-empty-cells-checkbox').checked,
                    applyRemovePTags: document.getElementById('remove-p-tags-checkbox').checked,
                    applyMakeTfootFromColspan: document.getElementById('make-tfoot-from-colspan-checkbox').checked,
                    applyTfootBeforeTbody: document.getElementById('make-tfoot-before-tbody-checkbox').checked,
                    applyAddSmallToTr: document.getElementById('add-small-to-tr-checkbox').checked,
                    applyHeader: document.getElementById('header-checkbox').checked,
                    applyRowHeader: document.getElementById('row-header-checkbox').checked,
                    applyBordered: document.getElementById('bordered-checkbox').checked,
                    applyStriped: document.getElementById('striped-checkbox').checked,
                    applyHover: document.getElementById('hover-checkbox').checked,
                    applyActiveColHeaders: document.getElementById('active-col-headers-checkbox').checked,
                    activeColspanHeadersCheckboxValue: document.getElementById('active-colspan-headers-checkbox').checked,
                    activeRowHeadersCheckboxValue: document.getElementById('active-row-headers-checkbox').checked,
                    applyClassSmall: document.getElementById('class-small-checkbox').checked,
                    applyFinanceTable: document.getElementById('finance-table-checkbox').checked,
                    currentCaptionAlignment: window.captionAlignment,
                    currentColHeaderAlignment: window.colHeaderAlignment,
                    currentRowHeaderAlignment: window.rowHeaderAlignment,
                    currentColspanHeaderAlignment: window.colspanHeaderAlignment,
                    currentDataCellsAlignment: window.dataCellsAlignment,
                    assignedIdCounter: isFigureTable ? ftblCounter++ : tblCounter++,
                    isFigureTable: isFigureTable,
                    specificTableId: false
                };
                
                formatTableLogic(table, options);

                if (options.applyId) {
                    const newTableId = table.id;

                    // --- ROBUST FOOTNOTE RE-IDing LOGIC ---
                    const footnoteIdMap = {};
        
                    const oldFnHeaderId = oldTableId ? `${oldTableId}fn` : 'fn';
                    const fnHeader = table.querySelector(`tfoot [id="${oldFnHeaderId}"], tfoot [id="fn"]`);
                    if (fnHeader) {
                        footnoteIdMap[fnHeader.id] = `${newTableId}fn`;
                    }
                    
                    table.querySelectorAll('[id*="fn"]').forEach(el => {
                        const oldId = el.id;
                        const idParts = oldId.match(/(?:(.*?))?fn(\d+)((?:-rf)?(?:-\d+)*)?$/);
                        if (idParts) {
                            const originalFootnoteNum = idParts[2];
                            const oldSuffix = idParts[3] || '';
                            const oldPrefix = idParts[1] || '';
                            const oldBaseId = `${oldPrefix}fn${originalFootnoteNum}`;
                            const newBaseId = `${newTableId}fn${originalFootnoteNum}`;
                            const newFullId = `${newBaseId}${oldSuffix}`;
                            footnoteIdMap[oldId] = newFullId;
                            footnoteIdMap[oldBaseId] = newBaseId;
                        }
                    });
        
                    table.querySelectorAll('[id]').forEach(el => {
                        if (footnoteIdMap[el.id]) {
                            el.id = footnoteIdMap[el.id];
                        }
                    });
                    table.querySelectorAll('a[href^="#"]').forEach(link => {
                        const oldAnchor = link.getAttribute('href').substring(1);
                        if (footnoteIdMap[oldAnchor]) {
                            link.setAttribute('href', `#${footnoteIdMap[oldAnchor]}`);
                        }
                    });
                }
            });

            // Clean up any manual active markers before final output.
            tempDiv.querySelectorAll('[data-manually-set-active]').forEach(el => el.removeAttribute('data-manually-set-active'));

            let formattedContent = tempDiv.innerHTML;
            formattedContent = protectDataAttributes(formattedContent);
            formattedContent = html_beautify(formattedContent, {
                indent_size: 4,
                space_in_paren: true,
                preserve_newlines: false,
                extra_liners: []
            });
            formattedContent = restoreDataAttributes(formattedContent);
            formattedContent = convertAllEntitiesToNumeric(formattedContent);
            setEditorContent(formattedContent);
            const prevSelectedTable = document.getElementById('table-search-dropdown').value;
            applyEntityHighlighting();
            populateTableSearchDropdown(prevSelectedTable);
            showMessage('HTML tables formatted successfully!', 'success');
        }
    } catch (e) {
        console.error("Error formatting HTML tables:", e);
        showMessage('An error occurred during formatting.', 'error');
    } finally {
        setTimeout(() => {
            formatButton.textContent = 'Format Tables';
            formatButton.removeAttribute('data-temp-active');
            updateAllInteractiveButtonStates();
        }, 1500);
    }
}

/**
 * Applies the custom formatting options to the currently selected table.
 */
function formatSpecificTable() {
    if (!window.monacoEditorInstance) return;

    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    const selectedValue = tableSearchDropdown.value;
    if (!selectedValue) {
        showMessage('No table selected for customization.', 'info');
        return;
    }

    const tableInfo = tableDataMap.get(selectedValue);
    if (!tableInfo || !tableInfo.range) {
        showMessage('Could not find the selected table\'s location.', 'error');
        return;
    }

    let formattedTableOuterHTML = tableInfo.outerHTML;

    // Clean up the tracking attribute before writing back to the editor.
    const finalDiv = document.createElement('div');
    finalDiv.innerHTML = formattedTableOuterHTML;
    finalDiv.querySelectorAll('[data-manually-set-active]').forEach(el => el.removeAttribute('data-manually-set-active'));
    formattedTableOuterHTML = finalDiv.innerHTML;


    window.originalTableState = null; // Commit the change, don't revert on close.
    closeCustomizeModal();

    const editOperation = {
        range: tableInfo.range,
        text: formattedTableOuterHTML,
        forceMoveMarkers: true
    };
    window.monacoEditorInstance.executeEdits('table-formatter', [editOperation]);

    setTimeout(() => {
        applyEntityHighlighting();
        populateTableSearchDropdown(selectedValue);
    }, 100);

    const formatSpecificTableButton = document.getElementById('format-specific-table-button');
    const originalHtml = formatSpecificTableButton.innerHTML;
    formatSpecificTableButton.innerHTML = 'Formatting...';
    formatSpecificTableButton.setAttribute('data-temp-active', 'true');
    updateAllInteractiveButtonStates();
    setTimeout(() => {
        formatSpecificTableButton.innerHTML = originalHtml;
        formatSpecificTableButton.removeAttribute('data-temp-active');
        updateAllInteractiveButtonStates();
        showMessage('Selected table customized successfully!', 'success');
    }, 1500);
}

/**
 * Gathers options from the "Custom Format" modal and formats the selected table in memory.
 * @returns {string} The HTML string of the formatted table for preview.
 */
function generatePreviewTableHtml() {
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    const selectedValue = tableSearchDropdown.value;
    const tableInfo = tableDataMap.get(selectedValue);
    if (!tableInfo) return '';

    const tempOriginalDivForId = document.createElement('div');
    tempOriginalDivForId.innerHTML = tableInfo.outerHTML;
    const oldTableId = tempOriginalDivForId.querySelector('table')?.id || '';

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableInfo.outerHTML;
    const clonedTable = tempDiv.querySelector('table');
    if (!clonedTable) return '';

    const tempOriginalDiv = document.createElement('div');
    tempOriginalDiv.innerHTML = window.originalTableState || tableInfo.outerHTML;
    const originalCaption = tempOriginalDiv.querySelector('caption');

    const customizeOptions = {
        preservedCaptionText: originalCaption ? originalCaption.innerHTML : null,
        tableIdPrefix: document.getElementById('tbl-customize-page-id-prefix-input').value.trim(),
        applyClassTables: document.getElementById('tbl-customize-class-tables-checkbox').checked,
        applyCaption: document.getElementById('tbl-customize-caption-checkbox').checked,
        applyInvisibleCaption: document.getElementById('tbl-customize-inv-caption-checkbox').checked,
        applyFixEmptyCells: document.getElementById('tbl-customize-fix-empty-cells-checkbox').checked,
        applyRemovePTags: document.getElementById('tbl-customize-remove-p-tags-checkbox').checked,
        applyMakeTfootFromColspan: document.getElementById('tbl-customize-make-tfoot-from-colspan-checkbox').checked,
        applyTfootBeforeTbody: document.getElementById('tbl-customize-make-tfoot-before-tbody-checkbox').checked,
        applyAddSmallToTr: document.getElementById('tbl-customize-add-small-to-tr-checkbox').checked,
        applyHeader: document.getElementById('tbl-customize-header-checkbox').checked,
        applyRowHeader: document.getElementById('tbl-customize-row-header-checkbox').checked,
        applyBordered: document.getElementById('tbl-customize-bordered-checkbox').checked,
        applyStriped: document.getElementById('tbl-customize-striped-checkbox').checked,
        applyHover: document.getElementById('tbl-customize-hover-checkbox').checked,
        applyActiveColHeaders: document.getElementById('tbl-customize-active-col-headers-checkbox').checked,
        activeColspanHeadersCheckboxValue: document.getElementById('tbl-customize-active-colspan-headers-checkbox').checked,
        activeRowHeadersCheckboxValue: document.getElementById('tbl-customize-active-row-headers-checkbox').checked,
        applyClassSmall: document.getElementById('tbl-customize-class-small-checkbox').checked,
        applyFinanceTable: document.getElementById('tbl-customize-finance-table-checkbox').checked,
        currentCaptionAlignment: window.customizeCaptionAlignment,
        currentColHeaderAlignment: window.isCustomizeManualColHeaderAlign ? 'manual' : window.customizeColHeaderAlignment,
        currentRowHeaderAlignment: window.isCustomizeManualRowHeaderAlign ? 'manual' : window.customizeRowHeaderAlignment,
        currentColspanHeaderAlignment: window.isCustomizeManualColspanAlign ? 'manual' : window.customizeColspanHeaderAlignment,
        currentDataCellsAlignment: window.isCustomizeManualDataAlign ? 'manual' : window.customizeDataCellsAlignment,
        specificTableId: selectedValue
    };

    const formattedTableElement = formatTableLogic(clonedTable, customizeOptions);
    const newTableId = formattedTableElement.id;

    if (newTableId) {
        // --- Robust Footnote Re-IDing Logic ---
        const footnoteIdMap = {};

        // 1. Handle the main footnote header (e.g., id="fn" or id="tbl1fn")
        const oldFnHeaderId = oldTableId ? `${oldTableId}fn` : 'fn';
        const fnHeader = formattedTableElement.querySelector(`tfoot [id="${oldFnHeaderId}"], tfoot [id="fn"]`);
        if (fnHeader) {
            footnoteIdMap[fnHeader.id] = `${newTableId}fn`;
        }
        
        // 2. Build a map of all required footnote ID changes.
        const allFnElements = formattedTableElement.querySelectorAll('[id*="fn"]');
        allFnElements.forEach(el => {
            const oldId = el.id;
            // This regex intelligently parses complex IDs like "tbl1fn2-rf-0"
            const idParts = oldId.match(/(?:(.*?))?fn(\d+)((?:-rf)?(?:-\d+)*)?$/);
            if (idParts) {
                const originalFootnoteNum = idParts[2]; // The core number, e.g., "2"
                const oldSuffix = idParts[3] || '';    // The suffix, e.g., "-rf-0"
                
                // Reconstruct the old base ID to ensure we map all variations
                const oldPrefix = idParts[1] || '';
                const oldBaseId = `${oldPrefix}fn${originalFootnoteNum}`;
                
                const newBaseId = `${newTableId}fn${originalFootnoteNum}`;
                const newFullId = `${newBaseId}${oldSuffix}`;

                footnoteIdMap[oldId] = newFullId;
                footnoteIdMap[oldBaseId] = newBaseId;
            }
        });

        // 3. Apply the changes from the map.
        // Update all element IDs
        formattedTableElement.querySelectorAll('[id]').forEach(el => {
            if (footnoteIdMap[el.id]) {
                el.id = footnoteIdMap[el.id];
            }
        });
        // Update all anchor hrefs
        formattedTableElement.querySelectorAll('a[href^="#"]').forEach(link => {
            const oldAnchor = link.getAttribute('href').substring(1);
            if (footnoteIdMap[oldAnchor]) {
                link.setAttribute('href', `#${footnoteIdMap[oldAnchor]}`);
            }
        });
    }

    let formattedHtml = formattedTableElement.outerHTML;
    formattedHtml = protectDataAttributes(formattedHtml);
    formattedHtml = html_beautify(formattedHtml, {
        indent_size: 4,
        space_in_paren: true,
        preserve_newlines: false,
        extra_liners: []
    });
    formattedHtml = restoreDataAttributes(formattedHtml);
    formattedHtml = convertAllEntitiesToNumeric(formattedHtml);

    return formattedHtml;
}

/**
 * Updates the "Custom Format" modal's preview iframe with new content.
 * @param {string} [htmlContentToPreview] - Optional HTML to preview; otherwise generated.
 */
function updateCustomizeModalPreview(htmlContentToPreview) {
    const finalHtmlToPreview = (htmlContentToPreview === undefined) ?
        generatePreviewTableHtml() :
        htmlContentToPreview;

    // Stage the changes by updating the in-memory map.
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    const selectedValue = tableSearchDropdown.value;
    const tableInfo = tableDataMap.get(selectedValue);
    if (tableInfo) {
        tableInfo.outerHTML = finalHtmlToPreview;
    }

    // Disguise WET classes that trigger on load to prevent interference.
    const tempPreviewDiv = document.createElement('div');
    tempPreviewDiv.innerHTML = finalHtmlToPreview;
    tempPreviewDiv.querySelectorAll('.wb-fnote').forEach(section => {
        section.classList.remove('wb-fnote');
        section.dataset.wasWbFnote = 'true';
    });
    const disguisedHtmlForPreview = tempPreviewDiv.innerHTML;

    const customizePreviewIframe = document.getElementById('tbl-customize-preview-iframe');
    if (!customizePreviewIframe) return;

    const baseHtml = `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Table Preview</title>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css">
            <link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/css/theme.min.css">
            <style>
                body { user-select: none; }
                td, th, caption { transition: background-color 0.1s ease-in-out; }
                .tbl-cell-hover { background-color: rgba(173, 216, 230, 0.3) !important; }
                .highlighted-cell { background-color: rgba(173, 216, 230, 0.7) !important; border: 1px solid #3b82f6 !important; }
                .fnt-nrml { font-weight: normal !important; }
                .mrgn-lft-sm { margin-left: 0.5rem; } .mrgn-lft-md { margin-left: 1rem; }
                .mrgn-lft-lg { margin-left: 1.5rem; } .mrgn-lft-xl { margin-left: 2rem; }
            </style>
        </head>
        <body>
            <main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement">
                <div class="container"><div class="table-responsive">${disguisedHtmlForPreview}</div></div>
            </main>
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"><\/script>
            <script src="https://www.canada.ca/etc/designs/canada/wet-boew/js/wet-boew.min.js"><\/script>
            <script src="https://www.canada.ca/etc/designs/canada/wet-boew/js/theme.min.js"><\/script>
            <script>
                // This inline script runs inside the iframe to handle cell selection and communication.
                document.addEventListener('DOMContentLoaded', () => {
                    $(document).on("wb-ready.wb", function(event) {
                        document.querySelectorAll('[data-was-wb-fnote="true"]').forEach(section => {
                            section.classList.add('wb-fnote');
                            section.removeAttribute('data-was-wb-fnote');
                            section.classList.remove('wb-init', 'wb-fnote-inited');
                            if (section.id.startsWith('wb-auto-')) section.removeAttribute('id');
                            section.querySelectorAll('dt, dd').forEach(el => {
                                el.removeAttribute('tabindex');
                                if (el.tagName === 'DT' && el.id.endsWith('-dt')) el.removeAttribute('id');
                            });
                        });
                    });

                    const table = document.querySelector('table');
                    if (!table) return;

                    const selectedCells = new Set();
                    let lastClickedCell = null, isDragging = false, dragStarted = false, startCellForDrag = null;
                    const grid = [];

                    const buildGrid = () => {
                        grid.length = 0;
                        Array.from(table.rows).forEach((row, rIndex) => {
                            grid[rIndex] = grid[rIndex] || [];
                            let cIndex = 0;
                            Array.from(row.cells).forEach(cell => {
                                while (grid[rIndex][cIndex]) cIndex++;
                                const colspan = parseInt(cell.getAttribute('colspan') || '1');
                                const rowspan = parseInt(cell.getAttribute('rowspan') || '1');
                                for (let rs = 0; rs < rowspan; rs++) {
                                    for (let cs = 0; cs < colspan; cs++) {
                                        if (!grid[rIndex + rs]) grid[rIndex + rs] = [];
                                        grid[rIndex + rs][cIndex + cs] = cell;
                                    }
                                }
                                cIndex += colspan;
                            });
                        });
                    };
                    buildGrid();

                    const findCellCoords = (cell) => {
                        for (let r = 0; r < grid.length; r++) {
                            for (let c = 0; c < (grid[r] ? grid[r].length : 0); c++) {
                                if (grid[r][c] === cell) return { r: r, c: c };
                            }
                        }
                        return null;
                    };
                    const clearAllHighlights = () => {
                        selectedCells.forEach(c => c.classList.remove('highlighted-cell'));
                        selectedCells.clear();
                    };

                    table.addEventListener('mouseover', e => {
                        document.querySelectorAll('.tbl-cell-hover').forEach(c => c.classList.remove('tbl-cell-hover'));
                        const targetCell = e.target.closest('th, td, caption');
                        if (targetCell) targetCell.classList.add('tbl-cell-hover');

                        if (isDragging && startCellForDrag && targetCell) {
                            dragStarted = true;
                            clearAllHighlights();
                            const startCoords = findCellCoords(startCellForDrag);
                            const currentCoords = findCellCoords(targetCell);
                            if (startCoords && currentCoords) {
                                const r1 = Math.min(startCoords.r, currentCoords.r), r2 = Math.max(startCoords.r, currentCoords.r);
                                const c1 = Math.min(startCoords.c, currentCoords.c), c2 = Math.max(startCoords.c, currentCoords.c);
                                for (let i = r1; i <= r2; i++) {
                                    for (let j = c1; j <= c2; j++) {
                                        const cell = grid[i] && grid[i][j];
                                        if (cell && !selectedCells.has(cell)) {
                                            cell.classList.add('highlighted-cell');
                                            selectedCells.add(cell);
                                        }
                                    }
                                }
                            }
                        }
                    });

                    table.addEventListener('mouseleave', () => document.querySelectorAll('.tbl-cell-hover').forEach(c => c.classList.remove('tbl-cell-hover')));
                    table.addEventListener('mousedown', e => {
                        const targetCell = e.target.closest('th, td, caption');
                        if (!targetCell) return;
                        isDragging = true; dragStarted = false; startCellForDrag = targetCell;
                        if (e.shiftKey && lastClickedCell) {
                            clearAllHighlights();
                            const startCoords = findCellCoords(lastClickedCell), endCoords = findCellCoords(targetCell);
                            if (startCoords && endCoords) {
                                const r1 = Math.min(startCoords.r, endCoords.r), r2 = Math.max(startCoords.r, endCoords.r);
                                const c1 = Math.min(startCoords.c, endCoords.c), c2 = Math.max(startCoords.c, endCoords.c);
                                for (let i = r1; i <= r2; i++) {
                                    for (let j = c1; j <= c2; j++) {
                                        if(grid[i] && grid[i][j]) selectedCells.add(grid[i][j]);
                                    }
                                }
                                selectedCells.forEach(c => c.classList.add('highlighted-cell'));
                            }
                        } else if (e.ctrlKey) {
                            if (selectedCells.has(targetCell)) {
                                targetCell.classList.remove('highlighted-cell');
                                selectedCells.delete(targetCell);
                            } else {
                                targetCell.classList.add('highlighted-cell');
                                selectedCells.add(targetCell);
                            }
                        } else {
                            clearAllHighlights();
                            targetCell.classList.add('highlighted-cell');
                            selectedCells.add(targetCell);
                        }
                    });

                    document.addEventListener('mouseup', e => {
                        if (isDragging && !dragStarted) {
                            const targetCell = e.target.closest('th, td, caption');
                            if (targetCell && !e.shiftKey) lastClickedCell = targetCell;
                        }
                        isDragging = false; startCellForDrag = null;
                    });

                    table.addEventListener('dblclick', e => {
                        e.preventDefault();
                        const targetCell = e.target.closest('th, td');
                        if (!targetCell || targetCell.closest('tfoot')) return;
                        clearAllHighlights();
                        if (targetCell.tagName === 'TH') {
                            const coords = findCellCoords(targetCell);
                            if (targetCell.closest('thead') && coords) {
                                for (let i = 0; i < grid.length; i++) {
                                    const cell = grid[i] && grid[i][coords.c];
                                    if (cell && !cell.closest('tfoot')) selectedCells.add(cell);
                                }
                            } else if (targetCell.parentElement) {
                                Array.from(targetCell.parentElement.cells).forEach(c => selectedCells.add(c));
                            }
                        } else if (targetCell.tagName === 'TD') {
                            table.querySelectorAll('tbody td').forEach(td => selectedCells.add(td));
                        }
                        selectedCells.forEach(cell => cell.classList.add('highlighted-cell'));
                    });

                    function handleCellAction(payload) {
                        if (selectedCells.size === 0) return;
                        const { action, value } = payload;
                        selectedCells.forEach(cell => {
                            switch(action) {
                                case 'tbl-toggle-unbold-th': if (cell.tagName === 'TH') cell.classList.toggle('fnt-nrml'); break;
                                case 'tbl-toggle-active':
                                    cell.classList.remove('bg-dark');
                                    if (cell.classList.contains('active')) {
                                        cell.classList.remove('active');
                                        cell.removeAttribute('data-manually-set-active');
                                    } else {
                                        cell.classList.add('active');
                                        cell.setAttribute('data-manually-set-active', 'true');
                                    }
                                    break;
                                case 'tbl-toggle-bg-dark': cell.classList.remove('active'); cell.classList.toggle('bg-dark'); break;
                                case 'tbl-toggle-text-white': cell.classList.toggle('text-white'); break;
                                case 'tbl-toggle-bold-td':
                                    if (cell.tagName === 'TD') {
                                        const firstEl = cell.firstElementChild;
                                        if (firstEl && firstEl.tagName === 'STRONG' && cell.children.length === 1) {
                                            while (firstEl.firstChild) cell.insertBefore(firstEl.firstChild, firstEl);
                                            firstEl.remove();
                                        } else {
                                            const strongEl = document.createElement('strong');
                                            while (cell.firstChild) strongEl.appendChild(cell.firstChild);
                                            cell.appendChild(strongEl);
                                        }
                                    }
                                    break;
                                case 'set-alignment':
                                    cell.classList.remove('text-left', 'text-center', 'text-right');
                                    if (value !== 'none') cell.classList.add('text-' + value);
                                    break;
                                case 'set-margin':
                                    const existingMarginDiv = cell.querySelector('div[class*="mrgn-lft-"]');
                                    if (existingMarginDiv) {
                                        while (existingMarginDiv.firstChild) cell.insertBefore(existingMarginDiv.firstChild, existingMarginDiv);
                                        existingMarginDiv.remove();
                                    }
                                    if (value !== '0') {
                                        const marginDiv = document.createElement('div');
                                        marginDiv.className = 'mrgn-lft-' + value;
                                        while (cell.firstChild) marginDiv.appendChild(cell.firstChild);
                                        cell.appendChild(marginDiv);
                                    }
                                    break;
                                case 'add-custom-class': if (value) cell.classList.add(value); break;
                                case 'reset-custom-classes':
                                    const protectedClasses = ['highlighted-cell', 'tbl-cell-hover', 'fnt-nrml', 'text-left', 'text-center', 'text-right'];
                                    const classesToRemove = Array.from(cell.classList).filter(c => !protectedClasses.includes(c));
                                    if (classesToRemove.length > 0) cell.classList.remove(...classesToRemove);
                                    break;
                            }
                        });

                        if (table) {
                            clearTimeout(window.updateParentTimeout);
                            window.updateParentTimeout = setTimeout(() => {
                                const tableClone = table.cloneNode(true);
                                const allElements = [tableClone, ...tableClone.querySelectorAll('*')];
                                allElements.forEach(el => {
                                    el.classList.remove('wb-tables-inited', 'sorting', 'sorting_asc', 'sorting_desc', 'footable-last-column', 'footable-first-column');
                                    el.removeAttribute('aria-live'); el.removeAttribute('aria-label'); el.removeAttribute('aria-sort');
                                    if (el.hasAttribute('class') && el.classList.length === 0) el.removeAttribute('class');
                                });
                                tableClone.querySelectorAll('.highlighted-cell, .tbl-cell-hover').forEach(c => c.classList.remove('highlighted-cell', 'tbl-cell-hover'));
                                window.parent.postMessage({ type: 'updateTableContent', tableHtml: tableClone.outerHTML }, '*');
                            }, 250);
                        }
                    }
                    
                    window.addEventListener('message', event => {
                        if (event.data && event.data.type === 'cellAction' && event.data.payload) {
                            handleCellAction(event.data.payload);
                        } else if (event.data && event.data.type === 'resetCellStates') {
                            clearAllHighlights();
                        }
                    });
                });
            <\/script>
        </body>
        </html>`;
    customizePreviewIframe.srcdoc = baseHtml;
}
/**
 * Resets all universal formatting options applied to all tables.
 */
function resetUniversalFormatting() {
    if (!window.monacoEditorInstance) return;
    const editorContent = getEditorContent();
    if (!editorContent.trim()) {
        showMessage('Nothing to reset.', 'info');
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;
    const tables = tempDiv.querySelectorAll('table');
    if (tables.length === 0) {
        showMessage('No tables found to reset.', 'info');
        return;
    }

    const managedClasses = ['table', 'table-bordered', 'table-striped', 'table-hover', 'table-condensed', 'small', 'active', 'text-left', 'text-center', 'text-right', 'nowrap', 'fnt-nrml', 'text-white', 'bg-dark'];
    tables.forEach(table => {
        [table, ...table.querySelectorAll('*')].forEach(el => el.classList.remove(...managedClasses));
        table.removeAttribute('id');
        cleanupEmptyClassAttributes(table);
    });

    let finalHtml = html_beautify(tempDiv.innerHTML, {
        indent_size: 4,
        space_in_paren: true,
        preserve_newlines: false,
        extra_liners: []
    });
    setEditorContent(finalHtml);
    applyEntityHighlighting();
    populateTableSearchDropdown();
    showMessage('Universal formatting has been reset.', 'success');
}

/**
 * Removes all responsive `div.table-responsive` wrappers.
 */
function resetResponsiveWrappers() {
    const editorContent = getEditorContent();
    if (!editorContent.trim()) {
        showMessage('Nothing to reset.', 'info');
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;
    const responsiveDivs = tempDiv.querySelectorAll('div.table-responsive');
    if (responsiveDivs.length === 0) {
        showMessage('No responsive wrappers found.', 'info');
        return;
    }

    responsiveDivs.forEach(div => {
        while (div.firstChild) div.parentNode.insertBefore(div.firstChild, div);
        div.remove();
    });

    let finalHtml = html_beautify(tempDiv.innerHTML, {
        indent_size: 4,
        space_in_paren: true,
        preserve_newlines: false,
        extra_liners: []
    });
    setEditorContent(finalHtml);
    applyEntityHighlighting();
    populateTableSearchDropdown();
    showMessage('Responsive wrappers have been removed.', 'success');
}

/**
 * Removes all `scope`, `id`, and `headers` attributes from all tables.
 */
function resetAllScopesAndIDs() {
    const editorContent = getEditorContent();
    if (!editorContent.trim()) {
        showMessage('Nothing to reset.', 'info');
        return;
    }

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;
    const cells = tempDiv.querySelectorAll('table th, table td');
    if (cells.length === 0) {
        showMessage('No table cells found to reset.', 'info');
        return;
    }

    cells.forEach(cell => {
        cell.removeAttribute('scope');
        cell.removeAttribute('id');
        cell.removeAttribute('headers');
    });

    let finalHtml = html_beautify(tempDiv.innerHTML, {
        indent_size: 4,
        space_in_paren: true,
        preserve_newlines: false,
        extra_liners: []
    });
    setEditorContent(finalHtml);
    applyEntityHighlighting();
    populateTableSearchDropdown();
    showMessage('All scopes, IDs, and headers have been reset.', 'success');
}

/**
 * Resets formatting for a single, selected table.
 */
function resetTableFormatting() {
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    const selectedValue = tableSearchDropdown.value;
    if (!selectedValue) {
        showMessage('Please select a table to reset.', 'info');
        return;
    }
    const tableInfo = tableDataMap.get(selectedValue);
    if (!tableInfo) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableInfo.outerHTML;
    const table = tempDiv.querySelector('table');
    const managedClasses = ['table', 'table-bordered', 'table-striped', 'table-hover', 'table-condensed', 'small', 'active', 'text-left', 'text-center', 'text-right', 'nowrap', 'fnt-nrml', 'text-white', 'bg-dark'];

    [table, ...table.querySelectorAll('*')].forEach(el => el.classList.remove(...managedClasses));
    table.removeAttribute('id');
    cleanupEmptyClassAttributes(table);

    let modifiedTableHtml = html_beautify(tempDiv.innerHTML, {
        indent_size: 4,
        space_in_paren: true,
        preserve_newlines: false,
        extra_liners: []
    });
    const editOperation = {
        range: tableInfo.range,
        text: modifiedTableHtml,
        forceMoveMarkers: true
    };
    window.monacoEditorInstance.executeEdits('table-formatter-reset', [editOperation]);

    setTimeout(() => {
        applyEntityHighlighting();
        populateTableSearchDropdown(selectedValue);
        showMessage(`Formatting reset for table "${selectedValue}".`, 'success');
    }, 100);
}

/**
 * Resets accessibility attributes for a single, selected table.
 */
function resetTableScopeAndID() {
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    const selectedValue = tableSearchDropdown.value;
    if (!selectedValue) {
        showMessage('Please select a table to reset.', 'info');
        return;
    }
    const tableInfo = tableDataMap.get(selectedValue);
    if (!tableInfo) return;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tableInfo.outerHTML;
    tempDiv.querySelector('table').querySelectorAll('th, td').forEach(cell => {
        cell.removeAttribute('scope');
        cell.removeAttribute('id');
        cell.removeAttribute('headers');
    });

    let modifiedTableHtml = html_beautify(tempDiv.innerHTML, {
        indent_size: 4,
        space_in_paren: true,
        preserve_newlines: false,
        extra_liners: []
    });
    const editOperation = {
        range: tableInfo.range,
        text: modifiedTableHtml,
        forceMoveMarkers: true
    };
    window.monacoEditorInstance.executeEdits('table-formatter-reset-scope', [editOperation]);

    setTimeout(() => {
        applyEntityHighlighting();
        populateTableSearchDropdown(selectedValue);
        showMessage(`Scopes and IDs reset for the selected table.`, 'success');
    }, 100);
}

/**
 * Applies unique IDs to all tables in the editor.
 */
function autoTableIDs() {
    const editorContent = getEditorContent();
    if (!editorContent.trim()) {
        showMessage('No content to add IDs to.', 'info');
        return;
    }

    const autoTableIDBtn = document.getElementById('autoTableIDBtn');
    const originalHtml = autoTableIDBtn.innerHTML;
    autoTableIDBtn.innerHTML = 'IDing...';
    autoTableIDBtn.setAttribute('data-temp-active', 'true');
    updateAllInteractiveButtonStates();

    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editorContent;
        const tables = tempDiv.querySelectorAll('table');
        if (tables.length === 0) {
            showMessage('No tables found to ID.', 'info');
            return;
        }

        let tblCounter = 1,
            ftblCounter = 1;
        
        tables.forEach(table => {
            const oldTableId = table.id;
            const isFigureTable = !!table.closest('figure');
            const newTableId = isFigureTable ? `ftbl${ftblCounter++}` : `tbl${tblCounter++}`;

            table.id = newTableId;

            // --- ROBUST FOOTNOTE RE-IDing LOGIC ---
            const footnoteIdMap = {};

            // 1. Handle the main footnote header (e.g., id="fn" or id="tbl1fn").
            const oldFnHeaderId = oldTableId ? `${oldTableId}fn` : 'fn';
            const fnHeader = table.querySelector(`tfoot [id="${oldFnHeaderId}"], tfoot [id="fn"]`);
            if (fnHeader) {
                footnoteIdMap[fnHeader.id] = `${newTableId}fn`;
            }
            
            // 2. Build a map of all required footnote ID changes.
            table.querySelectorAll('[id*="fn"]').forEach(el => {
                const oldId = el.id;
                // This regex intelligently parses complex IDs like "tbl1fn2-rf-0".
                const idParts = oldId.match(/(?:(.*?))?fn(\d+)((?:-rf)?(?:-\d+)*)?$/);
                if (idParts) {
                    const originalFootnoteNum = idParts[2]; // The core number, e.g., "2".
                    const oldSuffix = idParts[3] || '';    // The suffix, e.g., "-rf-0".
                    
                    const oldPrefix = idParts[1] || '';
                    const oldBaseId = `${oldPrefix}fn${originalFootnoteNum}`;
                    
                    const newBaseId = `${newTableId}fn${originalFootnoteNum}`;
                    const newFullId = `${newBaseId}${oldSuffix}`;

                    footnoteIdMap[oldId] = newFullId;
                    footnoteIdMap[oldBaseId] = newBaseId;
                }
            });

            // 3. Apply the changes from the map.
            table.querySelectorAll('[id]').forEach(el => {
                if (footnoteIdMap[el.id]) {
                    el.id = footnoteIdMap[el.id];
                }
            });
            table.querySelectorAll('a[href^="#"]').forEach(link => {
                const oldAnchor = link.getAttribute('href').substring(1);
                if (footnoteIdMap[oldAnchor]) {
                    link.setAttribute('href', `#${footnoteIdMap[oldAnchor]}`);
                }
            });
        });

        let finalHtml = html_beautify(tempDiv.innerHTML, {
            indent_size: 4,
            space_in_paren: true,
            preserve_newlines: false,
            extra_liners: []
        });
        finalHtml = convertAllEntitiesToNumeric(finalHtml);
        setEditorContent(finalHtml);
        applyEntityHighlighting();
        populateTableSearchDropdown();
        showMessage('Table IDs automatically assigned.', 'success');
    } catch (e) {
        console.error("Error assigning table IDs:", e);
        showMessage('An error occurred while assigning IDs.', 'error');
    } finally {
        setTimeout(() => {
            autoTableIDBtn.innerHTML = originalHtml;
            autoTableIDBtn.removeAttribute('data-temp-active');
            updateAllInteractiveButtonStates();
        }, 1500);
    }
}

/**
 * Main function to trigger number formatting across all tables for a specific language.
 * @param {string} lang - The target language ('eng' or 'fra').
 */
function formatTableNumbers(lang) {
    const editorContent = getEditorContent();
    if (!editorContent.trim()) {
        showMessage('No content to format.', 'info');
        return;
    }

    const btn = document.getElementById(lang === 'eng' ? 'eng-number-button' : 'fra-number-button');
    const originalHtml = btn.innerHTML;
    btn.innerHTML = 'Formatting...';
    btn.setAttribute('data-temp-active', 'true');
    updateAllInteractiveButtonStates();

    try {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = editorContent;
        tempDiv.querySelectorAll('table td, table th').forEach(cell => {
            const walker = document.createTreeWalker(cell, NodeFilter.SHOW_TEXT, null, false);
            let nodesToProcess = [],
                node;
            while (node = walker.nextNode()) nodesToProcess.push(node);
            nodesToProcess.forEach(textNode => {
                textNode.nodeValue = formatNumberString(textNode.nodeValue, lang);
            });
        });

        let finalHtml = tempDiv.innerHTML;
        finalHtml = finalHtml.replace(/\u00A0/g, '&#160;');
        finalHtml = convertAllEntitiesToNumeric(finalHtml);
        finalHtml = html_beautify(finalHtml, {
            indent_size: 4,
            space_in_paren: true,
            preserve_newlines: false,
            extra_liners: []
        });
        setEditorContent(finalHtml);
        applyEntityHighlighting();
        populateTableSearchDropdown();
        showMessage(`Numbers formatted for ${lang === 'eng' ? 'English' : 'French'}.`, 'success');
    } catch (e) {
        console.error(`Error formatting numbers for ${lang}:`, e);
        showMessage('An error occurred during number formatting.', 'error');
    } finally {
        setTimeout(() => {
            btn.innerHTML = originalHtml;
            btn.removeAttribute('data-temp-active');
            updateAllInteractiveButtonStates();
        }, 1500);
    }
}


// ===================================================================================
// VI. INITIALIZATION & EVENT LISTENERS
// ===================================================================================

// --- This global array must be defined before the `onload` function that populates it. ---
const allInteractiveButtons = [];

/**
 * Main entry point: Initializes the Monaco editor and attaches all event listeners.
 */
// Replace the existing window.onload function in tables.js with this one.
/**
 * Main entry point: Initializes the Monaco editor and attaches all event listeners.
 */
window.onload = function() {
    // --- Define DOM Element References ---
    const openOptionsModalButton = document.getElementById('open-tbl-options-tbl-modal-btn');
    const closeOptionsModalButton = document.getElementById('close-tbl-options-tbl-modal-btn');
    const formatButton = document.getElementById('format-tbl-button-modal');
    const closeCustomizeModalButton = document.getElementById('close-tbl-customize-modal-btn');
    const formatSpecificTableButton = document.getElementById('format-specific-table-button');
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    const customizeButton = document.getElementById('tbl-customize-button');
    const autoResponsiveBtn = document.getElementById('auto-responsive-btn');
    const autoScopeBtn = document.getElementById('auto-scope-btn');
    const forceIdButton = document.getElementById('force-id-button');
    const resetUniversalBtn = document.getElementById('reset-universal-btn');
    const resetResponsiveBtn = document.getElementById('reset-responsive-btn');
    const resetScopeIdBtn = document.getElementById('reset-scopeid-btn');
    const resetTableFormatBtn = document.getElementById('reset-tableformat-btn');
    const resetTableScopeIDBtn = document.getElementById('reset-tablescopeid-btn');
    const autoTableIDBtn = document.getElementById('autoTableIDBtn');
    const engNumberButton = document.getElementById('eng-number-button');
    const fraNumberButton = document.getElementById('fra-number-button');
    const toggleInteractiveBtn = document.getElementById('tbl-toggle-interactive');
    const addClassBtn = document.getElementById('add-class-btn');
    const removeClassBtn = document.getElementById('remove-class-btn');
    const customClassInput = document.getElementById('custom-class-input');
    const customizePageIdPrefixInput = document.getElementById('tbl-customize-page-id-prefix-input');

    // --- Set default states for TFOOT toggle switches ---
    const tfootBeforeTbodyCheckbox = document.getElementById('make-tfoot-before-tbody-checkbox');
    if (tfootBeforeTbodyCheckbox) {
        tfootBeforeTbodyCheckbox.checked = true;
        tfootBeforeTbodyCheckbox.disabled = true;
        const parentSwitch = tfootBeforeTbodyCheckbox.closest('.tbl-toggle-switch');
        if (parentSwitch) {
            parentSwitch.classList.add('is-checked', 'is-disabled');
        }
    }
    const customizeTfootBeforeTbodyCheckbox = document.getElementById('tbl-customize-make-tfoot-before-tbody-checkbox');
    if (customizeTfootBeforeTbodyCheckbox) {
        customizeTfootBeforeTbodyCheckbox.checked = true;
        customizeTfootBeforeTbodyCheckbox.disabled = true;
        const parentSwitch = customizeTfootBeforeTbodyCheckbox.closest('.tbl-toggle-switch');
        if (parentSwitch) {
            parentSwitch.classList.add('is-checked', 'is-disabled');
        }
    }

    // --- Populate the array for global state management ---
    allInteractiveButtons.push(
        formatButton, openOptionsModalButton, customizeButton, formatSpecificTableButton,
        autoScopeBtn, document.getElementById('force-scope-button'), forceIdButton,
        autoResponsiveBtn, autoTableIDBtn, resetUniversalBtn, resetResponsiveBtn,
        resetScopeIdBtn, resetTableFormatBtn, resetTableScopeIDBtn,
        engNumberButton, fraNumberButton, toggleInteractiveBtn
    );

    // --- Attach All Event Listeners ---
    openOptionsModalButton.addEventListener('click', openOptionsModal);
    closeOptionsModalButton.addEventListener('click', closeOptionsModal);
    formatButton.addEventListener('click', formatHtmlTables);
    closeCustomizeModalButton.addEventListener('click', closeCustomizeModal);
    formatSpecificTableButton.addEventListener('click', formatSpecificTable);

    // --- Safely wait for the main editor to be ready, then initialize table-specific functions ---
    const editorReadyCheck = setInterval(() => {
        if (window.monacoEditorInstance) {
            clearInterval(editorReadyCheck); // Stop checking once the editor is found
            console.log("Table Wizard: Main editor instance found. Initializing table features.");

            populateTableSearchDropdown();
            updateTableButtonStates(false); // Set the initial state (no table selected)
            applyEntityHighlighting();

            // --- Editor Content Change Listener ---
            window.monacoEditorInstance.onDidChangeModelContent(() => {
                clearTimeout(window.monacoUpdateTimeout);
                window.monacoUpdateTimeout = setTimeout(() => {
                    applyEntityHighlighting();
                    const currentSelection = tableSearchDropdown.value;
                    populateTableSearchDropdown(currentSelection);
                }, 500);
            });

            // --- Attach Remaining Event Listeners that depend on the editor ---
            customizeButton.addEventListener('click', () => {
                if (!tableSearchDropdown.value) {
                    showMessage('Please select a table from the dropdown first.', 'info');
                    return;
                }
                const tableInfo = tableDataMap.get(tableSearchDropdown.value);
                if (tableInfo) {
                    window.originalTableState = tableInfo.outerHTML; // Store state on open.
                }
                document.getElementById('tbl-customize-modal-overlay').classList.remove('hidden');
                tableSearchDropdown.dispatchEvent(new Event('change'));
            });

            tableSearchDropdown.addEventListener('change', () => {
                const selectedValue = tableSearchDropdown.value;
                clearMonacoHighlight();
                if (selectedValue) {
                    const tableInfo = tableDataMap.get(selectedValue);
                    if (tableInfo && tableInfo.range) {
                        window.monacoEditorInstance.revealRangeInCenter(tableInfo.range, monaco.editor.ScrollType.Smooth);
                        currentHighlightDecorationId = window.monacoEditorInstance.getModel().deltaDecorations([], [{
                            range: tableInfo.range,
                            options: {
                                isTransparent: true,
                                className: 'tbl-selected-line-highlight'
                            }
                        }]);
                        openOptionsModalCustomize();
                    } else {
                        openOptionsModalCustomize();
                    }
                } else {
                    openOptionsModalCustomize();
                }
                updateInteractiveButtonState();
                updateTableButtonStates(!!selectedValue); // This line is new
            });

            autoResponsiveBtn.addEventListener('click', () => {
                const originalHtml = autoResponsiveBtn.innerHTML;
                autoResponsiveBtn.innerHTML = 'Applying...';
                autoResponsiveBtn.setAttribute('data-temp-active', 'true');
                updateAllInteractiveButtonStates();
                try {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = getEditorContent();
                    const tables = tempDiv.querySelectorAll('table');
                    let wrappedCount = 0;
                    tables.forEach(table => {
                        const parent = table.parentElement;
                        if (!(parent && parent.classList.contains('table-responsive'))) {
                            const responsiveDiv = document.createElement('div');
                            responsiveDiv.className = 'table-responsive';
                            table.parentNode.insertBefore(responsiveDiv, table);
                            responsiveDiv.appendChild(table);
                            wrappedCount++;
                        }
                    });
                    if (wrappedCount > 0) {
                        let finalHtml = html_beautify(tempDiv.innerHTML, {
                            indent_size: 4,
                            space_in_paren: true,
                            preserve_newlines: false,
                            extra_liners: []
                        });
                        setEditorContent(convertAllEntitiesToNumeric(finalHtml));
                        applyEntityHighlighting();
                        populateTableSearchDropdown();
                        showMessage(`${wrappedCount} responsive wrappers added.`, 'success');
                    } else {
                        showMessage('All tables are already responsive.', 'info');
                    }
                } catch (e) {
                    console.error("Error applying responsive wrappers:", e);
                    showMessage('An error occurred.', 'error');
                } finally {
                    setTimeout(() => {
                        autoResponsiveBtn.innerHTML = originalHtml;
                        autoResponsiveBtn.removeAttribute('data-temp-active');
                        updateAllInteractiveButtonStates();
                    }, 1500);
                }
            });

            autoScopeBtn.addEventListener('click', () => {
                const originalHtml = autoScopeBtn.innerHTML;
                autoScopeBtn.innerHTML = 'Scoping...';
                autoScopeBtn.setAttribute('data-temp-active', 'true');
                updateAllInteractiveButtonStates();
                try {
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = getEditorContent();
                    const allTables = tempDiv.querySelectorAll('table');
                    if (allTables.length === 0) {
                        showMessage('No tables found to scope.', 'info');
                        return;
                    }
                    allTables.forEach((table, index) => autoScopeTableIDs(table, index));
                    let finalHtml = cleanEmptyHeadersAttribute(tempDiv.innerHTML);
                    setEditorContent(convertAllEntitiesToNumeric(finalHtml));
                    applyEntityHighlighting();
                    populateTableSearchDropdown();
                    showMessage('Auto-scoping complete!', 'success');
                } catch (e) {
                    console.error("Error during auto-scoping:", e);
                    showMessage('An error occurred during scoping.', 'error');
                } finally {
                    setTimeout(() => {
                        autoScopeBtn.innerHTML = originalHtml;
                        autoScopeBtn.removeAttribute('data-temp-active');
                        updateAllInteractiveButtonStates();
                    }, 1500);
                }
            });

            forceIdButton.addEventListener('click', () => {
                const selectedValue = tableSearchDropdown.value;
                if (!selectedValue) {
                    showMessage('Please select a table.', 'info');
                    return;
                }
                const tableInfo = tableDataMap.get(selectedValue);
                if (!tableInfo) return;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = tableInfo.outerHTML;
                const tableToProcess = tempDiv.querySelector('table');
                autoScopeTableIDs(tableToProcess, 0, 'complex');
                const modifiedTableHtml = cleanEmptyHeadersAttribute(convertAllEntitiesToNumeric(tableToProcess.outerHTML));
                window.monacoEditorInstance.executeEdits('table-formatter-force-id', [{
                    range: tableInfo.range,
                    text: modifiedTableHtml,
                    forceMoveMarkers: true
                }]);
                setTimeout(() => {
                    applyEntityHighlighting();
                    populateTableSearchDropdown(selectedValue);
                    showMessage('Force ID/Headers applied!', 'success');
                }, 100);
            });

            toggleInteractiveBtn.addEventListener('click', () => {
                const selectedValue = tableSearchDropdown.value;
                if (!selectedValue) {
                    showMessage('Please select a table.', 'info');
                    return;
                }
                const tableInfo = tableDataMap.get(selectedValue);
                if (!tableInfo || !tableInfo.range) return;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = tableInfo.outerHTML;
                const table = tempDiv.querySelector('table');
                if (table) {
                    table.classList.toggle('wb-tables');
                    cleanupEmptyClassAttributes(table);
                }
                const modifiedTableHtml = tempDiv.innerHTML;
                window.monacoEditorInstance.executeEdits('tbl-toggle-interactive-class', [{
                    range: tableInfo.range,
                    text: modifiedTableHtml,
                    forceMoveMarkers: true
                }]);
                setTimeout(() => {
                    const newTableInfo = tableDataMap.get(selectedValue);
                    if (newTableInfo) newTableInfo.outerHTML = modifiedTableHtml;
                    updateInteractiveButtonState();
                    showMessage('Interactive table class toggled.', 'success');
                }, 100);
            });

            // Reset Buttons
            resetUniversalBtn.addEventListener('click', resetUniversalFormatting);
            resetResponsiveBtn.addEventListener('click', resetResponsiveWrappers);
            resetScopeIdBtn.addEventListener('click', resetAllScopesAndIDs);
            resetTableFormatBtn.addEventListener('click', resetTableFormatting);
            resetTableScopeIDBtn.addEventListener('click', resetTableScopeAndID);

            // Utility Buttons
            autoTableIDBtn.addEventListener('click', autoTableIDs);
            engNumberButton.addEventListener('click', () => formatTableNumbers('eng'));
            fraNumberButton.addEventListener('click', () => formatTableNumbers('fra'));

            // Alignment Button Group Setup
            setupButtonGroup('caption-tbl-alignment-group', 'captionAlignment');
            setupButtonGroup('col-headers-tbl-alignment-group', 'colHeaderAlignment');
            setupButtonGroup('row-headers-tbl-alignment-group', 'rowHeaderAlignment');
            setupButtonGroup('colspan-headers-tbl-alignment-group', 'colspanHeaderAlignment');
            setupButtonGroup('data-cells-tbl-alignment-group', 'dataCellsAlignment');
            document.querySelector('#caption-tbl-alignment-group button[data-align="left"]').classList.add('active'); // Set default

            const customizeModalOverlay = document.getElementById('tbl-customize-modal-overlay');
            const headerAlignmentCallback = () => {
                const newPreviewHtml = generatePreviewTableHtml();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newPreviewHtml;
                const newTableElement = tempDiv.querySelector('table');
                if (newTableElement) {
                    updateHeaderAlignmentUI(newTableElement);
                    updateDataCellAlignmentUI(newTableElement);
                }
                updateCustomizeModalPreview(newPreviewHtml);
            };
            setupButtonGroup('tbl-customize-caption-tbl-alignment-group', 'customizeCaptionAlignment', customizeModalOverlay, updateCustomizeModalPreview);
            setupButtonGroup('tbl-customize-col-headers-tbl-alignment-group', 'customizeColHeaderAlignment', customizeModalOverlay, headerAlignmentCallback);
            setupButtonGroup('tbl-customize-row-headers-tbl-alignment-group', 'customizeRowHeaderAlignment', customizeModalOverlay, headerAlignmentCallback);
            setupButtonGroup('tbl-customize-colspan-headers-tbl-alignment-group', 'customizeColspanHeaderAlignment', customizeModalOverlay, headerAlignmentCallback);
            setupButtonGroup('tbl-customize-data-cells-tbl-alignment-group', 'customizeDataCellsAlignment', customizeModalOverlay, () => {
                const newPreviewHtml = generatePreviewTableHtml();
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newPreviewHtml;
                const newTableElement = tempDiv.querySelector('table');
                if (newTableElement) updateDataCellAlignmentUI(newTableElement);
                updateCustomizeModalPreview(newPreviewHtml);
            });

            // Listen for updates from the iframe.
            window.addEventListener('message', (event) => {
                if (event.data && event.data.type === 'updateTableContent') {
                    const selectedValue = tableSearchDropdown.value;
                    const tableInfo = tableDataMap.get(selectedValue);
                    if (tableInfo) {
                        tableInfo.outerHTML = event.data.tableHtml;
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = event.data.tableHtml;
                        const updatedTableElement = tempDiv.querySelector('table');
                        if (updatedTableElement) {
                            updateHeaderAlignmentUI(updatedTableElement);
                            updateDataCellAlignmentUI(updatedTableElement);
                        }
                    }
                }
            });

            // Initialize all toggle switch visuals.
            document.querySelectorAll('.tbl-toggle-switch input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', function() {
                    this.closest('.tbl-toggle-switch').classList.toggle('is-checked', this.checked);
                });
            });

            // Link auto-caption and manual caption toggles.
            const captionCheckbox = document.getElementById('caption-checkbox');
            const autoCaptionCheckbox = document.getElementById('auto-caption-checkbox');
            captionCheckbox.addEventListener('change', () => {
                if (captionCheckbox.checked) autoCaptionCheckbox.checked = false;
                initializeToggleSwitchesVisuals();
            });
            autoCaptionCheckbox.addEventListener('change', () => {
                if (autoCaptionCheckbox.checked) captionCheckbox.checked = false;
                initializeToggleSwitchesVisuals();
            });

            // Customize Modal Toggle/Input Listeners
            customizePageIdPrefixInput.addEventListener('input', () => updateCustomizeModalPreview());
            document.querySelectorAll('#tbl-customize-modal-overlay input[type="checkbox"]').forEach(checkbox => {
                checkbox.addEventListener('change', () => updateCustomizeModalPreview());
            });
            document.getElementById('tbl-customize-finance-table-checkbox').addEventListener('change', () => {
                updateDataCellAlignmentUI();
                updateCustomizeModalPreview();
            });

            // Cell Action Toolbar Listeners (for Customize Modal)
            const cellActionButtons = {
                'unbold-th-btn': { action: 'tbl-toggle-unbold-th' },
                'bold-td-btn': { action: 'tbl-toggle-bold-td' },
                'active-tbl-cell-btn': { action: 'tbl-toggle-active' },
                'bgdark-tbl-cell-btn': { action: 'tbl-toggle-bg-dark' },
                'textW-tbl-cell-btn': { action: 'tbl-toggle-text-white' },
                'align-left-btn': { action: 'set-alignment', value: 'left' },
                'align-center-btn': { action: 'set-alignment', value: 'center' },
                'align-right-btn': { action: 'set-alignment', value: 'right' },
                'reset-seltbl-cell-btn': { action: 'set-alignment', value: 'none' },
                'mrgn-sm-btn': { action: 'set-margin', value: 'sm' },
                'mrgn-md-btn': { action: 'set-margin', value: 'md' },
                'mrgn-lg-btn': { action: 'set-margin', value: 'lg' },
                'mrgn-xl-btn': { action: 'set-margin', value: 'xl' },
                'mrgn-0-btn': { action: 'set-margin', value: '0' }
            };
            Object.keys(cellActionButtons).forEach(id => {
                const btn = document.getElementById(id);
                if (btn) {
                    btn.addEventListener('click', () => {
                        const iframe = document.getElementById('tbl-customize-preview-iframe');
                        if (iframe && iframe.contentWindow) {
                            iframe.contentWindow.postMessage({ type: 'cellAction', payload: cellActionButtons[id] }, '*');
                        }
                    });
                }
            });
            addClassBtn.addEventListener('click', () => {
                const className = customClassInput.value.trim();
                const iframe = document.getElementById('tbl-customize-preview-iframe');
                if (className && iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'cellAction', payload: { action: 'add-custom-class', value: className } }, '*');
                }
            });
            removeClassBtn.addEventListener('click', () => {
                const iframe = document.getElementById('tbl-customize-preview-iframe');
                if (iframe && iframe.contentWindow) {
                    iframe.contentWindow.postMessage({ type: 'cellAction', payload: { action: 'reset-custom-classes' } }, '*');
                }
            });
        }
    }, 100); // Check every 100ms

    // Prevent accidental navigation with unsaved changes.
    window.onbeforeunload = function() {
        if (window.monacoEditorInstance && window.monacoEditorInstance.getValue().trim() !== '') {
            return "You have unsaved changes. Are you sure you want to leave?";
        }
    };
};

// ===================================================================================
// VII. HELPER FUNCTIONS FOR CUSTOMIZE MODAL UI STATE
// ===================================================================================
/**
 * Reads the alignment of headers in a table and updates the UI controls in the "Custom Format" modal.
 * @param {HTMLElement} tableElement - The table element to inspect.
 */
function updateHeaderAlignmentUI(tableElement) {
    if (!tableElement) return;

    const getCellAlignment = (cell) => {
        if (cell.classList.contains('text-left')) return 'left';
        if (cell.classList.contains('text-center')) return 'center';
        if (cell.classList.contains('text-right')) return 'right';
        return 'none';
    };

    const checkGroupAlignment = (selector, manualFlagName, alignmentVarName, groupId, tagId) => {
        const cells = Array.from(tableElement.querySelectorAll(selector));
        const alignmentGroup = document.getElementById(groupId);
        const manualTag = document.getElementById(tagId);
        window[manualFlagName] = false;
        manualTag.classList.add('hidden');
        alignmentGroup.querySelectorAll('button').forEach(btn => btn.disabled = false);
        alignmentGroup.style.opacity = '1';

        if (cells.length === 0) {
            window[alignmentVarName] = 'none';
            alignmentGroup.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
            return;
        }

        const firstAlignment = getCellAlignment(cells[0]);
        const hasMixedAlignment = cells.some(cell => getCellAlignment(cell) !== firstAlignment);

        if (hasMixedAlignment) {
            window[manualFlagName] = true;
            window[alignmentVarName] = 'manual';
            manualTag.classList.remove('hidden');
            alignmentGroup.querySelectorAll('button[data-align]').forEach(btn => btn.disabled = true);
            alignmentGroup.style.opacity = '0.5';
            alignmentGroup.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        } else {
            window[manualFlagName] = false;
            window[alignmentVarName] = firstAlignment;
            alignmentGroup.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.align === firstAlignment));
        }
    };

    checkGroupAlignment('thead th', 'isCustomizeManualColHeaderAlign', 'customizeColHeaderAlignment', 'tbl-customize-col-headers-tbl-alignment-group', 'manual-chalign-tag');
    checkGroupAlignment('tbody tr > th:first-child:not([colspan])', 'isCustomizeManualRowHeaderAlign', 'customizeRowHeaderAlignment', 'tbl-customize-row-headers-tbl-alignment-group', 'manual-rhalign-tag');
    checkGroupAlignment('tbody th[colspan]', 'isCustomizeManualColspanAlign', 'customizeColspanHeaderAlignment', 'tbl-customize-colspan-headers-tbl-alignment-group', 'manual-csalign-tag');
}

/**
 * Reads the alignment of a table caption and updates the UI controls in the "Custom Format" modal.
 * @param {HTMLElement} tableElement - The table element to inspect.
 */
function updateCaptionAlignmentUI(tableElement) {
    const captionAlignmentGroup = document.getElementById('tbl-customize-caption-tbl-alignment-group');
    if (!captionAlignmentGroup) return;

    const caption = tableElement ? tableElement.querySelector('caption') : null;

    let currentAlignment = 'none';
    if (caption) {
        if (caption.classList.contains('text-left')) currentAlignment = 'left';
        else if (caption.classList.contains('text-center')) currentAlignment = 'center';
        else if (caption.classList.contains('text-right')) currentAlignment = 'right';
    }

    // Update the global state variable and the UI buttons
    window.customizeCaptionAlignment = currentAlignment;
    captionAlignmentGroup.querySelectorAll('button').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.align === currentAlignment);
    });
}

/**
 * Reads the alignment of data cells in a table and updates the UI controls in the "Custom Format" modal.
 * @param {HTMLElement} tableElement - The table element to inspect.
 */
function updateDataCellAlignmentUI(tableElement) {
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    if (!tableElement) {
        const selectedValue = tableSearchDropdown.value;
        if (!selectedValue) return;
        const tableInfo = tableDataMap.get(selectedValue);
        if (!tableInfo) return;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tableInfo.outerHTML;
        tableElement = tempDiv.querySelector('table');
    }
    if (!tableElement) return;

    const dataCellsAlignmentGroup = document.getElementById('tbl-customize-data-cells-tbl-alignment-group');
    const financialTag = document.getElementById('financial-align-tag');
    const manualTag = document.getElementById('manual-align-tag');
    const financeCheckbox = document.getElementById('tbl-customize-finance-table-checkbox');

    financialTag.classList.add('hidden');
    manualTag.classList.add('hidden');
    dataCellsAlignmentGroup.querySelectorAll('button').forEach(btn => btn.disabled = false);
    dataCellsAlignmentGroup.style.opacity = '1';
    window.isCustomizeManualDataAlign = false;

    if (financeCheckbox.checked) {
        financialTag.classList.remove('hidden');
        dataCellsAlignmentGroup.querySelectorAll('button[data-align]').forEach(btn => btn.disabled = true);
        dataCellsAlignmentGroup.style.opacity = '0.5';
        window.customizeDataCellsAlignment = 'manual';
    } else {
        const getCellAlignment = (cell) => {
            if (cell.classList.contains('text-left')) return 'left';
            if (cell.classList.contains('text-center')) return 'center';
            if (cell.classList.contains('text-right')) return 'right';
            return 'none';
        };
        const dataCells = Array.from(tableElement.querySelectorAll('tbody td'));

        if (dataCells.length > 0) {
            const firstAlignment = getCellAlignment(dataCells[0]);
            const hasMixedAlignment = dataCells.some(cell => getCellAlignment(cell) !== firstAlignment);
            if (hasMixedAlignment) {
                window.isCustomizeManualDataAlign = true;
                window.customizeDataCellsAlignment = 'manual';
                manualTag.classList.remove('hidden');
                dataCellsAlignmentGroup.querySelectorAll('button[data-align]').forEach(btn => btn.disabled = true);
                dataCellsAlignmentGroup.style.opacity = '0.5';
            } else {
                window.isCustomizeManualDataAlign = false;
                window.customizeDataCellsAlignment = firstAlignment;
            }
            dataCellsAlignmentGroup.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.align === window.customizeDataCellsAlignment));
        } else {
            window.customizeDataCellsAlignment = 'none';
            dataCellsAlignmentGroup.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        }
    }
}

/**
 * Initializes the controls in the "Custom Format" modal based on the selected table's properties.
 */
function openOptionsModalCustomize() {
    const tableSearchDropdown = document.getElementById('table-search-dropdown');
    const selectedValue = tableSearchDropdown.value;
    const tableInfo = tableDataMap.get(selectedValue);
    let selectedTableElement = null;

    if (tableInfo) {
        const doc = new DOMParser().parseFromString(tableInfo.outerHTML, 'text/html');
        selectedTableElement = doc.querySelector('table');
    }

    // 1. Reset all controls to their default state first.
    const customizeModal = document.getElementById('tbl-customize-modal-overlay');
    customizeModal.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        // Exclude the control that should always be checked and disabled.
        if (cb.id !== 'tbl-customize-make-tfoot-before-tbody-checkbox') {
            cb.checked = false;
        }
    });
    document.getElementById('tbl-customize-page-id-prefix-input').value = '';

    // 2. If a table is selected, populate the controls based on its current state.
    if (selectedTableElement) {
        document.getElementById('tbl-customize-page-id-prefix-input').value = selectedTableElement.id || '';

        const tableClasses = Array.from(selectedTableElement.classList);
        const caption = selectedTableElement.querySelector('caption');
        const thead = selectedTableElement.querySelector('thead');
        const tbody = selectedTableElement.querySelector('tbody');

        document.getElementById('tbl-customize-caption-checkbox').checked = !!caption;
        document.getElementById('tbl-customize-inv-caption-checkbox').checked = caption ? caption.classList.contains('wb-inv') : false;
        document.getElementById('tbl-customize-class-small-checkbox').checked = tableClasses.includes('small');
        const allTrs = Array.from(selectedTableElement.querySelectorAll('tr'));
        document.getElementById('tbl-customize-add-small-to-tr-checkbox').checked = allTrs.length > 0 && allTrs.every(tr => tr.classList.contains('small'));
        document.getElementById('tbl-customize-class-tables-checkbox').checked = tableClasses.includes('table') && tableClasses.includes('table-condensed');
        document.getElementById('tbl-customize-header-checkbox').checked = !!thead;
        document.getElementById('tbl-customize-row-header-checkbox').checked = tbody && Array.from(tbody.querySelectorAll('tr')).some(row => row.firstElementChild && row.firstElementChild.tagName === 'TH');
        document.getElementById('tbl-customize-bordered-checkbox').checked = tableClasses.includes('table-bordered');
        document.getElementById('tbl-customize-striped-checkbox').checked = tableClasses.includes('table-striped');
        document.getElementById('tbl-customize-hover-checkbox').checked = tableClasses.includes('table-hover');
        document.getElementById('tbl-customize-active-col-headers-checkbox').checked = thead && Array.from(thead.querySelectorAll('tr')).some(tr => tr.classList.contains('active'));
        document.getElementById('tbl-customize-active-colspan-headers-checkbox').checked = Array.from(selectedTableElement.querySelectorAll('tbody th[colspan]')).some(th => th.classList.contains('active'));
        document.getElementById('tbl-customize-active-row-headers-checkbox').checked = Array.from(selectedTableElement.querySelectorAll('tbody tr > th:first-child:not([colspan])')).some(th => th.classList.contains('active'));
        document.getElementById('tbl-customize-finance-table-checkbox').checked = Array.from(selectedTableElement.querySelectorAll('td')).some(td => td.classList.contains('nowrap'));
    }

    // 3. Update all UI elements based on the new state.
    initializeToggleSwitchesVisuals(customizeModal);
    updateCaptionAlignmentUI(selectedTableElement);
    updateDataCellAlignmentUI(selectedTableElement);
    updateHeaderAlignmentUI(selectedTableElement);
    updateCustomizeModalPreview(tableInfo ? tableInfo.outerHTML : '');
}
// --- Accordion Logic for Customize Modal ---
    const accordionHeaders = document.querySelectorAll('.tbl-accordion-header');
    accordionHeaders.forEach(clickedHeader => {
        clickedHeader.addEventListener('click', () => {
            const wasExpanded = clickedHeader.classList.contains('expanded');

            // First, close all accordion panels
            accordionHeaders.forEach(header => {
                header.classList.remove('expanded');
                const content = document.querySelector(`.tbl-accordion-content[data-accordion-content="${header.dataset.accordionHeader}"]`);
                if (content) {
                    content.classList.remove('expanded');
                }
            });

            // If the clicked panel was not already open, open it
            if (!wasExpanded) {
                clickedHeader.classList.add('expanded');
                const clickedContent = document.querySelector(`.tbl-accordion-content[data-accordion-content="${clickedHeader.dataset.accordionHeader}"]`);
                if (clickedContent) {
                    clickedContent.classList.add('expanded');
                }
            }
        });
    });

    // Set the "Alignment" panel to be open by default
    const defaultOpenHeader = document.querySelector('[data-accordion-header="alignment"]');
    const defaultOpenContent = document.querySelector('[data-accordion-content="alignment"]');
    if (defaultOpenHeader && defaultOpenContent) {
        defaultOpenHeader.classList.add('expanded');
        defaultOpenContent.classList.add('expanded');
    }
}); 
