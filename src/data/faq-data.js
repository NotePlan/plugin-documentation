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

If you want <code>newNoteTitle</code> to be used, you must first create the note using the <code>/New Note from Template</code> command or <a href="/core-features/templating-commands">insert the template into a blank note</a>. See <a href="/core-features/templating-anatomy">Template Anatomy</a> for more details on how templates work.`,
  },
  {
    id: 'copying-a-template',
    question: 'How do I copy/paste a template into NotePlan?',
    answer: `There are three ways to copy a template into NotePlan:

## <em>If you have the template as a file (.md or .txt)</em> (the easiest way)

<strong>Option A:</strong> Open up any template in the <code>@Templates</code> folder and click the overflow menu in the upper right and click <code>Show in Finder</code>. Drop the template file you want to add anywhere inside the <code>@Templates</code> folder and it will then be accessible to you as a template.

## <em>If you have the template on the clipboard and want to paste it into NotePlan:</em>

<strong>Option B:</strong> You can create a new template in the <code>@Templates</code> folder, and paste the new template contents into the body. In the new template you pasted, anything between the top "---" (which show up as horizontal line) and the "---" that follows it are <a href="/core-features/templating-anatomy">key-value pairs of properties</a>. You can then copy and paste them one by one into the properties editor and then delete all that information from the body (including the dashes/horizontal lines).

<strong>Option C:</strong> You can create a new template in the <code>@Templates</code> folder, paste the full template of the new content, and then click the overflow menu next to the properties editor and click delete. Leave the template and then come back to it and you will notice that the new properties are now in the properties editor.
`,
  },
  {
    id: 'newNoteTitle-in-frontmatter',
    question:
      'How can a template set the title of the new note in the frontmatter of the resulting note rather than in a H1 at the top of the document?',
    answer: `You specify the title of the new note in the template using the field <code>newNoteTitle</code>. You can then access that field later in your template to create <a href="/core-features/templating-anatomy">frontmatter</a> for the new note and that frontmatter can contain the variable <code>newNoteTitle</code>.

## Example with Dynamic Content

This basic example uses the calendar event information (e.g. right-click on a calendar event and select the following template). It generates a new note with the meeting info for the title (and in the <a href="/advanced-features/templating-examples-frontmatter">frontmatter of the new note</a>).

\`\`\`markdown
---
title: Meeting Event Template
type: meeting-note
folder: My Meeting Folder
newNoteTitle: <%- eventTitle %> - <%- eventDate('YYYY-MM-DD') %>
---
--
title: <%- newNoteTitle %>
category: Meetings
--
Agenda...
\`\`\`

This will result in a new note with the meeting info for the title (and in the <a href="/advanced-features/templating-examples-frontmatter">frontmatter of the new note</a>).

## Example with User Prompt

This example does not use the calendar event information, but instead uses a prompt to get the user to enter the title of the meeting.

\`\`\`markdown
---
title: Meeting Template
type: blank-note
folder: My Meeting Folder
newNoteTitle: <%- prompt("What's the Subject of the meeting?") %>
---
--
title: <%- newNoteTitle %>
category: Meetings
--
Agenda...
\`\`\`

This example uses the <a href="/core-features/templating-prompts">prompt function</a> to get user input for the note title and will use that value for the title of the new note, which will be placed in the <a href="/core-features/templating-anatomy">frontmatter of the new note</a>.

## Key Points

- The <code>newNoteTitle</code> field in the template's <a href="/core-features/templating-anatomy">frontmatter</a> defines what the new note's title will be
- You can reference <code>newNoteTitle</code> in the template body using <code>&lt;%- newNoteTitle %&gt;</code> (see <a href="/core-features/templating-syntax">Template Syntax</a>)
- This allows you to create <a href="/advanced-features/templating-examples-frontmatter">frontmatter in the new note</a> that contains the dynamic title
- The title will appear in both the note's frontmatter and as the note's title in NotePlan
- For more details on using the two dashes ("--") syntax for note frontmatter, see the <a href="/advanced-features/templating-examples-frontmatter">Frontmatter Examples</a> documentation`,
  },
]
