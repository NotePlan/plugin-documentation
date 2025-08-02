/**
 * FAQ data for the Frequently Asked Questions page
 * This data is used for both search indexing and the interactive FAQ component
 */
export const faqData = [
  {
    id: 'newNoteTitle-not-working',
    question:
      'I created a blank note, added some content, then tried to insert a template using the "Insert Template" button (or the `/insert` or `/append` command) but the newNoteTitle field in the template is not changing the title of the note.',
    answer: `Once a note has a title (and/or some content), then newNoteTitle is ignored. If you want newNoteTitle to be used, you must first create the note using the \`/New Note from Template\` command or insert the template into a blank note.`,
  },
]
