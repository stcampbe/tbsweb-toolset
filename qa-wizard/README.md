# BeforeYouPost™ - QA/Prototype Wizard Feature Guide

Welcome to BeforeYouPost™, a powerful tool designed to validate, preview, and prototype your HTML content before it goes live. This guide highlights the major features to help you QA your work effectively.

---

## 🎨 Live Preview & Prototyping

The core of the wizard is its powerful live preview modal, which allows you to see exactly how your code will render and to create fully functional, shareable prototypes.

* **Live Preview**: Instantly view your HTML code in a sandboxed `iframe`.
* **Framework Toggling**: Switch the preview's CSS and JavaScript between three frameworks with one click:
    * **WET4**: Standard Government of Canada theme.
    * **GCDS**: The modern Canada.ca Design System.
    * **WET+**: A hybrid mode that includes both WET4 and GCDS for compatibility testing.
* **Language Toggling**: Instantly switch the `lang` attribute and other language-specific elements between **English (EN)** and **French (FR)**.
* **Responsive Breakpoints**: Resize the preview `iframe` to test your content at different screen sizes (**XS, SM, MD, Full**).
* **Export Prototype**: Download a complete, self-contained `prototype.html` file of your preview, including all necessary CSS and JS. This file can be shared with anyone for review.

---

## ⚙️ Preview Customization

Fine-tune the preview environment to match your specific testing needs. All customization options are available in a collapsible "Customize" panel within the preview modal.

* **Content Toggles**:
    * **Show/Hide Title**: Add or remove the main `<h1>` page title.
    * **Custom Width**: Toggle the main content `container` div on or off to see how your content behaves at full browser width.
    * **Disable CSS**: Turn off all WET/GCDS styling to inspect the raw HTML structure.
* **Source URL & Image Control**: Dynamically switch all links and image paths between three modes:
    * **Local**: Points to local/relative paths (e.g., `/content/canadasite/...`).
    * **Preview**: Points to the `canada-preview.adobecqms.net` server.
    * **Live**: Points to the live `www.canada.ca` server.
* **Visual Outlines**: Toggle on/off dashed outlines for **Sections** (`<section>`) and colored outlines for **Headings** (`<h1>` - `<h6>`) to easily visualize your document's structure.
* **Byline Insertion**: Add a standard "From: Treasury Board of Canada Secretariat" byline in either English or French.

---

## ✅ Code Validation & Cleaning

The wizard provides both automatic and manual tools to ensure your code is clean, valid, and accessible before you post it.

* **Live HTML Validation**: As you type in the code editor, the tool automatically checks for dozens of potential issues in real-time.
* **Error Reporting Panel**: A dedicated panel lists all validation errors, such as:
    * Unclosed or mismatched tags.
    * Duplicate IDs.
    * Broken anchor links (`#`).
    * Improperly nested elements (e.g., a block element inside an inline one).
    * Missing required attributes (e.g., `alt` on `<img>`).
    * Use of deprecated tags or attributes.
* **Click-to-Highlight**: Clicking on an error in the results panel instantly highlights the corresponding line in the code editor.
* **Quick-Clean Tools**: One-click buttons to perform common cleanup tasks:
    * **Clean Spaces**: Trims whitespace and removes extra spaces.
    * **Clean URLs**: Converts absolute `www.canada.ca` URLs to relative paths.
    * **Time Tags**: Automatically finds dates in your text and wraps them in the proper `<time>` tag.
    * **Fix FN IDs**: Corrects footnote `id` numbering to ensure links work correctly.
    * **Colophon**: Inserts a properly formatted copyright/ISBN section.

---

## 🛠️ Editor & Code Management

The Monaco-powered code editor is equipped with tools for an efficient workflow.

* **Auto-Indent & Auto-Encode**: One-click buttons to beautify your code and convert special characters to their proper HTML entities.
* **Undo/Redo**: Full undo and redo support for any changes you make in the editor.
* **Import/Export HTML**: Easily load an HTML file into the editor or save your work.
* **Unsaved Changes Warning**: If you try to close the tab with content in the editor, the browser will warn you to prevent accidental data loss.
* **Entity Highlighting**: All HTML entities (e.g., `&#160;`) are highlighted in **<span style="color:yellow;">yellow</span>** directly in the code editor for better visibility.
