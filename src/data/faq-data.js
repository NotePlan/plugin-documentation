/**
 * FAQ data for the Frequently Asked Questions page
 * This data is used for both search indexing and the interactive FAQ component
 *
 * FAQ Answer Formatting:
 *
 * The FAQ component supports both plain text and HTML formatting in answers. But generally you should use markdown for the answers keeping them as simple as possible and let the JSX component handle the HTML. Only use HTML for more complex formatting.
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
    order: 4,
    question:
      'I created a blank note, added some content, then tried to insert a template using the "Insert Template" button (or the `/insert` or `/append` command) but the newNoteTitle field in the template is not changing the title of the note.',
    answer: `Once a note has a title (and/or some content), then <code>newNoteTitle</code> is ignored. 

If you want <code>newNoteTitle</code> to be used, you must first create the note using the <code>/New Note from Template</code> command or <a href="/core-features/templating-commands">insert the template into a blank note</a>. See <a href="/core-features/templating-anatomy">Template Anatomy</a> for more details on how templates work.`,
  },
  {
    id: 'copying-a-template',
    order: 1,
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
    order: 5,
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
  {
    id: 'template-blank-lines',
    order: 2,
    question:
      'Why is the template inserting so many blank lines in the result and how do I remove them?',
    answer: `When template tags are processed, they are replaced with the text they represent. If each tag is on its own line, the line breaks at the end of each line will remain in the final output, resulting in numerous extra blank lines.

## The Solution: Newline Slurping Tags

To prevent these unwanted blank lines, use the newline slurping tag syntax: <code>-%&gt;</code> instead of simply <code>%&gt;</code>.

## How It Works

- <code>&lt;% tag %&gt;</code> - Keeps the newline after the tag
- <code>&lt;%- tag -%&gt;</code> - Removes the newline after the tag

## Example

<strong>With regular tags (\`%>\`) -- this creates extra lines:</strong>

~~~
<% const name = prompt("What's your name?") %>
<% const age = prompt("What's your age?") %>
<% const color = prompt("What's your favorite color?") %>
<%- name %>
<%- age %>
<%- color %>
~~~

This would result in the following output with the extra blank lines where the prompt tags were:

~~~
 
 
 
John Doe
25
Blue
~~~

<strong>With newline slurping tags (\`-%>\`) at the end of each tag that should not produce any output:</strong>

~~~
<% const name = prompt("What's your name?") -%>
<% const age = prompt("What's your age?") -%>
<% const color = prompt("What's your favorite color?") -%>
<%- name %>
<%- age %>
<%- color %>
~~~

This would result in the following output with no extra blank lines:

~~~
John Doe
25
Blue
~~~

## When to Use Each

- Use <code>&lt;% tag -%&gt;</code> when you want the return/newline after the tag to be removed

- Use <code>&lt;% tag %&gt;</code> when you want to preserve the return/newline after the tag (generally for outputting text)

This is especially important when you have many JavaScript tags or when you want precise control over the spacing in your template output.

For more information, read about <a href="/core-features/templating-tags">Template Tags</a>.`,
  },
  {
    id: 'template-properties-vs-note-frontmatter',
    order: 2.2,
    question:
      "What's the difference between the properties in the top part of the template and the properties in the body of the template? What should I put where?",
    answer: `There are two distinct areas for properties in templates, each serving a different purpose:

## Template Properties (Top Section)

The properties at the top of the template (in the Properties editor, or in the raw text between \`---\` separators) are **template metadata** that control how the template itself works:

- <strong>title</strong>: The name of the template
- <strong>type</strong>: Template type (e.g., meeting-note, blank-note)
- <strong>folder</strong>: Where new notes created from this template should be placed
- <strong>newNoteTitle</strong>: The title for the new note being created
- <strong>Any other template-specific settings</strong>

## Example

<DynamicImage src="note-frontmatter-example.png" alt="Template Properties Example" width="70%" />

In this example:
- The top section defines this as a template that can be used in the context of creating a "meeting-note" or an "empty-note" type template with the title: "Generate note with frontmatter" and will prompt the user to select a folder for the new note. The <code>newNoteTitle</code> field is used to set the title of the new note -- in this case, some text with the date automatically added.
- The middle section (between \`--\`) creates a new note with frontmatter containing any arbitrary properties/frontmatter that the user wants to add to the new note (could have template tags or just text)
- The bottom section is the actual note content

## Note Frontmatter (Body Section - Between \`--\`)

The properties between the \`--\` (two dashes) separators in the template body become the **actual frontmatter of the new note** that gets created. In this example:

- <strong>title</strong>: The actual title of the new note, which it is getting from the <code>newNoteTitle</code> field in the template's top section
- <strong>category</strong>, <strong>priority</strong>, etc.: User-defined properties that will be added to the new note's properties/frontmatter

## What Goes Where?

- <strong>Template properties (top):</strong> How the template works, where notes go, template behavior, variables to be used in the template body or note frontmatter
- <strong>Note frontmatter (middle):</strong> What metadata the resulting note should have
- <strong>Note content (bottom):</strong> The actual content of the new note

For more detailed examples and advanced usage, see the <a href="/advanced-features/templating-examples-frontmatter">Creating Notes with Properties/Frontmatter</a> documentation.`,
  },
  {
    id: 'newNoteTitle-not-overriding-first-line',
    order: 3,
    question:
      'My template has new note frontmatter and a newNoteTitle which is being used to create the note, but when the note is created, the title is actually being pulled from the top title line of my note. Why is the title not what I specified in `newNoteTitle`?',
    answer: `NotePlan historically has used the first line of a note to hold the <code># Title</code> of the note. For this reason, NotePlan reads that line and considers that line the title of your note from this point forward, no matter what title you gave it at note creation time.

If you want your note to keep the title that you specified in <code>newNoteTitle</code> rather than reading the first line of your note body, you simply have to add a <code>title</code> line to your template's new note frontmatter and pull the <code>&lt;%- newNoteTitle %&gt;</code> for the value.

<DynamicImage src="new-note-title-comparison.png" alt="New Note Title Not Overriding First Line" />

The note will have the title from <code>newNoteTitle</code> in its frontmatter, and NotePlan will use that title instead of reading the first <code># Title</code> line from the note body.
`,
  },
  {
    id: 'note-frontmatter-and-h1-title',
    order: 6,
    question:
      'How can I create a new note with both note frontmatter and the note title as a H1 in the first line of the note?',
    answer: `If you want the title to appear as the first line of the note body as a # heading (the traditional NotePlan title format), you can prompt the user for the new note's title using the <code>newNoteTitle</code> tag in the template's frontmatter, and then reference the <code>&lt;%- newNoteTitle %&gt;</code> for the value in your template's body.

<DynamicImage src="note-frontmatter-and-h1.png" alt="New Note Title with H1" />

The resulting new note's first line will have the title from <code>newNoteTitle</code> (whatever you entered in the prompt)as a H1 (# Title) heading, such as:

<DynamicImage src="frontmatter-and-newnotetitle-result.png" alt="New Note Title with H1" />

For more details on how to use the <code>title</code> line in the template's new note frontmatter, see the <a href="/advanced-features/templating-examples-frontmatter">Creating Notes with Properties/Frontmatter</a> documentation.`,
  },
  {
    id: 'create-xcallback-url-for-new-note',
    question:
      'How do I get an xcallback URL to run a template to create a new note?',
    answer: `The easiest way is to download the "Link Creator" plugin and run the following sequence of commands:

<DynamicImage src="x-callback-new-note.png" alt="Callback link to create a new note using a template" />

This will give you a URL that looks like this:

<code>noteplan://x-callback-url/runPlugin?pluginID=np.Templating&command=Create%20new%20note%20using%20template&arg0=My%20Template%20Title</code>

You can then attach that URL to a keyboard shortcut or can paste it as a link in your daily note or you can use the Favorites plugin to create this link as a <code>/ command</code> in the NotePlan Command Bar!

## Alternative: Manual URL Creation

If you prefer to create the URL manually, the basic format is:

<code>noteplan://x-callback-url/runPlugin?pluginID=np.Templating&command=Create%20new%20note%20using%20template&arg0=My%20Template%20Title</code>

Where:
- <code>My%20Template%20Title</code> is the name of your template (URL-encoded)

## Adding Variables

If you want to pass variables to a template using x-callbacks, you should use the <a href="/templating-templateRunner">Template Runner</a> template.`,
  },
].sort((a, b) => a.order - b.order)
