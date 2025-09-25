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
     * @description A large set of allowed CSS classes. This is used by the "Clean MSO Code" function
     * to strip out Microsoft Office-specific classes while preserving legitimate classes from
     * frameworks like WET4, Bootstrap, and Tailwind CSS.
     */
    wet4AllowedClasses: new Set([
        'abbr-dynamic',
        'accordion',
        'active',
        'admin',
        'alert',
        'alert-branch',
        'alert-danger',
        'alert-dismissible',
        'alert-info',
        'alert-link',
        'alert-success',
        'alert-warning',
        'alpha',
        'badge',
        'bg-black',
        'bg-danger',
        'bg-gray-100',
        'bg-gray-200',
        'bg-gray-300',
        'bg-gray-400',
        'bg-gray-500',
        'bg-gray-600',
        'bg-gray-700',
        'bg-gray-800',
        'bg-gray-900',
        'bg-green-500',
        'bg-indigo-500',
        'bg-info',
        'bg-pink-500',
        'bg-primary',
        'bg-purple-500',
        'bg-red-500',
        'bg-success',
        'bg-transparent',
        'bg-warning',
        'bg-white',
        'bg-yellow-500',
        'block',
        'blockquote-reverse',
        'bottom-0',
        'brdr-0',
        'brdr-bttm',
        'brdr-lft',
        'brdr-rght',
        'brdr-tp',
        'breadcrumb',
        'btn',
        'btn-block',
        'btn-call-to-action',
        'btn-danger',
        'btn-default',
        'btn-info',
        'btn-link',
        'btn-lg',
        'btn-primary',
        'btn-sm',
        'btn-success',
        'btn-warning',
        'btn-xs',
        'button-accent',
        'button-attention',
        'bx-brdr',
        'caption',
        'carousel',
        'carousel-caption',
        'carousel-control',
        'carousel-fade',
        'carousel-indicators',
        'carousel-inner',
        'center-block',
        'checkbox',
        'checkbox-inline',
        'clear',
        'clearfix',
        'close',
        'col-lg-1',
        'col-lg-10',
        'col-lg-11',
        'col-lg-12',
        'col-lg-2',
        'col-lg-3',
        'col-lg-4',
        'col-lg-5',
        'col-lg-6',
        'col-lg-7',
        'col-lg-8',
        'col-lg-9',
        'col-lg-offset-0',
        'col-lg-offset-1',
        'col-lg-offset-10',
        'col-lg-offset-11',
        'col-lg-offset-12',
        'col-lg-offset-2',
        'col-lg-offset-3',
        'col-lg-offset-4',
        'col-lg-offset-5',
        'col-lg-offset-6',
        'col-lg-offset-7',
        'col-lg-offset-8',
        'col-lg-offset-9',
        'col-md-1',
        'col-md-10',
        'col-md-11',
        'col-md-12',
        'col-md-2',
        'col-md-3',
        'col-md-4',
        'col-md-5',
        'col-md-6',
        'col-md-7',
        'col-md-8',
        'col-md-9',
        'col-md-offset-0',
        'col-md-offset-1',
        'col-md-offset-10',
        'col-md-offset-11',
        'col-md-offset-12',
        'col-md-offset-2',
        'col-md-offset-3',
        'col-md-offset-4',
        'col-md-offset-5',
        'col-md-offset-6',
        'col-md-offset-7',
        'col-md-offset-8',
        'col-md-offset-9',
        'col-seq',
        'col-sm-1',
        'col-sm-10',
        'col-sm-11',
        'col-sm-12',
        'col-sm-2',
        'col-sm-3',
        'col-sm-4',
        'col-sm-5',
        'col-sm-6',
        'col-sm-7',
        'col-sm-8',
        'col-sm-9',
        'col-sm-offset-0',
        'col-sm-offset-1',
        'col-sm-offset-10',
        'col-sm-offset-11',
        'col-sm-offset-12',
        'col-sm-offset-2',
        'col-sm-offset-3',
        'col-sm-offset-4',
        'col-sm-offset-5',
        'col-sm-offset-6',
        'col-sm-offset-7',
        'col-sm-offset-8',
        'col-sm-offset-9',
        'col-xs-1',
        'col-xs-10',
        'col-xs-11',
        'col-xs-12',
        'col-xs-2',
        'col-xs-3',
        'col-xs-4',
        'col-xs-5',
        'col-xs-6',
        'col-xs-7',
        'col-xs-8',
        'col-xs-9',
        'col-xs-offset-0',
        'col-xs-offset-1',
        'col-xs-offset-10',
        'col-xs-offset-11',
        'col-xs-offset-12',
        'col-xs-offset-2',
        'col-xs-offset-3',
        'col-xs-offset-4',
        'col-xs-offset-5',
        'col-xs-offset-6',
        'col-xs-offset-7',
        'col-xs-offset-8',
        'col-xs-offset-9',
        'collapse',
        'collapsing',
        'complex',
        'container',
        'container-fluid',
        'container_12',
        'container_16',
        'control-label',
        'danger',
        'dataTable',
        'datepicker-format',
        'details-close',
        'details-open',
        'disabled',
        'dl-horizontal',
        'dropdown',
        'dropdown-backdrop',
        'dropdown-header',
        'dropdown-menu',
        'dropdown-menu-right',
        'dropdown-toggle',
        'embed-responsive',
        'embed-responsive-16by9',
        'embed-responsive-4by3',
        'embed-responsive-item',
        'equalize',
        'fade',
        'favicon',
        'feed-active',
        'feed-ajax',
        'feed-item',
        'feed-loaded',
        'feed-loading',
        'figcaption',
        'figure',
        'fixed',
        'flex',
        'flex-col',
        'flex-col-reverse',
        'flex-grow',
        'flex-grow-0',
        'flex-nowrap',
        'flex-row',
        'flex-row-reverse',
        'flex-shrink',
        'flex-shrink-0',
        'flex-wrap',
        'flex-wrap-reverse',
        'fn-lnk',
        'fn-rtn',
        'fnt-bld',
        'fnt-ital',
        'fnt-nrml',
        'fnt-sz-lg',
        'fnt-sz-md',
        'fnt-sz-sm',
        'fnt-sz-xl',
        'font-black',
        'font-bold',
        'font-extrabold',
        'font-extralight',
        'font-light',
        'font-medium',
        'font-mono',
        'font-normal',
        'font-sans',
        'font-semibold',
        'font-serif',
        'font-thin',
        'form-control',
        'form-group',
        'form-horizontal',
        'form-inline',
        'frmvld-wtt',
        'gc-active',
        'gc-byline',
        'gc-font-2019',
        'gc-font-2020',
        'gc-rprt-prblm',
        'gc-stp-stp',
        'gc-sub-theme',
        'glyphicon',
        'grid',
        'grid_1',
        'grid_10',
        'grid_11',
        'grid_12',
        'grid_13',
        'grid_14',
        'grid_15',
        'grid_16',
        'grid_2',
        'grid_3',
        'grid_4',
        'grid_5',
        'grid_6',
        'grid_7',
        'grid_8',
        'grid_9',
        'h-0',
        'h-1',
        'h-10',
        'h-12',
        'h-16',
        'h-2',
        'h-20',
        'h-24',
        'h-3',
        'h-32',
        'h-4',
        'h-40',
        'h-48',
        'h-5',
        'h-56',
        'h-6',
        'h-64',
        'h-8',
        'h-auto',
        'h-full',
        'h-px',
        'h-screen',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'has-error',
        'has-feedback',
        'has-success',
        'has-warning',
        'help-block',
        'hidden',
        'hidden-lg',
        'hidden-md',
        'hidden-print',
        'hidden-sm',
        'hidden-xs',
        'icon-spinner',
        'img-circle',
        'img-responsive',
        'img-rounded',
        'img-thumbnail',
        'in',
        'info',
        'initial',
        'inline',
        'inline-block',
        'inline-flex',
        'input-group',
        'input-group-addon',
        'input-group-btn',
        'input-lg',
        'input-sm',
        'invisible',
        'italic',
        'item',
        'items-baseline',
        'items-center',
        'items-end',
        'items-start',
        'items-stretch',
        'jumbotron',
        'justify-around',
        'justify-between',
        'justify-center',
        'justify-end',
        'justify-start',
        'label',
        'label-danger',
        'label-default',
        'label-info',
        'label-primary',
        'label-success',
        'label-warning',
        'lead',
        'left-0',
        'list-group',
        'list-group-item',
        'list-group-item-danger',
        'list-group-item-heading',
        'list-group-item-info',
        'list-group-item-success',
        'list-group-item-text',
        'list-group-item-warning',
        'list-inline',
        'list-unstyled',
        'lst-lwr-alph',
        'lst-lwr-rmn',
        'lst-num',
        'lst-spcd',
        'lst-upr-alph',
        'lst-upr-rmn',
        'm-0',
        'm-1',
        'm-2',
        'm-3',
        'm-4',
        'm-5',
        'm-auto',
        'mb-0',
        'mb-1',
        'mb-2',
        'mb-3',
        'mb-4',
        'mb-5',
        'mb-auto',
        'media',
        'media-body',
        'media-heading',
        'media-left',
        'media-list',
        'media-middle',
        'media-object',
        'media-right',
        'mfp-hide',
        'ml-0',
        'ml-1',
        'ml-2',
        'ml-3',
        'ml-4',
        'ml-5',
        'ml-auto',
        'modal',
        'modal-backdrop',
        'modal-body',
        'modal-content',
        'modal-dialog',
        'modal-footer',
        'modal-header',
        'modal-lg',
        'modal-open',
        'modal-sm',
        'modal-title',
        'mr-0',
        'mr-1',
        'mr-2',
        'mr-3',
        'mr-4',
        'mr-5',
        'mr-auto',
        'mrgn-bttm-0',
        'mrgn-bttm-lg',
        'mrgn-bttm-md',
        'mrgn-bttm-sm',
        'mrgn-bttm-xl',
        'mrgn-lft-0',
        'mrgn-lft-lg',
        'mrgn-lft-md',
        'mrgn-lft-sm',
        'mrgn-lft-xl',
        'mrgn-rght-0',
        'mrgn-rght-lg',
        'mrgn-rght-md',
        'mrgn-rght-sm',
        'mrgn-rght-xl',
        'mrgn-tp-0',
        'mrgn-tp-lg',
        'mrgn-tp-md',
        'mrgn-tp-sm',
        'mrgn-tp-xl',
        'mt-0',
        'mt-1',
        'mt-2',
        'mt-3',
        'mt-4',
        'mt-5',
        'mt-auto',
        'multimedia',
        'mx-0',
        'mx-1',
        'mx-2',
        'mx-3',
        'mx-4',
        'mx-5',
        'mx-auto',
        'my-0',
        'my-1',
        'my-2',
        'my-3',
        'my-4',
        'my-5',
        'my-auto',
        'nav',
        'nav-pills',
        'nav-stacked',
        'nav-tabs',
        'nav-tabs-justified',
        'navbar',
        'navbar-brand',
        'navbar-btn',
        'navbar-collapse',
        'navbar-default',
        'navbar-fixed-bottom',
        'navbar-fixed-top',
        'navbar-form',
        'navbar-header',
        'navbar-inverse',
        'navbar-left',
        'navbar-link',
        'navbar-nav',
        'navbar-right',
        'navbar-static-top',
        'navbar-text',
        'navbar-toggle',
        'next',
        'not-italic',
        'nowrap',
        'omega',
        'open',
        'opacity-0',
        'opacity-100',
        'opacity-25',
        'opacity-50',
        'opacity-75',
        'p-0',
        'p-1',
        'p-2',
        'p-3',
        'p-4',
        'p-5',
        'page-header',
        'pager',
        'pagination',
        'pagination-lg',
        'pagination-sm',
        'panel',
        'panel-body',
        'panel-danger',
        'panel-default',
        'panel-footer',
        'panel-group',
        'panel-heading',
        'panel-info',
        'panel-primary',
        'panel-success',
        'panel-title',
        'panel-warning',
        'pause',
        'pb-0',
        'pb-1',
        'pb-2',
        'pb-3',
        'pb-4',
        'pb-5',
        'pddng-bttm-0',
        'pddng-bttm-lg',
        'pddng-bttm-md',
        'pddng-bttm-sm',
        'pddng-bttm-xl',
        'pddng-lft-0',
        'pddng-lft-lg',
        'pddng-lft-md',
        'pddng-lft-sm',
        'pddng-lft-xl',
        'pddng-rght-0',
        'pddng-rght-lg',
        'pddng-rght-md',
        'pddng-rght-sm',
        'pddng-rght-xl',
        'pddng-tp-0',
        'pddng-tp-lg',
        'pddng-tp-md',
        'pddng-tp-sm',
        'pddng-tp-xl',
        'pl-0',
        'pl-1',
        'pl-2',
        'pl-3',
        'pl-4',
        'pl-5',
        'play',
        'pr-0',
        'pr-1',
        'pr-2',
        'pr-3',
        'pr-4',
        'pr-5',
        'pre-scrollable',
        'prefix_1',
        'prefix_10',
        'prefix_11',
        'prefix_12',
        'prefix_13',
        'prefix_14',
        'prefix_15',
        'prefix_2',
        'prefix_3',
        'prefix_4',
        'prefix_5',
        'prefix_6',
        'prefix_7',
        'prefix_8',
        'prefix_9',
        'prev',
        'previous',
        'progress',
        'progress-bar',
        'progress-bar-danger',
        'progress-bar-info',
        'progress-bar-striped',
        'progress-bar-success',
        'progress-bar-warning',
        'provisional',
        'pt-0',
        'pt-1',
        'pt-2',
        'pt-3',
        'pt-4',
        'pt-5',
        'pull-left',
        'pull-right',
        'pull_1',
        'pull_10',
        'pull_11',
        'pull_12',
        'pull_13',
        'pull_14',
        'pull_15',
        'pull_2',
        'pull_3',
        'pull_4',
        'pull_5',
        'pull_6',
        'pull_7',
        'pull_8',
        'pull_9',
        'push_1',
        'push_10',
        'push_11',
        'push_12',
        'push_13',
        'push_14',
        'push_15',
        'push_2',
        'push_3',
        'push_4',
        'push_5',
        'push_6',
        'push_7',
        'push_8',
        'push_9',
        'px-0',
        'px-1',
        'px-2',
        'px-3',
        'px-4',
        'px-5',
        'py-0',
        'py-1',
        'py-2',
        'py-3',
        'py-4',
        'py-5',
        'radio',
        'radio-inline',
        'relative',
        'right-0',
        'rounded',
        'rounded-full',
        'rounded-lg',
        'rounded-md',
        'rounded-sm',
        'row',
        'shadow',
        'shadow-inner',
        'shadow-lg',
        'shadow-md',
        'shadow-none',
        'shadow-sm',
        'shadow-xl',
        'show',
        'show-grid',
        'simple',
        'small',
        'space-x-2',
        'space-y-2',
        'sr-only',
        'sr-only-focusable',
        'static',
        'sticky',
        'success',
        'suffix_1',
        'suffix_10',
        'suffix_11',
        'suffix_12',
        'suffix_13',
        'suffix_14',
        'suffix_15',
        'suffix_2',
        'suffix_3',
        'suffix_4',
        'suffix_5',
        'suffix_6',
        'suffix_7',
        'suffix_8',
        'suffix_9',
        'tab-content',
        'tab-count',
        'tab-pane',
        'table',
        'table-bordered',
        'table-cell',
        'table-condensed',
        'table-hover',
        'table-responsive',
        'table-simplify',
        'table-striped',
        'text-2xl',
        'text-3xl',
        'text-4xl',
        'text-5xl',
        'text-6xl',
        'text-base',
        'text-black',
        'text-blue-500',
        'text-capitalize',
        'text-center',
        'text-danger',
        'text-gray-100',
        'text-gray-200',
        'text-gray-300',
        'text-gray-400',
        'text-gray-500',
        'text-gray-600',
        'text-gray-700',
        'text-gray-800',
        'text-gray-900',
        'text-green-500',
        'text-hide',
        'text-indigo-500',
        'text-info',
        'text-justify',
        'text-left',
        'text-lg',
        'text-lowercase',
        'text-muted',
        'text-nowrap',
        'text-pink-500',
        'text-primary',
        'text-purple-500',
        'text-red-500',
        'text-right',
        'text-sm',
        'text-success',
        'text-transparent',
        'text-uppercase',
        'text-warning',
        'text-white',
        'text-xl',
        'text-xs',
        'text-yellow-500',
        'tgl-tab',
        'thumbnail',
        'tooltip',
        'tooltip-arrow',
        'tooltip-inner',
        'top-0',
        'visible',
        'visible-lg',
        'visible-lg-block',
        'visible-lg-inline',
        'visible-lg-inline-block',
        'visible-md',
        'visible-md-block',
        'visible-md-inline',
        'visible-md-inline-block',
        'visible-print',
        'visible-sm',
        'visible-sm-block',
        'visible-sm-inline',
        'visible-sm-inline-block',
        'visible-xs',
        'visible-xs-block',
        'visible-xs-inline',
        'visible-xs-inline-block',
        'w-0',
        'w-1',
        'w-10',
        'w-12',
        'w-16',
        'w-2',
        'w-20',
        'w-24',
        'w-3',
        'w-32',
        'w-4',
        'w-40',
        'w-48',
        'w-5',
        'w-56',
        'w-6',
        'w-64',
        'w-8',
        'w-auto',
        'w-full',
        'w-px',
        'w-screen',
        'warning',
        'wb-bar-b',
        'wb-bar-t',
        'wb-calevt',
        'wb-charts',
        'wb-chtwzrd',
        'wb-data-ajax',
        'wb-details',
        'wb-eqht',
        'wb-equalize',
        'wb-feed',
        'wb-feeds',
        'wb-fieldflow',
        'wb-filter',
        'wb-fltr-inited',
        'wb-fnote',
        'wb-frmvld',
        'wb-geomap',
        'wb-graph',
        'wb-init',
        'wb-invisible',
        'wb-inv',
        'wb-lbx',
        'wb-menu',
        'wb-mltmd',
        'wb-modal',
        'wb-multimedia',
        'wb-navcurr',
        'wb-overlay',
        'wb-prettify',
        'wb-share',
        'wb-steps',
        'wb-tabs',
        'wb-tables',
        'wb-tables-inited',
        'wb-toggle',
        'wb-txthl',
        'wb-zebra',
        'well',
        'well-lg',
        'well-sm',
        'wet-boew-button',
        'wet-boew-footnotes',
        'wet-boew-lightbox',
        'wet-boew-zebra',
        'z-0',
        'z-10',
        'z-20',
        'z-30',
        'z-40',
        'z-50',
        'z-auto',
        'zoom-in'
    ]),
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
                                hugerte.init({
                                    selector: '#richEditor',
                                    toolbar: 'undo redo styles bold italic alignleft aligncenter alignright numlist bullist link table',
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
                                    extended_valid_elements: 'li[*],span[*],dl[class|id],dt[class|id],dd[class|id],details[open|class|id|data-*],summary[class|id|data-*],div[data-*|class|id|style|contenteditable],option[*],optgroup[*]',
									valid_children: '+span[ul|div|p],+body[dl],+dl[dt|dd],+dt[a|abbr|acronym|b|bdo|big|br|button|cite|code|del|dfn|em|i|img|input|ins|kbd|label|map|q|samp|select|small|span|strike|strong|sub|sup|textarea|tt|var|p],+dd[a|abbr|acronym|b|bdo|big|br|button|cite|code|del|dfn|em|i|img|input|ins|kbd|label|map|q|samp|select|small|span|strike|strong|sub|sup|textarea|tt|var|p|ul|ol|dl],+details[summary|p|div|section|code|a|img|em|strong|ul|ol|table|h1|h2|h3|h4|h5|h6]',
                                    custom_elements: 'dl,dt,dd,details,summary,option,optgroup',
                                    setup: function(editor) {
                                        editor.on('SetContent', function(e) {
                                            openAllDetailsInEditor(editor);
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
