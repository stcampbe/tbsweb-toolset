# BeforeYouPost - A QA and Prototyping Wizard
This tool allows TBS webmasters to preview a fully rendered copy of their work before posting to Canada.ca and AEM.
Features:

\-          Limited code editor with a preview only (no typing) window

\-          Ability to full screen either side or drag and resize.

\-          CTRL+R “lock” to prevent accidental loss of data, asking user to confirm refresh

\-          **Code Editor**

o   Editing controls including clear all, undo, redo, copy all, import and export html files

o   Editor specific search and replace (CTRL+F and CTRL+H) with regex

o   Code cleaning features:

§  Clean spaces (double+ spaces, empty lines, tabs)

§  Clean URLs (convert all non AEM local URL’s to /content/canadasite)

§  Time tags

§  Fix FN ID’s (rectify duplicate sup ID’s)

§  Clean Entities to convert chars like “&nbsp;” to “&#160;” (should be done after options above, can be repeated)

§  Auto-Indent (can be repeated as “Clean Spaces” will wipe tabs)

o   Editor is able to accept both English and French with all feature above working in both, in addition to the new GCDS coding schema

o   Colophon dialog box – insert at bottom without coding. The “Year” field is auto-filling current system time year, can be overwritten. “King” is also selected by default, but option to choose “Queen” exists as well.

\-          **Preview**

o   Viewer is specifically focused on controllable elements within <main> as there is no coding needed for header and footer.

o   Ability to switch between coding for WET4, GC Design System (latest alpha source) or “WET+”

§  WET4 – CSS/JS loaded from the current live versions of the **GCWeb theme** being used on **Canada.ca**.

§  GCDS – CSS/JS loaded from the latest live **alpha GC Design System version** sourced from **cdn.design-system.alpha.canada.ca**

§  WET+ - CSS/JS loaded from both WET4 and GCDS as they are **currently implemented as experimental in AEM.**

o   EN/FR toggle to switch HTML wrapper, title, and byline. **NOT a full language toggle switch. Wizard UI will stay English and you must input your own French content**

o   Export prototype feature to download a full portable HTML version of the preview

o   Search function for any text within preview window

o   Highlight function to toggle highlighting for sections and headings

o   Customization:

§  Custom width option if you code your own container for full width design features

§  Hide title to mimic the disable H1 title feature in AEM (to manually code your own within the editor)

§  Disable CSS

§  Custom title

§  Byline insert

§  Image and URL source toggles to switch between local\* (/content/canadasite), preview\*\* (canada-preview.adobecqms.net), and live (canada.ca). **This does not change anything in the editor.**

·       \* Local sources will never work within the wizard as this is outside of AEM

·       \*\*User must be on TBS network to view
