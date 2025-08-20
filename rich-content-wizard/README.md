# WordToCode™ - Rich Content Wizard Feature Guide

Welcome to WordToCode™, the all-in-one tool for cleaning, structuring, and preparing rich content for the web. This guide highlights the major features to help you streamline your workflow.

---

## ✍️ Core Editors & Views

The wizard is built around a powerful dual-editor system, allowing you to work visually or with the raw code.

* **Dual-View Toggle**: Instantly switch between the **Rich-Text Editor** (a "what you see is what you get" interface) and the **HTML Code Editor** (a professional-grade Monaco editor for full control).
* **Live Synchronization**: Content is automatically synced between the two views when you toggle.

---

## 🧹 Content Cleaning & Automation

This is the core of the wizard, designed to transform messy source documents (especially from Microsoft Word) into clean, web-ready HTML.

* **Clean MSO**: The primary feature for removing Microsoft Office-specific junk code, unnecessary tags, and inline styles. This can be run manually with the **"Clean MSO"** button or set to run automatically every time you switch from the Rich-Text view to the HTML view.
* **Quick Formatting Panel**: A sidebar with a suite of powerful, toggleable actions that can be applied together with a single "Format" button:
    * **Structural Cleanup**: Automatically fix heading levels, wrap content in proper `<section>` tags, and clean up messy line breaks (`<br>`).
    * **Code Hygiene**: Clean extra spaces, convert `<u>`, `<b>`, and `<i>` tags to their semantic equivalents (`<strong>`, `<em>`), and remove paragraphs from within table cells.
    * **Link & ID Management**: Clean URLs to make them relative and fix footnote ID numbering.
    * **Time Tags**: Automatically find dates in your text (e.g., "September 5, 2025") and wrap them in the correct `<time>` tag.
* **Auto-Indent & Auto-Encode**: One-click buttons to beautify your code with proper indentation and convert special characters to their correct HTML entities.

---

## ➕ Quick Insert Tools

Generate complex, structured HTML blocks with easy-to-use modals.

* **Element IDs**: Opens a modal to automatically add structured, sequential IDs to your choice of elements: **sections**, **headings**, **figures**, and **tables**.
* **Footnote List**: Generates a complete, accessible footnote `<aside>` block with the number of footnotes you specify.
* **Colophon**: Generates the standard copyright and ISBN/ISSN block for the bottom of a page, with options for language and monarch.
* **Table of Contents**:
    * **Page ToC**: Creates an "On this page" list from the H2s (and optionally H3s) in your document.
    * **Section ToC**: Creates "In this section" lists under each H2, built from the H3s, H4s, etc. that follow it.

---

## 🛠️ Advanced Editor Tools

For power users who need maximum control over the code.

* **Advanced Find & Replace**: A robust search panel built into the code editor.
    * **Regex Support**: Use regular expressions for complex pattern matching.
    * **Search Scoping**: Limit your search and replace actions to only the content within a specific **tag** (e.g., `<p>`) or a specific **ID** (e.g., `#my-section`).
    * **Sequencing**: Perform replacements with an incrementing or decrementing number (e.g., rename multiple items to `image-1`, `image-2`, `image-3`).
* **Undo/Redo**: Full undo and redo history for any changes made in the code editor.
* **Import/Export HTML**: Easily load an HTML file into the editor or save your work.
* **Unsaved Changes Warning**: If you try to close the tab with content in the editor, the browser will warn you to prevent accidental data loss.
* **Entity Highlighting**: All HTML entities (e.g., `&#160;`) are highlighted in **<span style="color:gold;">gold</span>** directly in the code editor for better visibility.
