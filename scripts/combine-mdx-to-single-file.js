const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// The menu structure defining the order of documentation
const menu = [
  {
    title: 'Getting Started',
    links: [
      { title: 'Introduction', href: '/getting-started/templating-intro' },
      {
        title: 'Installation',
        href: '/getting-started/templating-installation',
      },
      { title: 'Basic Concepts', href: '/templating-terminology' },
    ],
  },
  {
    title: 'Core Features',
    links: [
      { title: 'Template Anatomy', href: '/core-features/templating-anatomy' },
      { title: 'Template Syntax', href: '/core-features/templating-syntax' },
      { title: 'Template Tags', href: '/core-features/templating-tags' },
      {
        title: 'Template Commands',
        href: '/core-features/templating-commands',
      },
      { title: 'Prompts', href: '/core-features/templating-prompts' },
    ],
  },
  {
    title: 'Built-in Modules',
    links: [
      {
        title: 'Global Commands',
        href: '/built-in-modules/templating-modules-global',
      },
      {
        title: 'Date Module',
        href: '/built-in-modules/templating-modules-date',
      },
      {
        title: 'Time Module',
        href: '/built-in-modules/templating-modules-time',
      },
      {
        title: 'Tasks Module',
        href: '/built-in-modules/templating-modules-tasks',
      },
      {
        title: 'Note Module',
        href: '/built-in-modules/templating-modules-note',
      },
      {
        title: 'System Module',
        href: '/built-in-modules/templating-modules-system',
      },
      {
        title: 'Web Services Module',
        href: '/built-in-modules/templating-modules-web-services',
      },
      { title: 'Web Module', href: '/built-in-modules/templating-modules-web' },
      {
        title: 'Utility Module',
        href: '/built-in-modules/templating-modules-utility',
      },
    ],
  },
  {
    title: 'Advanced Features',
    links: [
      {
        title: 'Javascript in Templates',
        href: '/advanced-features/javascript-in-templates',
      },
      {
        title: 'Conditional Logic',
        href: '/advanced-features/templating-examples-conditional',
      },
      {
        title: 'Looping',
        href: '/advanced-features/templating-examples-looping',
      },
      {
        title: 'Frontmatter',
        href: '/advanced-features/templating-examples-frontmatter',
      },
      {
        title: 'String Interpolation',
        href: '/advanced-features/templating-examples-string-interpolation',
      },
      {
        title: 'Import/Include code or content',
        href: '/advanced-features/import-include',
      },
      { title: 'File Blocks', href: '/advanced-features/file-blocks' },
    ],
  },
  {
    title: 'Examples & Templates',
    links: [
      {
        title: 'Javascript in Templates',
        href: '/examples-templates/templating-examples-js-weather',
      },
      {
        title: 'Web Services',
        href: '/examples-templates/templating-examples-web',
      },
      {
        title: 'Date/Time Examples',
        href: '/examples-templates/templating-examples-datetime',
      },
      {
        title: 'Quick Notes',
        href: '/examples-templates/templating-quicknotes',
      },
    ],
  },
  {
    title: 'Configuration',
    links: [
      { title: 'Plugin Settings', href: '/configuration/templating-settings' },
    ],
  },
]

// Function to convert href to file path
function hrefToFilePath(href) {
  // Remove leading slash
  const relativePath = href.startsWith('/') ? href.substring(1) : href

  // Handle special cases for root paths
  if (!relativePath.includes('/')) {
    return path.join('src/app', relativePath, 'page.mdx')
  }

  return path.join('src/app', relativePath, 'page.mdx')
}

// Function to filter out lines starting with "import "
function filterImportLines(content) {
  return content
    .split('\n')
    .filter((line) => !line.trim().startsWith('import '))
    .join('\n')
}

// Main function to concatenate files in the order specified by the menu
function concatenateFiles() {
  let outputContent = ''
  let processedCount = 0
  let errorCount = 0

  // Iterate through each section in the menu
  for (const section of menu) {
    // Add section title
    outputContent += `\n\n# ${section.title}\n\n`

    // Process each link in the section
    for (const link of section.links) {
      const filePath = hrefToFilePath(link.href)

      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf8')

          // Extract frontmatter if it exists
          const { data, content: markdownContent } = matter(content)

          // Filter out import lines
          const filteredContent = filterImportLines(markdownContent)

          // Add separator and file info
          outputContent += '\n\n---\n'
          outputContent += `## ${link.title}\n`
          outputContent += `Path: ${link.href}\n`
          outputContent += '---\n\n'

          // Add file content
          outputContent += filteredContent

          processedCount++
        } else {
          console.error(`File not found: ${filePath} (from ${link.href})`)
          errorCount++
        }
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error)
        errorCount++
      }
    }
  }

  // Write the concatenated content to a file
  fs.writeFileSync('All_Docs_Concatenated.md', outputContent)
  console.log(
    `Processed ${processedCount} files successfully, with ${errorCount} errors.`,
  )
  console.log('All documentation concatenated to documentation.md')
}

// Run the main function
concatenateFiles()
