document.addEventListener('DOMContentLoaded', function() {
    window.handleRichTextEditorReady = function(editorInstance) {
        console.log("Parent: Received ready signal from iframe. HugeRTE instance captured.");
        richTextEditorInstance = editorInstance;
        richTextEditorInstance.on('MouseDown KeyDown', () => {
            hasUserInteractedWithRTE = true;
        });

        if (richTextContent) {
            richTextEditorInstance.setContent(cleanHtmlForRichTextDisplay(richTextContent));
        }
    };
    const default_ifr = document.getElementById('default_ifr');
    const codePanel = document.getElementById('codePanel');
    const richtextOutputPanel = document.getElementById('richtextOutputPanel');
    const mainEditorArea = document.getElementById('mainEditorArea');
    const infoBtn = document.getElementById('infoBtn');
    const infoModal = document.getElementById('infoModal');
    const closeInfoModalBtn = document.getElementById('closeInfoModalBtn');
    const toggleEditorViewBtnRichText = document.getElementById('toggleEditorViewBtnRichText');
    const toggleEditorViewBtnCode = document.getElementById('toggleEditorViewBtnCode');
    const copyCodeBtn = document.getElementById('copyCodeBtn');
    const autoFormatBtn = document.getElementById('autoFormatBtn');
    const autoEncodeBtn = document.getElementById('autoEncodeBtn');
    const exportHtmlBtn = document.getElementById('exportHtmlBtn');
    const importHtmlBtn = document.getElementById('importHtmlBtn');
    const htmlFileInput = document.getElementById('htmlFileInput');
    const clearAllBtn = document.getElementById('clearAllBtn');
    const cleanMsoBtn = document.getElementById('cleanMsoBtn');
    const debouncedModalUpdate = debounce(updateModalPreview, 500);
    const validateNowBtn = document.getElementById('validateNowBtn');
    const previewBtn = document.getElementById('previewBtn');
    const toggleThemeBtn = document.getElementById('toggleThemeBtn');
    const previewModal = document.getElementById('previewModal');
    const modalPreviewFrame = document.getElementById('modalPreviewFrame');
    const closePreviewModalBtn = document.getElementById('closePreviewModalBtn');
    const exportPrototypeBtn = document.getElementById('exportPrototypeBtn');
    const modalCustomizeHeader = document.getElementById('modalCustomizeHeader');
    const modalCustomizeContent = document.getElementById('modalCustomizeContent');
    const modalCustomizeToggleIcon = document.getElementById('modalCustomizeToggleIcon');
    const modalToggleContainerBtn = document.getElementById('modalToggleContainerBtn');
    const modalToggleTitleBtn = document.getElementById('modalToggleTitleBtn');
    const modalToggleCssBtn = document.getElementById('modalToggleCssBtn');
    const modalH1TitleInput = document.getElementById('modalH1TitleInput');
    const modalH1TitleInputContainer = document.getElementById('modalH1TitleInputContainer');
    const modalNoneBylineBtn = document.getElementById('modalNoneBylineBtn');
    const modalEnglishBylineBtn = document.getElementById('modalEnglishBylineBtn');
    const modalFrenchBylineBtn = document.getElementById('modalFrenchBylineBtn');
    const modalLocalImagesBtn = document.getElementById('modalLocalImagesBtn');
    const modalPreviewImagesBtn = document.getElementById('modalPreviewImagesBtn');
    const modalToggleLiveImagesBtn = document.getElementById('modalToggleLiveImagesBtn');
    const modalLocalUrlsBtn = document.getElementById('modalLocalUrlsBtn');
    const modalPreviewUrlsBtn = document.getElementById('modalPreviewUrlsBtn');
    const modalToggleLiveUrlsBtn = document.getElementById('modalToggleLiveUrlsBtn');
    const modalPreviewSearchInput = document.getElementById('modalPreviewSearchInput');
    const modalPreviewFindPrevBtn = document.getElementById('modalPreviewFindPrevBtn');
    const modalPreviewFindNextBtn = document.getElementById('modalPreviewFindNextBtn');
    const modalToggleSectionsBtn = document.getElementById('modalToggleSectionsBtn');
    const modalToggleHeadingsBtn = document.getElementById('modalToggleHeadingsBtn');
    const modalWetGcdsToggleBtn = document.getElementById('modalWetGcdsToggleBtn');
    const modalLangEnBtn = document.getElementById('modalLangEnBtn');
    const modalLangFrBtn = document.getElementById('modalLangFrBtn');
    const modalBreakpointXsBtn = document.getElementById('modalBreakpointXsBtn');
    const modalBreakpointSmBtn = document.getElementById('modalBreakpointSmBtn');
    const modalBreakpointMdBtn = document.getElementById('modalBreakpointMdBtn');
    const modalBreakpointFullBtn = document.getElementById('modalBreakpointFullBtn');

    const contentModeBtn = document.getElementById('contentModeBtn');
    const tableModeBtn = document.getElementById('tableModeBtn');
    const mainControlsRow = document.getElementById('toggleEditorViewBtnCode').closest('.flex.items-center.mb-4.flex-wrap');
    const tableControlsRow1 = document.getElementById('open-tbl-options-tbl-modal-btn').closest('.flex.items-center.mb-2.flex-wrap');
    const tableControlsRow2 = document.getElementById('table-search-dropdown').parentElement;
    const bottomPanelContainer = document.getElementById('searchAndValidatePanel');
    const bottomPanelToggleBtn = document.getElementById('toggleBottomPanel');
    const bottomPanelSwitch = document.getElementById('searchValidateToggle');

    const toggleCleanSpaces = document.getElementById('toggleCleanSpaces');
    const toggleCleanUrls = document.getElementById('toggleCleanUrls');
    const toggleTimeTags = document.getElementById('toggleTimeTags');
    const toggleCleanSingleBreaks = document.getElementById('toggleCleanSingleBreaks');
    const toggleCleanFormattingTags = document.getElementById('toggleCleanFormattingTags');
    const toggleAutoLevelHeadings = document.getElementById('toggleAutoLevelHeadings');
    const toggleAutoSection = document.getElementById('toggleAutoSection');
    const toggleCleanPTables = document.getElementById('toggleCleanPTables');
    const formatSelectedBtn = document.getElementById('formatSelectedBtn');
    const autoCleanMsoToggleCodeContainer = document.getElementById('toggleAutoCleanMsoOnSwitchCode').closest('div.p-2');

    const autoIdBtn = document.getElementById('autoIdBtn');
    const colophonBtn = document.getElementById('colophonBtn');
    const figDescBtn = document.getElementById('figDescBtn');
    const defListBtn = document.getElementById('defListBtn');
    const footnoteAncBtn = document.getElementById('footnoteAncBtn');
    const footnoteListBtn = document.getElementById('footnoteListBtn');

    const undoBtn = document.getElementById('undoBtn');
    const redoBtn = document.getElementById('redoBtn');
    const enPageToCBtn = document.getElementById('enPageToCBtn');
    const enPageToCH3Btn = document.getElementById('enPageToCH3Btn');
    const frPageToCBtn = document.getElementById('frPageToCBtn');
    const frPageToCH3Btn = document.getElementById('frPageToCH3Btn');
    const enSecToCBtn = document.getElementById('enSecToCBtn');
    const enSecToCH4Btn = document.getElementById('enSecToCH4Btn');
    const enSecToCH5Btn = document.getElementById('enSecToCH5Btn');
    const enSecToCH6Btn = document.getElementById('enSecToCH6Btn');
    const frSecToCBtn = document.getElementById('frSecToCBtn');
    const frSecToCH4Btn = document.getElementById('frSecToCH4Btn');
    const frSecToCH5Btn = document.getElementById('frSecToCH5Btn');
    const frSecToCH6Btn = document.getElementById('frSecToCH6Btn');

    [contentModeBtn, tableModeBtn].forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    });



    const monacoEditorContainer = document.getElementById('monacoEditorContainer');
    const sidebarPanel = document.getElementById('sidebarPanel');

    const toggleAutoCleanMsoOnSwitchRichText = document.getElementById('toggleAutoCleanMsoOnSwitchRichText');
    const toggleAutoCleanMsoOnSwitchCode = document.getElementById('toggleAutoCleanMsoOnSwitchCode');

    const allInteractiveButtons = [
        toggleEditorViewBtnRichText, toggleEditorViewBtnCode, cleanMsoBtn, importHtmlBtn, exportHtmlBtn, formatSelectedBtn, autoIdBtn, figDescBtn, defListBtn, footnoteAncBtn, footnoteListBtn, colophonBtn, clearAllBtn, autoEncodeBtn, autoFormatBtn, copyCodeBtn, undoBtn, redoBtn, enPageToCBtn, enPageToCH3Btn, frPageToCBtn, frPageToCH3Btn, enSecToCBtn, enSecToCH4Btn, enSecToCH5Btn, enSecToCH6Btn, frSecToCBtn, frSecToCH4Btn, frSecToCH5Btn, frSecToCH6Btn,
    ];

    const undoStack = [];
    const redoStack = [];
    let isUndoingOrRedoing = false;
    const UNDO_LIMIT = 50;

    let richTextEditorInstance;
    let monacoEditorInstance;
    let cssEditorInstance = null;
    let currentView = 'richtext';

    let hasUserInteractedWithRTE = false;

    let richTextContent = '';
    let htmlOutputContent = '';

    let richTextEditorInstanceFromIframe;

    let modalShowSections = false;
    let modalShowHeadings = false;
    let modalUseContainerDiv = true;
    let modalShowTitle = true;
    let modalImageSourceMode = 'preview';
    let modalBylineMode = 'none';
    let modalIsCustomizeExpanded = false;
    let modalEnableCss = true;
    let modalUrlSourceMode = 'preview';
    let modalCurrentLanguage = 'en';
    let modalCurrentFramework = 'wet+';
    let modalH1TitleEn = '';
    let modalH1TitleFr = '';
    let modalLastSearchTerm = '';
    let modalCurrentBreakpoint = 'full';
    let customPreviewCss = '';
    const NBSP_PLACEHOLDER = '&#160;';

    let currentLineDecorations = [];

    const validationResultsDiv = document.getElementById('validationResults');
    validationResultsDiv.addEventListener('click', handleResultClick);

    function setEditorMode(mode) {
        if (mode === 'content') {

            contentModeBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
            contentModeBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            tableModeBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
            tableModeBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');

            sidebarPanel.classList.remove('hidden');
            toggleEditorViewBtnCode.classList.remove('hidden');
            autoCleanMsoToggleCodeContainer.classList.remove('hidden');
            cleanMsoBtn.classList.remove('hidden');
            removeTblModalBtn.classList.remove('hidden');

            tableControlsRow1.classList.add('hidden');
            tableControlsRow2.classList.add('hidden');

        } else if (mode === 'table') {

            tableModeBtn.classList.remove('bg-gray-600', 'hover:bg-gray-700');
            tableModeBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
            contentModeBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
            contentModeBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');

            sidebarPanel.classList.add('hidden');
            toggleEditorViewBtnCode.classList.add('hidden');
            autoCleanMsoToggleCodeContainer.classList.add('hidden');
            cleanMsoBtn.classList.add('hidden');
            removeTblModalBtn.classList.add('hidden');

            tableControlsRow1.classList.remove('hidden');
            tableControlsRow2.classList.remove('hidden');
        }
    }

    function handleResultClick(event) {
        const listItem = event.target.closest('li[data-line-number]');
        if (listItem && monacoEditorInstance) {
            const lineNumber = parseInt(listItem.dataset.lineNumber, 10);
            currentLineDecorations = monacoEditorInstance.deltaDecorations(currentLineDecorations, []);
            currentLineDecorations = monacoEditorInstance.deltaDecorations(currentLineDecorations, [{
                range: new monaco.Range(lineNumber, 1, lineNumber, monacoEditorInstance.getModel()
                    .getLineMaxColumn(lineNumber)),
                options: {
                    className: 'highlighted-line',
                    isOverviewRuler: true,
                    overviewRulerLane: monaco.editor.OverviewRulerLane.Full,
                    overviewRulerColor: 'rgba(100, 149, 237, 0.6)'
                }
            }]);
            monacoEditorInstance.revealLineInCenter(lineNumber);
            monacoEditorInstance.focus();
        }
    }

    function displayValidationResults(errors) {
        const validationResultsDiv = document.getElementById('validationResults');
        validationResultsDiv.innerHTML = '';

        errors.sort((a, b) => (a.lineNumber || 0) - (b.lineNumber || 0));

        if (errors.length === 0) {
            validationResultsDiv.classList.remove('bg-red-100', 'text-red-800', 'border-red-300');
            validationResultsDiv.classList.add('bg-green-100', 'text-green-800', 'border-green-300');
            validationResultsDiv.innerHTML = '<p class="font-semibold text-center">🎉 Valid! No issues found. 🎉</p>';
        } else {
            validationResultsDiv.classList.remove('bg-green-100', 'text-green-800', 'border-green-300');
            validationResultsDiv.classList.add('bg-red-100', 'text-red-800', 'border-red-300');
            const errorList = document.createElement('ul');
            errorList.classList.add('list-none', 'pl-2');

            errors.forEach(error => {
                const listItem = document.createElement('li');
                listItem.classList.add('mb-1');
                listItem.innerHTML = `<strong>Line ${error.lineNumber}:</strong> ${error.message}`;
                if (typeof error.lineNumber === 'number') {
                    listItem.dataset.lineNumber = error.lineNumber;
                }
                errorList.appendChild(listItem);
            });
            validationResultsDiv.appendChild(errorList);
        }
    }

    function isWithinAnyRange(index, ranges) {
        for (const range of ranges) {
            if (index >= range.start && index <= range.end) {
                return true;
            }
        }
        return false;
    }
    const removeTblModalBtn = document.getElementById('removeTblModalBtn');

    removeTblModalBtn.addEventListener('click', () => {
        const originalText = removeTblModalBtn.textContent;
        removeTblModalBtn.textContent = 'Opening...';
        removeTblModalBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();
        showRemoveTablesModal(removeTblModalBtn, originalText);
    });

    async function validateHtmlContent(fullHtmlCode) {
        const errors = [];
        if (monacoEditorInstance) {
            currentLineDecorations = monacoEditorInstance.deltaDecorations(currentLineDecorations, []);
        }
        const validationResultsDiv = document.getElementById('validationResults');
        validationResultsDiv.classList.remove('bg-green-100', 'bg-red-100');
        validationResultsDiv.classList.add('bg-gray-50', 'text-gray-700', 'border-gray-200');
        validationResultsDiv.innerHTML = '<p class="text-gray-500 text-center">Validating HTML... please wait.</p>';
        await new Promise(resolve => setTimeout(resolve, 50));

        try {
            const parser = new DOMParser();
            const tempDoc = parser.parseFromString(fullHtmlCode, 'text/html');

            APP_CONFIG.performValidationChecks(fullHtmlCode, tempDoc, monacoEditorInstance, errors);

        } catch (e) {
            console.error("Error during HTML validation:", e);
            errors.push({
                message: `<strong>Validation Error:</strong> An unexpected error occurred: ${e.message}.`,
                lineNumber: 'N/A'
            });
        } finally {
            displayValidationResults(errors);
        }
        return errors;
    }

    function updateUndoRedoButtons() {
        undoBtn.disabled = undoStack.length <= 1;
        redoBtn.disabled = redoStack.length === 0;
    }

    function recordState(content) {
        if (isUndoingOrRedoing) return;

        redoStack.length = 0;

        if (undoStack.length > 0 && undoStack[undoStack.length - 1] === content) {
            return;
        }

        undoStack.push(content);

        if (undoStack.length > UNDO_LIMIT) {
            undoStack.shift();
        }

        updateUndoRedoButtons();
    }

    previewBtn.addEventListener('click', showPreviewModal);
    previewModal.addEventListener('click', (event) => {
        if (event.target === previewModal) previewModal.classList.add('hidden');
    });
    closePreviewModalBtn.addEventListener('click', () => previewModal.classList.add('hidden'));
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !previewModal.classList.contains('hidden')) {
            closePreviewModalBtn.click();
        }
    });

    undoBtn.addEventListener('click', () => {
        if (undoStack.length > 1) {
            isUndoingOrRedoing = true;

            const currentState = undoStack.pop();
            redoStack.push(currentState);

            const prevState = undoStack[undoStack.length - 1];
            monacoEditorInstance.setValue(prevState);

            setTimeout(() => {
                isUndoingOrRedoing = false;
                updateUndoRedoButtons();
            }, 10);
        }
    });

    redoBtn.addEventListener('click', () => {
        if (redoStack.length > 0) {
            isUndoingOrRedoing = true;

            const stateToRestore = redoStack.pop();

            undoStack.push(stateToRestore);

            monacoEditorInstance.setValue(stateToRestore);

            setTimeout(() => {
                isUndoingOrRedoing = false;
                updateUndoRedoButtons();
            }, 10);
        }
    });

    function applyNBSPPlaceholders(htmlString) {
        let processedString = htmlString;
        processedString = processedString.replace(/&nbsp;|&#160;|\u00A0/g, NBSP_PLACEHOLDER);
        return processedString;
    }

    function revertNBSPPlaceholders(htmlString) {
        let processedString = htmlString;
        processedString = processedString.replace(new RegExp(NBSP_PLACEHOLDER, 'g'), '&#160;');
        return processedString;
    }

    function encodeBase64(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    function decodeBase64(str) {
        return decodeURIComponent(escape(atob(str)));
    }

    function protectDataAttributes(htmlString) {
        const regex = /(data-[a-zA-Z0-9-]+)=(['"])(.*?)\2/g;
        return htmlString.replace(regex, (match, attrName, quoteType, value) => {
            const safeValue = value.replace(/"/g, '__DOUBLE_QUOTE_PLACEHOLDER__').replace(/'/g, '__SINGLE_QUOTE_PLACEHOLDER__');
            const encodedValue = encodeBase64(safeValue);
            return `data-temp-protected-${attrName}="${encodedValue}"`;
        });
    }

    function restoreDataAttributes(htmlString) {
        const regex = /data-temp-protected-(data-[a-zA-Z0-9-]+)=(['"])(.*?)\2/g;
        return htmlString.replace(regex, (match, originalAttrName, quoteType, encodedValue) => {
            try {
                let decodedValue = decodeBase64(encodedValue);
                let safeValue = decodedValue.replace(/__DOUBLE_QUOTE_PLACEHOLDER__/g, '&quot;').replace(/__SINGLE_QUOTE_PLACEHOLDER__/g, '&apos;');
                return `${originalAttrName}="${safeValue}"`;
            } catch (e) {
                console.error("Error decoding or re-escaping Base64 data-attribute:", e);
                return '';
            }
        });
    }

    function decodeHtmlEntities(html) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = html;
        return textarea.value;
    }

    function cleanHtmlForRichTextDisplay(content) {
        return decodeHtmlEntities(content);
    }

    function protectGcdsTags(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const allElements = doc.body.querySelectorAll('*');

        for (let i = allElements.length - 1; i >= 0; i--) {
            const el = allElements[i];
            if (el.tagName.toLowerCase()
                .startsWith('gcds-')) {
                const tagName = el.tagName.toLowerCase();
                const innerContent = el.innerHTML;

                const attributes = {};
                let attributesDisplayHtml = '';
                for (const attr of el.attributes) {
                    attributes[attr.name] = attr.value;
                    attributesDisplayHtml += ` ${attr.name}="<span style='color: #c586c0;'>${attr.value}</span>"`;
                }
                const attributesJsonString = JSON.stringify(attributes);
                const safeAttributesJson = attributesJsonString.replace(/"/g, '&quot;');

                const wrapperDiv = doc.createElement('div');
                wrapperDiv.setAttribute('data-is-gcds-wrapper', 'true');
                wrapperDiv.setAttribute('data-gcds-tag-name', tagName);
                wrapperDiv.setAttribute('data-gcds-attributes-json', safeAttributesJson);

                const infoBlockHtml = `<div contenteditable="false" style="background-color: #2d3748; border: 1px solid #4a5568; border-radius: 4px; padding: 6px; font-family: monospace; font-size: 13px; margin-bottom: 8px; color: #a0aec0; user-select: none;">&lt;<span style="color: #569cd6;">${tagName}</span>${attributesDisplayHtml}&gt;</div>`;

                wrapperDiv.innerHTML = infoBlockHtml + innerContent;

                if (el.parentNode) {
                    el.parentNode.replaceChild(wrapperDiv, el);
                }
            }
        }
        return doc.body.innerHTML;
    }

    function restoreGcdsTags(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const wrappers = doc.body.querySelectorAll('div[data-is-gcds-wrapper="true"]');

        for (let i = wrappers.length - 1; i >= 0; i--) {
            const wrapper = wrappers[i];
            const tagName = wrapper.getAttribute('data-gcds-tag-name');
            const attributesJson = wrapper.getAttribute('data-gcds-attributes-json');

            const infoBlock = wrapper.querySelector('div[contenteditable="false"]');
            if (infoBlock) {
                infoBlock.remove();
            }
            const innerContent = wrapper.innerHTML;

            if (!tagName || !attributesJson) continue;

            try {
                const newGcdsElement = doc.createElement(tagName);
                const attributes = JSON.parse(attributesJson);
                for (const attr in attributes) {
                    newGcdsElement.setAttribute(attr, attributes[attr]);
                }
                newGcdsElement.innerHTML = innerContent;

                if (wrapper.parentNode) {
                    wrapper.parentNode.replaceChild(newGcdsElement, wrapper);
                }
            } catch (e) {
                console.error("Failed to restore GCDS tag. JSON was:", attributesJson, "Error:", e);
            }
        }
        return doc.body.innerHTML;
    }

    function applyUrlCleaning(htmlString) {
        const parser = new DOMParser();
        const tempDiv = parser.parseFromString(htmlString, 'text/html')
            .body;



        const aElements = tempDiv.querySelectorAll('a');
        aElements.forEach(a => {
            let href = a.getAttribute('href');
            const name = a.getAttribute('name');

            if (name && !href) {
                const parent = a.parentNode;
                if (parent) {
                    while (a.firstChild) {
                        parent.insertBefore(a.firstChild, a);
                    }
                    parent.removeChild(a);
                }
                return;
            }

            if (a.attributes.length === 0) {
                const parent = a.parentNode;
                if (parent) {
                    while (a.firstChild) {
                        parent.insertBefore(a.firstChild, a);
                    }
                    parent.removeChild(a);
                }
                return;
            }

            if (href) {
                if (href.startsWith('https://can01.safelinks.protection.outlook.com')) {
                    try {
                        const urlObj = new URL(href);
                        const actualUrlParam = urlObj.searchParams.get('url');
                        if (actualUrlParam) {
                            href = decodeURIComponent(actualUrlParam);
                            a.setAttribute('href', href);
                        }
                    } catch (e) {
                        console.error("Error parsing Outlook Safelink URL:", e);
                    }
                }

                let prepended = false;
                for (const pattern of APP_CONFIG.prependPatterns) {
                    if (href.startsWith(pattern)) {
                        if (href.startsWith('/')) {
                            href = '/content/canadasite' + href;
                        } else {
                            href = '/content/canadasite/' + href;
                        }
                        a.setAttribute('href', href);
                        prepended = true;
                        break;
                    }
                }

                if (prepended) {
                    if (a.hasAttribute('target')) {
                        a.removeAttribute('target');
                    }

                    if (a.hasAttribute('rel')) {
                        a.removeAttribute('rel');
                    }

                    if (a.hasAttribute('title')) {
                        a.removeAttribute('title');
                    }
                    return;
                }

                if (href.includes('/content/canadasite') || href.includes('/content/dam')) {
                    const contentPath = href.includes('/content/canadasite') ? '/content/canadasite' : '/content/dam';
                    const contentIndex = href.indexOf(contentPath);
                    if (contentIndex !== 0) {
                        href = href.substring(contentIndex);
                    }
                    a.setAttribute('href', href);
                } else {
                    for (const mapping of APP_CONFIG.urlMappings) {
                        if (href.startsWith(mapping.old)) {
                            href = href.replace(mapping.old, mapping.new);
                            a.setAttribute('href', href);
                            break;
                        }
                    }
                }
            }

            if (a.hasAttribute('target')) {
                a.removeAttribute('target');
            }

            if (a.hasAttribute('rel')) {
                a.removeAttribute('rel');
            }

        });


        const imgElements = tempDiv.querySelectorAll('img');
        imgElements.forEach(img => {
            let src = img.getAttribute('src');
            if (src && src.includes('/content/dam')) {
                const contentDamIndex = src.indexOf('/content/dam');
                if (contentDamIndex !== 0) {
                    src = src.substring(contentDamIndex);
                    img.setAttribute('src', src);
                }
            }
            if (img.hasAttribute('target')) {
                img.removeAttribute('target');
            }
            if (img.hasAttribute('rel')) {
                img.removeAttribute('rel');
            }
            if (img.hasAttribute('title')) {
                img.removeAttribute('title');
            }
        });

        return tempDiv.innerHTML;
    }

    function applyFixFnIdsLogic(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        const baseIdToSupElements = new Map();
        const supElements = doc.querySelectorAll('sup[id*="-rf"]');

        supElements.forEach(sup => {
            const originalId = sup.id;
            const baseId = originalId.replace(/-rf(-\d+)?$/, '');

            if (!baseIdToSupElements.has(baseId)) {
                baseIdToSupElements.set(baseId, []);
            }
            baseIdToSupElements.get(baseId).push(sup);
        });

        for (const [baseId, supList] of baseIdToSupElements.entries()) {
            let canonicalTargetId;

            if (supList.length > 1) {
                canonicalTargetId = `${baseId}-rf-0`;
                supList.forEach((sup, index) => {
                    const newSupId = `${baseId}-rf-${index}`;
                    sup.id = newSupId;
                });
            } else if (supList.length === 1) {
                canonicalTargetId = `${baseId}-rf`;
                supList[0].id = canonicalTargetId;
            } else {
                continue;
            }

            const ddElement = doc.getElementById(baseId);
            if (ddElement) {
                const returnLink = ddElement.querySelector('a[href*="-rf"]');
                if (returnLink) {
                    returnLink.setAttribute('href', `#${canonicalTargetId}`);
                }
            }
        }

        return doc.body.innerHTML;
    }

    function applyAutoSpacing(htmlString) {
        const parser = new DOMParser();
        let doc = parser.parseFromString(htmlString, 'text/html');
        const body = doc.body;

        const elementsToUnwrap = Array.from(body.querySelectorAll('div, span'));
        elementsToUnwrap.forEach(element => {
            if (element.attributes.length === 0) {
                const parent = element.parentNode;
                if (parent) {
                    while (element.firstChild) {
                        parent.insertBefore(element.firstChild, element);
                    }
                    parent.removeChild(element);
                }
            }
        });

        const spacerunSpans = body.querySelectorAll('span[style*="mso-spacerun: yes"]');
        spacerunSpans.forEach(span => {
            const parent = span.parentNode;
            if (parent) {
                if (span.textContent.includes(' ')) {
                    parent.replaceChild(doc.createTextNode(' '), span);
                } else {
                    parent.removeChild(span);
                }
            }
        });

        const walker = doc.createTreeWalker(
            body, NodeFilter.SHOW_TEXT, {
                acceptNode: function(node) {
                    const txt = node.nodeValue;
                    if (txt.trim() === '' && (txt.length > 1 || /[\r\n\t]/.test(txt))) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_REJECT;
                }
            }, false
        );

        const nodesToRemove = [];
        let currentNode;
        while (currentNode = walker.nextNode()) {
            nodesToRemove.push(currentNode);
        }

        nodesToRemove.forEach(node => {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });

        let cleanedHtml = body.innerHTML;

        cleanedHtml = cleanedHtml.replace(/(?:&#160;|\u00A0|&nbsp;){2,}/gi, '&#160;');

        cleanedHtml = cleanedHtml.replace(/\s+(&#160;|\u00A0|&nbsp;)/gi, '&#160;');
        cleanedHtml = cleanedHtml.replace(/(&#160;|\u00A0|&nbsp;)\s+/gi, '&#160;');


        cleanedHtml = cleanedHtml.replace(/(<br\s*\/?>\s*){2,}/gi, '</p><p>');

        cleanedHtml = cleanedHtml.replace(/<br\s+clear=["']?(all|ALL)["']?\s*\/?>/gi, '');


        doc.body.innerHTML = cleanedHtml;
        const finalBody = doc.body;

        const elementsToCheckForEmptiness = Array.from(finalBody.querySelectorAll('p, ul, li, div, span, strong, em, u, b, i, section, article, code, h1, h2, h3, h4, h5, h6'));

for (let i = elementsToCheckForEmptiness.length - 1; i >= 0; i--) {
    const element = elementsToCheckForEmptiness[i];
    const tagName = element.tagName.toLowerCase();
    const trimmedContent = element.innerHTML.trim();
    const containsOnlyNBSP = (trimmedContent === '&#160;' || trimmedContent === '&nbsp;' || trimmedContent === '\u00A0');
    const containsOnlySpace = (trimmedContent === ' ');

    if (tagName === 'li') {
        const hasOnlyNestedList = element.children.length === 1 && (element.children[0].tagName === 'UL' || element.children[0].tagName === 'OL');
        const isEffectivelyEmpty = trimmedContent === '' || containsOnlyNBSP || containsOnlySpace;

        // ONLY add/retain NBSP if it's actually empty OR contains only a sub-list
        if (isEffectivelyEmpty || hasOnlyNestedList) {
            if (hasOnlyNestedList) {
                // If it has a nested list, only add NBSP if there's no other text/content
                // Using textContent check ensures we don't overwrite if text is present
                const textWithoutNested = element.textContent.replace(element.children[0].textContent, '').trim();
                if (textWithoutNested === '') {
                    element.innerHTML = '&#160;' + element.children[0].outerHTML;
                    element.setAttribute('data-keep-spacer', 'true');
                }
            } else {
                // Completely empty LI
                element.innerHTML = '&#160;';
                element.setAttribute('data-keep-spacer', 'true');
            }
            continue; 
        }
    } else if (tagName === 'p') {
        const isInsideTable = element.closest('table');
        if (!isInsideTable && (trimmedContent === '' || containsOnlyNBSP)) {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        } else if (!isInsideTable && containsOnlySpace) {
            if (element.parentNode) {
                element.parentNode.replaceChild(doc.createTextNode(' '), element);
            }
        }
    } else {
        // ... existing logic for other tags ...
        if (['div', 'span', 'section'].includes(tagName) && element.attributes.length > 0) {
            continue;
        }
        if (element.textContent === ' ' && ['strong', 'em', 'u', 'b', 'i'].includes(tagName)) {
            element.parentNode.replaceChild(doc.createTextNode(' '), element);
            continue;
        }
        if (trimmedContent === '' || containsOnlyNBSP) {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        } else if (containsOnlySpace) {
            if (element.parentNode) {
                element.parentNode.replaceChild(doc.createTextNode(' '), element);
            }
        }
    }
}

        const elementsToTrim = finalBody.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');
elementsToTrim.forEach(element => {
    // SKIP trimming if this is a special empty LI we just processed
    if (element.hasAttribute('data-keep-spacer')) {
        element.removeAttribute('data-keep-spacer');
        return;
    }

    let currentHtml = element.innerHTML;
    currentHtml = currentHtml.replace(/^(?:&nbsp;|\s|&#160;|\u00A0)+/, '');
    currentHtml = currentHtml.replace(/(?:&nbsp;|\s|&#160;|\u00A0)+$/, '');
    element.innerHTML = currentHtml;
});

        return finalBody.innerHTML;
    }

    function applyCleanSingleBreaks(htmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    
    // We target LI elements specifically to handle internal paragraphing
    const listItems = Array.from(doc.querySelectorAll('li'));
    listItems.forEach(li => {
        if (li.querySelector('br')) {
            // Convert the LI content into paragraphs if it contains BRs
            // This turns <li>A<br>B</li> into <li><p>A</p><p>B</p></li>
            let content = li.innerHTML;
            let parts = content.split(/<br\s*\/?>/i);
            
            // Only convert to paragraphs if there is actual content to split
            if (parts.length > 1) {
                li.innerHTML = parts
                    .map(part => part.trim())
                    .filter(part => part.length > 0 || part === '&#160;')
                    .map(part => `<p>${part}</p>`)
                    .join('');
            }
        }
    });

    // Handle remaining BRs (those not inside LIs) using existing logic or standard removal
    const remainingBrs = Array.from(doc.querySelectorAll('br'));
    for (let i = remainingBrs.length - 1; i >= 0; i--) {
        const br = remainingBrs[i];
        if (!br || !br.parentNode) continue;

        let currentParent = br.parentNode;
        let isInsideTable = false;
        while (currentParent && currentParent !== doc.body) {
            if (currentParent.tagName && currentParent.tagName.toLowerCase() === 'table') {
                isInsideTable = true;
                break;
            }
            currentParent = currentParent.parentNode;
        }

        if (isInsideTable) continue;

        // Existing logic for BRs outside of LIs
        const newParagraph = doc.createElement('p');
        while (br.nextSibling) {
            newParagraph.appendChild(br.nextSibling);
        }
        if (br.parentNode.parentNode) {
            br.parentNode.parentNode.insertBefore(newParagraph, br.parentNode.nextSibling);
        } else {
            doc.body.appendChild(newParagraph);
        }
        br.parentNode.removeChild(br);
    }

    return doc.body.innerHTML;
}

    function applyCleanPTagsInTables(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        const pElementsInCells = doc.querySelectorAll('thead td p, thead th p, tbody td p, tbody th p');

        for (let i = pElementsInCells.length - 1; i >= 0; i--) {
            const pTag = pElementsInCells[i];
            const parentCell = pTag.parentNode;

            const closestCell = pTag.closest('td, th');

            if (closestCell) {
                while (pTag.firstChild) {
                    parentCell.insertBefore(pTag.firstChild, pTag);
                }
                parentCell.removeChild(pTag);
            }
        }
        return doc.body.innerHTML;
    }
	
	function unwrapStrongInHeadings(htmlString) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');

		// Select all <strong> elements that are direct or indirect descendants of h1-h6 tags
		const strongElements = Array.from(doc.body.querySelectorAll('h1 strong, h2 strong, h3 strong, h4 strong, h5 strong, h6 strong'));

		strongElements.forEach(strong => {
			const parent = strong.parentNode;
			if (parent) {
				// Move all children of <strong> directly under its parent (the heading tag)
				while (strong.firstChild) {
					parent.insertBefore(strong.firstChild, strong);
				}
				// Remove the now-empty <strong> tag
				parent.removeChild(strong);
			}
		});

		return doc.body.innerHTML;
	}
		
	function applyCleanListTypes(htmlString) {
		const parser = new DOMParser();
		const doc = parser.parseFromString(htmlString, 'text/html');

		// Select all ul and ol elements
		const listElements = doc.querySelectorAll('ul, ol');

		listElements.forEach(list => {
			if (list.hasAttribute('type')) {
				const tagName = list.tagName.toLowerCase();
				const typeValue = list.getAttribute('type').toLowerCase();
				
				// Remove type attribute from OL for *any* type
				if (tagName === 'ol') {
					list.removeAttribute('type');
				} 
				// Retain original logic for UL (removing specific unwanted types)
				else if (tagName === 'ul' && ['disc', 'circle', 'square'].includes(typeValue)) {
					list.removeAttribute('type');
				}
			}
		});

		return doc.body.innerHTML;
	}

    function removeEmptyParagraphsOutsideTablesAndLists(htmlString) {
        const parser = new DOMParser();
        const doc = doc.parseFromString(htmlString, 'text/html');
        const paragraphs = doc.querySelectorAll('p');

        for (let i = paragraphs.length - 1; i >= 0; i--) {
            const p = paragraphs[i];
            const containsOnlyNBSP = p.innerHTML.trim() === '&nbsp;' || p.innerHTML.trim() === '\u00A0';

            if (containsOnlyNBSP) {
                let parent = p.parentElement;
                let isInsideTableOrList = false;
                while (parent) {
                    if (parent.tagName === 'TABLE' || parent.tagName === 'LI') {
                        isInsideTableOrList = true;
                        break;
                    }
                    parent = parent.parentElement;
                }

                if (!isInsideTableOrList) {
                    p.parentNode.removeChild(p);
                }
            }
        }
        return doc.body.innerHTML;
    }

    function removeEmptyParagraphs(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const paragraphs = doc.querySelectorAll('p');

        for (let i = paragraphs.length - 1; i >= 0; i--) {
            const p = paragraphs[i];

            const trimmedContent = p.innerHTML.trim();
            const isEmptyOrNBSP = trimmedContent === '' || trimmedContent === '&nbsp;' || trimmedContent === '\u00A0';

            const hasMsoClass = p.classList.length > 0 && p.className.startsWith('Mso');

            const isInsideTable = p.closest('table');

            if (isEmptyOrNBSP && hasMsoClass && !isInsideTable) {
                if (p.parentNode) {
                    p.parentNode.removeChild(p);
                }
            }
        }
        return doc.body.innerHTML;
    }

    function removeInlineWidthHeightStyles(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const allElements = doc.querySelectorAll('*');

        allElements.forEach(element => {
            if (element.hasAttribute('style')) {
                let style = element.getAttribute('style');
                style = style.replace(/width:\s*[^;]+;?/gi, '');
                style = style.replace(/height:\s*[^;]+;?/gi, '');
                style = style.replace(/;{2,}/g, ';')
                    .trim();
                if (style.endsWith(';')) {
                    style = style.slice(0, -1);
                }

                if (style) {
                    element.setAttribute('style', style);
                } else {
                    element.removeAttribute('style');
                }
            }
        });
        return doc.body.innerHTML;
    }

    function convertAllEntitiesToNumeric(htmlString) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlString;

        const walker = document.createTreeWalker(
            tempDiv, NodeFilter.SHOW_TEXT, {
                acceptNode: function(textNode) {
                    let parent = textNode.parentNode;
                    while (parent) {
                        const tagName = parent.tagName ? parent.tagName.toLowerCase() : '';
                        if (tagName === 'script' || tagName === 'style' || tagName === 'time') {
                            return NodeFilter.FILTER_REJECT;
                        }
                        parent = parent.parentNode;
                    }
                    return NodeFilter.FILTER_ACCEPT;
                }
            }, false

        );

        let currentNode;
        const textNodesToProcess = [];
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



    function applyCleanLists(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const body = doc.body;

        doc.querySelectorAll('h1 [style*="mso-element: comment-list"], h1 [style*="mso-element: endnote-list"], ' +
                'h2 [style*="mso-element: comment-list"], h2 [style*="mso-element: endnote-list"], ' +
                'h3 [style*="mso-element: comment-list"], h3 [style*="mso-element: endnote-list"], ' +
                'h4 [style*="mso-element: comment-list"], h4 [style*="mso-element: endnote-list"], ' +
                'h5 [style*="mso-element: comment-list"], h5 [style*="mso-element: endnote-list"], ' +
                'h6 [style*="mso-element: comment-list"], h6 [style*="mso-element: endnote-list"]')
            .forEach(element => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            });

        doc.querySelectorAll('h1 a[href*="#_msocom"], h1 a[href*="#_edn"], ' +
                'h2 a[href*="#_msocom"], h2 a[href*="#_edn"], ' +
                'h3 a[href*="#_msocom"], h3 a[href*="#_edn"], ' +
                'h4 a[href*="#_msocom"], h4 a[href*="#_edn"], ' +
                'h5 a[href*="#_msocom"], h5 a[href*="#_edn"], ' +
                'h6 a[href*="#_msocom"], h6 a[href*="#_edn"]')
            .forEach(link => {
                if (link.parentNode) {
                    link.parentNode.removeChild(link);
                }
            });

        doc.querySelectorAll(
                'h1[style*="mso-list"],h2[style*="mso-list"],h3[style*="mso-list"],' +
                'h4[style*="mso-list"],h5[style*="mso-list"],h6[style*="mso-list"]'
            )
            .forEach(h => {
                const tag = h.tagName.toLowerCase();
                const text = h.textContent.trim().replace(/\s+/g, ' ');
                const cleanH = doc.createElement(tag);
                cleanH.textContent = text;
                h.replaceWith(cleanH);
            });

        function getLevel(styleAttr) {
            if (!styleAttr) return null;
            const match = styleAttr.match(/level(\d+)/);
            return match ? parseInt(match[1], 10) : null;
        }

        function getLevelFromClass(classList) {
            const msoClass = classList.find(cls => cls.startsWith('MsoList'));
            if (!msoClass) return null;

            const match = msoClass.match(/MsoList.*?(\d+)$/);
            if (match) {
                return parseInt(match[1], 10);
            }
            return 1;
        }

        function extractAllowedContentForLists(sourceNode) {
            let contentHtml = '';
            const childrenToProcess = Array.from(sourceNode.childNodes);

            childrenToProcess.forEach(child => {
                if (child.nodeType === Node.ELEMENT_NODE && child.tagName.toLowerCase() === 'span' && child.hasAttribute('style') && child.getAttribute('style')
                    .includes('mso-list: Ignore')) {
                    return;
                }

                if (child.nodeType === Node.TEXT_NODE) {
                    contentHtml += child.nodeValue;
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    const tagName = child.tagName.toLowerCase();
                    const hasClassOrId = child.hasAttribute('class') || child.hasAttribute('id');

                    const containsDisallowedPattern = (element) => {
                        const elemClassAttr = element.getAttribute('class');
                        if (elemClassAttr) {
                            const classes = elemClassAttr.split(/\s+/);
                            for (const cls of classes) {
                                if (cls.includes('Mso') || cls.includes('Word') || cls.includes('Style') || cls.includes('DocumentTitle') || cls.includes('Heading') || cls.includes('BCX0') || cls.includes('Header') || cls.includes('paragraph')) {
                                    return true;
                                }
                            }
                        }
                        const elemIdAttr = element.getAttribute('id');
                        if (elemIdAttr) {
                            if (elemIdAttr.includes('Mso') || elemIdAttr.includes('Word') || elemIdAttr.includes('BCX0')) {
                                return true;
                            }
                        }
                        return false;
                    };

                    if (tagName === 'br' || tagName === 'strong' || tagName === 'a' || tagName === 'em' || tagName === 'u' || tagName === 'sup' || tagName === 'sub' || tagName === 'section' || tagName === 'ins') {
                        contentHtml += child.outerHTML;
                    } else if ((tagName === 'span' || tagName === 'div') && !containsDisallowedPattern(child)) {
                        const clonedChild = child.cloneNode(false);
                        clonedChild.innerHTML = extractAllowedContentForLists(child);
                        contentHtml += clonedChild.outerHTML;
                    } else if (tagName === 'a' && child.hasAttribute('href')) {
                        contentHtml += child.outerHTML;
                    } else {
                        contentHtml += extractAllowedContentForLists(child);
                    }
                }
            });
            return contentHtml;
        }

        function detectListType(element) {
            const msoListIgnoreSpan = element.querySelector('span[style*="mso-list: Ignore"]');
            if (msoListIgnoreSpan) {
                const bulletText = msoListIgnoreSpan.textContent.trim();

                if (/^\d+(\.\d+)+[\.\)]*$/.test(bulletText)) return 'complex-bullet';
                if (/^[A-Za-z](\.\d+)+[\.\)]*$/.test(bulletText)) return 'complex-bullet';

                if (/^\d+[\.\)]$/.test(bulletText)) return 'ordered-numeric';

                if (/^[ivxlcdm]+[\.\)]$/i.test(bulletText)) {
                    const romanText = bulletText.replace(/[\.\)]$/, '');
                    if (isValidRomanNumeral(romanText.toLowerCase())) {
                        return romanText === romanText.toLowerCase() ? 'ordered-roman-lower' : 'ordered-roman-upper';
                    }
                }

                if (/^[a-z][\.\)]$/.test(bulletText)) return 'ordered-alpha-lower';
                if (/^[A-Z][\.\)]$/.test(bulletText)) return 'ordered-alpha-upper';
            }
            return 'unordered';
        }

        function isValidRomanNumeral(str) {
            const romanPattern = /^(i{1,3}|iv|v|vi{0,3}|ix|x)$/i;
            return romanPattern.test(str);
        }

        const targetElements = Array.from(body.querySelectorAll('p, h1, h2, h3, h4, h5, h6'));
        const elementsToReplace = new Map();
        const elementsToRemove = new Set();

        for (let i = 0; i < targetElements.length; i++) {
            const element = targetElements[i];

            if (elementsToRemove.has(element)) {
                continue;
            }

            const tagName = element.tagName.toLowerCase();
            const classList = Array.from(element.classList);
            const styleAttr = element.getAttribute('style') || '';

            // UPDATED: Check for ANY class starting with MsoList
            const isMsoListParagraphClass = classList.some(cls => cls.startsWith('MsoList'));

            // Allow matching solely by style if the class isn't present
            const matchesNewRule =
                (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) &&
                (!isMsoListParagraphClass) &&
                (styleAttr.includes('mso-list'));

            if (isMsoListParagraphClass || matchesNewRule) {
                // Try to get level from style first
                let level = getLevel(styleAttr);

                // UPDATED: If style level is missing, infer from class name (MsoList2 -> 2)
                if (level === null && isMsoListParagraphClass) {
                    level = getLevelFromClass(classList);
                }

                if (level === null) {
                    element.removeAttribute('class');
                    element.removeAttribute('style');
                    element.classList.add('MsoNormal');
                    continue;
                }

                const msoListIgnoreSpan = element.querySelector('span[style*="mso-list: Ignore"]');
                let bulletTextToPrepend = '';
                let listType = 'unordered';

                if (msoListIgnoreSpan) {
                    bulletTextToPrepend = msoListIgnoreSpan.textContent.trim();
                    listType = detectListType(element);
                    msoListIgnoreSpan.parentNode.removeChild(msoListIgnoreSpan);
                }

                let newRootListElement;
                if (listType === 'ordered-numeric') {
                    newRootListElement = doc.createElement('ol');
                } else if (listType === 'ordered-alpha-lower') {
                    newRootListElement = doc.createElement('ol');
                    newRootListElement.classList.add('lst-lwr-alph');
                } else if (listType === 'ordered-alpha-upper') {
                    newRootListElement = doc.createElement('ol');
                    newRootListElement.classList.add('lst-upr-alph');
                } else if (listType === 'ordered-roman-lower') {
                    newRootListElement = doc.createElement('ol');
                    newRootListElement.classList.add('lst-lwr-rmn');
                } else if (listType === 'ordered-roman-upper') {
                    newRootListElement = doc.createElement('ol');
                    newRootListElement.classList.add('lst-upr-rmn');
                } else {
                    newRootListElement = doc.createElement('ul');
                }

                let currentListStack = [{
                    domElement: newRootListElement,
                    level: level
                }];
                let currentParentList = newRootListElement;

                const li = doc.createElement('li');
                let listItemContent = extractAllowedContentForLists(element);

                if (listType === 'complex-bullet') {
                    li.innerHTML = bulletTextToPrepend + ' ' + listItemContent;
                } else {
                    li.innerHTML = listItemContent;
                }
                currentParentList.appendChild(li);
                elementsToReplace.set(element, newRootListElement);

                element.removeAttribute('class');
                element.removeAttribute('style');

                let nextSibling = element.nextElementSibling;
                let currentSequenceIndex = i + 1;

                while (nextSibling && currentSequenceIndex < targetElements.length) {
                    const nextElement = targetElements[currentSequenceIndex];
                    if (nextElement !== nextSibling) {
                        break;
                    }

                    const nextTagName = nextElement.tagName.toLowerCase();
                    const nextClassList = Array.from(nextElement.classList);
                    const nextStyleAttr = nextElement.getAttribute('style') || '';

                    // UPDATED: Check next element for ANY MsoList class
                    const isNextMsoListParagraphClass = nextClassList.some(cls => cls.startsWith('MsoList'));

                    const nextMatchesNewRule =
                        (['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(nextTagName)) &&
                        (!isNextMsoListParagraphClass) &&
                        (nextStyleAttr.includes('mso-list'));

                    if (isNextMsoListParagraphClass || nextMatchesNewRule) {
                        let nextLevel = getLevel(nextStyleAttr);

                        // UPDATED: If style level is missing, infer from class name
                        if (nextLevel === null && isNextMsoListParagraphClass) {
                            nextLevel = getLevelFromClass(nextClassList);
                        }

                        // Use current depth if we still can't find a level but it looks like a list item
                        if (nextLevel === null && isNextMsoListParagraphClass) {
                            const currentDepth = currentListStack[currentListStack.length - 1].level;
                            nextLevel = currentDepth;
                        }

                        if (nextLevel === null) {
                            nextElement.removeAttribute('class');
                            nextElement.removeAttribute('style');
                            nextElement.classList.add('MsoNormal');
                            break;
                        }

                        const nextMsoListIgnoreSpan = nextElement.querySelector('span[style*="mso-list: Ignore"]');
                        let nextBulletTextToPrepend = '';
                        let nextListType = 'unordered';

                        if (nextMsoListIgnoreSpan) {
                            nextBulletTextToPrepend = nextMsoListIgnoreSpan.textContent.trim();
                            nextListType = detectListType(nextElement);
                            nextMsoListIgnoreSpan.parentNode.removeChild(nextMsoListIgnoreSpan);
                        }

                        let currentDepth = currentListStack[currentListStack.length - 1].level;

                        if (nextLevel > currentDepth) {
                            let nestedListElement;
                            if (nextListType === 'ordered-numeric') {
                                nestedListElement = doc.createElement('ol');
                            } else if (nextListType === 'ordered-alpha-lower') {
                                nestedListElement = doc.createElement('ol');
                                nestedListElement.classList.add('lst-lwr-alph');
                            } else if (nextListType === 'ordered-alpha-upper') {
                                nestedListElement = doc.createElement('ol');
                                nestedListElement.classList.add('lst-upr-alph');
                            } else if (nextListType === 'ordered-roman-lower') {
                                nestedListElement = doc.createElement('ol');
                                nestedListElement.classList.add('lst-lwr-rmn');
                            } else if (nextListType === 'ordered-roman-upper') {
                                nestedListElement = doc.createElement('ol');
                                nestedListElement.classList.add('lst-upr-rmn');
                            } else {
                                nestedListElement = doc.createElement('ul');
                            }

                            let targetLi = currentParentList.lastElementChild;
                            if (!targetLi || targetLi.tagName.toLowerCase() !== 'li') {
                                targetLi = doc.createElement('li');
                                currentParentList.appendChild(targetLi);
                            }
                            targetLi.appendChild(nestedListElement);
                            currentListStack.push({
                                domElement: nestedListElement,
                                level: nextLevel
                            });
                            currentParentList = nestedListElement;

                        } else if (nextLevel < currentDepth) {
                            while (currentListStack.length > 1 && nextLevel <= currentListStack[currentListStack.length - 1].level) {
                                currentListStack.pop();
                            }
                            currentParentList = currentListStack[currentListStack.length - 1].domElement;

                            while (currentListStack.length < nextLevel) {
                                let targetLi = currentParentList.lastElementChild;
                                if (!targetLi || targetLi.tagName.toLowerCase() !== 'li') {
                                    targetLi = doc.createElement('li');
                                    currentParentList.appendChild(targetLi);
                                }
                                let newNestedList;
                                if (currentListStack.length + 1 === nextLevel) {
                                    if (nextListType === 'ordered-numeric') {
                                        newNestedList = doc.createElement('ol');
                                    } else if (nextListType === 'ordered-alpha') {
                                        newNestedList = doc.createElement('ol');
                                        newNestedList.classList.add('lst-lwr-alph');
                                    } else {
                                        newNestedList = doc.createElement('ul');
                                    }
                                } else {
                                    newNestedList = doc.createElement('ul');
                                }
                                targetLi.appendChild(newNestedList);
                                currentListStack.push({
                                    domElement: newNestedList,
                                    level: currentListStack.length + 1
                                });
                                currentParentList = newNestedList;
                            }
                        }

                        const nextLi = doc.createElement('li');
                        let nextListItemContent = extractAllowedContentForLists(nextElement);
                        if (nextListType === 'complex-bullet') {
                            nextLi.innerHTML = nextBulletTextToPrepend + ' ' + nextListItemContent;
                        } else {
                            nextLi.innerHTML = nextListItemContent;
                        }
                        currentParentList.appendChild(nextLi);
                        elementsToRemove.add(nextElement);

                        nextElement.removeAttribute('class');
                        nextElement.removeAttribute('style');

                        nextSibling = nextElement.nextElementSibling;
                        currentSequenceIndex++;
                    } else {
                        break;
                    }
                }
                i = currentSequenceIndex - 1;
            }
        }
		
        targetElements.forEach(element => {
            if (elementsToReplace.has(element)) {
                if (element.parentNode) {
                    element.parentNode.replaceChild(elementsToReplace.get(element), element);
                }
            } else if (elementsToRemove.has(element)) {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }
        });

        return doc.body.innerHTML;
    }
	
    function applyCleanTablesBasic(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const body = doc.body;

        doc.querySelectorAll('colgroup, col')
            .forEach(el => el.remove());

        doc.querySelectorAll('table, thead, tbody, tfoot, tr, th, td')
            .forEach(element => {
                const attributesToKeep = ['rowspan', 'colspan', 'class', 'id', 'headers', 'scope'];
                const attributesToRemove = Array.from(element.attributes)
                    .map(attr => attr.name)
                    .filter(attrName => !attributesToKeep.includes(attrName.toLowerCase()));

                attributesToRemove.forEach(attrName => element.removeAttribute(attrName));
            });

        doc.querySelectorAll('table')
            .forEach(table => {
                table.classList.remove('MsoTable');
                if (!table.getAttribute('class')) {
                    table.removeAttribute('class');
                }

                table.removeAttribute('style');
                table.querySelectorAll('*')
                    .forEach(descendant => {
                        descendant.removeAttribute('style');
                    });

                table.querySelectorAll('td[class^="xl"] span')
                    .forEach(span => {
                        if (span.parentNode) {
                            while (span.firstChild) {
                                span.parentNode.insertBefore(span.firstChild, span);
                            }
                            span.parentNode.removeChild(span);
                        }
                    });

                table.querySelectorAll('td[class^="xl"]')
                    .forEach(td => {
                        td.removeAttribute('class');
                    });

                table.querySelectorAll('p')
                    .forEach(p => {
                        const parentCell = p.closest('td, th');
                        if (parentCell) {
                            const classAttr = p.getAttribute('class');
                            if (classAttr && (classAttr.includes('Mso') || classAttr.includes('Style') || classAttr.includes('DocumentTitle') || classAttr.includes('Heading') || classAttr.includes('Aligned'))) {
                                p.removeAttribute('class');
                            }

                            const alignAttr = p.getAttribute('align');
                            if (alignAttr) {
                                p.removeAttribute('align');
                                let tailwindAlignClass = '';
                                switch (alignAttr.toLowerCase()) {
                                    case 'left':
                                        tailwindAlignClass = 'text-left';
                                        break;
                                    case 'center':
                                        tailwindAlignClass = 'text-center';
                                        break;
                                    case 'right':
                                        tailwindAlignClass = 'text-right';
                                        break;
                                }
                                if (tailwindAlignClass) {
                                    parentCell.classList.add(tailwindAlignClass);
                                }
                            }
                        }
                    });
            });
        return body.innerHTML;
    }

    function unwrapSingleCellTables(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const tables = doc.querySelectorAll('table');

        tables.forEach(table => {
            const cells = table.querySelectorAll('td, th');
            const isSingleCell = cells.length === 1;

            if (isSingleCell) {
                const cell = cells[0];
                const parent = table.parentNode;

                if (parent) {
                    while (cell.firstChild) {
                        parent.insertBefore(cell.firstChild, table);
                    }
                    parent.removeChild(table);
                }
            }
        });

        return doc.body.innerHTML;
    }

    function isClassAllowed(className, config) {
        if (!className || !config) return false;

        if (config.exact.has(className)) {
            return true;
        }
        if (config.prefixes.some(prefix => className.startsWith(prefix))) {
            return true;
        }
        return false;
    }


    function applyCleanMsoCode(htmlString) {
        if (!htmlString) return '';

        let cleanHtml = htmlString
            .replace(/<!--\s*\[\s*if[\s\S]*?-->/gi, '')
            .replace(/\x3c!\[endif\]--\x3e/gi, '')
            .replace(/\x3c!--\s*\[endif\]--\x3e/gi, '')
            .replace(/<xml>[\s\S]*?<\/xml>/gi, '')
            .replace(/<\/?o:p[^>]*>/gi, '');

        const parser = new DOMParser();
        const doc = parser.parseFromString(cleanHtml, 'text/html');
        const body = doc.body;

        body.querySelectorAll('del, span.msoDel').forEach(el => el.remove());
        body.querySelectorAll('ins, span.msoIns').forEach(el => {
            if (el.parentNode) {
                while (el.firstChild) {
                    el.parentNode.insertBefore(el.firstChild, el);
                }
                el.remove();
            }
        });

        body.querySelectorAll(
            '[style*="mso-element: comment-list"], [style*="mso-element: endnote-list"], a[href*="#_msocom"], a[href*="#_edn"]'
        ).forEach(el => el.remove());

        body.querySelectorAll('img').forEach(img => {
            const src = img.getAttribute('src');
            if (src && (src.startsWith('file://') || src.startsWith('data:'))) {
                const replacementDiv = doc.createElement('div');
                replacementDiv.classList.add('clearfix');
                const replacementMark = doc.createElement('mark');
                replacementMark.textContent = 'IMAGE NOT IMPORTED';
                replacementDiv.appendChild(replacementMark);
                if (img.parentNode) {
                    img.parentNode.replaceChild(replacementDiv, img);
                }
            }
        });

        body.querySelectorAll('hr').forEach(hr => {
            const allowedAttrs = new Set(['class', 'id']);
            if (Array.from(hr.attributes).some(attr => !allowedAttrs.has(attr.name.toLowerCase()))) {
                hr.remove();
            }
        });

        body.querySelectorAll('span[style*="mso-tab-count"], span[style*="mso-spacerun"]').forEach(span => {
            if (span.parentNode) {
                span.parentNode.replaceChild(doc.createTextNode(' '), span);
            }
        });

        body.querySelectorAll('span[style*="mso-element"]').forEach(span => {
            if (span.parentNode) {
                while (span.firstChild) {
                    span.parentNode.insertBefore(span.firstChild, span);
                }
                span.remove();
            }
        });

        body.querySelectorAll('a[href*="_Toc"]').forEach(a => {
            let cleanText = a.textContent.replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
            cleanText = cleanText.replace(/\.\s+\d+$/, '.');
            a.textContent = cleanText;
        });

        body.querySelectorAll('a:not([href])').forEach(anchor => {
            const parent = anchor.parentNode;
            if (parent) {
                while (anchor.firstChild) {
                    parent.insertBefore(anchor.firstChild, anchor);
                }
                parent.removeChild(anchor);
            }
        });

        body.querySelectorAll('div[class*="WordSection"], div[class*="DocumentTitle"]').forEach(div => {
            if (div.parentNode) {
                while (div.firstChild) {
                    div.parentNode.insertBefore(div.firstChild, div);
                }
                div.remove();
            }
        });

        const occurrenceMap = new Map();
        const refInfoMap = new Map();
        let tableCounter = 0;
        const tableElementToIdMap = new Map();
        const processedFootnoteDefinitions = [];

        const allPotentialRefs = Array.from(doc.querySelectorAll('a[href*="#_ftn"], span.MsoFootnoteReference'));

        allPotentialRefs.forEach(refElement => {
            if (refElement.tagName === 'SPAN' && refElement.classList.contains('MsoFootnoteReference') && refElement.closest('a[href*="#_ftn"]')) {
                return;
            }
            let originalNum;
            const linkRef = refElement.closest('a');
            if (linkRef && linkRef.href.includes('#_ftn')) {
                const match = linkRef.getAttribute('href').match(/#_ftn(\d+)/);
                if (match) originalNum = match[1];
            } else {
                const refText = refElement.textContent.trim().replace(/\[|\]/g, '');
                const footnoteListItems = doc.querySelectorAll('p[style*="mso-element: footnote"], div[style*="mso-element: footnote"]');
                for (const item of footnoteListItems) {
                    const itemRefSpan = item.querySelector('span.MsoFootnoteReference');
                    if (itemRefSpan && itemRefSpan.textContent.trim().replace(/\[|\]/g, '') === refText) {
                        const anchor = item.querySelector('a[name^="_ftn"]');
                        if (anchor) {
                            const match = anchor.getAttribute('name').match(/_ftn(\d+)/);
                            if (match) originalNum = match[1];
                            break;
                        }
                    }
                }
            }
            if (!originalNum) return;
            const containingTable = refElement.closest('table');
            let baseId;
            if (containingTable) {
                if (!tableElementToIdMap.has(containingTable)) {
                    tableCounter++;
                    tableElementToIdMap.set(containingTable, `tbl${tableCounter}`);
                }
                const tableId = tableElementToIdMap.get(containingTable);
                baseId = `${tableId}fn${originalNum}`;
            } else {
                baseId = `fn${originalNum}`;
            }
            occurrenceMap.set(baseId, (occurrenceMap.get(baseId) || 0) + 1);
            if (!refInfoMap.has(baseId)) {
                refInfoMap.set(baseId, {
                    elements: [],
                    originalNum: originalNum,
                    isTable: !!containingTable,
                    tableElement: containingTable
                });
            }
            refInfoMap.get(baseId).elements.push(refElement);
        });

        for (const [baseId, refInfo] of refInfoMap.entries()) {
            const {
                elements,
                originalNum,
                isTable,
                tableElement
            } = refInfo;
            const totalOccurrences = occurrenceMap.get(baseId);
            elements.forEach((refElement, index) => {
                let elementToReplace = refElement.closest('sup') || refElement;
                const linkText = `[${refElement.textContent.trim().replace(/\[|\]/g, '')}]`;
                const newSup = doc.createElement('sup');
                newSup.id = totalOccurrences > 1 ? `${baseId}-rf${index + 1}` : `${baseId}-rf`;
                const newLink = doc.createElement('a');
                newLink.href = `#${baseId}`;
                newLink.textContent = linkText;
                newSup.appendChild(newLink);
                if (elementToReplace.parentNode) {
                    elementToReplace.parentNode.replaceChild(newSup, elementToReplace);
                }
            });
            const definitionAnchor = doc.querySelector(`a[name="_ftn${originalNum}"]`);
            if (definitionAnchor) {
                const definitionContainer = definitionAnchor.closest('div[style*="mso-element: footnote"], p[style*="mso-element: footnote"]');
                if (definitionContainer) {
                    const firstRefSupId = totalOccurrences > 1 ? `${baseId}-rf1` : `${baseId}-rf`;
                    const originalRefNumber = (definitionContainer.querySelector('span.MsoFootnoteReference, a[href*="_ftnref"]') || {
                        textContent: `[${originalNum}]`
                    }).textContent;
                    const oldRef = definitionContainer.querySelector('span.MsoFootnoteReference, a[href*="_ftnref"]');
                    if (oldRef) oldRef.remove();

                    const finalDiv = doc.createElement('div');
                    finalDiv.id = baseId;
                    const finalP = doc.createElement('p');
                    const returnLink = doc.createElement('a');
                    returnLink.href = `#${firstRefSupId}`;
                    returnLink.textContent = originalRefNumber.trim();

                    let footnoteContentHtml;
                    const innerP = definitionContainer.querySelector('p');
                    if (definitionContainer.tagName.toLowerCase() !== 'p' && innerP) {
                        footnoteContentHtml = innerP.innerHTML;
                    } else {
                        footnoteContentHtml = definitionContainer.innerHTML;
                    }

                    finalP.innerHTML = returnLink.outerHTML + footnoteContentHtml.trim();
                    finalDiv.appendChild(finalP);

                    definitionContainer.remove();
                    definitionAnchor.remove();

                    if (isTable && tableElement) {
                        const firstRow = tableElement.querySelector('tr');
                        const colCount = firstRow ? firstRow.cells.length : 1;
                        const newRow = doc.createElement('tr');
                        const newCell = doc.createElement('td');
                        newCell.setAttribute('colspan', colCount);
                        newCell.appendChild(finalDiv);
                        newRow.appendChild(newCell);
                        let tfoot = tableElement.querySelector('tfoot');
                        if (!tfoot) {
                            tfoot = doc.createElement('tfoot');
                            tableElement.appendChild(tfoot);
                        }
                        tfoot.appendChild(newRow);
                    } else {
                        processedFootnoteDefinitions.push(finalDiv);
                    }
                }
            }
        }

        const footnoteListContainer = body.querySelector('div[style*="mso-element: footnote-list"]');
        if (footnoteListContainer) {
            const aside = doc.createElement('aside');
            processedFootnoteDefinitions.forEach(note => {
                aside.appendChild(note);
            });
            footnoteListContainer.parentNode.replaceChild(aside, footnoteListContainer);
        }

        const allElements = Array.from(body.querySelectorAll('*'));
        for (const element of allElements) {
            element.removeAttribute('style');
            if (element.hasAttribute('class')) {
                const allowedClasses = element.getAttribute('class')
                    .trim()
                    .split(/\s+/)
                    .filter(cls => isClassAllowed(cls, APP_CONFIG.allowedClassesConfig));

                if (allowedClasses.length > 0) {
                    element.setAttribute('class', allowedClasses.join(' '));
                } else {
                    element.removeAttribute('class');
                }
            }
            for (const attr of [...element.attributes]) {
                if (attr.name.startsWith('mso-') || attr.name.startsWith('xmlns') || attr.name === 'align' || attr.name === 'lang' || attr.name === 'title') {
                    element.removeAttribute(attr.name);
                }
            }
        }

        body.querySelectorAll('p').forEach(p => {
            if (p.textContent.trim().replace(/\s|&nbsp;/g, '') === '' && !p.querySelector('img, br')) {
                p.remove();
            }
        });

        body.normalize();

        return body.innerHTML;
    }

    function applyCleanFormattingTags(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        const uElements = Array.from(doc.querySelectorAll('u'));
        for (let i = uElements.length - 1; i >= 0; i--) {
            const u = uElements[i];
            if (u.parentNode) {
                while (u.firstChild) {
                    u.parentNode.insertBefore(u.firstChild, u);
                }
                u.parentNode.removeChild(u);
            }
        }

        const bElements = Array.from(doc.querySelectorAll('b'));
        for (let i = bElements.length - 1; i >= 0; i--) {
            const b = bElements[i];
            if (b.parentNode) {
                const strong = doc.createElement('strong');
                while (b.firstChild) {
                    strong.appendChild(b.firstChild);
                }
                b.parentNode.replaceChild(strong, b);
            }
        }

        const iElements = Array.from(doc.querySelectorAll('i'));
        for (let i = iElements.length - 1; i >= 0; i--) {
            const i_tag = iElements[i];
            if (i_tag.parentNode) {
                const em = doc.createElement('em');
                while (i_tag.firstChild) {
                    em.appendChild(i_tag.firstChild);
                }
                i_tag.parentNode.replaceChild(em, i_tag);
            }
        }

        return doc.body.innerHTML;
    }

    function removeLayoutTables(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');

        const layoutTables = Array.from(doc.querySelectorAll('table:not([class]):not([id])'));

        layoutTables.forEach(table => {
            const parent = table.parentNode;
            if (!parent) return;

            const fragment = doc.createDocumentFragment();
            const cells = table.querySelectorAll('td, th');

            cells.forEach((cell, index) => {
                while (cell.firstChild) {
                    fragment.appendChild(cell.firstChild);
                }

                if (index < cells.length - 1) {
                    fragment.appendChild(doc.createTextNode(' '));
                }
            });

            parent.replaceChild(fragment, table);
        });

        return doc.body.innerHTML;
    }

    function showRemoveTablesModal(triggeringButton, originalButtonText) {
        const modalContentHtml = `
            <p class="text-white">This tool is meant for imported tables used for layout purposes.</p><p class="text-white">However, this will unwrap <strong>ALL</strong> table tags (table, thead, tbody, tr, td, etc.) that <strong>do not</strong> contain an already existing <strong>class</strong> or <strong>ID</strong> attribute. All content will be preserved. To preserve any legitimate tables, add an ID or class to &lt;table&gt; before use.</p>
            <p class="mt-4 text-red-400 font-bold">Are you sure?</p>
        `;

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
            <div class="modal-content">
                <h3><i class="fa-solid fa-triangle-exclamation text-red-500"></i> Confirm Removal</h3>
                <div id="modalBody">${modalContentHtml}</div>
                <div class="flex justify-end mt-4 space-x-2">
                    <button id="modalCancelBtn" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                    <button id="modalConfirmBtn" class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Confirm & Remove</button>
                </div>
            </div>
        `;
        document.body.appendChild(modalOverlay);

        function closeModalAndReEnableButtons() {
            modalOverlay.remove();
            triggeringButton.removeAttribute('data-temp-active');
            triggeringButton.textContent = originalButtonText;
            updateAllInteractiveButtonStates();
        }

        document.getElementById('modalCancelBtn').addEventListener('click', closeModalAndReEnableButtons);

        document.getElementById('modalConfirmBtn').addEventListener('click', () => {
            if (!monacoEditorInstance) return;

            let currentContent = monacoEditorInstance.getValue();
            let cleanedContent = removeLayoutTables(currentContent);

            monacoEditorInstance.setValue(cleanedContent);

            closeModalAndReEnableButtons();

            triggeringButton.textContent = 'Removed!';
            triggeringButton.classList.add('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.remove('bg-slate-600', 'hover:bg-slate-700');
            setTimeout(() => {
                triggeringButton.textContent = originalButtonText;
                triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-700');
            }, 1500);
        });
    }

    function applyAutoLevelHeadings(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const body = doc.body;

        const headings = Array.from(body.querySelectorAll('h1, h2, h3, h4, h5, h6'));

        const specialH1 = headings.find(h =>
            h.tagName.toLowerCase() === 'h1' &&
            (h.getAttribute('property') === 'name' || h.id === 'wb-cont')
        );

        let levelAdjustmentForGlobalShift = 0;
        let firstRelevantHeadingFound = false;

        for (const h of headings) {
            if (h === specialH1) {
                continue;
            }
            if (!firstRelevantHeadingFound) {
                const actualLevel = parseInt(h.tagName.substring(1), 10);
                levelAdjustmentForGlobalShift = 2 - actualLevel;
                firstRelevantHeadingFound = true;
                break;
            }
        }

        let effectivePreviousLevel = 0;

        for (let i = 0; i < headings.length; i++) {
            let currentHeading = headings[i];

            if (currentHeading === specialH1) {
                effectivePreviousLevel = 1;
                continue;
            }

            const currentActualLevel = parseInt(currentHeading.tagName.substring(1), 10);
            let newLevel;

            let globallyAdjustedLevel = currentActualLevel + levelAdjustmentForGlobalShift;
            globallyAdjustedLevel = Math.max(2, globallyAdjustedLevel);


            if (effectivePreviousLevel === 0) {
                newLevel = 2;
            } else {
                newLevel = Math.min(globallyAdjustedLevel, effectivePreviousLevel + 1);
                newLevel = Math.max(2, newLevel);
            }

            if (newLevel !== currentActualLevel) {
                const newHeadingTag = doc.createElement(`h${newLevel}`);
                Array.from(currentHeading.attributes)
                    .forEach(attr => {
                        newHeadingTag.setAttribute(attr.name, attr.value);
                    });
                while (currentHeading.firstChild) {
                    newHeadingTag.appendChild(currentHeading.firstChild);
                }
                if (currentHeading.parentNode) {
                    currentHeading.parentNode.replaceChild(newHeadingTag, currentHeading);
                }
                headings[i] = newHeadingTag;
            }

            effectivePreviousLevel = newLevel;
        }

        return body.innerHTML;
    }

    function applyAutoSectioning(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const originalBody = doc.body;

        const newBody = doc.createElement('body');
        let currentSectionStack = [{
            domElement: newBody,
            level: 0
        }];

        while (originalBody.firstChild) {
            const node = originalBody.firstChild;
            originalBody.removeChild(node);

            if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toLowerCase();
                let nodeLevel = null;
                let shouldCreateNewSectionForNode = true;
                let isProtectedSection = false;

                if (tagName === 'section') {
                    if (node.id.includes('colophon') || node.querySelector('p')
                        ?.textContent?.includes('©') || node.hasAttribute('class') || (node.id && !/^sec\d+(-\d+)*$/.test(node.id))) {
                        isProtectedSection = true;
                        shouldCreateNewSectionForNode = false;
                    } else {
                        const fragment = doc.createDocumentFragment();
                        while (node.firstChild) {
                            fragment.appendChild(node.firstChild);
                        }
                        originalBody.insertBefore(fragment, originalBody.firstChild);
                        continue;
                    }
                }

                const headingLevelMatch = tagName.match(/^h([1-6])$/);
                if (headingLevelMatch) {
                    nodeLevel = parseInt(headingLevelMatch[1], 10);
                } else if (tagName === 'aside') {
                    nodeLevel = 2;
                    shouldCreateNewSectionForNode = false;
                }

                if (isProtectedSection) {
                    let parentToAppendTo = currentSectionStack[currentSectionStack.length - 1].domElement;
                    parentToAppendTo.appendChild(node);
                } else if (nodeLevel !== null) {
                    while (currentSectionStack.length > 1 && nodeLevel <= currentSectionStack[currentSectionStack.length - 1].level) {
                        currentSectionStack.pop();
                    }

                    let currentParentDomElement = currentSectionStack[currentSectionStack.length - 1].domElement;

                    if (shouldCreateNewSectionForNode) {
                        const newSection = doc.createElement('section');
                        currentParentDomElement.appendChild(newSection);
                        currentSectionStack.push({
                            domElement: newSection,
                            level: nodeLevel
                        });
                        currentSectionStack[currentSectionStack.length - 1].domElement.appendChild(node);
                    } else {
                        currentParentDomElement.appendChild(node);
                    }
                } else {
                    currentSectionStack[currentSectionStack.length - 1].domElement.appendChild(node);
                }
            } else {
                currentSectionStack[currentSectionStack.length - 1].domElement.appendChild(node);
            }
        }

        return newBody.innerHTML;
    }

    function applyAutoId(htmlString, options = {}) {
        const defaultOptions = {
            idSections: true,
            idHeadings: true,
            idFigures: true,
            idTables: true,
            idFigureTables: true,
            fixFnIds: false,
            idGenerationMode: 'preserve'
        };
        const currentOptions = {
            ...defaultOptions,
            ...options
        };

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const body = doc.body;

        const idChangeMap = {};

        function toAlpha(num) {
            let s = '';
            while (num > 0) {
                let t = (num - 1) % 26;
                s = String.fromCharCode(65 + t) + s;
                num = Math.floor((num - t) / 26);
            }
            return s || 'A';
        }

        function getLetterFromAppendixText(text) {
            const match = text.match(/^(?:Appendix|Annexe)\s*([A-Z])?/i);
            return (match && match[1]) ? match[1].toUpperCase() : null;
        }

        const existingIds = new Set();
        doc.querySelectorAll('[id]').forEach(el => existingIds.add(el.id));

        if (currentOptions.idHeadings) {
            let h2_num_counter = 0;
            let h2_general_alpha_counter = 0;
            let h2_appendix_alpha_counter = 0;
            let sub_num_counters = new Map();
            let sub_appendix_alpha_counters = new Map();

            const lastSeenHeadingIds = {
                2: '',
                3: '',
                4: '',
                5: '',
                6: ''
            };

            let hasAnyNumberedH2 = Array.from(body.querySelectorAll('h2')).some(h => h.textContent.trim().match(/^\s*(\d+)(?:\.|\s|\)|\-)?/));

            doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                const level = parseInt(heading.tagName.substring(1), 10);
                const text = heading.textContent.trim();
                const oldId = heading.id;
                let newId = oldId;

                if (level === 2) {
                    const lowerCaseText = text.toLowerCase();
                    if (oldId === 'toc' || lowerCaseText === 'on this page' || lowerCaseText === 'sur cette page') {
                        heading.setAttribute('id', 'toc');
                        return;
                    }
                }

                if (currentOptions.idGenerationMode === 'preserve' && oldId) {
                    return;
                }

                const ignoredParents = ['aside', 'caption', 'figure', 'figcaption', 'table'];
                if (heading.closest(ignoredParents.join(','))) {
                    return;
                }

                if (level === 1) return;

                let id_segment = '';
                const isNumericHeading = text.match(/^\s*(\d+)(?:\.|\s|\)|\-)?/);
                const isAppendixHeading = text.match(/^(?:Appendix|Annexe)/i);

                if (level === 2) {
                    if (isAppendixHeading) {
                        const letter = getLetterFromAppendixText(text) || toAlpha(++h2_appendix_alpha_counter);
                        id_segment = `app${letter}`;
                    } else if (hasAnyNumberedH2) {
                        id_segment = isNumericHeading ? `toc${++h2_num_counter}` : `toc${toAlpha(++h2_general_alpha_counter)}`;
                    } else {
                        id_segment = `toc${++h2_num_counter}`;
                    }
                    newId = id_segment;

                } else {
                    const parent_id = lastSeenHeadingIds[level - 1];
                    if (!parent_id) {
                        return;
                    }

                    if (isAppendixHeading) {
                        const currentAppCount = (sub_appendix_alpha_counters.get(parent_id) || 0) + 1;
                        sub_appendix_alpha_counters.set(parent_id, currentAppCount);
                        id_segment = `app${getLetterFromAppendixText(text) || toAlpha(currentAppCount)}`;
                    } else {
                        const currentNumCount = (sub_num_counters.get(parent_id) || 0) + 1;
                        sub_num_counters.set(parent_id, currentNumCount);
                        id_segment = String(currentNumCount);
                    }
                    newId = `${parent_id}-${id_segment}`;
                }

                lastSeenHeadingIds[level] = newId;

                for (let resetLevel = level + 1; resetLevel <= 6; resetLevel++) {
                    lastSeenHeadingIds[resetLevel] = '';
                }

                if (oldId && oldId !== newId) {
                    idChangeMap[oldId] = newId;
                }
                heading.setAttribute('id', newId);
                existingIds.add(newId);
            });
        }

        if (currentOptions.idSections) {
            let sectionChildCounters = {
                'root': 0
            };
            doc.querySelectorAll('section').forEach(section => {
                if (section.closest('table')) {
                    return;
                }

                if (currentOptions.idGenerationMode === 'preserve' && section.id) {
                    return;
                }

                let parentSection = section.parentElement.closest('section');
                let parentId = parentSection && parentSection.id && /^sec\d+(-\d+)*$/.test(parentSection.id) ? parentSection.id : 'root';
                sectionChildCounters[parentId] = (sectionChildCounters[parentId] || 0) + 1;
                const newNum = sectionChildCounters[parentId];
                const newId = (parentId === 'root') ? `sec${newNum}` : `${parentId}-${newNum}`;
                if (section.id && section.id !== newId) idChangeMap[section.id] = newId;
                section.id = newId;
            });
        }

        if (currentOptions.idFigures) {
            let figureCounter = 0;

            const figureSelector = currentOptions.idGenerationMode === 'preserve' ? 'figure:not([id])' : 'figure';
            doc.querySelectorAll(figureSelector).forEach(figure => {
                figure.id = `fig${++figureCounter}`;
            });
        }

        if (currentOptions.idTables || currentOptions.idFigureTables) {
            let tableCounter = 0;
            let figureTableCounter = 0;

            doc.querySelectorAll('table').forEach(table => {
                const oldTableId = table.id;

                if (currentOptions.idGenerationMode === 'preserve' && oldTableId) {
                    return;
                }

                let newTableId = null;
                const isFigureTable = !!table.closest('figure');

                if ((isFigureTable && currentOptions.idFigureTables) || (!isFigureTable && currentOptions.idTables)) {
                    newTableId = isFigureTable ? `ftbl${++figureTableCounter}` : `tbl${++tableCounter}`;
                }

                if (newTableId) {
                    if (oldTableId && oldTableId !== newTableId) {
                        idChangeMap[oldTableId] = newTableId;
                    }
                    table.id = newTableId;
                    existingIds.add(newTableId);

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
        }

        let finalHtml = doc.body.innerHTML;
        if (currentOptions.fixFnIds) {
            finalHtml = applyFixFnIdsLogic(finalHtml);
            doc.body.innerHTML = finalHtml;
        }

        doc.querySelectorAll('a[href^="#"]').forEach(link => {
            const currentAnchor = link.getAttribute('href').substring(1);
            if (idChangeMap[currentAnchor]) {
                link.setAttribute('href', `#${idChangeMap[currentAnchor]}`);
            }
        });

        return doc.body.innerHTML;
    }

    window.updateEditorStyles = function(enableCustomStyles) {
        if (richTextEditorInstance) {
            const editorDoc = richTextEditorInstance.getDoc();
            const customStyleSheet = editorDoc.getElementById('tinymce-custom-content-css');
            if (customStyleSheet) {
                customStyleSheet.disabled = !enableCustomStyles;
            }
        }
    };
    window.setRichEditorContent = function(content) {
        if (richTextEditorInstance) {
            const bookmark = richTextEditorInstance.selection.getBookmark(2, true);
            const doc = richTextEditorInstance.getDoc();
            const win = richTextEditorInstance.getWin();
            const prevScrollY = (win.pageYOffset !== undefined) 
                ? win.pageYOffset 
                : (doc.documentElement.scrollTop || doc.body.scrollTop || 0);
            richTextEditorInstance.setContent(cleanHtmlForRichTextDisplay(content));
            try {
                richTextEditorInstance.selection.moveToBookmark(bookmark);
            } catch (e) {
                
            }
            setTimeout(function() {
                if (win) win.scrollTo(0, prevScrollY);
                if (doc.documentElement) doc.documentElement.scrollTop = prevScrollY;
                if (doc.body) doc.body.scrollTop = prevScrollY;
                richTextEditorInstance.focus();
            }, 50);

        } else {
            console.warn('Parent: HugeRTE editor not yet initialized. Content will be set once ready.');
        }
    };

    window.getRichEditorContent = function() {
        if (richTextEditorInstance) {
            const content = richTextEditorInstance.getContent();
            return content;
        } else {
            console.warn('Iframe: HugeRTE editor not yet initialized. Cannot get content.');
            return '';
        }
    };

    function generateFullHtml(options, forExport = false) {
        const bodyContent = monacoEditorInstance.getValue();
        let customH1Title = (options.currentLanguage === 'en' ? options.h1TitleEn : options.h1TitleFr)
            .trim();
        if (customH1Title === '') {
            customH1Title = (options.currentLanguage === 'en') ? 'Canada.ca Page Title (EN)' : 'Titre de la page Canada.ca (FR)';
        }
        const pageTitle = customH1Title;

        let dynamicTitleHtml = '';
        if (options.showTitle) {
            if (options.currentFramework === 'wet' || options.currentFramework === 'wet+') {
                dynamicTitleHtml = `<h1 property="name" id="wb-cont">${customH1Title}</h1>`;
            } else if (options.currentFramework === 'gcds') {
                dynamicTitleHtml = `<gcds-heading tag="h1">${customH1Title}</gcds-heading>`;
            }
        }

        const bylineHtml = APP_CONFIG.getBylineHtml(options);

        let h1AndBylineSection = `${dynamicTitleHtml}${bylineHtml}`;
        if ((options.currentFramework === 'gcds') && (dynamicTitleHtml || bylineHtml)) {
            h1AndBylineSection = `<section>${h1AndBylineSection}</section>`;
        }

        let contentToInject = options.useContainerDiv ? `<div class="container">${h1AndBylineSection}${bodyContent}</div>` : `${h1AndBylineSection}${bodyContent}`;

        const parser = new DOMParser();
        const tempDoc = parser.parseFromString(contentToInject, 'text/html');

        function replaceUrlPrefix(url, currentPrefixes, targetPrefixes) {
            for (let i = 0; i < currentPrefixes.length; i++) {
                if (url.startsWith(currentPrefixes[i])) {
                    return targetPrefixes[i] + url.substring(currentPrefixes[i].length);
                }
            }
            return url;
        }

        tempDoc.querySelectorAll('img')
            .forEach(img => {
                let src = img.getAttribute('src');
                if (src && !src.startsWith('http://') && !src.startsWith('https://') && !src.startsWith('//')) {
                    let baseUrl = '';
                    if (options.imageSourceMode === 'preview') baseUrl = 'https://canada-preview.adobecqms.net';
                    else if (options.imageSourceMode === 'live') baseUrl = 'https://www.canada.ca';
                    if (baseUrl) img.setAttribute('src', `${baseUrl}${src.startsWith('/') ? '' : '/'}${src}`);
                }
            });

        tempDoc.querySelectorAll('a').forEach(link => {
            let href = link.getAttribute('href');
            if (href) {
                if (!forExport && !href.startsWith('#')) {
                    link.setAttribute('target', '_blank');
                }

                if (href.startsWith('/') || href.startsWith('http://') || href.startsWith('https://')) {
                    if (options.urlSourceMode === 'local') {
                        href = replaceUrlPrefix(href, APP_CONFIG.previewPrefixes, APP_CONFIG.localPrefixes);
                        href = replaceUrlPrefix(href, APP_CONFIG.livePrefixes, APP_CONFIG.localPrefixes);
                    } else if (options.urlSourceMode === 'preview') {
                        href = replaceUrlPrefix(href, APP_CONFIG.localPrefixes, APP_CONFIG.previewPrefixes);
                        href = replaceUrlPrefix(href, APP_CONFIG.livePrefixes, APP_CONFIG.previewPrefixes);
                    } else if (options.urlSourceMode === 'live') {
                        href = replaceUrlPrefix(href, APP_CONFIG.localPrefixes, APP_CONFIG.livePrefixes);
                        href = replaceUrlPrefix(href, APP_CONFIG.previewPrefixes, APP_CONFIG.livePrefixes);
                    }
                    link.setAttribute('href', href);
                }
            }
        });

        contentToInject = tempDoc.body.innerHTML;

        const bodyClassParts = [];
        if (!forExport && options.showSections) bodyClassParts.push('show-sections-outline');
        if (!forExport && options.showHeadings) bodyClassParts.push('show-headings-outline');
        const bodyClass = bodyClassParts.join(' ');

        let cssLinks = '';
        if (options.enableCss) {
            if (options.currentFramework === 'wet') cssLinks = `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"><link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/css/theme.min.css">`;
            else if (options.currentFramework === 'gcds') cssLinks = `<link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-utility@latest/dist/gcds-utility.min.css"><link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@latest/dist/gcds/gcds.css">`;
            else if (options.currentFramework === 'wet+') cssLinks = `<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.15.4/css/all.css"><link rel="stylesheet" href="https://www.canada.ca/etc/designs/canada/wet-boew/css/theme.min.css"><link rel="stylesheet" href="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@latest/dist/gcds/gcds.css">`;
        }

        let jsScripts = '';
        if (options.currentFramework === 'wet') jsScripts = `<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"><\/script><script src="https://www.canada.ca/etc/designs/canada/wet-boew/js/wet-boew.min.js"><\/script><script src="https://www.canada.ca/etc/designs/canada/wet-boew/js/theme.min.js"><\/script>`;
        else if (options.currentFramework === 'gcds') jsScripts = `<script type="module" src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@latest/dist/gcds/gcds.esm.js"><\/script><script nomodule src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@latest/dist/gcds/gcds.js"><\/script>`;
        else if (options.currentFramework === 'wet+') jsScripts = `<script type="module" src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@latest/dist/gcds/gcds.esm.js"><\/script><script nomodule src="https://cdn.design-system.alpha.canada.ca/@cdssnc/gcds-components@latest/dist/gcds/gcds.js"><\/script><script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js"><\/script><script src="https://www.canada.ca/etc/designs/canada/wet-boew/js/wet-boew.min.js"><\/script><script src="https://www.canada.ca/etc/designs/canada/wet-boew/js/theme.min.js"><\/script>`;

        let mainContentWrapper = '';
        if (options.currentFramework === 'wet' || options.currentFramework === 'wet+') mainContentWrapper = `<main property="mainContentOfPage" resource="#wb-main" typeof="WebPageElement">${contentToInject}</main>`;
        else if (options.currentFramework === 'gcds') mainContentWrapper = `<gcds-container id="main-content" main-container size="xl" centered tag="main">${contentToInject}</gcds-container>`;

        return `
<!DOCTYPE html>
<html class="no-js" lang="${options.currentLanguage}" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${pageTitle}</title>
    ${cssLinks}
    <style>
        body { text-align: left; font-family: 'Noto Sans', sans-serif; }
        ${!forExport ? `
        .show-sections-outline section { border: 2px dashed #007bff; padding: 10px; margin-bottom: 10px; }
        .show-sections-outline section:hover { background-color: rgba(0, 123, 255, 0.1); }
        .show-headings-outline h1, .show-headings-outline gcds-heading[tag="h1"] { border: 2px solid #FF0000; background-color: rgba(255,0,0,0.1); padding: 5px; }
        .show-headings-outline h2, .show-headings-outline gcds-heading[tag="h2"] { border: 2px solid #FF7F00; background-color: rgba(255,127,0,0.1); padding: 5px; }
        .show-headings-outline h3, .show-headings-outline gcds-heading[tag="h3"] { border: 2px solid #FFFF00; background-color: rgba(255,255,0,0.1); padding: 5px; }
        .show-headings-outline h4, .show-headings-outline gcds-heading[tag="h4"] { border: 2px solid #00FF00; background-color: rgba(0,255,0,0.1); padding: 5px; }
        .show-headings-outline h5, .show-headings-outline gcds-heading[tag="h5"] { border: 2px solid #0000FF; background-color: rgba(0,0,255,0.1); padding: 5px; }
        .show-headings-outline h6, .show-headings-outline gcds-heading[tag="h6"] { border: 2px solid #4B0082; background-color: rgba(75,0,130,0.1); padding: 5px; }
        ` : ''}
        .table tbody tr.active { background-color: #e0f2f7; }
        .nowrap { white-space: nowrap; }

        ${customPreviewCss}
    </style>
</head>
<body class="${bodyClass}">
    ${mainContentWrapper}
    ${jsScripts}
</body>
</html>`;
    }


    function updateModalPreview() {
        const previewOptions = {
            showSections: modalShowSections,
            showHeadings: modalShowHeadings,
            useContainerDiv: modalUseContainerDiv,
            showTitle: modalShowTitle,
            imageSourceMode: modalImageSourceMode,
            bylineMode: modalBylineMode,
            enableCss: modalEnableCss,
            urlSourceMode: modalUrlSourceMode,
            currentLanguage: modalCurrentLanguage,
            currentFramework: modalCurrentFramework,
            h1TitleEn: modalH1TitleEn,
            h1TitleFr: modalH1TitleFr
        };
        const fullHtml = generateFullHtml(previewOptions);
        const iframeDocument = modalPreviewFrame.contentDocument || modalPreviewFrame.contentWindow.document;
        iframeDocument.open();
        iframeDocument.write(fullHtml);
        iframeDocument.close();

        let iframeWidth = '100%';
        switch (modalCurrentBreakpoint) {
            case 'xs':
                iframeWidth = '375px';
                break;
            case 'sm':
                iframeWidth = '640px';
                break;
            case 'md':
                iframeWidth = '992px';
                break;
            case 'full':
                iframeWidth = '100%';
                break;
        }
        modalPreviewFrame.style.width = iframeWidth;
        modalPreviewFrame.style.margin = (iframeWidth === '100%') ? '0' : '0 auto';
    }

    function showPreviewModal() {
        previewModal.classList.remove('hidden');
        updateModalSettingsButtonStates();
        updateModalBylineButtonStates();
        updateModalImageSourceButtonStates();
        updateModalUrlSourceButtonStates();
        updateModalSectionHeadingButtonStates();
        updateModalWetGcdsButtonState();
        updateModalLanguageButtonStates();
        updateModalBreakpointButtonStates();
        modalH1TitleInputContainer.style.display = modalShowTitle ? 'block' : 'none';
        modalH1TitleInput.value = (modalCurrentLanguage === 'en') ? modalH1TitleEn : modalH1TitleFr;
        updateModalPreview();
    }

    function updateAllInteractiveButtonStates() {
        const anyTempMessageActive = allInteractiveButtons.some(btn => btn.getAttribute('data-temp-active') === 'true');

        allInteractiveButtons.forEach(btn => {
            btn.disabled = btn.getAttribute('data-temp-active') === 'true' || anyTempMessageActive;
        });
    }

    function stripStylesFromTables(htmlString) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        doc.querySelectorAll('table')
            .forEach(table => {
                table.removeAttribute('style');
                table.querySelectorAll('*')
                    .forEach(descendant => {
                        descendant.removeAttribute('style');
                    });
            });
        return doc.body.innerHTML;
    }

    function toggleEditorView() {
        const anyTempMessageActive = allInteractiveButtons.some(btn => btn.getAttribute('data-temp-active') === 'true');
        if (anyTempMessageActive) {
            return;
        }

        if (currentView === 'richtext') {
            if (default_ifr.contentWindow && typeof default_ifr.contentWindow.resetScopeChecker === 'function') {
                default_ifr.contentWindow.resetScopeChecker();
            }

            const CURSOR_MARKER = '|||CURSOR_MARKER|||';
            let markerInserted = false;

            if (richTextEditorInstance) {
                try {
                    richTextEditorInstance.selection.collapse(false);
                    richTextEditorInstance.insertContent(CURSOR_MARKER);
                    markerInserted = true;
                } catch (e) {
                    console.warn(e);
                }
            }

            if (default_ifr.contentWindow && default_ifr.contentWindow.getRichEditorContent) {
                richTextContent = default_ifr.contentWindow.getRichEditorContent();
            } else {
                richTextContent = '';
            }
            richTextContent = stripStylesFromTables(richTextContent);

            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(richTextContent, 'text/html');

                doc.querySelectorAll('details').forEach(detail => {
                    const wasOriginallyOpen = detail.hasAttribute('data-was-open');
                    detail.removeAttribute('data-was-open');
                    if (wasOriginallyOpen) {
                        detail.setAttribute('open', 'open');
                    } else {
                        detail.removeAttribute('open');
                    }
                });

                doc.querySelectorAll('a[href]').forEach(a => {
                    let href = a.getAttribute('href');
                    const originalHref = href;
                    if (href.startsWith('https://can01.safelinks.protection.outlook.com')) {
                        try {
                            const urlObj = new URL(href);
                            const actualUrlParam = urlObj.searchParams.get('url');
                            if (actualUrlParam) href = decodeURIComponent(actualUrlParam);
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    if (href.includes('/content/canadasite') || href.includes('/content/dam')) {
                        const contentPath = href.includes('/content/canadasite') ? '/content/canadasite' : '/content/dam';
                        const contentIndex = href.indexOf(contentPath);
                        if (contentIndex > 0) href = href.substring(contentIndex);
                    }
                    if (href !== originalHref) a.setAttribute('href', href);
                });

                doc.querySelectorAll('img[src]').forEach(img => {
                    let src = img.getAttribute('src');
                    if (src.includes('/content/dam')) {
                        const contentIndex = src.indexOf('/content/dam');
                        if (contentIndex > 0) {
                            src = src.substring(contentIndex);
                            img.setAttribute('src', src);
                        }
                    }
                });

                richTextContent = doc.body.innerHTML;

            } catch (e) {
                console.error(e);
            }

            richTextContent = restoreGcdsTags(richTextContent);
            richTextContent = restoreDataAttributes(richTextContent);

            let processedContent = richTextContent;

            if (toggleAutoCleanMsoOnSwitchRichText.checked) {
                processedContent = applyCleanLists(processedContent);
                processedContent = applyCleanTablesBasic(processedContent);
                processedContent = unwrapSingleCellTables(processedContent);
                processedContent = applyCleanMsoCode(processedContent);
                processedContent = applyAutoSpacing(processedContent);
            }

            processedContent = unwrapStrongInHeadings(processedContent);

            htmlOutputContent = processedContent;
            if (monacoEditorInstance) {
                monacoEditorInstance.setValue(htmlOutputContent);
                monacoEditorInstance.focus();
                applyEntityHighlighting();
            }

            autoFormatBtn.click();

            if (monacoEditorInstance && markerInserted) {
                setTimeout(() => {
                    const model = monacoEditorInstance.getModel();
                    const matches = model.findMatches(CURSOR_MARKER, false, false, false, null, true);

                    if (matches && matches.length > 0) {
                        const match = matches[0];
                        const position = match.range.getStartPosition();
                        const lineNumber = position.lineNumber;

                        monacoEditorInstance.executeEdits('cursor-tracker', [{
                            range: match.range,
                            text: ''
                        }]);

                        const lineContent = model.getLineContent(lineNumber).trim();
                        if (lineContent === '<p></p>' || lineContent === '<p>  </p>') {
                            const range = new monaco.Range(lineNumber, 1, lineNumber + 1, 1);
                            monacoEditorInstance.executeEdits('cursor-tracker-cleanup', [{
                                range: range,
                                text: ''
                            }]);
                        }

                        monacoEditorInstance.setPosition(position);
                        monacoEditorInstance.revealPositionInCenter(position);
                    }
                }, 50);
            }

            richtextOutputPanel.classList.remove('panel-visible');
            richtextOutputPanel.classList.add('panel-hidden');
            mainEditorArea.classList.remove('panel-hidden');
            mainEditorArea.classList.add('panel-visible');

            toggleEditorViewBtnRichText.classList.remove('bg-green-600', 'hover:bg-green-700', 'bg-cyan-700', 'hover:bg-cyan-800');
            toggleEditorViewBtnRichText.classList.add('bg-slate-800', 'hover:bg-slate-700');
            toggleEditorViewBtnCode.classList.remove('bg-green-600', 'hover:bg-green-700', 'bg-slate-800', 'hover:bg-slate-700');
            toggleEditorViewBtnCode.classList.add('bg-cyan-700', 'hover:bg-cyan-800');

            currentView = 'code';
            [contentModeBtn, tableModeBtn].forEach(btn => {
                btn.disabled = false;
                btn.classList.remove('opacity-50', 'cursor-not-allowed');
            });
            updateCleanMsoButtonState();
        } else {
            
            if (monacoEditorInstance) {
                const model = monacoEditorInstance.getModel();
                const position = monacoEditorInstance.getPosition();
                const rawContent = model.getValue();
                let offset = model.getOffsetAt(position); 

                // --- 1. Tag Escape Logic (Refined) ---
                // If cursor is inside a tag definition (e.g. <div cl|ass="..."> or )
                let textBeforeCursor = rawContent.substring(0, offset);
                let lastOpen = textBeforeCursor.lastIndexOf('<');
                let lastClose = textBeforeCursor.lastIndexOf('>');

                if (lastOpen > lastClose) {
                    // We are inside a tag structure
                    const isClosingTag = rawContent[lastOpen + 1] === '/';
                    
                    if (isClosingTag) {
                        // If inside a closing tag (</p|>) -> Rewind to BEFORE the tag starts (|<)
                        offset = lastOpen;
                    } else {
                        // If inside an opening tag OR comment (<p cl|ass> or ) 
                        // -> Fast-forward to AFTER the tag/comment (>)
                        const remainingText = rawContent.substring(offset);
                        const nextClose = remainingText.indexOf('>');
                        if (nextClose !== -1) {
                            offset = offset + nextClose + 1;
                        }
                    }
                    // Update textBefore for the next step
                    textBeforeCursor = rawContent.substring(0, offset);
                }

                // --- 1.5. Closing Tag & Comment Rewind (FIXED) ---
                // If we are sitting immediately after a closing tag OR a comment,
                // we rewind to get back "inside" the content block.
                // New Regex matches: </div> OR at the end of the string
                const rewindRegex = /(?:<\/([a-zA-Z0-9]+)>|)\s*$/;
                
                let match = rewindRegex.exec(textBeforeCursor);
                let rewindLimit = 10; // Allow rewinding through multiple comments/tags
                
                while (match && rewindLimit > 0) {
                    // Move offset back by the length of the matched tag/comment
                    offset -= match[0].length;
                    
                    // Update textBefore for next iteration
                    textBeforeCursor = rawContent.substring(0, offset);
                    match = rewindRegex.exec(textBeforeCursor);
                    rewindLimit--;
                }

                // --- 2. Entity Escape Logic ---
                // If cursor is inside an entity (e.g. &nb|sp;), move to end
                const lastAmpersand = textBeforeCursor.lastIndexOf('&');
                const lastSemicolon = textBeforeCursor.lastIndexOf(';');

                if (lastAmpersand > lastSemicolon) {
                    const remainingText = rawContent.substring(offset);
                    const nextSemicolon = remainingText.indexOf(';');
                    if (nextSemicolon !== -1 && nextSemicolon < 12) { 
                        offset = offset + nextSemicolon + 1;
                        textBeforeCursor = rawContent.substring(0, offset);
                    }
                }

                // --- 3. Structural Context Analysis (Smart Dive) ---
                // Determine if we are in a "Structural" tag (like <ul>) and need to dive into a child
                const structuralTags = new Set(['ul', 'ol', 'dl', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'colgroup']);
                const strictForbiddenTags = new Set(['style', 'script', 'head', 'iframe', 'select', 'textarea', 'option']);
                const voidTags = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
                
                const tagRegex = /<\/?([a-zA-Z0-9]+)[^>]*>/g;
                let tagMatch;
                const stack = [];
                
                while ((tagMatch = tagRegex.exec(textBeforeCursor)) !== null) {
                    const tagName = tagMatch[1].toLowerCase();
                    const isClosing = tagMatch[0].startsWith('</');
                    const isSelfClosing = tagMatch[0].endsWith('/>') || voidTags.has(tagName);
                    
                    if (isClosing) {
                        const idx = stack.lastIndexOf(tagName);
                        if (idx !== -1) stack.length = idx;
                    } else if (!isSelfClosing) {
                        stack.push(tagName);
                    }
                }

                let currentParent = stack.length > 0 ? stack[stack.length - 1] : null;
                let shouldTrack = true;

                if (currentParent && strictForbiddenTags.has(currentParent)) {
                    shouldTrack = false;
                }
                else if (currentParent && structuralTags.has(currentParent)) {
                    // Dive logic: If we are in <ul>|, try to find next <li>
                    const remainingText = rawContent.substring(offset);
                    const nextTagMatch = /<([a-zA-Z0-9]+)[^>]*>/g.exec(remainingText);
                    
                    if (nextTagMatch) {
                        const nextTagName = nextTagMatch[1].toLowerCase();
                        if (!structuralTags.has(nextTagName) && !strictForbiddenTags.has(nextTagName)) {
                            offset = offset + nextTagMatch.index + nextTagMatch[0].length;
                        } else {
                             shouldTrack = false;
                        }
                    } else {
                        shouldTrack = false;
                    }
                }

                // --- 4. Inject Marker ---
                if (shouldTrack) {
                    const MARKER_HTML = '<span id="rte-cursor-marker">&#xFEFF;</span>';
                    htmlOutputContent = rawContent.slice(0, offset) + MARKER_HTML + rawContent.slice(offset);
                } else {
                    htmlOutputContent = rawContent;
                }

            } else {
                htmlOutputContent = '';
            }

            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlOutputContent, 'text/html');
            
            // ... (Rest of existing logic for details, GCDs, cleanup, etc. remains unchanged) ...
            
            doc.querySelectorAll('details').forEach(detail => {
                if (detail.hasAttribute('open')) {
                    detail.setAttribute('data-was-open', 'true');
                }
            });
            htmlOutputContent = doc.body.innerHTML;

            let contentToSendToRichText = protectDataAttributes(htmlOutputContent);
            contentToSendToRichText = protectGcdsTags(contentToSendToRichText);

            richTextContent = contentToSendToRichText;
            
            if (default_ifr.contentWindow && default_ifr.contentWindow.setRichEditorContent) {
                default_ifr.contentWindow.setRichEditorContent(cleanHtmlForRichTextDisplay(richTextContent));
            }

            mainEditorArea.classList.remove('panel-visible');
            mainEditorArea.classList.add('panel-hidden');
            richtextOutputPanel.classList.remove('panel-hidden');
            richtextOutputPanel.classList.add('panel-visible');

            toggleEditorViewBtnCode.classList.remove('bg-green-600', 'hover:bg-green-700', 'bg-slate-800', 'hover:bg-slate-700');
            toggleEditorViewBtnCode.classList.add('bg-cyan-700', 'hover:bg-cyan-800');
            updateGoToHtmlButtonColor();

            currentView = 'richtext';
            
            hasUserInteractedWithRTE = false;

            [contentModeBtn, tableModeBtn].forEach(btn => {
                btn.disabled = true;
                btn.classList.add('opacity-50', 'cursor-not-allowed');
            });
            updateCleanMsoButtonState();
        }
    }

    let entityDecorations = [];

    function applyEntityHighlighting() {
        if (!monacoEditorInstance) return;

        const model = monacoEditorInstance.getModel();
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

        entityDecorations = monacoEditorInstance.deltaDecorations(entityDecorations, newDecorations);
    }

    function updateGoToHtmlButtonColor() {
        if (toggleAutoCleanMsoOnSwitchRichText.checked) {
            toggleEditorViewBtnRichText.classList.remove('bg-cyan-700', 'hover:bg-cyan-800', 'bg-slate-800', 'hover:bg-slate-700');
            toggleEditorViewBtnRichText.classList.add('bg-green-600', 'hover:bg-green-700');
        } else {
            toggleEditorViewBtnRichText.classList.remove('bg-green-600', 'hover:bg-green-700', 'bg-slate-800', 'hover:bg-slate-700');
            toggleEditorViewBtnRichText.classList.add('bg-cyan-700', 'hover:bg-cyan-800');
        }
    }

    function updateCleanMsoButtonState() {
        const isAutoCleanEnabled = toggleAutoCleanMsoOnSwitchRichText.checked;
        if (isAutoCleanEnabled) {
            cleanMsoBtn.disabled = true;
            cleanMsoBtn.classList.remove('bg-blue-700', 'hover:bg-blue-800');
            cleanMsoBtn.classList.add('bg-gray-400', 'cursor-not-allowed', 'opacity-60');
        } else {
            cleanMsoBtn.disabled = false;
            cleanMsoBtn.classList.remove('bg-gray-400', 'cursor-not-allowed', 'opacity-60');
            cleanMsoBtn.classList.add('bg-blue-700', 'hover:bg-blue-800');
        }
    }

    function syncMsoTogglesOnLoad() {
        const isChecked = toggleAutoCleanMsoOnSwitchRichText.checked;

        toggleAutoCleanMsoOnSwitchCode.checked = isChecked;

        toggleAutoCleanMsoOnSwitchRichText.closest('.toggle-switch').classList.toggle('is-checked', isChecked);
        toggleAutoCleanMsoOnSwitchCode.closest('.toggle-switch').classList.toggle('is-checked', isChecked);

        updateGoToHtmlButtonColor();
        updateCleanMsoButtonState();
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), delay);
        };
    }

    const debouncedMonacoLayout = debounce(() => {
        if (monacoEditorInstance) {
            monacoEditorInstance.layout();
        }
    }, 200);
    const toggleRichTextStyles = document.getElementById('toggleRichTextStyles');
    toggleRichTextStyles.addEventListener('change', (event) => {
        const isEnabled = event.target.checked;
        event.target.closest('.toggle-switch')
            .classList.toggle('is-checked', isEnabled);

        if (default_ifr.contentWindow && typeof default_ifr.contentWindow.updateEditorStyles === 'function') {
            default_ifr.contentWindow.updateEditorStyles(isEnabled);
        }
    });

    function showModal(title, contentHtml, triggeringButton, originalButtonText) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
                <div class="modal-content">
                    <h3>${title}</h3>
                    <div id="modalBody">${contentHtml}</div>
                    <div class="flex justify-end mt-4 space-x-2">
                        <button id="modalCancelBtn" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                        <button id="modalInsertBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Insert</button>
                    </div>
                </div>
            `;
        document.body.appendChild(modalOverlay);

        function closeModalAndReEnableButtons() {
            modalOverlay.remove();
            triggeringButton.removeAttribute('data-temp-active');
            triggeringButton.textContent = originalButtonText;
            triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            updateAllInteractiveButtonStates();
        }


        document.getElementById('modalCancelBtn')
            .addEventListener('click', closeModalAndReEnableButtons);

        const langEnglishBtn = document.getElementById('langEnglishBtn');
        const langFrenchBtn = document.getElementById('langFrenchBtn');
        const monarchKingBtn = document.getElementById('monarchKingBtn');
        const monarchQueenBtn = document.getElementById('monarchQueenBtn');
        const idISBNBtn = document.getElementById('idISBNBtn');
        const idISSNBtn = document.getElementById('idISSNBtn');
        const colophonYearInput = document.getElementById('colophonYear');
        const colophonNumberInput = document.getElementById('colophonNumber');
        const modalInsertBtn = document.getElementById('modalInsertBtn');

        let selectedLanguage = 'English';
        let selectedMonarch = 'King';
        let selectedIdentifier = 'ISBN';

        function updateButtonActiveState(buttons, activeBtn) {
            buttons.forEach(btn => {
                btn.classList.remove('active', 'bg-indigo-600');
                btn.classList.add('bg-gray-600', 'hover:bg-gray-500');
            });
            activeBtn.classList.add('active', 'bg-indigo-600');
            activeBtn.classList.remove('bg-gray-600', 'hover:bg-gray-500');
        }

        updateButtonActiveState([langEnglishBtn, langFrenchBtn], langEnglishBtn);
        updateButtonActiveState([monarchKingBtn, monarchQueenBtn], monarchKingBtn);
        updateButtonActiveState([idISBNBtn, idISSNBtn], idISBNBtn);

        langEnglishBtn.addEventListener('click', () => {
            selectedLanguage = 'English';
            updateButtonActiveState([langEnglishBtn, langFrenchBtn], langEnglishBtn);
        });

        langFrenchBtn.addEventListener('click', () => {
            selectedLanguage = 'French';
            updateButtonActiveState([langEnglishBtn, langFrenchBtn], langFrenchBtn);
        });

        monarchKingBtn.addEventListener('click', () => {
            selectedMonarch = 'King';
            updateButtonActiveState([monarchKingBtn, monarchQueenBtn], monarchKingBtn);
        });

        monarchQueenBtn.addEventListener('click', () => {
            selectedMonarch = 'Queen';
            updateButtonActiveState([monarchKingBtn, monarchQueenBtn], monarchQueenBtn);
        });

        idISBNBtn.addEventListener('click', () => {
            selectedIdentifier = 'ISBN';
            updateButtonActiveState([idISBNBtn, idISSNBtn], idISBNBtn);
        });

        idISSNBtn.addEventListener('click', () => {
            selectedIdentifier = 'ISSN';
            updateButtonActiveState([idISBNBtn, idISSNBtn], idISSNBtn);
        });

        colophonYearInput.addEventListener('input', (event) => {
            const input = event.target;
            input.value = input.value.replace(/\D/g, '');
            if (input.value.length > 4) {
                input.value = input.value.substring(0, 4);
            }
        });


        modalInsertBtn.addEventListener('click', () => {
            const currentYear = new Date()
                .getFullYear();
            const year = colophonYearInput.value || currentYear;
            const number = colophonNumberInput.value || '###';
            const colophonHtmlContent = APP_CONFIG.getColophonHtml({
                language: selectedLanguage,
                monarch: selectedMonarch,
                year: year,
                identifier: selectedIdentifier,
                number: number
            });

            if (monacoEditorInstance) {
                let currentContent = monacoEditorInstance.getValue();
                currentContent = protectDataAttributes(currentContent);

                currentContent += colophonHtmlContent;

                currentContent = restoreDataAttributes(currentContent);
                currentContent = convertAllEntitiesToNumeric(currentContent);

                monacoEditorInstance.setValue(currentContent);
                htmlOutputContent = currentContent;
                applyEntityHighlighting();
            }

            closeModalAndReEnableButtons();

            const capturedOriginalText = originalButtonText;

            triggeringButton.textContent = 'Inserted!';
            triggeringButton.classList.add('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.remove('bg-slate-600', 'hover:bg-slate-500');
            setTimeout(() => {
                triggeringButton.textContent = capturedOriginalText;
                triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            }, 1500);
        });
    }

    function showFigureModal(triggeringButton, originalButtonText) {
        const figureModalContentHtml = `
        <div class="flex flex-col space-y-4">
            <div>
                <span class="text-sm font-medium text-gray-200 mr-2">Language:</span>
                <div class="button-group inline-flex">
                    <button id="figLangEnglishBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">English</button>
                    <button id="figLangFrenchBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">French</button>
                </div>
            </div>
            <div>
                <label for="figTitleInput" class="block text-sm font-medium text-gray-200">Title (figcaption):</label>
                <input type="text" id="figTitleInput" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Figure 1: Annual Growth Rate">
            </div>
            <div>
                <label for="figNumInput" class="block text-sm font-medium text-gray-200">Figure # (summary):</label>
                <input type="text" id="figNumInput" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Figure 1">
            </div>
            <div>
                <label for="figSrcInput" class="block text-sm font-medium text-gray-200">AEM image source:</label>
                <input type="text" id="figSrcInput" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., /content/dam/figure1.png">
            </div>
            <div>
                <label for="figAltInput" class="block text-sm font-medium text-gray-200">Image alt text:</label>
                <input type="text" id="figAltInput" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Bar chart showing annual growth...">
            </div>
            <p>NOTE: Placeholder text description will be inserted. Manually place content in the editor.</p>
        </div>
    `;

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
        <div class="modal-content">
            <h3>Insert Figure (w/ desc)</h3>
            <div id="modalBody">${figureModalContentHtml}</div>
            <div class="flex justify-end mt-4 space-x-2">
                <button id="modalCancelFigBtn" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                <button id="modalInsertFigBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Insert</button>
            </div>
        </div>
    `;
        document.body.appendChild(modalOverlay);

        function closeModalAndReEnableButtons() {
            modalOverlay.remove();
            triggeringButton.removeAttribute('data-temp-active');
            triggeringButton.textContent = originalButtonText;
            triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            updateAllInteractiveButtonStates();
        }

        document.getElementById('modalCancelFigBtn')
            .addEventListener('click', closeModalAndReEnableButtons);

        const figLangEnglishBtn = document.getElementById('figLangEnglishBtn');
        const figLangFrenchBtn = document.getElementById('figLangFrenchBtn');
        const modalInsertFigBtn = document.getElementById('modalInsertFigBtn');

        let selectedLanguage = 'English';

        function updateButtonActiveState(buttons, activeBtn) {
            buttons.forEach(btn => btn.classList.remove('active', 'bg-indigo-600'));
            activeBtn.classList.add('active', 'bg-indigo-600');
        }

        updateButtonActiveState([figLangEnglishBtn, figLangFrenchBtn], figLangEnglishBtn);

        figLangEnglishBtn.addEventListener('click', () => {
            selectedLanguage = 'English';
            updateButtonActiveState([figLangEnglishBtn, figLangFrenchBtn], figLangEnglishBtn);
        });

        figLangFrenchBtn.addEventListener('click', () => {
            selectedLanguage = 'French';
            updateButtonActiveState([figLangEnglishBtn, figLangFrenchBtn], figLangFrenchBtn);
        });

        modalInsertFigBtn.addEventListener('click', () => {
            const title = document.getElementById('figTitleInput')
                .value.trim() || '<mark>[Figure title]</mark>';
            const figNum = document.getElementById('figNumInput')
                .value.trim() || '<mark>[Figure #]</mark>';
            const imgSrc = document.getElementById('figSrcInput')
                .value.trim() || '/content/dam/...';
            const altText = document.getElementById('figAltInput')
                .value.trim() || '[alt text]';

            const altSuffix = selectedLanguage === 'English' ? 'Text version below:' : 'Version textuelle en bas :';
            const summaryText = selectedLanguage === 'English' ? 'Text version' : 'Version textuelle';

            const figureHtml = `<figure>
    <figcaption><strong>${title}</strong></figcaption>
    <img class="img-responsive center-block" src="${imgSrc}" alt="${altText}. ${altSuffix}">
    <details>
        <summary data-toggle="{&quot;print&quot;:&quot;on&quot;}">${figNum} - ${summaryText}</summary>
        <p><mark>[Insert text description]</mark></p>
    </details>
</figure>`;

            if (monacoEditorInstance) {
                monacoEditorInstance.trigger('keyboard', 'type', {
                    text: figureHtml
                });

                setTimeout(() => {
                    autoFormatBtn.click();
                }, 100);
            }

            closeModalAndReEnableButtons();

            triggeringButton.textContent = 'Inserted!';
            triggeringButton.classList.add('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.remove('bg-slate-600', 'hover:bg-slate-500');
            setTimeout(() => {
                triggeringButton.textContent = originalButtonText;
                triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            }, 1500);
        });
    }

    figDescBtn.addEventListener('click', () => {
        const originalText = figDescBtn.textContent;
        figDescBtn.textContent = 'Opening...';
        figDescBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        figDescBtn.classList.remove('bg-slate-600', 'hover:bg-slate-500');
        figDescBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();
        showFigureModal(figDescBtn, originalText);
    });


    footnoteAncBtn.addEventListener('click', () => {
        const originalText = footnoteAncBtn.textContent;
        footnoteAncBtn.textContent = 'Opening...';
        footnoteAncBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        footnoteAncBtn.classList.remove('bg-slate-600', 'hover:bg-slate-500');
        footnoteAncBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();
        showFootnoteAnchorModal(footnoteAncBtn, originalText);
    });

    function showFootnoteAnchorModal(triggeringButton, originalButtonText) {
        const modalContentHtml = `
        <div class="flex flex-col space-y-4">
            <div>
                <span class="text-sm font-medium text-gray-200 mr-2">Language:</span>
                <div class="button-group inline-flex">
                    <button id="fnAncLangEnglishBtn" class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">English</button>
                    <button id="fnAncLangFrenchBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">French</button>
                </div>
            </div>
        </div>
    `;

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
        <div class="modal-content">
            <h3>Process All Footnotes</h3>
            <div id="modalBody">${modalContentHtml}</div>
            <div class="flex justify-end mt-4 space-x-2">
                <button id="modalCancelFnAncBtn" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                <button id="modalInsertFnAncBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Format Footnotes</button>
            </div>
        </div>
    `;
        document.body.appendChild(modalOverlay);

        function closeModalAndReEnableButtons() {
            modalOverlay.remove();
            triggeringButton.removeAttribute('data-temp-active');
            triggeringButton.textContent = originalButtonText;
            triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            updateAllInteractiveButtonStates();
        }

        document.getElementById('modalCancelFnAncBtn').addEventListener('click', closeModalAndReEnableButtons);

        const langEnglishBtn = document.getElementById('fnAncLangEnglishBtn');
        const langFrenchBtn = document.getElementById('fnAncLangFrenchBtn');
        const modalInsertBtn = document.getElementById('modalInsertFnAncBtn');

        let selectedLanguage = 'English';

        function updateButtonActiveState(buttons, activeBtn) {
            buttons.forEach(btn => {
                btn.classList.remove('active', 'bg-indigo-600');
                btn.classList.add('bg-gray-600', 'hover:bg-gray-500');
            });
            activeBtn.classList.add('active', 'bg-indigo-600');
            activeBtn.classList.remove('bg-gray-600', 'hover:bg-gray-500');
        }

        updateButtonActiveState([langEnglishBtn, langFrenchBtn], langEnglishBtn);

        langEnglishBtn.addEventListener('click', () => {
            selectedLanguage = 'English';
            updateButtonActiveState([langEnglishBtn, langFrenchBtn], langEnglishBtn);
        });

        langFrenchBtn.addEventListener('click', () => {
            selectedLanguage = 'French';
            updateButtonActiveState([langEnglishBtn, langFrenchBtn], langFrenchBtn);
        });

        modalInsertBtn.addEventListener('click', () => {
            if (!monacoEditorInstance) return;

            let editorContent = monacoEditorInstance.getValue();
            const parser = new DOMParser();
            const doc = parser.parseFromString(editorContent, 'text/html');
            const selectedLanguage = document.getElementById('fnAncLangEnglishBtn').classList.contains('active') ? 'English' : 'French';

            const tableFootnoteSymbolMap = new Map();
            const pageFootnoteSymbolMap = new Map();
            const pageIdChangeMap = new Map();

            const pageFootnoteSources = Array.from(doc.querySelectorAll('aside.wb-fnote dd[id*="fn"], aside:not(.wb-fnote) div[id*="fn"]'));

            if (pageFootnoteSources.length > 0) {
                let fnCounter = 0;
                const uniqueFootnotes = new Map();

                pageFootnoteSources.forEach(sourceEl => {
                    const oldId = sourceEl.id;
                    let contentHtml = '',
                        symbol = '';

                    if (sourceEl.tagName.toLowerCase() === 'dd') {
                        const p = sourceEl.querySelector('p:not(.fn-rtn)');
                        contentHtml = p ? p.innerHTML.trim() : '';
                        const dt = sourceEl.previousElementSibling;
                        if (dt && dt.tagName.toLowerCase() === 'dt') {
                            symbol = dt.textContent.replace(/^(Footnote|Note de bas de page)\s*/, '').trim();
                        }
                    } else {
                        const p = sourceEl.querySelector('p');
                        if (p) {
                            const returnLink = p.querySelector('a[href*="-rf"]');
                            if (returnLink) {
                                symbol = returnLink.textContent.trim().replace(/\[|\]/g, '');
                                const tempP = p.cloneNode(true);
                                tempP.querySelector('a[href*="-rf"]').remove();
                                contentHtml = tempP.innerHTML.trim();
                            }
                        }
                    }

                    if (!uniqueFootnotes.has(contentHtml)) {
                        fnCounter++;
                        const isNumericSymbol = /^\d+$/.test(symbol);
                        uniqueFootnotes.set(contentHtml, {
                            newFnNum: fnCounter,
                            displaySymbol: isNumericSymbol ? fnCounter.toString() : symbol,
                            content: contentHtml
                        });
                    }
                    const newFnInfo = uniqueFootnotes.get(contentHtml);
                    pageIdChangeMap.set(oldId, `fn${newFnInfo.newFnNum}`);
                });

                const existingAside = doc.querySelector('aside.wb-fnote, aside:not(.wb-fnote)');
                const newAside = doc.createElement('aside');
                newAside.className = 'wb-fnote';
                newAside.setAttribute('role', 'note');

                const h2 = doc.createElement('h2');
                h2.id = 'fn';
                h2.textContent = selectedLanguage === 'English' ? 'Footnotes' : 'Notes de bas de page';
                newAside.appendChild(h2);

                const dl = doc.createElement('dl');
                const sortedUniqueFootnotes = Array.from(uniqueFootnotes.values()).sort((a, b) => a.newFnNum - b.newFnNum);

                sortedUniqueFootnotes.forEach(fnInfo => {
                    const {
                        newFnNum,
                        displaySymbol,
                        content
                    } = fnInfo;
                    const newBaseId = `fn${newFnNum}`;
                    pageFootnoteSymbolMap.set(newBaseId, displaySymbol);

                    const dt = doc.createElement('dt');
                    dt.textContent = (selectedLanguage === 'English' ? 'Footnote ' : 'Note de bas de page ') + displaySymbol;
                    const dd = doc.createElement('dd');
                    dd.id = newBaseId;
                    dd.innerHTML = `<p>${content}</p>`;
                    const returnP = doc.createElement('p');
                    returnP.className = 'fn-rtn';
                    const newReturnLink = doc.createElement('a');

                    newReturnLink.href = `#${newBaseId}-rf`;

                    newReturnLink.innerHTML = selectedLanguage === 'English' ?
                        `<span class="wb-inv">Return to footnote </span>${displaySymbol}<span class="wb-inv"> referrer</span>` :
                        `<span class="wb-inv">Retour à la note de bas de page </span>${displaySymbol}`;
                    returnP.appendChild(newReturnLink);
                    dd.appendChild(returnP);
                    dl.appendChild(dt);
                    dl.appendChild(dd);
                });

                newAside.appendChild(dl);

                if (existingAside && existingAside.parentNode) {
                    existingAside.parentNode.replaceChild(newAside, existingAside);
                } else {
                    doc.body.appendChild(newAside);
                }
            }

            doc.querySelectorAll('table[id]').forEach(table => {
                const tableId = table.id;
                const tableNum = tableId.replace(/\D/g, '') || '1';
                const isFigureTable = !!table.closest('figure');
                const labelWordEn = isFigureTable ? 'Figure' : 'Table';
                const labelWordFr = isFigureTable ? 'Figure' : 'Tableau';
                const prepositionFr = isFigureTable ? 'de la' : 'du';

                const footnoteSources = Array.from(table.querySelectorAll('tfoot div[id*="fn"], tfoot dd[id*="fn"]'));
                if (footnoteSources.length === 0) return;

                let fnCounter = 0;
                const uniqueFootnotes = new Map();
                const idChangeMap = new Map();

                footnoteSources.forEach(sourceEl => {
                    const oldId = sourceEl.id;
                    let contentHtml = '',
                        symbol = '';

                    if (sourceEl.tagName.toLowerCase() === 'dd') {
                        const p = sourceEl.querySelector('p:not(.fn-rtn)');
                        contentHtml = p ? p.innerHTML.trim() : '';
                        const dt = sourceEl.previousElementSibling;
                        if (dt && dt.tagName.toLowerCase() === 'dt') {
                            const dtText = dt.textContent.trim();
                            const symbolMatch = dtText.match(/(?:Note|Note)\s*(.*)/);
                            symbol = symbolMatch ? symbolMatch[1].replace(/du tableau.*|de la figure.*/, '').trim() : '';
                        }
                    } else {
                        const p = sourceEl.querySelector('p');
                        if (p) {
                            const returnLink = p.querySelector('a[href*="-rf"]');
                            if (returnLink) {
                                symbol = returnLink.textContent.trim().replace(/\[|\]/g, '');
                                const tempP = p.cloneNode(true);
                                tempP.querySelector('a[href*="-rf"]').remove();
                                contentHtml = tempP.innerHTML.trim();
                            }
                        }
                    }

                    if (!uniqueFootnotes.has(contentHtml)) {
                        fnCounter++;
                        const isNumericSymbol = /^\d+$/.test(symbol);
                        uniqueFootnotes.set(contentHtml, {
                            newFnNum: fnCounter,
                            displaySymbol: isNumericSymbol ? fnCounter.toString() : symbol,
                            content: contentHtml
                        });
                    }
                    const newFnInfo = uniqueFootnotes.get(contentHtml);
                    idChangeMap.set(oldId, `${tableId}_fn${newFnInfo.newFnNum}`);
                });

                table.querySelectorAll('thead sup[id*="fn"], tbody sup[id*="fn"]').forEach(sup => {
                    const oldSupId = sup.id;
                    const oldBaseId = oldSupId.replace(/-rf(-\d+)?$/, '');
                    const newBaseId = idChangeMap.get(oldBaseId);
                    if (newBaseId) {
                        const newSupId = oldSupId.replace(oldBaseId, newBaseId);
                        sup.id = newSupId;
                        const anchor = sup.querySelector('a');
                        if (anchor) {
                            anchor.setAttribute('href', `#${newBaseId}`);
                        }
                    }
                });

                let tfoot = table.querySelector('tfoot');
                if (tfoot) tfoot.innerHTML = '';
                else {
                    tfoot = doc.createElement('tfoot');
                    table.appendChild(tfoot);
                }

                const firstRow = table.querySelector('thead tr, tbody tr, tr');
                const colCount = firstRow ? firstRow.cells.length : 1;

                const newSection = doc.createElement('section');
                newSection.className = 'wb-fnote';
                const h2 = doc.createElement('h2');
                h2.id = `${tableId}fn`;
                h2.className = 'wb-inv';
                h2.textContent = selectedLanguage === 'English' ? `${labelWordEn} ${tableNum} Notes` : `Notes ${prepositionFr} ${labelWordFr.toLowerCase()} ${tableNum}`;
                newSection.appendChild(h2);

                const dl = doc.createElement('dl');
                const sortedUniqueFootnotes = Array.from(uniqueFootnotes.values()).sort((a, b) => a.newFnNum - b.newFnNum);

                sortedUniqueFootnotes.forEach(fnInfo => {
                    const {
                        newFnNum,
                        displaySymbol,
                        content
                    } = fnInfo;
                    const newBaseId = `${tableId}_fn${newFnNum}`;

                    tableFootnoteSymbolMap.set(newBaseId, displaySymbol);

                    const dt = doc.createElement('dt');
                    dt.textContent = selectedLanguage === 'English' ? `${labelWordEn} ${tableNum} Note ${displaySymbol}` : `Note ${displaySymbol} ${prepositionFr} ${labelWordFr.toLowerCase()} ${tableNum}`;

                    const dd = doc.createElement('dd');
                    dd.id = newBaseId;
                    dd.innerHTML = `<p>${content}</p>`;

                    const supsForThisNote = Array.from(table.querySelectorAll(`sup[id^="${newBaseId}-rf"]`));
                    const firstSupId = supsForThisNote.length > 0 ? supsForThisNote[0].id : `${newBaseId}-rf`;

                    const returnP = doc.createElement('p');
                    returnP.className = 'fn-rtn';
                    const newReturnLink = doc.createElement('a');
                    newReturnLink.href = `#${firstSupId}`;

                    if (selectedLanguage === 'English') {
                        newReturnLink.innerHTML = `<span class="wb-inv">Return to ${labelWordEn.toLowerCase()} ${tableNum} note </span>${displaySymbol}<span class="wb-inv"> referrer</span>`;
                    } else {
                        newReturnLink.innerHTML = `<span class="wb-inv">Retour à la note </span>${displaySymbol}<span class="wb-inv"> ${prepositionFr} ${labelWordFr.toLowerCase()} ${tableNum}</span>`;
                    }
                    returnP.appendChild(newReturnLink);
                    dd.appendChild(returnP);

                    dl.appendChild(dt);
                    dl.appendChild(dd);
                });

                newSection.appendChild(dl);
                const newTd = doc.createElement('td');
                newTd.setAttribute('colspan', colCount);
                newTd.appendChild(newSection);
                const newTr = doc.createElement('tr');
                newTr.appendChild(newTd);
                tfoot.appendChild(newTr);
            });

            doc.querySelectorAll('sup a[href*="fn"]').forEach(anchor => {
                anchor.querySelectorAll('span.wb-inv').forEach(span => span.remove());
                let visibleText = anchor.innerHTML.trim();

                const href = anchor.getAttribute('href');
                let wbInvText = '';

                const sup = anchor.closest('sup');
                if (!sup) return;

                if (href.includes('tbl')) {
                    const newBaseId = href.substring(1);
                    if (tableFootnoteSymbolMap.has(newBaseId)) {
                        visibleText = tableFootnoteSymbolMap.get(newBaseId);
                    }

                    const containingTable = anchor.closest('table');
                    const isFigureTable = containingTable ? !!containingTable.closest('figure') : false;
                    const labelWordEn = isFigureTable ? 'Figure' : 'Table';
                    const labelWordFr = isFigureTable ? 'Figure' : 'Tableau';
                    const prepositionFr = isFigureTable ? 'de la' : 'du';

                    const tableNumMatch = href.match(/tbl(\d+)/);
                    const tableNum = tableNumMatch ? tableNumMatch[1] : '';

                    wbInvText = selectedLanguage === 'English' ? `${labelWordEn} ${tableNum} note ` : `Note ${prepositionFr} ${labelWordFr.toLowerCase()} ${tableNum} `;
                } else {
                    const oldSupId = sup.id;
                    const oldBaseId = oldSupId.replace(/-rf(-\d+)?$/, '');

                    if (pageIdChangeMap.has(oldBaseId)) {
                        const newBaseId = pageIdChangeMap.get(oldBaseId);
                        const suffixMatch = oldSupId.match(/-rf(-\d+)?$/);
                        const suffix = suffixMatch ? suffixMatch[0] : '-rf';
                        sup.id = newBaseId + suffix;
                        anchor.href = `#${newBaseId}`;
                        if (pageFootnoteSymbolMap.has(newBaseId)) {
                            visibleText = pageFootnoteSymbolMap.get(newBaseId);
                        }
                    } else {
                        const currentBaseId = href.substring(1);
                        if (pageFootnoteSymbolMap.has(currentBaseId)) {
                            visibleText = pageFootnoteSymbolMap.get(currentBaseId);
                        }
                    }
                    wbInvText = selectedLanguage === 'English' ? 'Footnote ' : 'Note de bas de page ';
                }

                if (visibleText) {
                    anchor.classList.add('fn-lnk');
                    anchor.innerHTML = `<span class="wb-inv">${wbInvText}</span>${visibleText}`;
                }
            });

            doc.querySelectorAll('dd[id*="fn"]').forEach(dd => {
                const baseId = dd.id;
                const firstSup = doc.querySelector(`sup[id^="${baseId}-rf"]`);
                if (firstSup) {
                    const returnLink = dd.querySelector('p.fn-rtn a');
                    if (returnLink) {
                        returnLink.href = `#${firstSup.id}`;
                    }
                }
            });

            const updatedContent = doc.body.innerHTML;

            let finalContent = html_beautify(updatedContent, {
                indent_size: 4,
                space_in_paren: true
            });

            finalContent = doAutoEncode(finalContent);

            monacoEditorInstance.setValue(finalContent);
            closeModalAndReEnableButtons();

            triggeringButton.textContent = 'Formatted!';
            triggeringButton.classList.add('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.remove('bg-slate-600', 'hover:bg-slate-500');
            setTimeout(() => {
                triggeringButton.textContent = originalButtonText;
                triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            }, 1500);
        });
    }

    function showFootnoteModal(triggeringButton, originalButtonText) {
        const footnoteContentHtml = `
                <div class="flex flex-col space-y-4">
				
				
				
                    <div>
                        <span class="text-sm font-medium text-gray-200 mr-2">Language:</span>
                        <div class="button-group inline-flex">
                            <button id="fnLangEnglishBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">English</button>
                            <button id="fnLangFrenchBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">French</button>
                        </div>
                    </div>
                    
                    <div>
                        <label for="fnCount" class="block text-sm font-medium text-gray-200">How many?</label>
                        <input type="number" id="fnCount" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="1" min="1" value="1">
                    </div>
					<div>
                        <label for="fnIdPrefix" class="block text-sm font-medium text-gray-200">ID Prefix (optional):</label>
                        <input type="text" id="fnIdPrefix" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., mydoc-">
					</div>
                    <p class="text-xs text-gray-400">NOTE: This only creates an empty list of footnotes, you must populate it on your own. It also does not add/change anchors.</p>
                </div>
            `;

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
                <div class="modal-content">
                    <h3>Insert Footnote List</h3>
                    <div id="modalBody">${footnoteContentHtml}</div>
                    <div class="flex justify-end mt-4 space-x-2">
                        <button id="modalCancelFnBtn" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                        <button id="modalInsertFnBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Insert</button>
                    </div>
                </div>
            `;
        document.body.appendChild(modalOverlay);

        function closeModalAndReEnableButtons() {
            modalOverlay.remove();
            triggeringButton.removeAttribute('data-temp-active');
            triggeringButton.textContent = originalButtonText;
            triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            updateAllInteractiveButtonStates();
        }

        document.getElementById('modalCancelFnBtn')
            .addEventListener('click', closeModalAndReEnableButtons);

        const fnLangEnglishBtn = document.getElementById('fnLangEnglishBtn');
        const fnLangFrenchBtn = document.getElementById('fnLangFrenchBtn');
        const fnIdPrefixInput = document.getElementById('fnIdPrefix');
        const fnCountInput = document.getElementById('fnCount');
        const modalInsertFnBtn = document.getElementById('modalInsertFnBtn');

        let selectedFnLanguage = 'English';

        function updateFnButtonActiveState(buttons, activeBtn) {
            buttons.forEach(btn => {
                btn.classList.remove('active', 'bg-indigo-600');
                btn.classList.add('bg-gray-600', 'hover:bg-gray-500');
            });
            activeBtn.classList.add('active', 'bg-indigo-600');
            activeBtn.classList.remove('bg-gray-600', 'hover:bg-gray-500');
        }

        updateFnButtonActiveState([fnLangEnglishBtn, fnLangFrenchBtn], fnLangEnglishBtn);

        fnLangEnglishBtn.addEventListener('click', () => {
            selectedFnLanguage = 'English';
            updateFnButtonActiveState([fnLangEnglishBtn, fnLangFrenchBtn], fnLangEnglishBtn);
        });

        fnLangFrenchBtn.addEventListener('click', () => {
            selectedFnLanguage = 'French';
            updateFnButtonActiveState([fnLangEnglishBtn, fnLangFrenchBtn], fnLangFrenchBtn);
        });

        fnCountInput.addEventListener('input', (event) => {
            const input = event.target;
            input.value = input.value.replace(/\D/g, '');
            if (input.value === '') {
                input.value = '1';
            }
        });

        modalInsertFnBtn.addEventListener('click', () => {
            const idPrefix = fnIdPrefixInput.value.trim();
            const footnoteCount = parseInt(fnCountInput.value) || 1;

            const capturedOriginalText = originalButtonText;

            let footnoteHtmlContent = `<aside class="wb-fnote" role="note">\n`;
            footnoteHtmlContent += `\t<h2 id="${idPrefix}fn">${selectedFnLanguage === 'English' ? 'Footnotes' : 'Notes en bas de page'}</h2>\n`;
            footnoteHtmlContent += `\t<dl>\n`;

            for (let i = 1; i <= footnoteCount; i++) {
                const dtText = selectedFnLanguage === 'English' ? `Footnote ${i}` : `Note en bas de page ${i}`;
                const ddContent = selectedFnLanguage === 'English' ? `ENG footnote ${i} content.` : `FRA footnote ${i} content.`;
                const returnTextInv = selectedFnLanguage === 'English' ? `Return to footnote ` : `Retour à la référence de la note en bas de page `;
                const returnTextRef = selectedFnLanguage === 'English' ? ` referrer` : ``;

                footnoteHtmlContent += `\t\t<dt>${dtText}</dt>\n`;
                footnoteHtmlContent += `\t\t<dd id="${idPrefix}fn${i}">\n`;
                footnoteHtmlContent += `\t\t\t<p>${ddContent}</p>\n`;
                footnoteHtmlContent += `\t\t\t<p class="fn-rtn"> <a href="#${idPrefix}fn${i}-rf"><span class="wb-inv">${returnTextInv}</span>${i}<span class="wb-inv">${returnTextRef}</span></a> </p>\n`;
                footnoteHtmlContent += `\t\t</dd>\n`;
            }

            footnoteHtmlContent += `\t</dl>\n`;
            footnoteHtmlContent += `</aside>\n`;

            if (monacoEditorInstance) {
                let currentContent = monacoEditorInstance.getValue();
                currentContent = protectDataAttributes(currentContent);

                const colophonSectionMatch = currentContent.match(/<section[^>]*id=["'][^"']*colophon[^"']*["'][^>]*>/i);
                let insertionIndex = -1;

                if (colophonSectionMatch) {
                    insertionIndex = currentContent.indexOf(colophonSectionMatch[0]);
                }

                if (insertionIndex !== -1) {
                    currentContent = currentContent.substring(0, insertionIndex) + footnoteHtmlContent + currentContent.substring(insertionIndex);
                } else {
                    const bodyEndTagIndex = currentContent.lastIndexOf('</body>');
                    if (bodyEndTagIndex !== -1) {
                        currentContent = currentContent.substring(0, bodyEndTagIndex) + footnoteHtmlContent + '\n' + currentContent.substring(bodyEndTagIndex);
                    } else {
                        currentContent += footnoteHtmlContent;
                    }
                }

                currentContent = restoreDataAttributes(currentContent);
                currentContent = convertAllEntitiesToNumeric(currentContent);

                monacoEditorInstance.setValue(currentContent);
                htmlOutputContent = currentContent;
                applyEntityHighlighting();
            }

            closeModalAndReEnableButtons();

            triggeringButton.textContent = 'Inserted!';
            triggeringButton.classList.add('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.remove('bg-slate-600', 'hover:bg-slate-500');
            setTimeout(() => {
                triggeringButton.textContent = capturedOriginalText;
                triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            }, 1500);
        });
    }

    function showRegexGuideModal(triggeringButton, originalButtonText) {
        const regexGuideContentHtml = `
        <p class="mb-4">Regular expressions are patterns used to match character combinations in strings. Here are some common metacharacters:</p>
        
            <p><code class="font-bold">.</code> : Matches any single character (except newline).</p>
            <p><code class="font-bold">\\d</code> : Matches any digit (0-9).</p>
            <p><code class="font-bold">\\D</code> : Matches any non-digit character.</p>
            <p><code class="font-bold">\\w</code> : Matches any word character (alphanumeric and underscore).</p>
            <p><code class="font-bold">\\W</code> : Matches any non-word character.</p>
            <p><code class="font-bold">\\s</code> : Matches any whitespace character (space, tab, newline).</p>
            <p><code class="font-bold">\\S</code> : Matches any non-whitespace character.</p>
            <p><code class="font-bold">\\b</code> : Matches a word boundary.</p>
            <p><code class="font-bold">\\B</code> : Matches a non-word boundary.</p>
            <p><code class="font-bold">^</code> : Matches the beginning of the string.</p>
            <p><code class="font-bold">$</code> : Matches the end of the string.</p>
            <p><code class="font-bold">*</code> : Matches the previous character zero or more times.</p>
            <p><code class="font-bold">+</code> : Matches the previous character one or more times.</p>
            <p><code class="font-bold">?</code> : Matches the previous character zero or one time (also for non-greedy matching).</p>
            <p><code class="font-bold">{n}</code> : Matches the previous character exactly 'n' times.</p>
            <p><code class="font-bold">{n,}</code> : Matches the previous character 'n' or more times.</p>
            <p><code class="font-bold">{n,m}</code> : Matches the previous character between 'n' and 'm' times.</p>
            <p><code class="font-bold">[abc]</code> : Matches any one of the characters inside the brackets.</p>
            <p><code class="font-bold">[^abc]</code> : Matches any character NOT inside the brackets.</p>
            <p><code class="font-bold">(x|y)</code> : Matches either 'x' or 'y'.</p>
            <p><code class="font-bold">(...)</code> : Capturing group.</p>
            <p><code class="font-bold">\\n</code> : Backreference to the n-th capturing group.</p>
            <p><code class="font-bold">|</code> : OR operator.</p>
            <p><code class="font-bold">\\\\</code> : Escapes a special character (e.g., '\.' to match a literal dot).</p>
    `;

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
        <div class="modal-content regex-guide-modal-content">
            <h3>Regex Guide</h3> 
            <div id="modalBody">${regexGuideContentHtml}</div>
            <div class="flex justify-end mt-4 space-x-2">
                <button id="modalCloseRegexBtn" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Close</button>
            </div>
        </div>
    `;
        document.body.appendChild(modalOverlay);

        function closeModalAndReEnableButtons() {
            modalOverlay.remove();
            triggeringButton.removeAttribute('data-temp-active');
            triggeringButton.textContent = originalButtonText;
            triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.add('bg-gray-600', 'hover:bg-gray-700');
            updateAllInteractiveButtonStates();
        }

        document.getElementById('modalCloseRegexBtn')
            .addEventListener('click', closeModalAndReEnableButtons);

        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                closeModalAndReEnableButtons();
            }
        });

        triggeringButton.textContent = 'Opening...';
        triggeringButton.classList.add('bg-green-500', 'hover:bg-green-600');
        triggeringButton.classList.remove('bg-gray-600', 'hover:bg-gray-700');
        triggeringButton.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();
    }

    function showAutoIdModal(triggeringButton, originalButtonText) {
        const autoIdContentHtml = `
                <div class="flex flex-col space-y-4">
                    <div>
					<div class="mb-4">
							<span class="text-sm font-medium mr-2">ID Generation Mode:</span>
							<ul class="list-disc text-sm font-medium ml-6">
							<li><em>(default)</em> <strong>Preserve</strong> custom/existing ID's (only add missing ones); OR</li>
							<li><strong>Regenerate</strong> ALL ID's and overwrite them all</li>
							</ul>
							<div class="button-group inline-flex mt-2" id="id-generation-mode-group">
								<button id="preserveIdsBtn" class="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">Preserve existing ID's</button>
								<button id="regenerateIdsBtn" class="px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">Regenerate all ID's</button>
							</div>
						</div>
                        <span class="text-sm font-medium text-CBD5E1 mr-2">Choose elements to ID:</span>
						
                        <div class="space-y-2 mt-2">
                            
                            <div class="toggle-switch-container">
                                <label class="toggle-switch is-checked" for="toggleSectionsId">
                                    <input type="checkbox" id="toggleSectionsId" checked>
                                    <span class="toggle-switch-slider"></span>
                                </label>
                                <span class="toggle-switch-label text-white text-sm">Sections (sec#)</span>
                            </div>
                            
                            <div class="toggle-switch-container">
                                <label class="toggle-switch is-checked" for="toggleHeadingsId">
                                    <input type="checkbox" id="toggleHeadingsId" checked>
                                    <span class="toggle-switch-slider"></span>
                                </label>
                                <span class="toggle-switch-label text-white text-sm">Headings (toc#)</span>
                            </div>
                            
                            <div class="toggle-switch-container">
                                <label class="toggle-switch is-checked" for="toggleFiguresId">
                                    <input type="checkbox" id="toggleFiguresId" checked>
                                    <span class="toggle-switch-slider"></span>
                                </label>
                                <span class="toggle-switch-label text-white text-sm">Figures (fig#)</span>
                            </div>
                            
                            <div class="toggle-switch-container">
                                <label class="toggle-switch" for="toggleTablesId">
                                    <input type="checkbox" id="toggleTablesId">
                                    <span class="toggle-switch-slider"></span>
                                </label>
                                <span class="toggle-switch-label text-white text-sm">Tables (tbl#)</span>
                            </div>
                            
                            <div class="toggle-switch-container">
                                <label class="toggle-switch" for="toggleFigureTablesId">
                                    <input type="checkbox" id="toggleFigureTablesId">
                                    <span class="toggle-switch-slider"></span>
                                </label>
                                <span class="toggle-switch-label text-white text-sm">Figure Tables (ftbl#)</span>
                            </div>

                            <div class="toggle-switch-container">
                                <label class="toggle-switch is-checked" for="toggleFixFnIdsModal">
                                    <input type="checkbox" id="toggleFixFnIdsModal" checked>
                                    <span class="toggle-switch-slider"></span>
                                </label>
                                <span class="toggle-switch-label text-white text-sm">Fix Duplicate FN Refs (fn#-rf)</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.innerHTML = `
        <div class="modal-content">
            <h3>Element ID's Options</h3>
            <div id="modalBody">${autoIdContentHtml}</div>
            <div class="flex justify-end mt-4 space-x-2">
                <button id="modalCancelAutoIdBtn" class="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600">Cancel</button>
                <button id="modalApplyAutoIdBtn" class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Apply IDs</button>
            </div>
        </div>
    `;
        document.body.appendChild(modalOverlay);

        function closeModalAndReEnableButtons() {
            modalOverlay.remove();
            triggeringButton.removeAttribute('data-temp-active');
            triggeringButton.textContent = originalButtonText;
            triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
            triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
            updateAllInteractiveButtonStates();
        }

        document.getElementById('modalCancelAutoIdBtn').addEventListener('click', closeModalAndReEnableButtons);

        const toggleSectionsId = document.getElementById('toggleSectionsId');
        const toggleHeadingsId = document.getElementById('toggleHeadingsId');
        const toggleFiguresId = document.getElementById('toggleFiguresId');
        const toggleTablesId = document.getElementById('toggleTablesId');
        const toggleFigureTablesId = document.getElementById('toggleFigureTablesId');
        const toggleFixFnIdsModal = document.getElementById('toggleFixFnIdsModal');
        const modalApplyAutoIdBtn = document.getElementById('modalApplyAutoIdBtn');

        const preserveIdsBtn = document.getElementById('preserveIdsBtn');
        const regenerateIdsBtn = document.getElementById('regenerateIdsBtn');

        function updateIdModeButtons(activeButton) {
            if (activeButton === preserveIdsBtn) {
                preserveIdsBtn.classList.add('active', 'bg-blue-600');
                preserveIdsBtn.classList.remove('bg-gray-600', 'hover:bg-gray-500');
                regenerateIdsBtn.classList.remove('active', 'bg-blue-600');
                regenerateIdsBtn.classList.add('bg-gray-600', 'hover:bg-gray-500');
            } else {
                regenerateIdsBtn.classList.add('active', 'bg-blue-600');
                regenerateIdsBtn.classList.remove('bg-gray-600', 'hover:bg-gray-500');
                preserveIdsBtn.classList.remove('active', 'bg-blue-600');
                preserveIdsBtn.classList.add('bg-gray-600', 'hover:bg-gray-500');
            }
        }

        preserveIdsBtn.addEventListener('click', () => updateIdModeButtons(preserveIdsBtn));
        regenerateIdsBtn.addEventListener('click', () => updateIdModeButtons(regenerateIdsBtn));
        updateIdModeButtons(preserveIdsBtn);


        [toggleSectionsId, toggleHeadingsId, toggleFiguresId, toggleTablesId, toggleFigureTablesId, toggleFixFnIdsModal].forEach(toggle => {
            toggle.addEventListener('change', (event) => {
                const parentLabel = event.target.closest('.toggle-switch');
                if (event.target.checked) {
                    parentLabel.classList.add('is-checked');
                } else {
                    parentLabel.classList.remove('is-checked');
                }
            });
        });

        modalApplyAutoIdBtn.addEventListener('click', () => {
            const idGenerationMode = document.getElementById('regenerateIdsBtn').classList.contains('active') ? 'regenerate' : 'preserve';
            const options = {
                idSections: toggleSectionsId.checked,
                idHeadings: toggleHeadingsId.checked,
                idFigures: toggleFiguresId.checked,
                idTables: toggleTablesId.checked,
                idFigureTables: toggleFigureTablesId.checked,
                fixFnIds: toggleFixFnIdsModal.checked,
                idGenerationMode: idGenerationMode
            };

            if (monacoEditorInstance) {
                let currentContent = monacoEditorInstance.getValue();
                currentContent = protectDataAttributes(currentContent);
                currentContent = applyAutoId(currentContent, options);
                currentContent = restoreDataAttributes(currentContent);
                currentContent = convertAllEntitiesToNumeric(currentContent);
                monacoEditorInstance.setValue(currentContent);
                htmlOutputContent = currentContent;
                applyEntityHighlighting();

                closeModalAndReEnableButtons();

                const capturedOriginalText = originalButtonText;

                triggeringButton.textContent = 'ID\'d!';
                triggeringButton.classList.add('bg-green-500', 'hover:bg-green-600');
                triggeringButton.classList.remove('bg-slate-600', 'hover:bg-slate-500');
                setTimeout(() => {
                    triggeringButton.textContent = capturedOriginalText;
                    triggeringButton.classList.remove('bg-green-500', 'hover:bg-green-600');
                    triggeringButton.classList.add('bg-slate-600', 'hover:bg-slate-500');
                }, 1500);
            }
        });
    }

    const quickFormattingToggles = [
        toggleCleanSpaces, toggleCleanUrls, toggleTimeTags, toggleCleanSingleBreaks, toggleCleanPTables, toggleCleanFormattingTags,
        toggleAutoLevelHeadings, toggleAutoSection
    ];

    function updateFormatButtonState() {
        const anySelected = quickFormattingToggles.some(toggle => toggle.checked);
        if (anySelected) {
            formatSelectedBtn.disabled = false;
            formatSelectedBtn.classList.remove('bg-gray-400', 'cursor-not-allowed', 'opacity-60');
            formatSelectedBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
        } else {
            formatSelectedBtn.disabled = true;
            formatSelectedBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            formatSelectedBtn.classList.add('bg-gray-400', 'cursor-not-allowed', 'opacity-60');
        }
    }

    function doAutoEncode(htmlContent) {
        let processedContent = protectDataAttributes(htmlContent);
        processedContent = convertAllEntitiesToNumeric(processedContent);
        processedContent = restoreDataAttributes(processedContent);
        return processedContent;
    }

    function updateModalSettingsButtonStates() {
        [modalToggleContainerBtn, modalToggleTitleBtn, modalToggleCssBtn].forEach(btn => btn.classList.remove('active', 'bg-indigo-600', 'bg-red-600'));
        if (modalUseContainerDiv) modalToggleContainerBtn.classList.add('active', 'bg-indigo-600');
        if (modalShowTitle) modalToggleTitleBtn.classList.add('active', 'bg-indigo-600');
        if (!modalEnableCss) modalToggleCssBtn.classList.add('bg-red-600');
        modalToggleContainerBtn.textContent = modalUseContainerDiv ? 'Custom Width' : 'Default Width';
        modalToggleTitleBtn.textContent = modalShowTitle ? 'Hide Title' : 'Show Title';
        modalToggleCssBtn.textContent = modalEnableCss ? 'Disable CSS' : 'Enable CSS';
    }

    function updateModalBylineButtonStates() {
        [modalNoneBylineBtn, modalEnglishBylineBtn, modalFrenchBylineBtn].forEach(btn => btn.classList.remove('active', 'bg-indigo-600'));
        if (modalBylineMode === 'none') modalNoneBylineBtn.classList.add('active', 'bg-indigo-600');
        else if (modalBylineMode === 'english') modalEnglishBylineBtn.classList.add('active', 'bg-indigo-600');
        else if (modalBylineMode === 'french') modalFrenchBylineBtn.classList.add('active', 'bg-indigo-600');
        modalEnglishBylineBtn.style.display = (modalCurrentLanguage === 'en') ? 'inline-block' : 'none';
        modalFrenchBylineBtn.style.display = (modalCurrentLanguage === 'fr') ? 'inline-block' : 'none';
    }

    function updateModalImageSourceButtonStates() {
        [modalLocalImagesBtn, modalPreviewImagesBtn, modalToggleLiveImagesBtn].forEach(btn => btn.classList.remove('active', 'bg-indigo-600'));
        if (modalImageSourceMode === 'local') modalLocalImagesBtn.classList.add('active', 'bg-indigo-600');
        else if (modalImageSourceMode === 'preview') modalPreviewImagesBtn.classList.add('active', 'bg-indigo-600');
        else if (modalImageSourceMode === 'live') modalToggleLiveImagesBtn.classList.add('active', 'bg-indigo-600');
    }

    function updateModalUrlSourceButtonStates() {
        [modalLocalUrlsBtn, modalPreviewUrlsBtn, modalToggleLiveUrlsBtn].forEach(btn => btn.classList.remove('active', 'bg-indigo-600'));
        if (modalUrlSourceMode === 'local') modalLocalUrlsBtn.classList.add('active', 'bg-indigo-600');
        else if (modalUrlSourceMode === 'preview') modalPreviewUrlsBtn.classList.add('active', 'bg-indigo-600');
        else if (modalUrlSourceMode === 'live') modalToggleLiveUrlsBtn.classList.add('active', 'bg-indigo-600');
    }

    function updateModalSectionHeadingButtonStates() {
        modalToggleSectionsBtn.classList.toggle('active', modalShowSections);
        modalToggleHeadingsBtn.classList.toggle('active', modalShowHeadings);
    }

    function updateModalWetGcdsButtonState() {
        modalWetGcdsToggleBtn.classList.remove('bg-blue-600', 'bg-indigo-600');
        modalWetGcdsToggleBtn.innerHTML = '';
        if (modalCurrentFramework === 'wet') {
            modalWetGcdsToggleBtn.classList.add('bg-blue-600');
            modalWetGcdsToggleBtn.textContent = 'WET4';
        } else if (modalCurrentFramework === 'gcds') {
            modalWetGcdsToggleBtn.classList.add('bg-indigo-600');
            modalWetGcdsToggleBtn.textContent = 'GCDS';
        } else if (modalCurrentFramework === 'wet+') {
            modalWetGcdsToggleBtn.classList.add('bg-indigo-600');
            modalWetGcdsToggleBtn.innerHTML = '<strong><u>WET+</u></strong>';
        }
    }

    function updateModalLanguageButtonStates() {
        modalLangEnBtn.classList.remove('active', 'bg-indigo-600');
        modalLangFrBtn.classList.remove('active', 'bg-indigo-600');
        if (modalCurrentLanguage === 'en') {
            modalLangEnBtn.classList.add('active', 'bg-indigo-600');
            modalH1TitleInput.placeholder = 'e.g., My Custom ENG Title';
            modalH1TitleInput.value = modalH1TitleEn;
        } else {
            modalLangFrBtn.classList.add('active', 'bg-indigo-600');
            modalH1TitleInput.placeholder = 'e.g., Mon titre FRA personnalisé';
            modalH1TitleInput.value = modalH1TitleFr;
        }
        updateModalBylineButtonStates();
    }

    function updateModalBreakpointButtonStates() {
        [modalBreakpointXsBtn, modalBreakpointSmBtn, modalBreakpointMdBtn, modalBreakpointFullBtn].forEach(btn => btn.classList.remove('active', 'bg-indigo-600'));
        if (modalCurrentBreakpoint === 'xs') modalBreakpointXsBtn.classList.add('active', 'bg-indigo-600');
        else if (modalCurrentBreakpoint === 'sm') modalBreakpointSmBtn.classList.add('active', 'bg-indigo-600');
        else if (modalCurrentBreakpoint === 'md') modalBreakpointMdBtn.classList.add('active', 'bg-indigo-600');
        else if (modalCurrentBreakpoint === 'full') modalBreakpointFullBtn.classList.add('active', 'bg-indigo-600');
    }


    const toggleBottomPanel = document.getElementById('toggleBottomPanel');
    const searchAndValidatePanel = document.getElementById('searchAndValidatePanel');
    const searchValidateToggle = document.getElementById('searchValidateToggle');

    const openSearchControlsBtn = document.getElementById('openSearchControlsBtn');
    const openValidationBtn = document.getElementById('openValidationBtn');

    const searchControlsView = document.getElementById('searchRegex');
    const validationResultsView = document.getElementById('validationResultsContainer');



    toggleBottomPanel.addEventListener('click', () => {
        const isPanelHidden = searchAndValidatePanel.classList.toggle('hidden');
        searchValidateToggle.classList.toggle('hidden', isPanelHidden);
        toggleBottomPanel.textContent = isPanelHidden ? 'Show Panel' : 'Hide Panel';
    });

    openSearchControlsBtn.addEventListener('click', () => {
        searchControlsView.classList.remove('view-hidden');
        openSearchControlsBtn.classList.add('active');

        validationResultsView.classList.add('view-hidden');
        openValidationBtn.classList.remove('active');
    });

    openValidationBtn.addEventListener('click', () => {
        searchReset.click();
        validationResultsView.classList.remove('view-hidden');
        openValidationBtn.classList.add('active');

        searchControlsView.classList.add('view-hidden');
        openSearchControlsBtn.classList.remove('active');
    });
    validateNowBtn.addEventListener('click', async () => {
        searchReset.click();
        openValidationBtn.click();

        if (searchAndValidatePanel.classList.contains('hidden')) {
            toggleBottomPanel.click();
        }

        if (monacoEditorInstance) {
            const codeToValidate = monacoEditorInstance.getValue();
            const errors = await validateHtmlContent(codeToValidate);

            validateNowBtn.disabled = true;

            if (errors.length === 0) {
                validateNowBtn.classList.remove('bg-blue-700', 'hover:bg-blue-600', 'bg-red-600', 'hover:bg-red-700');
                validateNowBtn.classList.add('bg-green-600', 'hover:bg-green-700');
                validateNowBtn.innerHTML = '<i class="fa-solid fa-check"></i> Valid!';
            } else {
                validateNowBtn.classList.remove('bg-blue-700', 'hover:bg-blue-600', 'bg-green-600', 'hover:bg-green-700');
                validateNowBtn.classList.add('bg-red-600', 'hover:bg-red-700');
                validateNowBtn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> ${errors.length} Errors`;
            }

            setTimeout(() => {
                validateNowBtn.classList.remove('bg-green-600', 'hover:bg-green-700', 'bg-red-600', 'hover:bg-red-700');
                validateNowBtn.classList.add('bg-blue-700', 'hover:bg-blue-600');
                validateNowBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> Validate';
                validateNowBtn.disabled = false;
            }, 2500);

        } else {
            const validationResultsDiv = document.getElementById('validationResults');
            validationResultsDiv.innerHTML = '<p class="text-red-700 text-center">Error: Editor not found.</p>';
        }
    });

    function initializeViews() {
        searchControlsView.classList.remove('view-hidden');
        openSearchControlsBtn.classList.add('active');

        validationResultsView.classList.add('view-hidden');
        openValidationBtn.classList.remove('active');
    }

    initializeViews();
    default_ifr.src = 'about:blank?cachebust=' + new Date()
        .getTime();
    default_ifr.addEventListener('load', () => {
        console.log("Parent: Iframe has loaded. Commanding editor initialization.");
        if (default_ifr.contentWindow && typeof default_ifr.contentWindow.initializeEditor === 'function') {
            default_ifr.contentWindow.initializeEditor();
        } else {
            console.error("Parent: Iframe loaded, but its initializeEditor function was not found.");
        }
    });
    console.log("Parent window.onload triggered.");
    richtextOutputPanel.classList.add('panel-visible');
    mainEditorArea.classList.add('panel-hidden');

    toggleEditorViewBtnCode.classList.add('bg-cyan-700', 'hover:bg-cyan-800');
    toggleEditorViewBtnCode.classList.remove('bg-cyan-700', 'hover:bg-cyan-800', 'bg-slate-800', 'hover:bg-slate-700');
    updateGoToHtmlButtonColor();

    require.config({
        paths: APP_CONFIG.monacoLoaderPaths
    });
    require(['vs/editor/editor.main'], function() {
        
        monaco.editor.defineTheme('custom-vs-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [],
            colors: {
                'editor.lineHighlightBorder': '#818132ff',
                'editor.lineHighlightBackground': '#00000000'
            }
        });

        monaco.editor.defineTheme('custom-vs-light', {
            base: 'vs',
            inherit: true,
            rules: [],
            colors: {
                'editor.lineHighlightBorder': '#000000',
                'editor.lineHighlightBackground': '#00000000'
            }
        });

        monaco.languages.html.htmlDefaults.setOptions({
            wrapLineLength: 500,
        });
        const editorOptions = APP_CONFIG.getMonacoEditorOptions(htmlOutputContent);
        editorOptions.theme = 'custom-vs-dark';

        monacoEditorInstance = monaco.editor.create(
            monacoEditorContainer,
            editorOptions
        );
        window.monacoEditorInstance = monacoEditorInstance;
        console.log("Monaco editor initialized.");

        let currentMonacoTheme = 'dark';

        toggleThemeBtn.addEventListener('click', () => {
            if (currentMonacoTheme === 'dark') {
                currentMonacoTheme = 'light';
                monaco.editor.setTheme('custom-vs-light');
                toggleThemeBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
                toggleThemeBtn.title = "Switch to Dark Theme";
            } else {
                currentMonacoTheme = 'dark';
                monaco.editor.setTheme('custom-vs-dark');
                toggleThemeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
                toggleThemeBtn.title = "Switch to Light Theme";
            }
        });

        monacoEditorInstance.addCommand(monaco.KeyCode.KeyZ | monaco.KeyMod.CtrlCmd, () => {
            undoBtn.click();
        });

        monacoEditorInstance.addCommand(monaco.KeyCode.KeyY | monaco.KeyMod.CtrlCmd, () => {
            redoBtn.click();
        });

        recordState(monacoEditorInstance.getValue());
        updateUndoRedoButtons();

        const debouncedRecordState = debounce(() => {
            recordState(monacoEditorInstance.getValue());
        }, 500);

        monacoEditorInstance.onDidChangeModelContent(() => {
            htmlOutputContent = monacoEditorInstance.getValue();

            if (!isUndoingOrRedoing) {
                debouncedRecordState();
            }

            applyEntityHighlighting();

            populateTagDropdown();
            populateIdDropdown();
            resetSearchState(true);
        });


        applyEntityHighlighting();


        window.addEventListener('resize', debouncedMonacoLayout);

        const findInput = document.getElementById('find-input');
        const replaceInput = document.getElementById('replace-input');
        const findNextButton = document.getElementById('find-next-button');
        const findPreviousButton = document.getElementById('find-previous-button');
        const replaceOneButton = document.getElementById('replace-one-button');
        const replaceAllButton = document.getElementById('replace-all-button');
        const tagDropdown = document.getElementById('target-tag-dropdown');
        const idDropdown = document.getElementById('target-id-dropdown');
        const enableRegexCheckbox = document.getElementById('enable-regex');
        const matchCaseCheckbox = document.getElementById('match-case');
        const highlightAllCheckbox = document.getElementById('highlight-all');
        const sequenceCheckbox = document.getElementById('sequence');
        const sequenceContainer = document.getElementById('sequence-container');
        const sequenceRangeContainer = document.getElementById('sequence-range-container');
        const startIndexInput = document.getElementById('start-index');
        const endIndexInput = document.getElementById('end-index');
        const matchCountSpan = document.getElementById('match-count');
        const regexGuideButton = document.getElementById('regex-guide-button');
        const searchRegex = document.getElementById('searchRegex');
        allInteractiveButtons.push(regexGuideButton);

        let allDecorations = [];
        let allMatches = [];
        let currentMatchIndex = -1;
        let currentFindText = '';
        let currentSelectedId = 'all';
        let currentSelectedTag = 'all';
        let currentIsRegex = false;
        let currentMatchCase = false;



        let searchControlsVisible = true;

        function toggleSearchControls() {
            searchControlsVisible = !searchControlsVisible;

            if (searchControlsVisible) {
                searchRegex.classList.remove('search-controls-hidden');
                searchRegex.classList.add('search-controls-visible');

                searchAndValidatePanel.classList.remove('hidden');
                searchAndValidatePanel.classList.remove('search-controls-hidden');
                searchAndValidatePanel.classList.add('search-controls-visible');

                toggleBottomPanel.textContent = 'Hide Panel';
            } else {
                searchRegex.classList.remove('search-controls-visible');
                searchRegex.classList.add('search-controls-hidden');

                toggleBottomPanel.textContent = 'Show Panel';
            }
        }

        toggleBottomPanel.addEventListener('click', toggleSearchControls);

        searchAndValidatePanel.classList.remove('hidden');
        searchRegex.classList.add('search-controls-visible');

        function populateTagDropdown() {
            const currentSelection = tagDropdown.value;
            const editorValue = monacoEditorInstance.getValue();
            const tagRegex = /<(\w+)(?=\s|>)/g;
            const uniqueTags = new Set();
            let match;

            while ((match = tagRegex.exec(editorValue)) !== null) {
                uniqueTags.add(match[1]);
            }

            tagDropdown.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = 'all';
            defaultOption.textContent = 'All Tags';
            tagDropdown.appendChild(defaultOption);

            const sortedTags = [...uniqueTags].sort();

            sortedTags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = `<${tag}>`;
                tagDropdown.appendChild(option);
            });

            if (Array.from(tagDropdown.options)
                .some(option => option.value === currentSelection)) {
                tagDropdown.value = currentSelection;
            } else {
                tagDropdown.value = 'all';
            }
        }

        function populateTagDropdown() {
            const currentSelection = tagDropdown.value;
            const editorValue = monacoEditorInstance.getValue();
            const tagRegex = /<(\w+)(?=\s|>)/g;
            const uniqueTags = new Set();
            let match;

            while ((match = tagRegex.exec(editorValue)) !== null) {
                uniqueTags.add(match[1]);
            }

            tagDropdown.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = 'all';
            defaultOption.textContent = 'All Tags';
            tagDropdown.appendChild(defaultOption);

            const sortedTags = [...uniqueTags].sort();

            sortedTags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = `<${tag}>`;
                tagDropdown.appendChild(option);
            });

            if (Array.from(tagDropdown.options)
                .some(option => option.value === currentSelection)) {
                tagDropdown.value = currentSelection;
            } else {
                tagDropdown.value = 'all';
            }
        }

        function populateIdDropdown() {
            const currentSelection = idDropdown.value;
            const editorValue = monacoEditorInstance.getValue();
            const idRegex = /id="([^"]+)"/g;
            const uniqueIds = [];
            const seenIds = new Set();

            let match;
            while ((match = idRegex.exec(editorValue)) !== null) {
                const id = match[1];
                if (!seenIds.has(id)) {
                    uniqueIds.push(id);
                    seenIds.add(id);
                }
            }

            idDropdown.innerHTML = '';
            const defaultOption = document.createElement('option');
            defaultOption.value = 'all';
            defaultOption.textContent = 'All ID\'s';
            idDropdown.appendChild(defaultOption);

            uniqueIds.forEach(id => {
                const option = document.createElement('option');
                option.value = id;
                option.textContent = `#${id}`;
                idDropdown.appendChild(option);
            });

            if (Array.from(idDropdown.options)
                .some(option => option.value === currentSelection)) {
                idDropdown.value = currentSelection;
            } else {
                idDropdown.value = 'all';
            }
        }

        populateTagDropdown();
        populateIdDropdown();


        function toggleSequenceVisibility() {
            if (enableRegexCheckbox.checked) {
                sequenceContainer.classList.remove('max-h-0', 'opacity-0', 'pointer-events-none');
                sequenceContainer.classList.add('max-h-40', 'opacity-100');
            } else {
                sequenceContainer.classList.remove('max-h-40', 'opacity-0', 'pointer-events-none');
                sequenceContainer.classList.add('max-h-0', 'opacity-0', 'pointer-events-none');
            }
        }

        sequenceCheckbox.addEventListener('change', () => {
            if (sequenceCheckbox.checked) {
                sequenceRangeContainer.classList.remove('opacity-0', 'pointer-events-none');
            } else {
                sequenceRangeContainer.classList.add('opacity-0', 'pointer-events-none');
            }
        });

        function toggleRegexBorder() {
            if (enableRegexCheckbox.checked) {
                findInput.classList.add('regex-active-border');
                replaceInput.classList.add('regex-active-border');
            } else {
                findInput.classList.remove('regex-active-border');
                replaceInput.classList.remove('regex-active-border');
            }
        }

        enableRegexCheckbox.addEventListener('change', () => {
            toggleSequenceVisibility();
            toggleRegexBorder();
            resetSearchState(true);
        });

        toggleSequenceVisibility();
        toggleRegexBorder();

        function getContextString() {
            const selectedId = idDropdown.value;
            const selectedTag = tagDropdown.value;
            let contextText = '';

            if (selectedId !== 'all' && selectedTag !== 'all') {
                contextText = ` in selected <span class="text-blue-400 font-bold">#${selectedId}</span> and <span class="text-purple-400 font-bold">&lt;${selectedTag}&gt;</span> tags only`;
            } else if (selectedId !== 'all') {
                contextText = ` in selected <span class="text-blue-400 font-bold">#${selectedId}</span> only`;
            } else if (selectedTag !== 'all') {
                contextText = ` in selected <span class="text-purple-400 font-bold">&lt;${selectedTag}&gt;</span> tags only`;
            }
            return contextText;
        }

        function findMatches() {
            const findText = findInput.value;
            if (!findText) return [];

            const selectedId = idDropdown.value;
            const selectedTag = tagDropdown.value;
            const isRegex = enableRegexCheckbox.checked;
            const matchCase = matchCaseCheckbox.checked;
            const isCaseSensitive = matchCase;
            const model = monacoEditorInstance.getModel();
            const editorValue = model.getValue();
            let matches = [];
            let searchScopeRange = null;

            if (selectedId !== 'all') {
                const idAttributeRegex = new RegExp(`<(\\w+)([^>]*id="${selectedId}"[^>]*)>`, 'i');
                const idMatch = idAttributeRegex.exec(editorValue);

                if (idMatch) {
                    const startOffset = idMatch.index;
                    const tagName = idMatch[1];
                    const tagContent = idMatch[2];

                    const isSelfClosing = tagContent.endsWith('/') || ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(tagName.toLowerCase());

                    if (isSelfClosing) {
                        searchScopeRange = new monaco.Range(
                            model.getPositionAt(startOffset)
                            .lineNumber, model.getPositionAt(startOffset)
                            .column, model.getPositionAt(startOffset + idMatch[0].length)
                            .lineNumber, model.getPositionAt(startOffset + idMatch[0].length)
                            .column
                        );
                    } else {
                        searchScopeRange = findFullElementRange(model, startOffset);
                    }
                } else {
                    return [];
                }
            }

            if (selectedTag !== 'all') {
                let currentSearchAreaRange = searchScopeRange;
                let allRangesToSearch = [];

                const tagOpeningRegex = new RegExp(`<${selectedTag}([^>]*)>`, 'gi');
                tagOpeningRegex.lastIndex = currentSearchAreaRange ? model.getOffsetAt(currentSearchAreaRange.getStartPosition()) : 0;

                let match;
                while ((match = tagOpeningRegex.exec(editorValue)) !== null) {
                    const matchStartOffset = match.index;
                    const matchEndOffset = match.index + match[0].length;

                    if (currentSearchAreaRange) {
                        const matchStartPos = model.getPositionAt(matchStartOffset);
                        if (!currentSearchAreaRange.containsPosition(matchStartPos) && matchStartOffset >= model.getOffsetAt(currentSearchAreaRange.getEndPosition())) {
                            break;
                        }
                        if (!currentSearchAreaRange.containsPosition(matchStartPos)) {
                            continue;
                        }
                    }

                    const elementFullRange = findFullElementRange(model, matchStartOffset);
                    if (elementFullRange) {
                        allRangesToSearch.push(elementFullRange);
                    }
                }

                if (allRangesToSearch.length > 0) {
                    allRangesToSearch.forEach(range => {
                        matches.push(...model.findMatches(findText, range, isRegex, isCaseSensitive, null, true));
                    });
                } else {
                    return [];
                }

            } else {
                const textToSearch = findText;
                matches = model.findMatches(textToSearch, searchScopeRange, isRegex, isCaseSensitive, null, true);
            }

            return matches;
        }

        function findFullElementRange(model, initialStartOffset) {
            const editorValue = model.getValue();
            const startPos = model.getPositionAt(initialStartOffset);

            const openTagMatch = editorValue.substring(initialStartOffset)
                .match(/^<(\w+)([^>]*)>/);
            if (!openTagMatch) {
                return null;
            }

            const tagName = openTagMatch[1];
            const tagContent = openTagMatch[2];
            const openTagLength = openTagMatch[0].length;
            const isSelfClosing = tagContent.endsWith('/') || ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(tagName.toLowerCase());

            if (isSelfClosing) {
                return new monaco.Range(
                    startPos.lineNumber, startPos.column, model.getPositionAt(initialStartOffset + openTagLength)
                    .lineNumber, model.getPositionAt(initialStartOffset + openTagLength)
                    .column
                );
            }

            let balance = 1;
            let currentOffset = initialStartOffset + openTagLength;

            const openingTagRegex = new RegExp(`<${tagName}([^>]*)>`, 'gi');
            const closingTagRegex = new RegExp(`<\/${tagName}>`, 'gi');

            openingTagRegex.lastIndex = currentOffset;
            closingTagRegex.lastIndex = currentOffset;

            let nextOpenMatch = openingTagRegex.exec(editorValue);
            let nextCloseMatch = closingTagRegex.exec(editorValue);

            while (balance > 0 && (nextOpenMatch || nextCloseMatch)) {
                if (nextCloseMatch && (!nextOpenMatch || nextCloseMatch.index < nextOpenMatch.index)) {
                    balance--;
                    currentOffset = nextCloseMatch.index + nextCloseMatch[0].length;
                    if (balance === 0) {
                        return new monaco.Range(
                            startPos.lineNumber, startPos.column, model.getPositionAt(currentOffset)
                            .lineNumber, model.getPositionAt(currentOffset)
                            .column
                        );
                    }
                    openingTagRegex.lastIndex = currentOffset;
                    closingTagRegex.lastIndex = currentOffset;
                    nextOpenMatch = openingTagRegex.exec(editorValue);
                    nextCloseMatch = closingTagRegex.exec(editorValue);
                } else if (nextOpenMatch) {
                    balance++;
                    currentOffset = nextOpenMatch.index + nextOpenMatch[0].length;
                    openingTagRegex.lastIndex = currentOffset;
                    closingTagRegex.lastIndex = currentOffset;
                    nextOpenMatch = openingTagRegex.exec(editorValue);
                    nextCloseMatch = closingTagRegex.exec(editorValue);
                } else {
                    break;
                }
            }

            return new monaco.Range(
                startPos.lineNumber, startPos.column, model.getPositionAt(initialStartOffset + openTagLength)
                .lineNumber, model.getPositionAt(initialStartOffset + openTagLength)
                .column
            );
        }

        function updateDecorations() {
            const newDecorations = [];
            const selectedId = idDropdown.value;
            const selectedTag = tagDropdown.value;
            const editorValue = monacoEditorInstance.getModel()
                .getValue();
            const model = monacoEditorInstance.getModel();

            let idBlockRange = null;

            if (selectedId !== 'all') {
                const idAttributeRegex = new RegExp(`<(\\w+)([^>]*id="${selectedId}"[^>]*)>`, 'i');
                const idMatch = idAttributeRegex.exec(editorValue);

                if (idMatch) {
                    const startOffset = idMatch.index;
                    const tagName = idMatch[1];
                    const tagContent = idMatch[2];

                    const isSelfClosing = tagContent.endsWith('/') || ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].includes(tagName.toLowerCase());

                    if (isSelfClosing) {
                        idBlockRange = new monaco.Range(
                            model.getPositionAt(startOffset)
                            .lineNumber, model.getPositionAt(startOffset)
                            .column, model.getPositionAt(startOffset + idMatch[0].length)
                            .lineNumber, model.getPositionAt(startOffset + idMatch[0].length)
                            .column
                        );
                    } else {
                        idBlockRange = findFullElementRange(model, startOffset);
                    }
                }
            }

            if (idBlockRange) {
                newDecorations.push({
                    range: idBlockRange,
                    options: {
                        inlineClassName: 'id-highlight'
                    }
                });
            }

            if (selectedTag !== 'all') {
                let contentToSearchForTags = editorValue;
                let baseOffsetForTags = 0;
                let searchStartOffset = 0;

                if (selectedId !== 'all' && idBlockRange) {
                    searchStartOffset = model.getOffsetAt(new monaco.Position(idBlockRange.startLineNumber, idBlockRange.startColumn));
                    contentToSearchForTags = model.getValueInRange(idBlockRange);
                    baseOffsetForTags = searchStartOffset;
                }

                const tagOpeningRegex = new RegExp(`<${selectedTag}([^>]*)>`, 'gi');
                tagOpeningRegex.lastIndex = searchStartOffset;

                let match;
                while ((match = tagOpeningRegex.exec(editorValue)) !== null) {
                    if (selectedId !== 'all' && idBlockRange) {
                        const matchStartPos = model.getPositionAt(match.index);
                        if (!idBlockRange.containsPosition(matchStartPos)) {
                            if (match.index >= model.getOffsetAt(idBlockRange.getEndPosition())) {
                                break;
                            }
                            continue;
                        }
                    }

                    const currentElementFullRange = findFullElementRange(model, match.index);
                    if (currentElementFullRange) {
                        newDecorations.push({
                            range: currentElementFullRange,
                            options: {
                                inlineClassName: 'tag-highlight'
                            }
                        });
                    }
                }
            }

            if (allMatches.length > 0) {
                if (highlightAllCheckbox.checked) {
                    allMatches.forEach(match => {
                        newDecorations.push({
                            range: match.range,
                            options: {
                                inlineClassName: 'highlight-all-magenta'
                            }
                        });
                    });
                    if (currentMatchIndex !== -1) {
                        newDecorations.push({
                            range: allMatches[currentMatchIndex].range,
                            options: {
                                inlineClassName: 'find-current-match-highlight'
                            }
                        });
                    }
                } else if (currentMatchIndex !== -1) {
                    newDecorations.push({
                        range: allMatches[currentMatchIndex].range,
                        options: {
                            inlineClassName: 'find-highlight'
                        }
                    });
                }

                if (currentMatchIndex !== -1) {
                    monacoEditorInstance.revealRangeInCenterIfOutsideViewport(allMatches[currentMatchIndex].range, 0);
                    const position = allMatches[currentMatchIndex].range.getStartPosition();
                    monacoEditorInstance.setPosition(position);

                    matchCountSpan.innerHTML = `${currentMatchIndex + 1} of ${allMatches.length}${getContextString()}`;
                }
            } else {
                const matchCase = matchCaseCheckbox.checked;
                let statusMessage = "No matches";
                let optionsDescription = [];

                if (findInput.value === '') {
                    matchCountSpan.innerHTML = "";
                    allDecorations = monacoEditorInstance.deltaDecorations(allDecorations, newDecorations);
                    return;
                }

                if (matchCase) {
                    optionsDescription.push("case-sensitive");
                }

                if (optionsDescription.length > 0) {
                    statusMessage = `No ${optionsDescription.join(' ')} matches`;
                }
                matchCountSpan.innerHTML = `${statusMessage}${getContextString()}`;
            }

            allDecorations = monacoEditorInstance.deltaDecorations(allDecorations, newDecorations);
        }

        function resetSearchState(force = false) {
            const newFindText = findInput.value;
            const newSelectedId = idDropdown.value;
            const newSelectedTag = tagDropdown.value;
            const newIsRegex = enableRegexCheckbox.checked;
            const newMatchCase = matchCaseCheckbox.checked;

            const criteriaChanged = (
                newFindText !== currentFindText ||
                newSelectedId !== currentSelectedId ||
                newSelectedTag !== currentSelectedTag ||
                newIsRegex !== currentIsRegex ||
                newMatchCase !== currentMatchCase
            );

            if (force || criteriaChanged) {
                currentFindText = newFindText;
                currentSelectedId = newSelectedId;
                currentSelectedTag = newSelectedTag;
                currentIsRegex = newIsRegex;
                currentMatchCase = newMatchCase;

                allMatches = findMatches();
                currentMatchIndex = -1;

                if (allMatches.length > 0 && newFindText !== '') {
                    currentMatchIndex = 0;
                }
            }

            updateDecorations();
        }

        function processReplacement(originalMatchText, replaceText, isRegex, isSequencing, sequenceCurrentValue) {
            let finalReplacement = replaceText;

            if (isSequencing) {
                if (finalReplacement.includes('{$#+}')) {
                    finalReplacement = finalReplacement.replaceAll('{$#+}', sequenceCurrentValue.toString());
                } else if (finalReplacement.includes('{$#-}')) {
                    finalReplacement = finalReplacement.replaceAll('{$#-}', sequenceCurrentValue.toString());
                }
            }

            if (isRegex) {
                const findText = findInput.value;
                const matchCase = matchCaseCheckbox.checked;
                const pattern = findText;
                const regexForGroups = new RegExp(pattern, matchCase ? '' : 'i');

                const groupMatch = regexForGroups.exec(originalMatchText);

                if (groupMatch) {
                    finalReplacement = finalReplacement.replaceAll('$&', groupMatch[0] || '');
                    for (let i = 1; i < groupMatch.length; i++) {
                        const placeholder = `$${i}`;
                        finalReplacement = finalReplacement.replaceAll(placeholder, groupMatch[i] || '');
                    }
                }
            }
            return finalReplacement;
        }

        findNextButton.addEventListener('click', () => {
            resetSearchState();
            if (allMatches.length > 0) {
                currentMatchIndex = (currentMatchIndex + 1) % allMatches.length;
                updateDecorations();
            } else {}
        });

        findPreviousButton.addEventListener('click', () => {
            resetSearchState();
            if (allMatches.length > 0) {
                currentMatchIndex = (currentMatchIndex - 1 + allMatches.length) % allMatches.length;
                updateDecorations();
            } else {}
        });

        replaceOneButton.addEventListener('click', () => {
            const findText = findInput.value;
            const replaceText = replaceInput.value;
            const isRegex = enableRegexCheckbox.checked;
            const isSequencing = sequenceCheckbox.checked && (replaceText.includes('{$#+}') || replaceText.includes('{$#-}'));
            let startIndex = parseInt(startIndexInput.value, 10);

            if (!findText) {
                updateDecorations();
                return;
            }

            if (isSequencing && isNaN(startIndex)) {
                showMessageBox("Please enter a valid number for 'Start' index when sequencing.", true);
                return;
            }

            if (allMatches.length === 0 || currentMatchIndex === -1 || currentMatchIndex >= allMatches.length) {
                resetSearchState();
                if (allMatches.length === 0) {
                    updateDecorations();
                    return;
                }
            }

            const matchToReplace = allMatches[currentMatchIndex];
            const originalMatchRange = matchToReplace.range;
            const originalMatchText = monacoEditorInstance.getModel()
                .getValueInRange(originalMatchRange);

            const processedReplaceText = processReplacement(
                originalMatchText, replaceText, isRegex, isSequencing, startIndex
            );

            monacoEditorInstance.executeEdits(
                null, [{
                    range: originalMatchRange,
                    text: processedReplaceText,
                    forceMoveMarkers: true
                }]
            );

            if (isSequencing) {
                if (replaceText.includes('{$#+}')) {
                    startIndexInput.value = (startIndex + 1)
                        .toString();
                } else if (replaceText.includes('{$#-}')) {
                    startIndexInput.value = (startIndex - 1)
                        .toString();
                }
            }

            const oldEndPosition = originalMatchRange.getEndPosition();

            resetSearchState(true);

            let newCurrentMatchIndex = -1;

            for (let i = 0; i < allMatches.length; i++) {
                const newMatchRange = allMatches[i].range;
                if (monaco.Position.compare(newMatchRange.getStartPosition(), oldEndPosition) >= 0) {
                    newCurrentMatchIndex = i;
                    break;
                }
            }

            if (newCurrentMatchIndex !== -1) {
                currentMatchIndex = newCurrentMatchIndex;
            } else if (allMatches.length > 0) {
                currentMatchIndex = 0;
            } else {
                currentMatchIndex = -1;
            }

            allDecorations = monacoEditorInstance.deltaDecorations(allDecorations, []);
            updateDecorations();
        });

        idDropdown.addEventListener('change', () => resetSearchState(true));
        tagDropdown.addEventListener('change', () => resetSearchState(true));
        matchCaseCheckbox.addEventListener('change', () => resetSearchState(true));
        highlightAllCheckbox.addEventListener('change', updateDecorations);
        findInput.addEventListener('input', () => resetSearchState(true));

        searchReset.addEventListener('click', () => {
            findInput.value = '';
            replaceInput.value = '';

            tagDropdown.value = 'all';
            idDropdown.value = 'all';

            if (matchCaseCheckbox.checked) {
                matchCaseCheckbox.checked = false;
            }
            if (highlightAllCheckbox.checked) {
                highlightAllCheckbox.checked = false;
            }
            if (enableRegexCheckbox.checked) {
                enableRegexCheckbox.checked = false;
                toggleSequenceVisibility();
                toggleRegexBorder();
            }
            if (sequenceCheckbox.checked) {
                sequenceCheckbox.checked = false;
                sequenceRangeContainer.classList.add('opacity-0', 'pointer-events-none');
            }

            startIndexInput.value = '1';
            endIndexInput.value = '';

            matchCountSpan.innerHTML = '';

            resetSearchState(true);
        });

        replaceAllButton.addEventListener('click', () => {
            const findText = findInput.value;
            const replaceText = replaceInput.value;
            const isRegex = enableRegexCheckbox.checked;
            const matchCase = matchCaseCheckbox.checked;
            const isSequencing = sequenceCheckbox.checked && (replaceText.includes('{$#+}') || replaceText.includes('{$#-}'));

            if (!findText) {
                resetSearchState();
                matchCountSpan.innerHTML = "Enter text to find.";
                return;
            }

            let startIndex = parseInt(startIndexInput.value, 10);
            if (isSequencing && (isNaN(startIndex) || startIndex < 0)) {
                showMessageBox("Please enter a valid non-negative number for 'Start' index when sequencing.", true);
                return;
            }

            let matchesToReplace = findMatches();

            if (matchesToReplace.length === 0) {
                resetSearchState();
                return;
            }

            const edits = [];
            let replacementCount = 0;
            let sequenceCounter = startIndex;

            const endIndex = parseInt(endIndexInput.value, 10);
            const hasEndIndex = isSequencing && !isNaN(endIndex);

            const pattern = isRegex ? findText : escapeRegExp(findText);

            let filteredMatches = matchesToReplace;
            if (hasEndIndex) {
                filteredMatches = matchesToReplace.filter((match, index) => {
                    const currentMatchSequenceValue = sequenceCounter + index;
                    return currentMatchSequenceValue <= endIndex;
                });
            }

            filteredMatches.forEach((match, index) => {
                const effectiveSequenceValue = sequenceCounter + index;

                let finalReplacement = replaceText;

                if (isSequencing) {
                    if (finalReplacement.includes('{$#+}')) {
                        finalReplacement = finalReplacement.replaceAll('{$#+}', effectiveSequenceValue.toString());
                    } else if (finalReplacement.includes('{$#-}')) {
                        finalReplacement = finalReplacement.replaceAll('{$#-}', effectiveSequenceValue.toString());
                    }
                }

                if (isRegex) {
                    const originalMatchText = monacoEditorInstance.getModel()
                        .getValueInRange(match.range);
                    const regexForGroups = new RegExp(pattern, matchCase ? '' : 'i');
                    const groupMatch = regexForGroups.exec(originalMatchText);

                    if (groupMatch) {
                        finalReplacement = finalReplacement.replaceAll('$&', groupMatch[0] || '');

                        for (let i = 1; i < groupMatch.length; i++) {
                            const placeholder = `$${i}`;
                            finalReplacement = finalReplacement.replaceAll(placeholder, groupMatch[i] || '');
                        }
                    }
                }

                edits.push({
                    range: match.range,
                    text: finalReplacement
                });
                replacementCount++;
            });

            if (edits.length === 0) {
                matchCountSpan.innerHTML = "No matches found within the specified sequence range.";
                return;
            }

            monacoEditorInstance.getModel()
                .pushEditOperations(
                    [], edits, () => null
                );

            matchCountSpan.innerHTML = `Replaced ${replacementCount} occurrences.`;
            resetSearchState(true);
        });

        regexGuideButton.addEventListener('click', () => {
            const originalText = regexGuideButton.textContent;
            showRegexGuideModal(regexGuideButton, originalText);
        });
        updateAllInteractiveButtonStates();
    });

    copyCodeBtn.addEventListener('click', async () => {
        const codeContent = monacoEditorInstance ? monacoEditorInstance.getValue() : '';
        try {
            await navigator.clipboard.writeText(codeContent);
            const originalHTML = copyCodeBtn.innerHTML;
            copyCodeBtn.textContent = 'Copied!';
            copyCodeBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            copyCodeBtn.classList.remove('bg-zinc-700', 'hover:bg-zinc-600');
            copyCodeBtn.disabled = true;
            copyCodeBtn.setAttribute('data-temp-active', 'true');
            updateAllInteractiveButtonStates();
            setTimeout(() => {
                copyCodeBtn.innerHTML = originalHTML;
                copyCodeBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                copyCodeBtn.classList.add('bg-zinc-700', 'hover:bg-zinc-600');
                copyCodeBtn.disabled = false;
                copyCodeBtn.removeAttribute('data-temp-active');
                updateAllInteractiveButtonStates();
            }, 1500);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    });

    autoFormatBtn.addEventListener('click', () => {
        if (monacoEditorInstance) {
            let currentContent = monacoEditorInstance.getValue();
            currentContent = protectDataAttributes(currentContent);

            let formattedContent = html_beautify(currentContent, {
                indent_size: 4,
                space_in_paren: true
            });

            formattedContent = restoreDataAttributes(formattedContent);
            formattedContent = convertAllEntitiesToNumeric(formattedContent);
			formattedContent = applyCleanListTypes(formattedContent);
			formattedContent = doAutoEncode(formattedContent);
            monacoEditorInstance.setValue(formattedContent);
            applyEntityHighlighting();

            const originalText = autoFormatBtn.textContent;
            autoFormatBtn.textContent = 'Formatted!';
            autoFormatBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            autoFormatBtn.classList.remove('bg-red-700', 'hover:bg-red-800');
            autoFormatBtn.disabled = true;
            autoFormatBtn.setAttribute('data-temp-active', 'true');
            updateAllInteractiveButtonStates();
            setTimeout(() => {
                autoFormatBtn.textContent = originalText;
                autoFormatBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                autoFormatBtn.classList.add('bg-red-700', 'hover:bg-red-800');
                autoFormatBtn.disabled = false;
                autoFormatBtn.removeAttribute('data-temp-active');
                updateAllInteractiveButtonStates();
            }, 1500);
        }
    });

    autoEncodeBtn.addEventListener('click', () => {
        if (monacoEditorInstance) {
            let currentContent = monacoEditorInstance.getValue();
            let encodedContent = doAutoEncode(currentContent);

            monacoEditorInstance.setValue(encodedContent);
            htmlOutputContent = encodedContent;
            applyEntityHighlighting();

            const originalText = autoEncodeBtn.textContent;
            autoEncodeBtn.textContent = 'Encoded!';
            autoEncodeBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            autoEncodeBtn.classList.remove('bg-red-700', 'hover:bg-red-800');
            autoEncodeBtn.disabled = true;
            autoEncodeBtn.setAttribute('data-temp-active', 'true');
            updateAllInteractiveButtonStates();
            setTimeout(() => {
                autoEncodeBtn.textContent = originalText;
                autoEncodeBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                autoEncodeBtn.classList.add('bg-red-700', 'hover:bg-red-800');
                autoEncodeBtn.disabled = false;
                autoEncodeBtn.removeAttribute('data-temp-active');
                updateAllInteractiveButtonStates();
            }, 1500);
        }
    });

    exportHtmlBtn.addEventListener('click', () => {
        const htmlContent = monacoEditorInstance ? monacoEditorInstance.getValue() : '';
        const blob = new Blob([htmlContent], {
            type: 'text/html'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'index.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        const originalHTML = exportHtmlBtn.innerHTML;
        exportHtmlBtn.textContent = 'Exported!';
        exportHtmlBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        exportHtmlBtn.classList.remove('bg-red-700', 'hover:bg-red-800');
        exportHtmlBtn.disabled = true;
        exportHtmlBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();
        setTimeout(() => {
            exportHtmlBtn.innerHTML = originalHTML;
            exportHtmlBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            exportHtmlBtn.classList.add('bg-red-700', 'hover:bg-red-800');
            exportHtmlBtn.disabled = false;
            exportHtmlBtn.removeAttribute('data-temp-active');
            updateAllInteractiveButtonStates();
        }, 1500);
    });

    importHtmlBtn.addEventListener('click', () => htmlFileInput.click());
    htmlFileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const importedContent = e.target.result;
                if (monacoEditorInstance) {
                    monacoEditorInstance.setValue(importedContent);
                    htmlOutputContent = importedContent;
                    applyEntityHighlighting();
                }
                const originalHTML = importHtmlBtn.innerHTML;
                importHtmlBtn.textContent = 'Imported!';
                importHtmlBtn.classList.add('bg-green-500', 'hover:bg-green-600');
                importHtmlBtn.classList.remove('bg-purple-700', 'hover:bg-purple-800');
                importHtmlBtn.disabled = true;
                importHtmlBtn.setAttribute('data-temp-active', 'true');
                updateAllInteractiveButtonStates();
                setTimeout(() => {
                    importHtmlBtn.innerHTML = originalHTML;
                    importHtmlBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                    importHtmlBtn.classList.add('bg-purple-700', 'hover:bg-purple-800');
                    htmlFileInput.value = null;
                    importHtmlBtn.removeAttribute('data-temp-active');
                    updateAllInteractiveButtonStates();
                }, 1500);
            };
            reader.readAsText(file);
        }
    });

    toggleEditorViewBtnRichText.addEventListener('click', toggleEditorView);
    toggleEditorViewBtnCode.addEventListener('click', toggleEditorView);

    cleanMsoBtn.addEventListener('click', () => {
        if (monacoEditorInstance) {
            let currentContent = monacoEditorInstance.getValue();
            currentContent = protectDataAttributes(currentContent);
            currentContent = unwrapSingleCellTables(currentContent);
            currentContent = applyCleanLists(currentContent);
			currentContent = applyCleanListTypes(currentContent);
            currentContent = applyCleanTablesBasic(currentContent);
            currentContent = applyCleanMsoCode(currentContent);
            currentContent = applyAutoSpacing(currentContent);
            console.log("Cleaned!");
            currentContent = restoreDataAttributes(currentContent);
            currentContent = convertAllEntitiesToNumeric(currentContent);
            monacoEditorInstance.setValue(currentContent);
            htmlOutputContent = currentContent;
            applyEntityHighlighting();
            autoEncodeBtn.click();
            const originalHTML = cleanMsoBtn.innerHTML;
            cleanMsoBtn.innerHTML = '<i class="fa-solid fa-eraser"></i> Cleaned!';
            cleanMsoBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            cleanMsoBtn.classList.remove('bg-blue-700', 'hover:bg-blue-800');
            cleanMsoBtn.disabled = true;
            cleanMsoBtn.setAttribute('data-temp-active', 'true');
            updateAllInteractiveButtonStates();
            setTimeout(() => {
                cleanMsoBtn.innerHTML = originalHTML;
                cleanMsoBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                cleanMsoBtn.classList.add('bg-blue-700', 'hover:bg-blue-800');
                cleanMsoBtn.disabled = false;
                cleanMsoBtn.removeAttribute('data-temp-active');
                updateAllInteractiveButtonStates();
                updateCleanMsoButtonState();
            }, 1500);
        }
    });

    clearAllBtn.addEventListener('click', () => {
        if (monacoEditorInstance) {
            monacoEditorInstance.setValue('');
            htmlOutputContent = '';
            applyEntityHighlighting();
        }
        const originalHTML = clearAllBtn.innerHTML;
        clearAllBtn.textContent = 'Cleared!';
        clearAllBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        clearAllBtn.classList.remove('bg-zinc-700', 'hover:bg-zinc-600');
        clearAllBtn.disabled = true;
        clearAllBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();
        setTimeout(() => {
            clearAllBtn.innerHTML = originalHTML;
            clearAllBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            clearAllBtn.classList.add('bg-zinc-700', 'hover:bg-zinc-600');
            clearAllBtn.disabled = false;
            clearAllBtn.removeAttribute('data-temp-active');
            updateAllInteractiveButtonStates();
        }, 1500);
    });

    const iframeDocument = default_ifr.contentDocument || default_ifr.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(APP_CONFIG.richTextEditorTemplate);
    iframeDocument.close();

    toggleAutoCleanMsoOnSwitchRichText.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        const parentLabel = event.target.closest('.toggle-switch');
        if (isChecked) {
            parentLabel.classList.add('is-checked');
        } else {
            parentLabel.classList.remove('is-checked');
        }
        toggleAutoCleanMsoOnSwitchCode.checked = isChecked;
        toggleAutoCleanMsoOnSwitchCode.closest('.toggle-switch')
            .classList.toggle('is-checked', isChecked);
        console.log(`Auto-Clean MSO on RichText switch is now: ${isChecked ? 'ON' : 'OFF'}`);
        updateGoToHtmlButtonColor();
        updateCleanMsoButtonState();
    });

    toggleAutoCleanMsoOnSwitchCode.addEventListener('change', (event) => {
        const isChecked = event.target.checked;
        const parentLabel = event.target.closest('.toggle-switch');
        if (isChecked) {
            parentLabel.classList.add('is-checked');
            toggleAutoCleanMsoOnSwitchCode.checked = true;
        } else {
            parentLabel.classList.remove('is-checked');
            toggleAutoCleanMsoOnSwitchCode.checked = false;
        }
        toggleAutoCleanMsoOnSwitchRichText.checked = isChecked;
        toggleAutoCleanMsoOnSwitchRichText.closest('.toggle-switch')
            .classList.toggle('is-checked', isChecked);
        console.log(`Auto-Clean MSO on Code switch is now: ${isChecked ? 'ON' : 'OFF'}`);
        updateCleanMsoButtonState();
    });

    quickFormattingToggles.forEach(toggle => {
        if (toggle.id === 'toggleCleanSingleBreaks' || toggle.id === 'toggleCleanFormattingTags' || toggle.id === 'toggleCleanPTables') {
            toggle.checked = false;
            toggle.closest('.toggle-switch')
                .classList.remove('is-checked');
        } else {
            toggle.checked = true;
            toggle.closest('.toggle-switch')
                .classList.add('is-checked');
        }

        toggle.addEventListener('change', (event) => {
            const parentLabel = event.target.closest('.toggle-switch');
            if (event.target.checked) {
                parentLabel.classList.add('is-checked');
            } else {
                parentLabel.classList.remove('is-checked');
            }
            updateFormatButtonState();
        });
    });

    updateFormatButtonState();

    syncMsoTogglesOnLoad();

    formatSelectedBtn.addEventListener('click', async () => {
        console.log("Format button clicked.");
        if (monacoEditorInstance) {
            console.log("Monaco instance is valid.");
            let currentContent = monacoEditorInstance.getValue();
            console.log("Content before processing (length):", currentContent.length);

            currentContent = protectDataAttributes(currentContent);

            currentContent = applyNBSPPlaceholders(currentContent);

            if (toggleCleanSingleBreaks.checked) {
                currentContent = applyCleanSingleBreaks(currentContent);
                console.log("Clean Single Breaks applied. Content length:", currentContent.length);
            }
            if (toggleCleanPTables.checked) {
                currentContent = applyCleanPTagsInTables(currentContent);
                console.log("Clean <p> in Tables applied. Content length:", currentContent.length);
            }
            if (toggleCleanSpaces.checked) {
                currentContent = applyAutoSpacing(currentContent);
                console.log("Clean Spaces applied. Content length:", currentContent.length);
            }
            if (toggleCleanUrls.checked) {
                currentContent = applyUrlCleaning(currentContent);
                console.log("Clean URLs applied. Content length:", currentContent.length);
            }
            if (toggleCleanFormattingTags.checked) {
                currentContent = applyCleanFormattingTags(currentContent);
                console.log("Clean <U> | <B> | <I> applied. Content length:", currentContent.length);
            }
            if (toggleAutoLevelHeadings.checked) {
                currentContent = applyAutoLevelHeadings(currentContent);
                console.log("Auto-Level Headings applied. Content length:", currentContent.length);
            }
            if (toggleAutoSection.checked) {
                currentContent = applyAutoSectioning(currentContent);
                console.log("Auto-Section applied. Content length:", currentContent.length);
            }
            if (toggleTimeTags.checked) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(currentContent, 'text/html');
                const body = doc.body;

                body.querySelectorAll('time')
                    .forEach(timeEl => {
                        const parent = timeEl.parentNode;
                        if (parent) {
                            while (timeEl.firstChild) {
                                parent.insertBefore(timeEl.firstChild, timeEl);
                            }
                            parent.removeChild(timeEl);
                        }
                    });

                const walker = doc.createTreeWalker(
                    body, NodeFilter.SHOW_TEXT, {
                        acceptNode: function(node) {
                            const parentTag = node.parentNode.tagName.toLowerCase();
                            if (['script', 'style', 'time'].includes(parentTag)) {
                                return NodeFilter.FILTER_REJECT;
                            }
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }, false
                );

                const textNodes = [];
                let currentNode;
                while (currentNode = walker.nextNode()) {
                    textNodes.push(currentNode);
                }

                const monthMap = {
                    'january': '01',
                    'jan': '01',
                    'janvier': '01',
                    'february': '02',
                    'feb': '02',
                    'février': '02',
                    'march': '03',
                    'mar': '03',
                    'mars': '03',
                    'april': '04',
                    'apr': '04',
                    'avril': '04',
                    'may': '05',
                    'mai': '05',
                    'june': '06',
                    'jun': '06',
                    'juin': '06',
                    'july': '07',
                    'jul': '07',
                    'juillet': '07',
                    'august': '08',
                    'aug': '08',
                    'août': '08',
                    'september': '09',
                    'sep': '09',
                    'septembre': '09',
                    'october': '10',
                    'oct': '10',
                    'octobre': '10',
                    'november': '11',
                    'nov': '11',
                    'novembre': '11',
                    'december': '12',
                    'dec': '12',
                    'décembre': '12'
                };

                function getMonthNumber(monthName) {
                    return monthMap[monthName.toLowerCase()] || null;
                }

                const sortedMonthKeys = Object.keys(monthMap)
                    .sort((a, b) => b.length - a.length);
                const monthPattern = sortedMonthKeys.map(m => m.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'))
                    .join('|');
                const spaceOrNBSPChar = `(?:\\s|${NBSP_PLACEHOLDER})+`;
                const daySuffixPattern = '(?:<sup>er<\\/sup>|<sup>st<\\/sup>|<sup>nd<\\/sup>|<sup>rd<\\/sup>|<sup>th<\\/sup>|er|st|nd|rd|th)?';

                const regexIsoDateFull = /(?<!\d)(\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01]))(?!\d)/g;
                const regexMonthDayYear = new RegExp(`(?<!\\d)\\b(${monthPattern})\\b${spaceOrNBSPChar}(\\d{1,2}${daySuffixPattern})\\s*,?${spaceOrNBSPChar}(\\d{4})(?!\\d)`, 'gi');
                const regexDayMonthYear = new RegExp(`(?<!\\d)(?:(?:le|the)${spaceOrNBSPChar})?(\\d{1,2}${daySuffixPattern})${spaceOrNBSPChar}\\b(${monthPattern})\\b\\s*,?${spaceOrNBSPChar}(\\d{4})(?!\\d)`, 'gi');
                const regexMonthYear = new RegExp(`(?<!\\d)\\b(${monthPattern})\\b${spaceOrNBSPChar}(\\d{4})(?!\\d|(?:${spaceOrNBSPChar}\\d{1,2}))`, 'gi');
                const regexMonthDayNoYear = new RegExp(`(?<!\\d)\\b(${monthPattern})\\b${spaceOrNBSPChar}(\\d{1,2}${daySuffixPattern})(?!\\d|(?:${spaceOrNBSPChar}\\d{4}))(?!-)`, 'gi');
                const regexDayMonthNoYear = new RegExp(`(?<!\\d)(?:(?:le|the)${spaceOrNBSPChar})?(\\d{1,2}${daySuffixPattern})${spaceOrNBSPChar}\\b(${monthPattern})\\b(?!\d|(?:${spaceOrNBSPChar}\\d{4}))(?!-)`, 'gi');

                const patternsToTest = [{
                    name: 'IsoDateFull',
                    regex: regexIsoDateFull,
                    handler: (match) => match[1],
                    priority: 3
                }, {
                    name: 'MonthDayYear',
                    regex: regexMonthDayYear,
                    handler: (match) => {
                        const [, month, dayPart, year] = match;
                        const monthNum = getMonthNumber(month);
                        let cleanDay = dayPart.replace(/(?:<sup>er<\/sup>|<sup>st<\/sup>|<sup>nd<\/sup>|<sup>rd<\/sup>|<sup>th<\/sup>|er|st|nd|rd|th)/gi, '')
                            .trim();
                        const parsedDay = parseInt(cleanDay);
                        if (!monthNum || isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) return null;
                        return `${year}-${monthNum}-${String(parsedDay).padStart(2, '0')}`;
                    },
                    priority: 2
                }, {
                    name: 'DayMonthYear',
                    regex: regexDayMonthYear,
                    handler: (match) => {
                        const [, dayPart, month, year] = match;
                        const monthNum = getMonthNumber(month);
                        let cleanDay = dayPart.replace(/(?:<sup>er<\/sup>|<sup>st<\/sup>|<sup>nd<\/sup>|<sup>rd<\/sup>|<sup>th<\/sup>|er|st|nd|rd|th)/gi, '')
                            .trim();
                        const parsedDay = parseInt(cleanDay);
                        if (!monthNum || isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) return null;
                        return `${year}-${monthNum}-${String(parsedDay).padStart(2, '0')}`;
                    },
                    priority: 2
                }, {
                    name: 'MonthYear',
                    regex: regexMonthYear,
                    handler: (match) => {
                        const [, month, year] = match;
                        const monthNum = getMonthNumber(month);
                        if (!monthNum) return null;
                        return `${year}-${monthNum}`;
                    },
                    priority: 2
                }, {
                    name: 'MonthDayNoYear',
                    regex: regexMonthDayNoYear,
                    handler: (match) => {
                        const [, month, dayPart] = match;
                        const monthNum = getMonthNumber(month);
                        let cleanDay = dayPart.replace(/(?:<sup>er<\/sup>|<sup>st<\/sup>|<sup>nd<\/sup>|<sup>rd<\/sup>|<sup>th<\/sup>|er|st|nd|rd|th)/gi, '')
                            .trim();
                        const parsedDay = parseInt(cleanDay);
                        if (!monthNum || isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) return null;
                        return `${monthNum}-${String(parsedDay).padStart(2, '0')}`;
                    },
                    priority: 1
                }, {
                    name: 'DayMonthNoYear',
                    regex: regexDayMonthNoYear,
                    handler: (match) => {
                        const [, dayPart, month] = match;
                        const monthNum = getMonthNumber(month);
                        let cleanDay = dayPart.replace(/(?:<sup>er<\/sup>|<sup>st<\/sup>|<sup>nd<\/sup>|<sup>rd<\/sup>|<sup>th<\/sup>|er|st|nd|rd|th)/gi, '')
                            .trim();
                        const parsedDay = parseInt(cleanDay);
                        if (!monthNum || isNaN(parsedDay) || parsedDay < 1 || parsedDay > 31) return null;
                        return `${monthNum}-${String(parsedDay).padStart(2, '0')}`;
                    },
                    priority: 1
                }];

                for (let i = textNodes.length - 1; i >= 0; i--) {
                    const node = textNodes[i];
                    const text = node.nodeValue;

                    let allMatchesInNode = [];
                    patternsToTest.forEach(pattern => {
                        let localRegex = new RegExp(pattern.regex.source, 'gi');
                        let match;
                        while ((match = localRegex.exec(text)) !== null) {
                            const datetimeValue = pattern.handler(match);
                            if (datetimeValue) {
                                allMatchesInNode.push({
                                    start: match.index,
                                    end: match.index + match[0].length,
                                    original: match[0],
                                    datetime: datetimeValue,
                                    priority: pattern.priority
                                });
                            }
                        }
                    });

                    if (allMatchesInNode.length === 0) continue;

                    allMatchesInNode.sort((a, b) => {
                        if (a.start !== b.start) return a.start - b.start;
                        if (a.original.length !== b.original.length) return b.original.length - a.original.length;
                        return b.priority - a.priority;
                    });

                    let nonOverlappingMatches = [];
                    if (allMatchesInNode.length > 0) {
                        nonOverlappingMatches.push(allMatchesInNode[0]);
                        for (let j = 1; j < allMatchesInNode.length; j++) {
                            const currentMatch = allMatchesInNode[j];
                            const lastAddedMatch = nonOverlappingMatches[nonOverlappingMatches.length - 1];
                            if (currentMatch.start >= lastAddedMatch.end) {
                                nonOverlappingMatches.push(currentMatch);
                            }
                        }
                    }

                    if (nonOverlappingMatches.length > 0) {
                        const parent = node.parentNode;
                        const fragment = doc.createDocumentFragment();
                        let lastIndex = 0;

                        nonOverlappingMatches.forEach(match => {
                            if (match.start > lastIndex) {
                                fragment.appendChild(doc.createTextNode(text.substring(lastIndex, match.start)));
                            }
                            const timeEl = doc.createElement('time');
                            timeEl.className = 'nowrap';
                            timeEl.setAttribute('datetime', match.datetime);

                            const tempDiv = doc.createElement('div');
                            tempDiv.innerHTML = match.original;
                            while (tempDiv.firstChild) {
                                timeEl.appendChild(tempDiv.firstChild);
                            }
                            fragment.appendChild(timeEl);

                            lastIndex = match.end;
                        });

                        if (lastIndex < text.length) {
                            fragment.appendChild(doc.createTextNode(text.substring(lastIndex)));
                        }

                        if (parent) {
                            parent.replaceChild(fragment, node);
                        }
                    }
                }

                currentContent = body.innerHTML;
                console.log("Time Tags applied using DOM walker. Content length:", currentContent.length);

            }




            currentContent = revertNBSPPlaceholders(currentContent);
            currentContent = restoreDataAttributes(currentContent);
            currentContent = doAutoEncode(currentContent);
            console.log("Auto-Encode applied. Content length:", currentContent.length);


            monacoEditorInstance.setValue(currentContent);
            htmlOutputContent = currentContent;
            applyEntityHighlighting();

            const originalText = formatSelectedBtn.textContent;
            formatSelectedBtn.textContent = 'Formatted!';
            formatSelectedBtn.classList.add('bg-green-500', 'hover:bg-green-600');
            formatSelectedBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
            formatSelectedBtn.disabled = true;
            formatSelectedBtn.setAttribute('data-temp-active', 'true');
            updateAllInteractiveButtonStates();
            setTimeout(() => {
                formatSelectedBtn.textContent = originalText;
                formatSelectedBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
                formatSelectedBtn.classList.add('bg-blue-600', 'hover:bg-blue-700');
                formatSelectedBtn.disabled = false;
                formatSelectedBtn.removeAttribute('data-temp-active');
                updateAllInteractiveButtonStates();
            }, 1500);
        } else {
            console.error("Monaco editor instance is not available.");
        }
    });

    autoIdBtn.addEventListener('click', () => {
        const originalText = autoIdBtn.textContent;
        autoIdBtn.textContent = 'Opening...';
        autoIdBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        autoIdBtn.classList.remove('bg-slate-600', 'hover:bg-slate-500');
        autoIdBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();
        showAutoIdModal(autoIdBtn, originalText);
    });

    colophonBtn.addEventListener('click', () => {
        const originalText = colophonBtn.textContent;
        colophonBtn.textContent = 'Opening...';
        colophonBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        colophonBtn.classList.remove('bg-slate-600', 'hover:bg-slate-500');
        colophonBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();

        const colophonHtmlContent = `
                    <div class="flex flex-col space-y-4">
                        <div>
                            <span class="text-sm font-medium text-CBD5E1 mr-2">Language:</span> 
                            <div class="button-group inline-flex">
                                <button id="langEnglishBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">English</button>
                                <button id="langFrenchBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">French</button>
                            </div>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-CBD5E1 mr-2">Monarch:</span>
                            <div class="button-group inline-flex">
                                <button id="monarchKingBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">King</button>
                                <button id="monarchQueenBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">Queen</button>
                            </div>
                        </div>
                        <div>
                            <span class="text-sm font-medium text-CBD5E1 mr-2">Identifier Type:</span>
                            <div class="button-group inline-flex">
                                <button id="idISBNBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">ISBN</button>
                                <button id="idISSNBtn" class="px-3 py-1 text-sm bg-gray-600 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 font-bold">ISSN</button>
                            </div>
                        </div>
                        <div>
                            <label for="colophonYear" class="block text-sm font-medium text-gray-200">Year (optional, defaults to current year):</label>
                            <input type="number" id="colophonYear" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 2024" min="1900" max="2100">
                        </div>
                        <div>
                            <label for="colophonNumber" class="block text-sm font-medium text-gray-200">Identifier Number (optional, defaults to ###):</label>
                            <input type="text" id="colophonNumber" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 123-456-789-X">
                        </div>
                    </div>
                `;
        showModal('Insert Colophon', colophonHtmlContent, colophonBtn, originalText);
    });


    defListBtn.addEventListener('click', () => {
        if (!monacoEditorInstance) return;

        const originalText = defListBtn.textContent;
        const htmlString = monacoEditorInstance.getValue();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const body = doc.body;

        const allDls = Array.from(body.querySelectorAll('dl'))
            .filter(dl => !dl.closest('table') && !dl.closest('aside'));

        if (allDls.length === 0) {
            defListBtn.textContent = 'ERROR: Insert <dl> tag first!';
            defListBtn.classList.add('bg-red-500', 'hover:bg-red-600');
            defListBtn.classList.remove('bg-slate-600', 'hover:bg-slate-500');
            defListBtn.disabled = true;
            setTimeout(() => {
                defListBtn.textContent = originalText;
                defListBtn.classList.remove('bg-red-500', 'hover:bg-red-600');
                defListBtn.classList.add('bg-slate-600', 'hover:bg-slate-500');
                defListBtn.disabled = false;
            }, 2500);
            return;
        }

        const unformattedDls = allDls.filter(dl => dl.querySelector(':scope > p, :scope > h1, :scope > h2, :scope > h3, :scope > h4, :scope > h5, :scope > h6'));

        if (unformattedDls.length === 0) {
            defListBtn.textContent = 'Already formatted!';
            defListBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
            defListBtn.classList.remove('bg-slate-600', 'hover:bg-slate-500');
            defListBtn.disabled = true;
            setTimeout(() => {
                defListBtn.textContent = originalText;
                defListBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
                defListBtn.classList.add('bg-slate-600', 'hover:bg-slate-500');
                defListBtn.disabled = false;
            }, 2000);
            return;
        }

        defListBtn.textContent = 'Formatting...';
        defListBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        defListBtn.classList.remove('bg-slate-600', 'hover:bg-slate-500');
        defListBtn.disabled = true;
        defListBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();

        try {
            unformattedDls.forEach(dl => {
                const newChildren = [];
                let currentDdNodes = [];

                const flushDdContent = () => {
                    if (currentDdNodes.length > 0) {
                        const dd = doc.createElement('dd');
                        currentDdNodes.forEach(node => dd.appendChild(node));
                        newChildren.push(dd);
                        currentDdNodes = [];
                    }
                };

                const originalChildren = Array.from(dl.childNodes);

                originalChildren.forEach(node => {
                    let isDtPattern = false;

                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const tagName = node.tagName.toLowerCase();
                        if (/^h[1-6]$/.test(tagName)) {
                            isDtPattern = true;
                        } else if (tagName === 'p') {
                            const significantChildren = Array.from(node.childNodes)
                                .filter(n =>
                                    n.nodeType === Node.ELEMENT_NODE || (n.nodeType === Node.TEXT_NODE && n.textContent.trim() !== '')
                                );
                            if (significantChildren.length === 1 && significantChildren[0].tagName?.toLowerCase() === 'strong') {
                                isDtPattern = true;
                            }
                        }
                    }

                    if (isDtPattern) {
                        flushDdContent();
                        const dt = doc.createElement('dt');
                        let contentSourceNode = node;
                        if (node.tagName.toLowerCase() === 'p') {
                            contentSourceNode = node.querySelector('strong');
                        }
                        while (contentSourceNode.firstChild) {
                            dt.appendChild(contentSourceNode.firstChild);
                        }
                        newChildren.push(dt);
                    } else {
                        if (node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')) {
                            currentDdNodes.push(node);
                        }
                    }
                });

                flushDdContent();
                dl.innerHTML = '';
                newChildren.forEach(newNode => dl.appendChild(newNode));
            });

            body.querySelectorAll('dd')
                .forEach(dd => {
                    const significantChildren = Array.from(dd.childNodes)
                        .filter(node =>
                            node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && node.textContent.trim() !== '')
                        );
                    if (significantChildren.length === 1 && significantChildren[0].nodeType === Node.ELEMENT_NODE && significantChildren[0].tagName.toLowerCase() === 'p') {
                        const p = significantChildren[0];
                        while (p.firstChild) {
                            dd.appendChild(p.firstChild);
                        }
                        dd.removeChild(p);
                    }
                });

            const rawUpdatedHtml = body.innerHTML;
            const formattedHtml = html_beautify(rawUpdatedHtml, {
                indent_size: 4,
                extra_liners: ['dl', 'dt', 'dd', 'p', 'ul', 'ol', 'li']
            });

            monacoEditorInstance.setValue(formattedHtml);
            defListBtn.textContent = 'Formatted!';

        } catch (error) {
            console.error("Error formatting definition lists:", error);
            defListBtn.textContent = 'Error!';
            defListBtn.classList.remove('bg-green-500', 'hover:bg-green-600');
            defListBtn.classList.add('bg-red-500', 'hover:bg-red-600');
        }

        setTimeout(() => {
            defListBtn.textContent = originalText;
            defListBtn.classList.remove('bg-green-500', 'hover:bg-green-600', 'bg-red-500', 'hover:bg-red-600');
            defListBtn.classList.add('bg-slate-600', 'hover:bg-slate-500');
            defListBtn.disabled = false;
            defListBtn.removeAttribute('data-temp-active');
            updateAllInteractiveButtonStates();
        }, 1500);
    });
    footnoteListBtn.addEventListener('click', () => {
        const originalText = footnoteListBtn.textContent;
        footnoteListBtn.textContent = 'Opening...';
        footnoteListBtn.classList.add('bg-green-500', 'hover:bg-green-600');
        footnoteListBtn.classList.remove('bg-slate-600', 'hover:bg-slate-500');
        footnoteListBtn.setAttribute('data-temp-active', 'true');
        updateAllInteractiveButtonStates();
        showFootnoteModal(footnoteListBtn, originalText);
    });

    function generateUniqueId(baseText, existingIds) {
        let id = baseText.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/^-+|-+$/g, '');

        if (!id) {
            id = 'auto-id';
        }

        let counter = 1;
        let uniqueId = id;
        while (existingIds.has(uniqueId)) {
            uniqueId = `${id}-${counter}`;
            counter++;
        }
        existingIds.add(uniqueId);
        return uniqueId;
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function collectExistingListClasses(listElement, liClassMap, aClassMap) {
        Array.from(listElement.children)
            .forEach(child => {
                if (child.tagName.toLowerCase() === 'li') {
                    const li = child;
                    const a = li.querySelector('a');
                    const hrefTargetId = a ? a.getAttribute('href')
                        ?.substring(1) : null;

                    if (hrefTargetId) {
                        if (li.className) {
                            liClassMap.set(hrefTargetId, li.className);
                        }
                        if (a && a.className) {
                            aClassMap.set(hrefTargetId, a.className);
                        }
                    }

                    Array.from(li.children)
                        .forEach(liChild => {
                            if (liChild.tagName.toLowerCase() === 'ul' || liChild.tagName.toLowerCase() === 'ol') {
                                collectExistingListClasses(liChild, liClassMap, aClassMap);
                            }
                        });
                }
            });
    }
	
	
function showTocIdModal(tocFunction, maxLevel, lang) {
    const html = monacoEditorInstance.getValue();
    const parser = new DOMParser().parseFromString(html, 'text/html');

    // --- Fix: Only check headings up to the specified maxLevel ---
    let headingSelector = 'h1';
    for (let i = 2; i <= maxLevel; i++) {
        headingSelector += `, h${i}`;
    }
    
    // Check relevant headings for IDs, excluding the fixed page title ID 'wb-cont'
    const headings = parser.body.querySelectorAll(headingSelector);
    // ---------------------------------------------------------------

    let missingIdCount = 0;
    headings.forEach(h => {
        if (!h.id || h.id.trim() === '' || h.id === 'wb-cont') {
            missingIdCount++;
        }
    });

    if (missingIdCount === 0) {
        // No missing IDs, proceed directly
        tocFunction(maxLevel, lang);
        return;
    }
    
    // --- Helper function for "Auto-set heading ID's" ---
    function applySequentialHeadingIds(htmlString, maxLevel) { // Accept maxLevel
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const body = doc.body;

    const idChangeMap = {};

    function toAlpha(num) {
        let s = '';
        while (num > 0) {
            let t = (num - 1) % 26;
            s = String.fromCharCode(65 + t) + s;
            num = Math.floor((num - t) / 26);
        }
        return s || 'A';
    }

    function getLetterFromAppendixText(text) {
        const match = text.match(/^(?:Appendix|Annexe)\s*([A-Z])?/i);
        return (match && match[1]) ? match[1].toUpperCase() : null;
    }

    const existingIds = new Set();
    doc.querySelectorAll('[id]').forEach(el => existingIds.add(el.id));

    let h2_num_counter = 0;
    let h2_general_alpha_counter = 0;
    let h2_appendix_alpha_counter = 0;
    let sub_num_counters = new Map();
    let sub_appendix_alpha_counters = new Map();

    const lastSeenHeadingIds = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '' };

    let hasAnyNumberedH2 = Array.from(body.querySelectorAll('h2')).some(h => h.textContent.trim().match(/^\s*(\d+)(?:\.|\s|\)|\-)?/));
    
    // Iterate over all headings to correctly track parent IDs for nesting
    doc.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
        const level = parseInt(heading.tagName.substring(1), 10);
        const text = heading.textContent.trim();
        const oldId = heading.id;
        let newId = oldId;

        if (level === 2) {
            const lowerCaseText = text.toLowerCase();
            if (oldId === 'toc' || lowerCaseText === 'on this page' || lowerCaseText === 'sur cette page') {
                heading.setAttribute('id', 'toc');
                lastSeenHeadingIds[level] = 'toc';
                for (let resetLevel = level + 1; resetLevel <= 6; resetLevel++) {
                    lastSeenHeadingIds[resetLevel] = '';
                }
                return;
            }
        }

        const ignoredParents = ['aside', 'caption', 'figure', 'figcaption', 'table'];
        if (heading.closest(ignoredParents.join(','))) {
            if (oldId) lastSeenHeadingIds[level] = oldId;
            return;
        }

        if (level === 1) {
            if (oldId) lastSeenHeadingIds[level] = oldId;
            return;
        }

        let id_segment = '';
        const isNumericHeading = text.match(/^\s*(\d+)(?:\.|\s|\)|\-)?/);
        const isAppendixHeading = text.match(/^(?:Appendix|Annexe)/i);

        if (level === 2) {
            if (isAppendixHeading) {
                const letter = getLetterFromAppendixText(text) || toAlpha(++h2_appendix_alpha_counter);
                id_segment = `app${letter}`;
            } else if (hasAnyNumberedH2) {
                id_segment = isNumericHeading ? `toc${++h2_num_counter}` : `toc${toAlpha(++h2_general_alpha_counter)}`;
            } else {
                id_segment = `toc${++h2_num_counter}`;
            }
            newId = id_segment;

        } else {
            const parent_id = lastSeenHeadingIds[level - 1];
            if (!parent_id) {
                 // Can't create a child ID without a parent ID, but still need to reset deeper levels
                 lastSeenHeadingIds[level] = ''; // Ensure this level doesn't act as a parent
                 for (let resetLevel = level + 1; resetLevel <= 6; resetLevel++) {
                     lastSeenHeadingIds[resetLevel] = '';
                 }
                return;
            }
            if (isAppendixHeading) {
                const currentAppCount = (sub_appendix_alpha_counters.get(parent_id) || 0) + 1;
                sub_appendix_alpha_counters.set(parent_id, currentAppCount);
                id_segment = `app${getLetterFromAppendixText(text) || toAlpha(currentAppCount)}`;
            } else {
                const currentNumCount = (sub_num_counters.get(parent_id) || 0) + 1;
                sub_num_counters.set(parent_id, currentNumCount);
                id_segment = String(currentNumCount);
            }
            newId = `${parent_id}-${id_segment}`;
        }

        lastSeenHeadingIds[level] = newId;

        for (let resetLevel = level + 1; resetLevel <= 6; resetLevel++) {
            lastSeenHeadingIds[resetLevel] = '';
        }
        
        // *** FIX: Only apply the new ID if the heading is within the maxLevel ***
        if (level <= maxLevel) {
            if (oldId && oldId !== newId) {
                idChangeMap[oldId] = newId;
            }
            heading.setAttribute('id', newId);
            existingIds.add(newId);
        }
    });

    doc.querySelectorAll('a[href^="#"]').forEach(link => {
        const currentAnchor = link.getAttribute('href').substring(1);
        if (idChangeMap[currentAnchor]) {
            link.setAttribute('href', `#${idChangeMap[currentAnchor]}`);
        }
    });

    return body.innerHTML;
}
    // ---------------------------------------------------

    const modalContentHtml = `
        <p class="mb-4"><strong>One or more headings do not have an ID to generate an anchor (<code>toc#</code>). Before continuing, choose one of the following to properly create the page/section ToC:</strong></p>
    `;

    // --- Modal Creation (Tailwind CSS classes are assumed to be available) ---
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modalOverlay.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
            <h3 class="text-xl font-bold mb-4 text-white"><i class="fa-solid fa-triangle-exclamation text-yellow-500"></i> Caution: Missing Heading IDs</h3>
            <div id="modalBody" class="text-gray-200">${modalContentHtml}</div>
            <div class="flex flex-col space-y-2 mt-6">
                <button id="modalAutoSetTocIdBtn" class="px-4 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-150">(Recommended) Auto-set "toc#" heading ID's</button>
                <button id="modalContinueTocIdBtn" class="px-4 py-3 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 transition duration-150">(Not recommended) Generate from heading text</button>
                <button id="modalCancelTocIdBtn" class="px-4 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 transition duration-150">Cancel</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    const closeModal = () => modalOverlay.remove();

    document.getElementById('modalCancelTocIdBtn').addEventListener('click', closeModal);

    document.getElementById('modalContinueTocIdBtn').addEventListener('click', () => {
        closeModal();
        // The existing ToC functions have a fallback to generate temporary IDs.
        tocFunction(maxLevel, lang); 
    });

    document.getElementById('modalAutoSetTocIdBtn').addEventListener('click', () => {
        closeModal();
        
        let htmlContent = monacoEditorInstance.getValue();
        htmlContent = applySequentialHeadingIds(htmlContent, maxLevel);
        monacoEditorInstance.setValue(htmlContent);

        // Run the original ToC function on the now-ID'd content
        tocFunction(maxLevel, lang);

        // Apply formatting as is done after ToC insertion in the existing code
        autoFormatBtn.click(); 
    });
}

    function insertPageToc(maxLevel, lang) {
        const html = monacoEditorInstance.getValue();
        const doc = new DOMParser()
            .parseFromString(html, 'text/html');

        // --- Fix: Removed proactive ID generation ---
        // ID generation is now handled by the modal or as a fallback below.

        let pageTocSectionClass = '';
        let pageTocH2Class = '';
        let pageTocUlClass = '';
        let initialListTagName = 'ul';
        const pageTocLiClassMap = new Map();
        const pageTocALinkClassMap = new Map();

        let oldToc = doc.getElementById('page-nav');
        if (oldToc) {
            pageTocSectionClass = oldToc.getAttribute('class') || '';
            const existingH2 = oldToc.querySelector('h2');
            if (existingH2) {
                pageTocH2Class = existingH2.getAttribute('class') || '';
            }
            const existingUlOrOl = oldToc.querySelector('ul, ol');
            if (existingUlOrOl) {
                pageTocUlClass = existingUlOrOl.getAttribute('class') || '';
                initialListTagName = existingUlOrOl.tagName.toLowerCase();
                collectExistingListClasses(existingUlOrOl, pageTocLiClassMap, pageTocALinkClassMap);
            }
            oldToc.remove();
        } else {
            const existingH2ByContent = Array.from(doc.querySelectorAll('h2'))
                .find(h =>
                    h.textContent.trim()
                    .toLowerCase() === 'on this page' || h.textContent.trim()
                    .toLowerCase() === 'sur cette page'
                );
            if (existingH2ByContent && existingH2ByContent.parentNode && existingH2ByContent.parentNode.tagName.toLowerCase() === 'section') {
                const potentialOldTocSection = existingH2ByContent.parentNode;
                pageTocSectionClass = potentialOldTocSection.getAttribute('class') || '';
                pageTocH2Class = existingH2ByContent.getAttribute('class') || '';
                const existingUlOrOl = potentialOldTocSection.querySelector('ul, ol');
                if (existingUlOrOl) {
                    pageTocUlClass = existingUlOrOl.getAttribute('class') || '';
                    initialListTagName = existingUlOrOl.tagName.toLowerCase();
                    collectExistingListClasses(existingUlOrOl, pageTocLiClassMap, pageTocALinkClassMap);
                }
                potentialOldTocSection.remove();
            }
        }

        const relevantHeadings = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'))
            .filter(h => {
                return parseInt(h.tagName.substring(1), 10) <= maxLevel && !h.closest('aside') && !h.closest('table');
            });

        if (!relevantHeadings.length) return;


        const rootUl = doc.createElement(initialListTagName);
        if (pageTocUlClass) rootUl.setAttribute('class', pageTocUlClass);

        let currentListStack = [{
            domElement: rootUl,
            level: 2,
            tagName: initialListTagName
        }];
        let currentListDomElement = rootUl;

        // --- Fix: Add fallback ID generation (for "Generate from text" option) ---
        const existingIds = new Set(Array.from(doc.querySelectorAll('[id]')).map(el => el.id));
        // -------------------------------------------------------------------

        relevantHeadings.forEach(h => {
            const hLevel = parseInt(h.tagName.substring(1), 10);
            const txt = h.innerHTML.trim();
            
            // --- Fix: Fallback ID logic ---
            let id = h.id; // Get the ID
            if (!id || id.trim() === '') {
                // This is the fallback logic for "Generate from heading text"
                id = generateUniqueId(h.textContent || `heading-${h.tagName.toLowerCase()}`, existingIds);
                h.id = id; // Set it in the doc for this pass
                existingIds.add(id); // Add to set to prevent future collisions
            }
            // -----------------------------
            
            const liClass = pageTocLiClassMap.get(id) || '';
            const aClass = pageTocALinkClassMap.get(id) || '';

            const li = doc.createElement('li');
            if (liClass) li.setAttribute('class', liClass);
            const a = doc.createElement('a');
            a.setAttribute('href', `#${id}`);
            a.innerHTML = txt;
            if (aClass) a.setAttribute('class', aClass);
            li.appendChild(a);

            while (currentListStack.length > 1 && hLevel < currentListStack[currentListStack.length - 1].level) {
                currentListStack.pop();
            }
            currentListDomElement = currentListStack[currentListStack.length - 1].domElement;

            if (hLevel > currentListStack[currentListStack.length - 1].level) {
                const parentLiElement = currentListDomElement.lastElementChild;

                if (parentLiElement && parentLiElement.tagName.toLowerCase() === 'li') {
                    const newNestedListDomElement = doc.createElement(initialListTagName);
                    parentLiElement.appendChild(newNestedListDomElement);

                    currentListStack.push({
                        domElement: newNestedListDomElement,
                        level: hLevel,
                        tagName: initialListTagName
                    });
                    currentListDomElement = newNestedListDomElement;
                } else {
                    console.warn(`H${hLevel} (${txt}) found with no valid parent LI to nest under. Appending to current UL.`);
                }
            }

            currentListDomElement.appendChild(li);
        });

        const finalHtmlListContent = rootUl.outerHTML;

        const tocTitle = lang === 'en' ? 'On this page' : 'Sur cette page';
        const toc = `
    <section id="page-nav"${pageTocSectionClass ? ` class="${pageTocSectionClass}"` : ''}>
        <h2 id="toc"${pageTocH2Class ? ` class="${pageTocH2Class}"` : ''}>${tocTitle}</h2>
        ${finalHtmlListContent}
    </section>`;

        const firstSection = doc.querySelector('section');
        if (firstSection) {
            firstSection.insertAdjacentHTML('beforebegin', toc);
        } else {
            doc.body.insertAdjacentHTML('afterbegin', toc);
        }

        monacoEditorInstance.setValue(doc.body.innerHTML);
        autoFormatBtn.click();
    }

    document.getElementById('enPageToCBtn')
    .addEventListener('click', () => showTocIdModal(insertPageToc, 2, 'en'));
document.getElementById('frPageToCBtn')
    .addEventListener('click', () => showTocIdModal(insertPageToc, 2, 'fr'));
document.getElementById('enPageToCH3Btn')
    .addEventListener('click', () => showTocIdModal(insertPageToc, 3, 'en'));
document.getElementById('frPageToCH3Btn')
    .addEventListener('click', () => showTocIdModal(insertPageToc, 3, 'fr'));

// Section ToC Buttons
document.getElementById('enSecToCBtn')
    .addEventListener('click', () => showTocIdModal(insertSectionToc, 4, 'en'));
document.getElementById('enSecToCH4Btn')
    .addEventListener('click', () => showTocIdModal(insertSectionToc, 4, 'en'));
document.getElementById('enSecToCH5Btn')
    .addEventListener('click', () => showTocIdModal(insertSectionToc, 5, 'en'));
document.getElementById('enSecToCH6Btn')
    .addEventListener('click', () => showTocIdModal(insertSectionToc, 6, 'en'));
document.getElementById('frSecToCBtn')
    .addEventListener('click', () => showTocIdModal(insertSectionToc, 4, 'fr'));
document.getElementById('frSecToCH4Btn')
    .addEventListener('click', () => showTocIdModal(insertSectionToc, 4, 'fr'));
document.getElementById('frSecToCH5Btn')
    .addEventListener('click', () => showTocIdModal(insertSectionToc, 5, 'fr'));
document.getElementById('frSecToCH6Btn')
    .addEventListener('click', () => showTocIdModal(insertSectionToc, 6, 'fr'));


    function insertSectionToc(maxLevel, lang) {
        const html = monacoEditorInstance.getValue();
        const doc = new DOMParser()
            .parseFromString(html, 'text/html');
        
        const liClassMap = new Map();
        const aClassMap = new Map();
        const rootListTypeMap = new Map();

        doc.querySelectorAll('details[id^="sec-nav-"]')
            .forEach(existingDetails => {
                const detailsId = existingDetails.id;
                const existingUlOrOl = existingDetails.querySelector('ul, ol');

                if (existingUlOrOl) {
                    rootListTypeMap.set(detailsId, existingUlOrOl.tagName.toLowerCase());

                    collectExistingListClasses(existingUlOrOl, liClassMap, aClassMap);
                }
            });

        Array.from(doc.querySelectorAll('h2'))
            .forEach(h2 => {
                
                // --- Fix: Add fallback ID collector (for "Generate from text" option) ---
                const existingIds = new Set(Array.from(doc.querySelectorAll('[id]')).map(el => el.id));
                // -------------------------------------------------------------------

                const items = [];
                let currentElement = h2.nextElementSibling;
                while (currentElement && !['h1', 'h2'].includes(currentElement.tagName.toLowerCase())) {
                    Array.from(currentElement.querySelectorAll('h3, h4, h5, h6'))
                        .forEach(subHeading => {
                            const subLevel = parseInt(subHeading.tagName.substring(1), 10);
                            if (subLevel <= maxLevel) {
                                
                                // --- Fix: Fallback ID logic ---
                                if (!subHeading.id || subHeading.id.trim() === '') {
                                    // This is the fallback logic for "Generate from heading text"
                                    subHeading.id = generateUniqueId(subHeading.textContent || `heading-${subHeading.tagName.toLowerCase()}`, existingIds);
                                    existingIds.add(subHeading.id); // Add to set
                                }
                                // -----------------------------
                                
                                items.push(subHeading);
                            }
                        });
                    currentElement = currentElement.nextElementSibling;
                }

                const detailsId = 'sec-nav-' + h2.id;
                let details = doc.getElementById(detailsId);
                let summary, ulOrOl;
                let oldDetailsClasses = details ? details.getAttribute('class') || '' : '';
                let oldSummaryClasses = details ? (details.querySelector('summary') ? details.querySelector('summary')
                    .getAttribute('class') || '' : '') : '';
                let oldListClasses = details ? (details.querySelector('ul, ol') ? details.querySelector('ul, ol')
                    .getAttribute('class') || '' : '') : '';
                let initialListTagName = rootListTypeMap.get(detailsId) || 'ul';

                if (!details) {
                    const potentialDetails = Array.from(h2.parentNode.children)
                        .find(child => {
                            return child.tagName.toLowerCase() === 'details' &&
                                !child.id &&
                                child === h2.nextElementSibling &&
                                child.querySelector('summary') &&
                                (child.querySelector('summary')
                                    .textContent.trim()
                                    .toLowerCase() === 'in this section' ||
                                    child.querySelector('summary')
                                    .textContent.trim()
                                    .toLowerCase() === 'dans cette section');
                        });

                    if (potentialDetails) {
                        details = potentialDetails;
                        details.id = detailsId;
                        existingIds.add(detailsId);
                        oldDetailsClasses = details.getAttribute('class') || '';
                        oldSummaryClasses = details.querySelector('summary') ? details.querySelector('summary')
                            .getAttribute('class') || '' : '';
                        oldListClasses = details.querySelector('ul, ol') ? details.querySelector('ul', 'ol')
                            .getAttribute('class') || '' : '';
                        const existingUl = details.querySelector('ul');
                        const existingOl = details.querySelector('ol');
                        if (existingUl) initialListTagName = 'ul';
                        else if (existingOl) initialListTagName = 'ol';
                    }
                }

                if (items.length <= 1) {
    // If a previous section TOC block (details) exists, remove it.
    if (details) {
        details.remove();
    }
    // Exit the function to prevent the block from being created.
    return;
}


                if (details) {
                    summary = details.querySelector('summary');
                    ulOrOl = details.querySelector('ul, ol');
                    if (ulOrOl) {
                        ulOrOl.innerHTML = '';
                    } else {
                        ulOrOl = doc.createElement(initialListTagName);
                        if (oldListClasses) ulOrOl.setAttribute('class', oldListClasses);
                        details.appendChild(ulOrOl);
                    }
                } else {
                    details = doc.createElement('details');
                    details.id = detailsId;
                    summary = doc.createElement('summary');
                    summary.className = 'wb-toggle';
                    ulOrOl = doc.createElement(initialListTagName);
                    details.appendChild(summary);
                    details.appendChild(ulOrOl);
                }

                if (oldDetailsClasses) details.setAttribute('class', oldDetailsClasses);
                if (oldSummaryClasses) summary.setAttribute('class', oldSummaryClasses);
                if (oldListClasses) ulOrOl.setAttribute('class', oldListClasses);

                summary.setAttribute('data-toggle', '{"print":"on"}');
                summary.textContent = lang === 'en' ? 'In this section' : 'Dans cette section';

                let currentListStack = [{
                    domElement: ulOrOl,
                    level: 3,
                    tagName: initialListTagName
                }];

                items.forEach(el => {
                    const elLevel = parseInt(el.tagName.substring(1), 10);
                    const li = doc.createElement('li');
                    const a = doc.createElement('a');
                    const hrefTargetId = el.id;
                    a.href = `#${hrefTargetId}`;
					
                    // Create a temporary element to parse the heading's HTML
					const tempDiv = doc.createElement('div');
					tempDiv.innerHTML = el.innerHTML.trim();

					// Find all descendant elements within the temporary element
					const allDescendants = tempDiv.querySelectorAll('*');
					allDescendants.forEach(desc => {
						const tagName = desc.tagName.toLowerCase();
						
						// If the tag is NOT <i> and NOT <em>, remove it and its contents
						if (tagName !== 'i' && tagName !== 'em') {
							if (desc.parentNode) {
								desc.parentNode.removeChild(desc);
							}
						}
					});

					// Use the cleaned HTML for the anchor link
					a.innerHTML = tempDiv.innerHTML;

                    if (liClassMap.has(hrefTargetId)) {
                        li.setAttribute('class', liClassMap.get(hrefTargetId));
                    }
                    if (aClassMap.has(hrefTargetId)) {
                        a.setAttribute('class', aClassMap.get(hrefTargetId));
                    }

                    li.appendChild(a);

                    let currentParentListContainer = currentListStack[currentListStack.length - 1];
                    let currentParentList = currentParentListContainer.domElement;
                    let currentParentLevel = currentParentListContainer.level;
                    let currentParentListType = currentParentListContainer.tagName;

                    if (elLevel > currentParentLevel) {
                        while (elLevel > currentParentLevel) {
                            let newNestedListTagName = 'ul';
                            if (currentParentListType === 'ol') {
                                newNestedListTagName = 'ol';
                            }
                            const newNestedList = doc.createElement(newNestedListTagName);

                            if (currentParentList.lastElementChild && currentParentList.lastElementChild.tagName.toLowerCase() === 'li') {
                                currentParentList.lastElementChild.appendChild(newNestedList);
                            } else {
                                console.warn(`Unexpected structure: Appending new ${newNestedListTagName.toUpperCase()} to ${currentParentList.tagName.toUpperCase()} without preceding LI.`);
                                currentParentList.appendChild(newNestedList);
                            }
                            currentListStack.push({
                                domElement: newNestedList,
                                level: currentParentLevel + 1,
                                tagName: newNestedListTagName
                            });
                            currentParentList = newNestedList;
                            currentParentLevel++;
                            currentParentListType = newNestedListTagName;
                        }
                        currentParentList.appendChild(li);
                    } else if (elLevel < currentParentLevel) {
                        while (currentListStack.length > 1 && elLevel < currentListStack[currentListStack.length - 1].level) {
                            currentListStack.pop();
                        }
                        currentParentListContainer = currentListStack[currentListStack.length - 1];
                        currentParentList = currentParentListContainer.domElement;
                        currentParentList.appendChild(li);
                    } else {
                        currentParentList.appendChild(li);
                    }
                });

                if (!doc.getElementById(detailsId)) {
                    h2.parentNode.insertBefore(details, h2.nextSibling);
                }
            });

        monacoEditorInstance.setValue(doc.body.innerHTML);
        autoFormatBtn.click();
    }

    document.getElementById('formatSelectedBtn')
        .addEventListener('click', () => {
            const unformattedCode = monacoEditorInstance.getValue();

            const options = {
                indent_size: 4,
                space_in_empty_paren: true
            };

            const formattedCode = html_beautify(unformattedCode, options);

            monacoEditorInstance.setValue(formattedCode);
        });
    document.getElementById('cleanMsoBtn')
        .addEventListener('click', () => {
            const unformattedCode = monacoEditorInstance.getValue();

            const options = {
                indent_size: 4,
                space_in_empty_paren: true
            };

            const formattedCode = html_beautify(unformattedCode, options);

            monacoEditorInstance.setValue(formattedCode);
        });

    if (infoBtn) {
        infoBtn.addEventListener('click', () => {
            if (infoModal) infoModal.classList.remove('hidden');
        });
    }

    if (closeInfoModalBtn) {
        closeInfoModalBtn.addEventListener('click', () => {
            if (infoModal) infoModal.classList.add('hidden');
        });
    }

    if (infoModal) {
        infoModal.addEventListener('click', (event) => {
            if (event.target === infoModal) {
                infoModal.classList.add('hidden');
            }
        });
    }

    if (howToUseBtn) {
        howToUseBtn.addEventListener('click', () => {
            if (howToUseModal) {
                howToUseModal.classList.remove('hidden');
            }
        });
    }

    if (closeHowToUseModalBtn) {
        closeHowToUseModalBtn.addEventListener('click', () => {
            if (howToUseModal) {
                howToUseModal.classList.add('hidden');
            }
        });
    }

    if (howToUseModal) {
        howToUseModal.addEventListener('click', (event) => {
            if (event.target === howToUseModal) {
                howToUseModal.classList.add('hidden');
            }
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (previewModal && !previewModal.classList.contains('hidden')) {
                closePreviewModalBtn.click();
            }
            if (infoModal && !infoModal.classList.contains('hidden')) {
                infoModal.classList.add('hidden');
            }
            if (howToUseModal && !howToUseModal.classList.contains('hidden')) {
                howToUseModal.classList.add('hidden');
            }
        }
    });

    enSecToCBtn.addEventListener('click', () => insertSectionToc(3, 'en'));
    frSecToCBtn.addEventListener('click', () => insertSectionToc(3, 'fr'));
    enSecToCH4Btn.addEventListener('click', () => insertSectionToc(4, 'en'));
    frSecToCH4Btn.addEventListener('click', () => insertSectionToc(4, 'fr'));
    enSecToCH5Btn.addEventListener('click', () => insertSectionToc(5, 'en'));
    frSecToCH5Btn.addEventListener('click', () => insertSectionToc(5, 'fr'));
    enSecToCH6Btn.addEventListener('click', () => insertSectionToc(6, 'en'));
    frSecToCH6Btn.addEventListener('click', () => insertSectionToc(6, 'fr'));

    updateCleanMsoButtonState();

    modalCustomizeHeader.addEventListener('click', () => {
        modalIsCustomizeExpanded = !modalIsCustomizeExpanded;
        modalCustomizeContent.classList.toggle('expanded', modalIsCustomizeExpanded);
        modalCustomizeHeader.classList.toggle('expanded', modalIsCustomizeExpanded);
    });
    modalToggleContainerBtn.addEventListener('click', () => {
        modalUseContainerDiv = !modalUseContainerDiv;
        updateModalSettingsButtonStates();
        updateModalPreview();
    });
    modalToggleTitleBtn.addEventListener('click', () => {
        modalShowTitle = !modalShowTitle;
        modalH1TitleInputContainer.style.display = modalShowTitle ? 'block' : 'none';
        updateModalSettingsButtonStates();
        updateModalPreview();
    });
    modalToggleCssBtn.addEventListener('click', () => {
        modalEnableCss = !modalEnableCss;
        updateModalSettingsButtonStates();
        updateModalPreview();
    });
    modalH1TitleInput.addEventListener('input', () => {
        if (modalCurrentLanguage === 'en') modalH1TitleEn = modalH1TitleInput.value;
        else modalH1TitleFr = modalH1TitleInput.value;
        updateModalPreview();
    });
    modalNoneBylineBtn.addEventListener('click', () => {
        modalBylineMode = 'none';
        updateModalBylineButtonStates();
        updateModalPreview();
    });
    modalEnglishBylineBtn.addEventListener('click', () => {
        modalBylineMode = 'english';
        updateModalBylineButtonStates();
        updateModalPreview();
    });
    modalFrenchBylineBtn.addEventListener('click', () => {
        modalBylineMode = 'french';
        updateModalBylineButtonStates();
        updateModalPreview();
    });
    modalLocalImagesBtn.addEventListener('click', () => {
        modalImageSourceMode = 'local';
        updateModalImageSourceButtonStates();
        updateModalPreview();
    });
    modalPreviewImagesBtn.addEventListener('click', () => {
        modalImageSourceMode = 'preview';
        updateModalImageSourceButtonStates();
        updateModalPreview();
    });
    modalToggleLiveImagesBtn.addEventListener('click', () => {
        modalImageSourceMode = 'live';
        updateModalImageSourceButtonStates();
        updateModalPreview();
    });
    modalLocalUrlsBtn.addEventListener('click', () => {
        modalUrlSourceMode = 'local';
        updateModalUrlSourceButtonStates();
        updateModalPreview();
    });
    modalPreviewUrlsBtn.addEventListener('click', () => {
        modalUrlSourceMode = 'preview';
        updateModalUrlSourceButtonStates();
        updateModalPreview();
    });
    modalToggleLiveUrlsBtn.addEventListener('click', () => {
        modalUrlSourceMode = 'live';
        updateModalUrlSourceButtonStates();
        updateModalPreview();
    });
    modalToggleSectionsBtn.addEventListener('click', () => {
        modalShowSections = !modalShowSections;
        updateModalSectionHeadingButtonStates();
        updateModalPreview();
    });
    modalToggleHeadingsBtn.addEventListener('click', () => {
        modalShowHeadings = !modalShowHeadings;
        updateModalSectionHeadingButtonStates();
        updateModalPreview();
    });
    modalWetGcdsToggleBtn.addEventListener('click', () => {
        const frameworks = ['wet', 'gcds', 'wet+'];
        const currentIndex = frameworks.indexOf(modalCurrentFramework);
        modalCurrentFramework = frameworks[(currentIndex + 1) % frameworks.length];
        updateModalWetGcdsButtonState();
        updateModalPreview();
    });
    modalLangEnBtn.addEventListener('click', () => {
        if (modalBylineMode === 'french') modalBylineMode = 'english';
        modalCurrentLanguage = 'en';
        updateModalLanguageButtonStates();
        updateModalPreview();
    });
    modalLangFrBtn.addEventListener('click', () => {
        if (modalBylineMode === 'english') modalBylineMode = 'french';
        modalCurrentLanguage = 'fr';
        updateModalLanguageButtonStates();
        updateModalPreview();
    });
    modalBreakpointXsBtn.addEventListener('click', () => {
        modalCurrentBreakpoint = 'xs';
        updateModalBreakpointButtonStates();
        updateModalPreview();
    });
    modalBreakpointSmBtn.addEventListener('click', () => {
        modalCurrentBreakpoint = 'sm';
        updateModalBreakpointButtonStates();
        updateModalPreview();
    });
    modalBreakpointMdBtn.addEventListener('click', () => {
        modalCurrentBreakpoint = 'md';
        updateModalBreakpointButtonStates();
        updateModalPreview();
    });
    modalBreakpointFullBtn.addEventListener('click', () => {
        modalCurrentBreakpoint = 'full';
        updateModalBreakpointButtonStates();
        updateModalPreview();
    });

    function performModalPreviewSearch(forward = true) {
        const term = modalPreviewSearchInput.value;
        if (!term || !modalPreviewFrame.contentWindow) return;
        if (term !== modalLastSearchTerm) modalPreviewFrame.contentWindow.getSelection()
            .removeAllRanges();
        modalLastSearchTerm = term;
        modalPreviewFrame.contentWindow.find(term, false, !forward, true, false, false, false);
    }
    modalPreviewFindNextBtn.addEventListener('click', () => performModalPreviewSearch(true));
    modalPreviewFindPrevBtn.addEventListener('click', () => performModalPreviewSearch(false));
    modalPreviewSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performModalPreviewSearch(true);
        }
    });

    exportPrototypeBtn.addEventListener('click', () => {
        const prototypeHtml = generateFullHtml({
            showSections: false,
            showHeadings: false,
            useContainerDiv: modalUseContainerDiv,
            showTitle: modalShowTitle,
            imageSourceMode: modalImageSourceMode,
            bylineMode: modalBylineMode,
            enableCss: modalEnableCss,
            urlSourceMode: modalUrlSourceMode,
            currentLanguage: modalCurrentLanguage,
            currentFramework: modalCurrentFramework,
            h1TitleEn: modalH1TitleEn,
            h1TitleFr: modalH1TitleFr
        }, true);
        const blob = new Blob([prototypeHtml], {
            type: 'text/html'
        });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'prototype.html';
        a.click();
        URL.revokeObjectURL(a.href);
    });

    const openCustomCssModalBtn = document.getElementById('openCustomCssModalBtn');
    const customCssModal = document.getElementById('customCssModal');
    const closeCustomCssModalBtn = document.getElementById('closeCustomCssModalBtn');
    const cancelCustomCssBtn = document.getElementById('cancelCustomCssBtn');
    const previewCustomCssBtn = document.getElementById('previewCustomCssBtn');
    // Note: customCssInput is no longer used, we use the Monaco instance

    function openCustomCssModal() {
        customCssModal.classList.remove('hidden');
        
        // Initialize Monaco for CSS if it doesn't exist yet
        if (!cssEditorInstance) {
            // Ensure monaco is loaded
            if (typeof monaco !== 'undefined') {
                cssEditorInstance = monaco.editor.create(document.getElementById('customCssEditorContainer'), {
                    value: customPreviewCss,
                    language: 'css',
                    theme: 'custom-vs-dark', // <--- CHANGED from 'vs-dark' to 'custom-vs-dark'
                    automaticLayout: true,
                    minimap: { enabled: false }, // Cleaner look for small modal
                    scrollBeyondLastLine: false,
                    fontSize: 14
                });
            }
        } else {
            // If already exists, just update value and layout
            cssEditorInstance.setValue(customPreviewCss);
            // Small timeout ensures the modal is fully visible before layout calculates
            setTimeout(() => {
                cssEditorInstance.layout();
                cssEditorInstance.focus();
            }, 50);
        }
    }

    function closeCustomCssModal() {
        // Save content from Editor to Variable
        if (cssEditorInstance) {
            customPreviewCss = cssEditorInstance.getValue();
        }
        customCssModal.classList.add('hidden');
    }

    if (openCustomCssModalBtn) {
        openCustomCssModalBtn.addEventListener('click', openCustomCssModal);
    }

    if (closeCustomCssModalBtn) {
        closeCustomCssModalBtn.addEventListener('click', closeCustomCssModal);
    }

    if (cancelCustomCssBtn) {
        cancelCustomCssBtn.addEventListener('click', closeCustomCssModal);
    }

    // Logic for "Preview w/ Custom CSS"
    if (previewCustomCssBtn) {
        previewCustomCssBtn.addEventListener('click', () => {
            // 1. Save the input value from Monaco
            if (cssEditorInstance) {
                customPreviewCss = cssEditorInstance.getValue();
            }
            
            // 2. Open the Main Preview Modal
            showPreviewModal();
        });
    }

    // Close if clicking outside the modal content
    if (customCssModal) {
        customCssModal.addEventListener('click', (event) => {
            if (event.target === customCssModal) {
                closeCustomCssModal();
            }
        });
    }

    contentModeBtn.addEventListener('click', () => setEditorMode('content'));
    tableModeBtn.addEventListener('click', () => setEditorMode('table'));

    setEditorMode('content');

    window.onbeforeunload = function() {
        if (monacoEditorInstance && monacoEditorInstance.getValue()
            .trim() !== '') {
            return "You have unsaved changes. Are you sure you want to leave?";
        }
    };

});
