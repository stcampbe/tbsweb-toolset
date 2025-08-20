# AutoTabler™ Feature Guide

Welcome to AutoTabler™, your powerful wizard for creating, formatting, and managing HTML tables. This guide highlights the major features to help you get the most out of the tool.

---

## 🎨 Global Formatting & Styling

These actions affect **all tables** currently in the editor. They are perfect for applying a consistent style across your document.

* **Format ALL Tables**: Opens a comprehensive modal with dozens of options.
    * **Base Properties**: Automatically add table IDs, create captions, and fix empty cells.
    * **Structure & Styling**: Convert rows/columns to headers (`<th>`), apply `active` classes, and add styles like **bordered**, **striped**, and **hover**.
    * **Alignment**: Set the text alignment for captions, headers, and data cells across all tables.
* **Auto-Responsive**: Instantly wraps every table in a `<div class="table-responsive">` to ensure they are mobile-friendly.
* **Auto-Scope/ID**: A powerful accessibility feature that automatically adds the correct `scope`, `id`, and `headers` attributes to all tables, making them compliant and understandable for screen readers.

---

## ✍️ Per-Table Customization

For more granular control, select a specific table from the dropdown menu to access the **Custom Format** panel.

* **Table Select Dropdown**: A list of all tables found in your code. Selecting a table highlights it in the editor and loads its properties into the Custom Format panel.
* **Live Preview**: The Custom Format panel features a live, interactive preview of your selected table in an `iframe`. Any change you make is reflected here instantly.
* **Custom Formatting**: Apply all the same great formatting options as the global tool, but only to the selected table.
* **Cell-Specific Actions**: Fine-tune your table with precision tools:
    * **Toggle Bold**: Make header (`<th>`) or data (`<td>`) cell text bold or normal.
    * **Align & Indent**: Override global styles to align or indent text in specific cells you've selected in the preview.
    * **Add Custom Class**: Apply any CSS class you need to selected cells for unique styling.
* **Force Scope/ID**: If the automatic scoping isn't right for a complex table, you can force a "simple" (`scope`) or "complex" (`id`/`headers`) accessibility structure on the selected table.

---

## 🛠️ Editor & Code Management

These tools help you manage the code in the editor efficiently.

* **Auto-Indent**: Cleans up your code with proper indentation, making it clean and readable.
* **Auto-Encode**: Converts special characters (like `’`, `«`, `»`) and non-breaking spaces (`&nbsp;`) into their proper HTML numeric entities (e.g., `&#8217;`) for maximum compatibility.
* **Undo/Redo**: Full undo and redo support for any changes you make.
* **Import/Export HTML**: Easily load an HTML file into the editor or save your work.
* **Unsaved Changes Warning**: If you try to close the tab with content in the editor, the browser will warn you to prevent accidental data loss.
* **Entity Highlighting**: All HTML entities (e.g., `&#160;`) are highlighted in **<span style="color:gold;">gold</span>** directly in the code editor for better visibility.

---

## ✨ Special Tools

* **Number Formatting (ENG/FRA)**: Automatically formats numbers inside your tables to either English (`1,234.56`) or French (`1 234,56`) standards, including handling currency symbols and non-breaking spaces.
* **Drag-to-Select**: In the Custom Format preview, you can click and drag your mouse to select multiple cells, just like in a spreadsheet. This works with `Ctrl+Click` and `Shift+Click` for more complex selections.
