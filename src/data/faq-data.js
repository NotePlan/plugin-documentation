/**
 * FAQ data for the Frequently Asked Questions page
 * This data is used for both search indexing and the interactive FAQ component
 */
export const faqData = [
  {
    id: 'newNoteTitle-not-working',
    question:
      'I am inserting a template in a blank note using the "Insert Template" button (or the `/insert` or `/append` command) and have a newNoteTitle field in my template, and the template is being rendered but the title is not being set.',
    answer: `If you first create a new note and then try to insert a template using insert or append (or the "Insert Template" button), any newNoteTitle already been created in the default folder or wherever you created it. If you want to set the title using the newNoteTitle field:

The easiest/quickest way is to simply use /new note from template command. This is the best way to create a note because it can read its title from newNoteTitle and can get the folder to put it in from the folder field in the template.

Otherwise, you can set your title in the first line of the template with a # your title`,
  },
]
