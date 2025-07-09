const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

// Import the shared navigation structure
const { navigation } = require('../src/data/navigation.js')

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

  // Iterate through each section in the navigation
  for (const section of navigation) {
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
