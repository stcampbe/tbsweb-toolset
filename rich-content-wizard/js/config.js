const APP_CONFIG = {

    /**
     * @description Defines a list of URL mappings. This is used to automatically
     * convert absolute URLs from different environments (like the preview or live canada.ca site)
     * into the relative AEM paths used for local development and authoring.
     */
    urlMappings: [{
            old: 'https://canada-preview.adobecqms.net/en/treasury-board-secretariat',
            new: '/content/canadasite/en/treasury-board-secretariat'
        },
        {
            old: 'https://canada-preview.adobecqms.net/fr/secretariat-conseil-tresor',
            new: '/content/canadasite/fr/secretariat-conseil-tresor'
        },
        {
            old: 'https://canada-preview.adobecqms.net/en/government',
            new: '/content/canadasite/en/government'
        },
        {
            old: 'https://canada-preview.adobecqms.net/fr/gouvernement',
            new: '/content/canadasite/fr/gouvernement'
        },
        {
            old: 'https://www.canada.ca/en/treasury-board-secretariat',
            new: '/content/canadasite/en/treasury-board-secretariat'
        },
        {
            old: 'https://www.canada.ca/fr/secretariat-conseil-tresor',
            new: '/content/canadasite/fr/secretariat-conseil-tresor'
        },
        {
            old: 'https://www.canada.ca/en/government',
            new: '/content/canadasite/en/government'
        },
        {
            old: 'https://www.canada.ca/fr/gouvernement',
            new: '/content/canadasite/fr/gouvernement'
        }
    ],

    /**
     * @description An array of URL path beginnings that are often found in pasted content
     * without the full AEM prefix. The cleaning function will prepend '/content/canadasite'
     * to any URL that starts with one of these patterns.
     */
    prependPatterns: [
        '/en/treasury-board-secretariat', 'en/treasury-board-secretariat',
        '/fr/secretariat-conseil-tresor', 'fr/secretariat-conseil-tresor',
        '/en/government', 'en/government',
        '/fr/gouvernement', 'fr/gouvernement'
    ],

    /**
     * @description These arrays define the base URL paths for different environments.
     * They are used by the preview modal to swap link and image source prefixes, allowing
     * the user to see how the page would look with local, preview, or live URLs.
     */
    localPrefixes: ['/content/canadasite/en/treasury-board-secretariat', '/content/canadasite/fr/secretariat-conseil-tresor', '/content/canadasite/en/government', '/content/canadasite/fr/gouvernement'],
    previewPrefixes: ['https://canada-preview.adobecqms.net/en/treasury-board-secretariat', 'https://canada-preview.adobecqms.net/fr/secretariat-conseil-tresor', 'https://canada-preview.adobecqms.net/en/government', 'https://canada-preview.adobecqms.net/fr/gouvernement'],
    livePrefixes: ['https://www.canada.ca/en/treasury-board-secretariat', 'https://www.canada.ca/fr/secretariat-conseil-tresor', 'https://www.canada.ca/en/government', 'https://www.canada.ca/fr/gouvernement'],

    /**
     * @description A set of HTML tags that are "void" or "self-closing", meaning they
     * do not need a corresponding closing tag (e.g., <img>, <br>).
     * Used by the validation function to check for correct tag structure.
     */
    selfClosingTags: new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']),
    /**
     * @description A set of HTML tags that are deprecated and should no longer be used.
     * The validation function will flag these tags as errors.
     */
    deprecatedTags: new Set(['acronym', 'applet', 'basefont', 'big', 'center', 'dir', 'font', 'frame', 'frameset', 'noframes', 'strike', 'tt', 'u']),
    /**
     * @description A set of HTML elements that are considered "block-level" elements.
     * These elements typically start on a new line and take up the full width available.
     * Used by the validation function to check for invalid nesting (e.g., a <div> inside a <span>).
     */
    blockElements: new Set(['address', 'article', 'aside', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'p', 'pre', 'section', 'table', 'tfoot', 'ul', 'video']),
    /**
     * @description A set of HTML elements that are considered "inline" elements.
     * These elements do not start on a new line and only take up as much width as necessary.
     * Used by the validation function to check for invalid nesting.
     */
    inlineElements: new Set(['a', 'abbr', 'b', 'bdo', 'br', 'button', 'cite', 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map', 'object', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'time', 'var']),
    /**
     * @description A set of elements for which it is acceptable to have 'width' and 'height'
     * attributes directly on the tag (e.g., <img>, <video>). For other elements, CSS should be used.
     */
    mediaSizingElements: new Set(['img', 'iframe', 'video', 'canvas', 'object', 'embed']),
    /**
     * @description A set of elements where using the 'target' attribute (e.g., target="_blank")
     * is considered valid. The validator will flag its use on other elements.
     */
    targetValidElements: new Set(['a', 'form']),
    /**
     * @description A set of tags that the validation logic should completely ignore.
     * This is useful for custom elements that might not follow standard HTML rules.
     */
    ignoredTags: new Set(['doc']),

    /**
     * @description This is the primary HTML validation function. It takes the full HTML code,
     * a DOM document representation, the Monaco editor instance, and an array to populate with errors.
     * It performs a series of checks for things like duplicate IDs, mismatched/unclosed tags,
     * invalid nesting, deprecated tags/attributes, and accessibility issues.
     */
    performValidationChecks: function(fullHtmlCode, tempDoc, monacoEditorInstance, errors) {
        const validAnchors = new Set();
        tempDoc.querySelectorAll('[id]')
            .forEach(el => {
                if (el.id) validAnchors.add(el.id);
            });

        const idRegex = /id\s*=\s*(["'])(.*?)\1/g;
        const foundIds = new Map();
        let idMatch;
        while ((idMatch = idRegex.exec(fullHtmlCode)) !== null) {
            const idValue = idMatch[2];
            const lineNumber = monacoEditorInstance.getModel()
                .getPositionAt(idMatch.index)
                .lineNumber;
            if (foundIds.has(idValue)) {
                errors.push({
                    message: `<strong>Duplicate ID:</strong> The ID "${idValue}" is used more than once.`,
                    lineNumber: lineNumber
                });
            } else {
                foundIds.set(idValue, lineNumber);
            }
        }

        const tagRegexForValidation = /<\/?([a-zA-Z0-9]+)(\s+[^>]*?)?(\/?)>/g;
        const tagStack = [];
        let match;
        while ((match = tagRegexForValidation.exec(fullHtmlCode)) !== null) {
            const fullTag = match[0];
            const tagName = match[1].toLowerCase();
            const attributesString = (match[2] || '').trim();
            const isClosingTag = fullTag.startsWith('</');
            const isSelfClosingSyntax = match[3] === '/';
            const lineNumber = monacoEditorInstance.getModel()
                .getPositionAt(match.index)
                .lineNumber;
            const parentTag = tagStack.length > 0 ? tagStack[tagStack.length - 1] : null;

            if (this.ignoredTags.has(tagName)) {
                if (!isClosingTag && !isSelfClosingSyntax) {
                    tagStack.push({
                        tagName: tagName,
                        lineNumber: lineNumber,
                        ignored: true
                    });
                } else if (isClosingTag) {
                    for (let i = tagStack.length - 1; i >= 0; i--) {
                        if (tagStack[i].tagName === tagName && tagStack[i].ignored) {
                            tagStack.splice(i, 1);
                            break;
                        }
                    }
                }
                continue;
            }

            if (isClosingTag) {
                if (tagStack.length === 0 || parentTag.ignored) {
                    errors.push({
                        message: `<strong>Unmatched Tag:</strong> Found a closing &lt;/${tagName}&gt; tag without a matching opening tag.`,
                        lineNumber: lineNumber
                    });
                } else {
                    const lastOpenTag = tagStack.pop();
                    if (lastOpenTag.tagName !== tagName) {
                        errors.push({
                            message: `<strong>Mismatched Tag:</strong> Expected &lt;/${lastOpenTag.tagName}&gt; (from line ${lastOpenTag.lineNumber}) but found &lt;/${tagName}&gt;.`,
                            lineNumber: lineNumber
                        });
                        tagStack.push(lastOpenTag);
                    }
                }
            } else {
                if (!this.selfClosingTags.has(tagName) && !isSelfClosingSyntax) {
                    tagStack.push({
                        tagName,
                        lineNumber,
                        ignored: false
                    });
                }

                if (parentTag && !parentTag.ignored && this.inlineElements.has(parentTag.tagName) && this.blockElements.has(tagName)) {
                    errors.push({
                        message: `<strong>Invalid Nesting:</strong> Block element &lt;${tagName}&gt; cannot be inside inline element &lt;${parentTag.tagName}&gt; (from line ${parentTag.lineNumber}).`,
                        lineNumber: lineNumber
                    });
                }
				if (parentTag && (parentTag.tagName === 'ul' || parentTag.tagName === 'ol') && tagName !== 'li') {
					errors.push({
						message: `<strong>Invalid Child:</strong> The &lt;${parentTag.tagName}&gt; tag can only contain &lt;li&gt; elements as direct children. Found &lt;${tagName}&gt;.`,
						lineNumber: lineNumber
					});
				}

                if (this.deprecatedTags.has(tagName)) errors.push({
                    message: `<strong>Deprecated Tag:</strong> The &lt;${tagName}&gt; tag is deprecated.`,
                    lineNumber: lineNumber
                });
                if (isSelfClosingSyntax && !this.selfClosingTags.has(tagName)) errors.push({
                    message: `<strong>Invalid Syntax:</strong> The &lt;${tagName}&gt; tag should not be self-closing.`,
                    lineNumber: lineNumber
                });

                if (tagName === 'img') {
                    if (!/\balt\s*=/.test(attributesString)) errors.push({
                        message: `<strong>Missing Attribute:</strong> &lt;img&gt; tag requires an 'alt' attribute.`,
                        lineNumber: lineNumber
                    });
                    if (!/\bsrc\s*=/.test(attributesString)) errors.push({
                        message: `<strong>Missing Attribute:</strong> &lt;img&gt; tag requires a 'src' attribute.`,
                        lineNumber: lineNumber
                    });
                } else if (tagName === 'th') {
                    if (!/\bscope\s*=/.test(attributesString) && !/\bid\s*=/.test(attributesString)) errors.push({
                        message: `<strong>Accessibility Error:</strong> &lt;th&gt; should have a 'scope' or 'id' attribute.`,
                        lineNumber: lineNumber
                    });
                } else if (tagName === 'tr') {
                    if (/\b(colspan|rowspan)\s*=/.test(attributesString)) errors.push({
                        message: `<strong>Invalid Attribute:</strong> 'colspan' or 'rowspan' cannot be on a &lt;tr&gt; tag.`,
                        lineNumber: lineNumber
                    });
                }

                if (/\balign\s*=/.test(attributesString)) errors.push({
                    message: `<strong>Deprecated Attribute:</strong> 'align' on &lt;${tagName}&gt;. Use CSS instead.`,
                    lineNumber: lineNumber
                });
                if ((/\bwidth\s*=/.test(attributesString) || /\bheight\s*=/.test(attributesString)) && !this.mediaSizingElements.has(tagName)) errors.push({
                    message: `<strong>Improper Attribute:</strong> 'width' or 'height' on &lt;${tagName}&gt;. Use CSS for sizing.`,
                    lineNumber: lineNumber
                });
                if (/\btarget\s*=/.test(attributesString) && !this.targetValidElements.has(tagName)) errors.push({
                    message: `<strong>Improper Attribute:</strong> 'target' on &lt;${tagName}&gt;.`,
                    lineNumber: lineNumber
                });

                if (tagName === 'a') {
                    const hrefMatch = attributesString.match(/\bhref\s*=\s*(["'])(.*?)\1/i);
                    if (hrefMatch) {
                        const href = hrefMatch[2];
                        if (href.includes(' ') && !href.includes('%20')) errors.push({
                            message: `<strong>Invalid URL:</strong> Space found in href. URL-encode spaces to '%20'.`,
                            lineNumber: lineNumber
                        });
                        if (href.startsWith('#') && href.length > 1) {
                            const anchorId = href.substring(1);
                            if (!validAnchors.has(anchorId)) errors.push({
                                message: `<strong>Broken Anchor:</strong> &lt;a href="#${anchorId}"&gt; points to a non-existent ID.`,
                                lineNumber: lineNumber
                            });
                        }
                    }
                }
            }
        }

        tagStack.forEach(unclosedTag => {
            if (!unclosedTag.ignored) {
                errors.push({
                    message: `<strong>Unclosed Tag:</strong> The &lt;${unclosedTag.tagName}&gt; tag (from line ${unclosedTag.lineNumber}) was never closed.`,
                    lineNumber: unclosedTag.lineNumber
                });
            }
        });
    },

    /**
     * @description Defines allowed CSS classes using a more efficient structure.
     * 'exact' provides fast lookups for specific classes.
     * 'prefixes' allows for pattern-based matching (e.g., 'col-', 'bg-').
     */
    allowedClassesConfig: {
        exact: new Set([
            'accordion', 'active', 'admin', 'alert', 'alpha', 'badge', 'block',
            'blockquote-reverse', 'bottom-0', 'breadcrumb', 'btn', 'caption', 'carousel',
            'center-block', 'checkbox', 'clear', 'clearfix', 'close', 'collapse',
            'collapsing', 'complex', 'container', 'control-label', 'danger',
            'dataTable', 'disabled', 'dropdown', 'equalize', 'fade',
            'favicon', 'figure', 'fixed', 'flex',
            'frmvld-wtt', 'glyphicon', 'grid', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'hidden', 'in', 'info', 'initial', 'inline', 'invisible', 'italic', 'item',
            'jumbotron', 'label', 'lead', 'media', 'mfp-hide', 'modal',
            'multimedia', 'nav', 'next', 'no-js', 'nojs-hide', 'nojs-show', 'not-italic',
            'nowrap', 'omega', 'open', 'page-header', 'pager', 'pagination', 'panel',
            'pause', 'play', 'pre-scrollable', 'prev', 'previous', 'progress',
            'provisional', 'radio', 'relative', 'row', 'show', 'simple',
            'small', 'sr-only', 'static', 'sticky', 'success', 'tab-content', 'table',
            'tgl-tab', 'thumbnail', 'tooltip', 'top-0', 'visible', 'warning', 'well',
            'zoom-in',

            // Custom classes (exact matches)
			// IMPORTANT: Add any classes if a custom CSS is required, otherwise the cleaning operation will remove it.
            'dpp', 'tbs'
        ]),
        prefixes: [
            '--wb-', 'abbr-', 'alert-', 'bg-', 'brdr-', 'btn-', 'carousel-', 'checkbox-', 
            'col-', 'container_', 'datepicker-', 'details-', 'dl-', 'dropdown-', 'embed-',
            'feed-', 'figure-', 'flex-', 'fn-', 'fnt-', 'font-', 'form-', 'gc-', 'grid_',
            'h-', 'has-', 'hidden-', 'icon-', 'img-', 'inline-', 'input-', 'items-',
            'justify-', 'label-', 'left-', 'list-', 'lst-', 'm-', 'mb-',
            'media-', 'ml-', 'modal-', 'mr-', 'mrgn-', 'mt-', 'mx-', 'my-', 'nav-',
            'navbar-', 'nojs-', 'opacity-', 'p-', 'pagination-', 'panel-', 'pb-',
            'pddng-', 'pl-', 'pr-', 'prefix_', 'progress-', 'pt-', 'pull-', 'push-',
            'px-', 'py-', 'radio-', 'right-', 'rounded', 'shadow', 'space-', 'suffix_', 'table-',
            'text-', 'tooltip-', 'visible-', 'w-', 'wb-', 'well-', 'wet-', 'z-',
			
			// Custom classes (prefix)
			// IMPORTANT: Add any class prefixes if a custom CSS is required, otherwise the cleaning operation will remove it.
			'link-', 'bg-', 'dpp-', 'tbs-'
        ]
    },
    /**
     * @description This is the complete HTML document that gets loaded into the iframe
     * for the rich text editor (TinyMCE via the HugeRTE wrapper). It includes the necessary
     * scripts, styles, and initialization logic to run the editor and communicate with the parent window.
     */
    richTextEditorTemplate: `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Rich Editor</title>
                    <script src="js/hugerte/hugerte.min.js"><\/script>
                    <script src="js/tailwind.js"><\/script>
                    <style>
                        html, body {
                            height: 100%; 
                            margin: 0;
                            box-sizing: border-box; 
                        }
                        body {
                            font-family: sans-serif;
                            background-color: #ffffff; 
                            color: #333;
                            display: flex; 
                            flex-direction: column;
                            padding: 1rem; 
                        }
                        form {
                            height: 100%;
                            display: flex;
                            flex-direction: column;
                        }
                        textarea {
                            width: 100%;
                            flex-grow: 1;
                            border: 1px solid #ccc;
                            border-radius: 0.5rem;
                            padding: 0.75rem;
                            font-size: 1rem;
                            resize: none; 
                            box-sizing: border-box; 
                        }
                        .tox.tox-tinymce {

resize: none; 
                            box-sizing: border-box; 
                        }
                        .tox.tox-tinymce { 
                            height: 100% !important; 
                            display: flex; 
                            flex-direction: column; 
                        }
                        .tox-editor-container {
                            flex-grow: 1; 
                            display: flex;
                            flex-direction: column;
                        }
                        .tox-edit-area {
                            flex-grow: 1; 
                            display: flex;
                            flex-direction: column;
                        }
                        .tox-edit-area__iframe {
                            flex-grow: 1; 
                        }
                        .nowrap {
                            white-space: nowrap;
                        }
						
                    </style>
                </head>
                <body>
                    <form method="post">
                        <textarea id="richEditor"></textarea>
                    </form>
                    <script type="text/javascript">
                        console.log("Iframe script started executing.");
                        
                        let richTextEditorInstance;
                        let isUpdatingFromCodeMirror = false;

const defaultContentStyle = 'body { max-width: 1170px; margin-left: auto; margin-right: auto; padding: 15px; box-sizing: border-box; } h1, .h1 { background-color: #FF6347; padding: 2px 5px; border-radius: 3px;} h2, .h2 { background-color: #FE9900; padding: 2px 5px; border-radius: 3px;} h3, .h3 { background-color: #FFDE59; padding: 2px 5px; border-radius: 3px;} h4, .h4 { background-color: #7DDA58; padding: 2px 5px; border-radius: 3px;} h5, .h5 { background-color: #5DE2E7; padding: 2px 5px; border-radius: 3px;} h6, .h6 { background-color: #E7DDFF; padding: 2px 5px; border-radius: 3px;} section { border: #060270 2px dashed; margin: 5px; padding: 5px;} figure { display: block !important; border: #1e81b0 2px solid; margin: 5px; padding: 5px;} div { border: #e28743 2px solid; margin: 5px; padding: 5px;} aside { border: #8D6F64 2px solid; margin: 5px; padding: 5px;} details > *:not(summary) { display: block !important; } dl { border: #A270C5 2px solid; margin: 5px; padding: 5px; } details { border: #42902C 2px solid; margin: 5px; padding: 5px; } details summary { cursor: default !important; font-weight: bold; margin-bottom: 5px; color: #333; } time { background-color: #ffd6f9; padding: 2px 5px; border-radius: 3px;} div.well { background-color: #dadada; } .text-center { text-align: center !important; } .text-right { text-align: right !important; } .text-left { text-align: left !important; } div[data-is-gcds-wrapper="true"] { border: 2px dotted #4f46e5; padding: 8px; margin: 8px 0; }';

window.setRichEditorContent = function(content) {
                            if (richTextEditorInstance && !isUpdatingFromCodeMirror) {
                                isUpdatingFromCodeMirror = true;
                                richTextEditorInstance.setContent(content);
                                richTextEditorInstance.focus();
                                isUpdatingFromCodeMirror = false;
                            } else {
                                console.warn('Iframe: HugeRTE editor not yet initialized or isUpdatingFromCodeMirror is true.');
                            }
                        };

                        window.getRichEditorContent = function() {
                            if (richTextEditorInstance) {
                                return richTextEditorInstance.getContent();
                            }
                            console.warn('Iframe: HugeRTE editor not yet initialized. Cannot get content.');
                            return '';
                        };

                        window.updateEditorStyles = function(enableCustomStyles) {
                            if (richTextEditorInstance) {
                                const editorDoc = richTextEditorInstance.getDoc();
                                if (!editorDoc) return;

                                let customStyleSheet = editorDoc.getElementById('tinymce-custom-content-css');

                                if (!customStyleSheet) {
                                    const styleSheets = editorDoc.head.querySelectorAll('style');
                                    for (let i = 0; i < styleSheets.length; i++) {
                                        if (styleSheets[i].innerHTML.includes('FF6347')) { 
                                            customStyleSheet = styleSheets[i];
                                            customStyleSheet.id = 'tinymce-custom-content-css';
                                            break;
                                        }
                                    }
                                }

                                if (customStyleSheet) {
                                    customStyleSheet.disabled = !enableCustomStyles;
                                }
                            }
                        };

                        function openAllDetailsInEditor(editor) {
                            const editorDoc = editor.getDoc();
                            if (editorDoc) {
                                const detailsElements = editorDoc.querySelectorAll('details');
                                detailsElements.forEach(el => {
                                    el.setAttribute('open', 'open');
                                });
                            }
                        }

window.initializeEditor = function() {
                            if (typeof hugerte !== 'undefined') {
                                console.log("Iframe: Parent commanded initialization. Initializing editor.");
								const applyListStyle = (editor, listType, styleClass) => {
									editor.undoManager.transact(() => {
										// 1. Determine the command based on the desired list type
										const command = listType === 'ul' ? 'InsertUnorderedList' : 'InsertOrderedList';

										// 2. Check current selection and convert if necessary
										const node = editor.selection.getNode();
										const existingList = editor.dom.getParent(node, 'ul,ol');

										// If not a list, or if the list type doesn't match what we want, switch it
										if (!existingList || existingList.nodeName.toLowerCase() !== listType) {
											editor.execCommand(command);
										}

										// 3. Get the active list element (it should match the listType now)
										const currentList = editor.dom.getParent(editor.selection.getNode(), listType);

										if (currentList) {
											// 4. Clean ALL specific custom classes (including list-unstyled)
											editor.dom.removeClass(currentList, 'lst-lwr-alph lst-upr-alph lst-lwr-rmn lst-upr-rmn list-unstyled');
											
											// 5. Apply new class only if one was provided
											if (styleClass) {
												editor.dom.addClass(currentList, styleClass);
											}
										}
									});
								};
                                hugerte.init({
                                    selector: '#richEditor',
                                    toolbar: 'undo redo styles bold italic alignleft aligncenter alignright | numlist bullist list_number list_lwr_alph list_upr_alph list_lwr_rmn list_upr_rmn list_bullet list_unstyle | link table',
                                    plugins: ['table', 'lists', 'link'],
									table_resize_bars: false,
									object_resizing: false,
                                    height: '100%',
                                    tab_focus: false,
                                    formats: {
                                        alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-left', exact: true },
                                        aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-center', exact: true },
                                        alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', classes: 'text-right', exact: true },
                                    },
                                    content_style: defaultContentStyle,
									content_css: 'https://www.canada.ca/etc/designs/canada/wet-boew/css/theme.min.css',
                                    extended_valid_elements: 'li[*],span[*],dl[class|id],dt[class|id],dd[class|id],details[open|class|id|data-*],summary[class|id|data-*],div[data-*|class|id|style|contenteditable],option[*],optgroup[*]',
									valid_children: '+span[ul|div|p],+body[dl],+dl[dt|dd],+dt[a|abbr|acronym|b|bdo|big|br|button|cite|code|del|dfn|em|i|img|input|ins|kbd|label|map|q|samp|select|small|span|strike|strong|sub|sup|textarea|tt|var|p],+dd[a|abbr|acronym|b|bdo|big|br|button|cite|code|del|dfn|em|i|img|input|ins|kbd|label|map|q|samp|select|small|span|strike|strong|sub|sup|textarea|tt|var|p|ul|ol|dl],+details[summary|p|div|section|code|a|img|em|strong|ul|ol|table|h1|h2|h3|h4|h5|h6]',
                                    custom_elements: 'dl,dt,dd,details,summary,option,optgroup',
                                    setup: function(editor) {
										

                                        editor.on('SetContent', function(e) {
                                            openAllDetailsInEditor(editor);
                                        });
										
										editor.on('ExecCommand', function(e) {
											if (e.command === 'InsertUnorderedList') {
												const node = editor.selection.getNode();
												const list = editor.dom.getParent(node, 'ul');
												if (list) {
													// Remove all custom classes so they don't stick to the plain bullets
													editor.dom.removeClass(list, 'lst-lwr-alph lst-upr-alph lst-lwr-rmn lst-upr-rmn list-unstyled');
												}
											}
										});
										
										// 1. Default Numbering (#.) -> OL
    editor.ui.registry.addButton('list_number', {
        text: '#.',
        tooltip: 'Default Numbering',
        onAction: () => applyListStyle(editor, 'ol', null)
    });

    // 2. Lower Alpha (a.) -> OL
    editor.ui.registry.addButton('list_lwr_alph', {
        text: 'a.',
        tooltip: 'Lower Alpha',
        onAction: () => applyListStyle(editor, 'ol', 'lst-lwr-alph')
    });

    // 3. Upper Alpha (A.) -> OL
    editor.ui.registry.addButton('list_upr_alph', {
        text: 'A.',
        tooltip: 'Upper Alpha',
        onAction: () => applyListStyle(editor, 'ol', 'lst-upr-alph')
    });

    // 4. Lower Roman (i.) -> OL
    editor.ui.registry.addButton('list_lwr_rmn', {
        text: 'i.',
        tooltip: 'Lower Roman',
        onAction: () => applyListStyle(editor, 'ol', 'lst-lwr-rmn')
    });

    // 5. Upper Roman (I.) -> OL
    editor.ui.registry.addButton('list_upr_rmn', {
        text: 'I.',
        tooltip: 'Upper Roman',
        onAction: () => applyListStyle(editor, 'ol', 'lst-upr-rmn')
    });

    // 6. Default Bulleting (·) -> UL
    editor.ui.registry.addButton('list_bullet', {
        text: '·',
        tooltip: 'Default Bulleting',
        onAction: () => applyListStyle(editor, 'ul', null)
    });

    // 7. Unstyled (x) -> UL
    editor.ui.registry.addButton('list_unstyle', {
        text: 'x',
        tooltip: 'Unstyled',
        onAction: () => applyListStyle(editor, 'ul', 'list-unstyled')
    });
										
                                    },
                                    init_instance_callback: function(editorInstance) {
                                        console.log('Iframe: HugeRTE editor initialized inside iframe.');
                                        richTextEditorInstance = editorInstance;
                                        openAllDetailsInEditor(editorInstance);
                                        if (window.parent && typeof window.parent.handleRichTextEditorReady === 'function') {
                                            window.parent.handleRichTextEditorReady(editorInstance);
                                        }
                                        editorInstance.on('keydown', (event) => {
                                            if (event.key === 'Tab') {
                                                event.preventDefault();
                                                editorInstance.focus();
                                            }
                                        });
                                    }
                                });
                            } else {
                                console.error("Iframe: Parent commanded initialization, but HugeRTE library not loaded!");
                            }
                        };
                    <\/script>
                </body>
                </html>`,
    /**
     * @description A function that generates the standard "From" byline HTML snippet.
     * It returns different markup depending on the selected framework (WET or GCDS) and language.
     * This is used by the preview modal.
     */
    getBylineHtml: function(options) {
        let bylineHtml = '';
        if (options.bylineMode === 'english') {
            if (options.currentFramework === 'wet' || options.currentFramework === 'wet+') {
                bylineHtml = '<p class="gc-byline"><strong>From: <a href="/en/treasury-board-secretariat.html">Treasury Board of Canada Secretariat</a></strong></p>';
            } else if (options.currentFramework === 'gcds') {
                bylineHtml = `<gcds-text><strong>From: <gcds-link href="/en/treasury-board-secretariat.html">Treasury Board of Canada Secretariat</gcds-link></strong></gcds-text>`;
            }
        } else if (options.bylineMode === 'french') {
            if (options.currentFramework === 'wet' || options.currentFramework === 'wet+') {
                bylineHtml = '<p class="gc-byline"><strong>De : <a href="/fr/secretariat-conseil-tresor.html">Secrétariat du Conseil du Trésor du Canada</a></strong></p>';
            } else if (options.currentFramework === 'gcds') {
                bylineHtml = `<gcds-text><strong>De : <gcds-link href="/fr/secretariat-conseil-tresor.html">Secrétariat du Conseil du Trésor du Canada</gcds-link></strong></gcds-text>`;
            }
        }
        return bylineHtml;
    },

    /**
     * @description A function that generates the standard copyright/colophon HTML section.
     * It takes options for language, monarch (King/Queen), year, and identifier (ISBN/ISSN)
     * to construct the correct legal text.
     */
    getColophonHtml: function({
        language,
        monarch,
        year,
        identifier,
        number
    }) {
        let content = `<section id="colophon">\n<p class="mrgn-tp-lg text-center small">© `;

        if (language === 'English') {
            if (monarch === 'King') {
                content += `His Majesty the King in Right of Canada, represented by the President of the Treasury Board, ${year},<br>${identifier}:&#160;${number}</p>\n</section>`;
            } else { // Queen
                content += `Her Majesty the Queen in Right of Canada, represented by the President of the Treasury Board, ${year},<br>${identifier}:&#160;${number}</p>\n</section>`;
            }
        } else { // French
            if (monarch === 'King') {
                content += `Sa Majesté le Roi du chef du Canada, représenté par le président du Conseil du Trésor, ${year},<br>${identifier}&#160;:&#160;${number}</p>\n</section>`;
            } else { // Queen
                content += `Sa Majesté la Reine du chef du Canada, représentée par le président du Conseil du Trésor, ${year},<br>${identifier}&#160;:&#160;${number}</p>\n</section>`;
            }
        }
        return content;
    },

    /**
     * @description Configures the path for the RequireJS loader to find the Monaco Editor
     * source files, pointing to a CDN.
     */
    monacoLoaderPaths: {
        'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs'
    },
	
	/**
     * @description Defines the theme names for Monaco Editor's light and dark modes.
     */
    monacoThemes: {
        light: 'vs',
        dark: 'vs-dark'
    },

    /**
     * @description A function that returns a default configuration object for initializing
     * the Monaco code editor. It sets options like language, theme, font size, word wrap, etc.
     */
    getMonacoEditorOptions: function(initialValue) {
        return {
            value: initialValue,
            language: 'html',
            theme: 'vs-dark',
            automaticLayout: true,
            minimap: {
                enabled: true
            },
            fontSize: 14,
            tabSize: 4,
            insertSpaces: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            wrappingIndent: 'same',
        };
    }
	
};
