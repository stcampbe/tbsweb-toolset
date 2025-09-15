# TBS Web Content Wizard 🧙‍♂️

## Overview

The TBS Web Content Wizard is a comprehensive, browser-based toolkit designed to streamline the creation, formatting, and validation of web content for the Treasury Board of Canada Secretariat (TBS) and its Adobe Experience Manager (AEM) platform.

It excels at converting messy documents, particularly from Microsoft Office, into clean, accessible, and standards-compliant HTML. The wizard features a powerful dual-editor system, extensive automation tools, and a real-time prototyping environment that supports WET4, GCDS (GC Design System), and hybrid frameworks.

The application is divided into two primary toolsets for a focused workflow: **Content Mode** for general document authoring and **Table Mode** for advanced table manipulation.

---

## Key Features

### General Interface & Utilities

*   **Dual-View Editor**: A core feature is the synchronized dual-editor system.
    *   **Rich-Text Editor**: A "what you see is what you get" (WYSIWYG) interface for visual editing, pasting content, and arranging elements. It includes guide markings to help visualize document structure.
    *   **HTML Code Editor**: A professional-grade Monaco Editor (the engine behind VS Code) for full control over the markup, featuring syntax highlighting and advanced tools.
*   **Live Preview & Prototyping**: A powerful real-time preview of your content in a modal window.
    *   **Framework Switching**: Instantly toggle the preview between WET4, GCDS, and a hybrid WET+GCDS environment.
    *   **Language & Customization**: Switch between English and French page templates, set custom page titles, add standard bylines, and simulate different image/URL paths (Local, Preview, Live).
    *   **Responsive Testing**: Resize the preview to XS, SM, MD, or Full width to test responsiveness.
*   **Built-in HTML Validator**: Click the "Validate" button to check your code for errors. The validator identifies issues like duplicate IDs, mismatched tags, improper nesting, deprecated elements, and common accessibility problems (e.g., missing `alt` text, missing `scope` on table headers). Results are clickable and jump you to the error line in the code editor.
*   **Advanced Find & Replace**: A robust search panel in the HTML view with support for regular expressions, case sensitivity, and scoping searches to specific tags or ID'd elements. It also includes a sequencing feature for complex replacement tasks.
*   **File Management**: Easily import an HTML file into the editor or save your current work.

---

### Content Mode Features

This is the primary toolset for authoring and cleaning document content.

#### Automated Cleaning

*   **One-Click MSO Cleanup**: The "Clean MSO" button instantly removes Microsoft Office-specific code, empty tags, and messy inline styles. It intelligently processes Word-generated lists and tables into clean HTML structures.
*   **Auto-Clean on Toggle**: An optional "Auto-Clean MSO" switch can be enabled to run the cleanup process automatically every time you switch from the Rich-Text to the HTML view.

#### Quick Formatting Panel

A sidebar with one-click toggles and a "Format" button to apply various transformations:
*   **Clean Spaces & URLs**: Fixes whitespace issues and resolves Outlook SafeLinks.
*   **Set Time Tags**: Automatically finds dates and wraps them in accessible `<time>` tags.
*   **Auto-Level Headings & Auto-Section**: Ensures a logical heading structure (H2, H3, etc.) and wraps content in `<section>` tags.
*   **Semantic Formatting**: Converts `<b>` to `<strong>`, `<i>` to `<em>`, and removes `<u>` tags.

#### Intelligent Content Generation

*   **Table of Contents (ToC)**:
    *   **Page ToC**: Creates an "On this page" list from the H2s (and optionally H3s).
    *   **Section ToC**: Creates "In this section" lists under each H2, built from subsequent H3s, H4s, etc.
*   **Element IDs**: A modal to automatically add structured, sequential IDs to sections, headings, figures, and tables.
*   **WET-Compliant Components**:
    *   **Figure (w/ desc)**: Inserts a complete, accessible `<figure>` block, including a `<figcaption>` and a `<details>` element for long descriptions.
    *   **Footnote List**: Generates a complete footnote `<aside>` block.
    *   **Definition List**: Formats a simple list into a proper `<dl>`, `<dt>`, and `<dd>` structure.
    *   **Colophon**: Inserts the standard copyright and ISBN/ISSN block.

---

### Table Mode Features

This dedicated toolset provides advanced functionality for creating and managing complex HTML tables.

*   **Table Inspector**: A dropdown menu automatically detects and lists all tables in the document, allowing you to select and focus on a specific one for editing.
*   **Universal Formatting**: Apply formatting options to **all** tables simultaneously. Options include adding base WET classes, borders, striping, headers, and setting universal alignment for captions and headers.
*   **Custom Formatting with Live Preview**: A powerful interface for fine-tuning a single selected table.
    *   **Live Interactive Preview**: The selected table is rendered in a live iframe. You can click, drag, or use modifier keys (Ctrl, Shift) to select individual or multiple cells.
    *   **Cell-Level Styling**: Apply styles like bolding, alignment, background colors, or custom CSS classes directly to your selected cells and see the changes immediately.
*   **Accessibility Engine**:
    *   **Auto-Scope/ID**: Automatically applies correct accessibility attributes. It uses `scope` for simple tables and generates a full `id/headers` system for complex tables.
    *   **Force ID/Headers**: Manually force the complex `id/headers` system on any table.
*   **Utility Tools**:
    *   **Auto-Responsive**: Wraps all tables in `<div class="table-responsive">`.
    *   **Number Formatting**: Formats numbers within tables to English (`1,234.56`) or French (`1 234,56`) standards.
    *   **Reset Functions**: Granular controls to remove formatting, responsive wrappers, or accessibility attributes from all tables or just the selected one.

## Technologies Used

*   **HugeRTE**: Core Rich-Text Editor
*   **Monaco Editor**: Core HTML Code Editor
*   **Tailwind CSS**: User Interface Styling
*   **Font Awesome**: Icons
*   **HTML Beautify**: Code Indentation and Formatting
