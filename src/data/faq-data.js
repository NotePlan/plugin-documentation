/**
 * FAQ data for the Frequently Asked Questions page
 * This data is used for both search indexing and the interactive FAQ component
 *
 * FAQ Answer Formatting:
 *
 * The FAQ component supports both plain text and HTML formatting in answers.
 *
 * Plain Text:
 * - Use \n\n (double line breaks) to create paragraph breaks
 * - Example: "Paragraph one.\n\nParagraph two."
 *
 * HTML Formatting:
 * - Use HTML tags for rich formatting
 * - Common tags: <strong>, <em>, <code>, <ul>, <li>, <br>
 * - Example: "This has <strong>bold text</strong> and <code>code snippets</code>."
 *
 * Markdown Headers:
 * - Use # for H1 headers
 * - Use ## for H2 headers
 * - Use ### for H3 headers
 * - Headers must be on their own line (separated by \n\n)
 * - Example: "# Main Title\n\n## Section Title\n\n### Subsection"
 *
 * Images:
 * - Use standard HTML <img> tags
 * - Images should be placed in src/images/ directory
 * - Reference with relative paths: "/images/filename.png"
 * - Example: <img src="/images/example.png" alt="Description" class="w-full max-w-md rounded" />
 *
 * Available CSS Classes:
 * - w-full: Full width
 * - max-w-sm/md/lg/xl: Maximum width constraints
 * - rounded: Rounded corners
 * - shadow-md: Drop shadow
 * - border: Border
 * - mb-4: Bottom margin
 * - mt-4: Top margin
 *
 * Example with images and formatting:
 * answer: `Here's how to set up templating:
 *
 * <strong>Step 1:</strong> Install the plugin
 * <img src="/images/plugin-installer.png" alt="Plugin installer" class="w-full max-w-md rounded mb-4" />
 *
 * <strong>Step 2:</strong> Configure settings
 * <img src="/images/plugin-settings.png" alt="Plugin settings" class="w-full max-w-md rounded" />
 *
 * Each step builds on the previous one.`
 */
export const faqData = [
  {
    id: 'newNoteTitle-not-working',
    question:
      'I created a blank note, added some content, then tried to insert a template using the "Insert Template" button (or the `/insert` or `/append` command) but the newNoteTitle field in the template is not changing the title of the note.',
    answer: `Once a note has a title (and/or some content), then <code>newNoteTitle</code> is ignored. 

If you want <code>newNoteTitle</code> to be used, you must first create the note using the <code>/New Note from Template</code> command or insert the template into a blank note.`,
  },
  {
    id: 'copying-a-template',
    question: 'How do I copy/paste a template into NotePlan?',
    answer: `There are three ways to copy a template into NotePlan:

## <em>If you have the template as a file (.md or .txt)</em> (the easiest way)

<strong>Option A:</strong> Open up any template in the <code>@Templates</code> folder and click the overflow menu in the upper right and click <code>Show in Finder</code>. Drop the template file you want to add anywhere inside the <code>@Templates</code> folder and it will then be accessible to you as a template.

## <em>If you have the template on the clipboard and want to paste it into NotePlan:</em>

<strong>Option B:</strong> You can create a new template in the <code>@Templates</code> folder, and paste the new template contents into the body. In the new template you pasted, anything between the top "---" (which show up as horizontal line) and the "---" that follows it are key-value pairs of properties. You can then copy and paste them one by one into the properties editor and then delete all that information from the body (including the dashes/horizontal lines).

<strong>Option C:</strong> You can create a new template in the <code>@Templates</code> folder, paste the full template of the new content, and then click the overflow menu next to the properties editor and click delete. Leave the template and then come back to it and you will notice that the new properties are now in the properties editor.`,
  },
]
