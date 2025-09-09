# WordToCode™ - Rich Content Wizard 🧙‍♂️

Welcome to WordToCode™, your all-in-one toolkit for transforming messy documents into clean, accessible, and standards-compliant web content. This wizard is packed with powerful automation, generation, and validation tools to dramatically speed up your workflow.

---

## 🖥️ Core Interface: Dual-View Editor

The wizard is built around a powerful, synchronized dual-editor system, giving you the flexibility to work visually or dive into the code.

* **Rich-Text Editor**: A "what you see is what you get" (WYSIWYG) interface perfect for quick edits, pasting content, and visual arrangement. It includes guide markings to help visualize structural elements like sections and headings.
* **HTML Code Editor**: A professional-grade **Monaco Editor** (the engine behind VS Code) for full control over the markup. It features syntax highlighting, undo/redo history, and advanced tools.
* **Live Synchronization**: Seamlessly toggle between views with the "Go to HTML" and "Go to Rich-Text" buttons. Your content is automatically synced.

---

## 🧹 Automated Content Cleaning & Formatting

This is the heart of the wizard. These features are designed to instantly clean up messy source code, especially from Microsoft Word, and apply consistent formatting.

### One-Click MSO Cleanup
* **Manual & Automatic Cleaning**: The **"Clean MSO"** button instantly removes Microsoft Office-specific junk code, empty tags, and messy inline styles.
* **Auto-Clean on Toggle**: For an even faster workflow, enable the **"Auto-Clean MSO"** switch to have the cleanup process run automatically every time you switch from the Rich-Text to the HTML view.

### Quick Formatting Panel
The sidebar contains a suite of powerful, toggleable actions that can be applied all at once with the **"Format"** button. Mix and match these tools to suit your needs:
* **Structural Formatting**:
    * **Auto-Level Headings**: Intelligently restructures heading levels (e.g., `<h1>`, `<h2>`) to be logical and sequential.
    * **Auto-Section**: Automatically wraps heading blocks in the proper `<section>` tags.
    * **Clean Single Breaks**: Converts single `<br>` tags into proper paragraph structures.
* **Code Hygiene**:
    * **Clean Spaces**: Removes extra whitespace and redundant non-breaking spaces.
    * **Clean `<p>` in Tables**: Removes paragraph tags from within table cells, a common issue from Word exports.
    * **Clean Formatting Tags**: Converts non-semantic `<u>`, `<b>`, and `<i>` tags to their correct semantic equivalents (`<strong>` and `<em>`).
* **Link & ID Management**:
    * **Clean URLs**: Converts absolute Canada.ca URLs to the correct relative paths.
    * **Fix FN IDs**: Corrects footnote ID numbering and references for accessibility.
    * **Set Time Tags**: Automatically finds dates (e.g., "September 8, 2025") and wraps them in the correct `<time>` tag.
* **Global Actions**:
    * **Auto-Indent**: Beautifies your HTML with clean, consistent indentation.
    * **Auto-Encode**: Converts special characters to their proper HTML entities.

---

## ➕ Intelligent Content Generation

Generate complex, accessible HTML blocks in seconds using the "Quick Insert" tools.

* **Table of Contents (ToC)**:
    * **Page ToC**: Creates an "On this page" list from the H2s (and optionally H3s) in your document.
    * **Section ToC**: Creates "In this section" lists under each H2, built from the subsequent H3s, H4s, etc.
    * *Both ToC types are available in English and French.*
* **Element IDs**: Opens a modal to automatically add structured, sequential IDs to your choice of elements: **sections**, **headings**, **figures**, and **tables**.
* **Figure (w/ desc)**: Inserts a complete, accessible `<figure>` block, including a `<figcaption>` and a `<details>` element for long descriptions.
* **Footnote List**: Generates a complete WET-compliant footnote `<aside>` block with the number of footnotes you specify.
* **Definition List**: Automatically formats a simple list of bolded terms and descriptions into a proper `<dl>`, `<dt>`, and `<dd>` structure.
* **Colophon**: Inserts the standard copyright and ISBN/ISSN block, with options for language and the reigning monarch.

---

## 🛠️ Code Editor Power Tools

For users who need maximum control, the HTML view includes a set of advanced tools.

### Advanced Find & Replace
A robust search panel with powerful capabilities:
* **Regex Support**: Use regular expressions for complex pattern matching. A handy **Regex Guide** is included.
* **Search Scoping**: Limit your search to the content within a specific **HTML tag** (e.g., only in `<p>` tags) or an element with a specific **ID** (e.g., only in `#my-section`).
* **Sequencing**: Perform replacements with an incrementing or decrementing number. For example, you can rename multiple items to `image-1`, `image-2`, `image-3`, etc., in a single operation.

### Built-in HTML Validator
* Click the **"Validate"** button to check your code for errors.
* The validator identifies issues like **duplicate IDs**, **mismatched tags**, improper element **nesting**, **deprecated tags/attributes**, and common **accessibility problems** (missing `alt` text, missing `scope` on table headers).
* Results are displayed in a list, and clicking an error will instantly jump you to the corresponding line in the code editor.

### Utility and File Management
* **Undo/Redo**: Full history for all changes made in the code editor.
* **Import/Export**: Easily load an HTML file into the editor or save your current work as an `index.html` file.
* **Unsaved Changes Warning**: The tool will warn you before you close the tab if you have unsaved work.
* **Entity Highlighting**: All HTML entities (like `&#160;`) are highlighted in gold for easy identification.

---

## 🚀 Live Preview & Prototyping

Click the **"View Preview"** button to open a powerful, real-time preview of your content in a modal window.

* **Framework Switching**: Instantly toggle the preview between **WET4**, **GCDS**, and a hybrid **WET+GCDS** environment.
* **Language Toggling**: Switch between **English** and **French** page templates.
* **Full Customization**:
    * Set a custom page title (`<h1>`).
    * Add a standard English or French **byline**.
    * Simulate different environments by changing image and URL paths between **Local**, **Preview**, and **Live** sources.
    * Toggle CSS on or off to check raw content structure.
* **Responsive Breakpoint Testing**: Resize the preview to **XS, SM, MD,** or **Full** width to test responsiveness.
* **Visual Helpers**: Overlay outlines on **sections** and **headings** to easily debug your document structure.
* **Export Prototype**: Download a fully self-contained HTML file of the current preview, perfect for sharing and testing.
