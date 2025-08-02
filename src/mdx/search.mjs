import { slugifyWithCounter } from '@sindresorhus/slugify'
import glob from 'fast-glob'
import * as fs from 'fs'
import { toString } from 'mdast-util-to-string'
import * as path from 'path'
import { remark } from 'remark'
import remarkMdx from 'remark-mdx'
import { createLoader } from 'simple-functional-loader'
import { filter } from 'unist-util-filter'
import { SKIP, visit } from 'unist-util-visit'
import * as url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const processor = remark().use(remarkMdx).use(extractSections)
const slugify = slugifyWithCounter()

function isObjectExpression(node) {
  return (
    node.type === 'mdxTextExpression' &&
    node.data?.estree?.body?.[0]?.expression?.type === 'ObjectExpression'
  )
}

function excludeObjectExpressions(tree) {
  return filter(tree, (node) => !isObjectExpression(node))
}

function escapeTemplateTags(content) {
  // Escape HTML angle brackets to prevent them from being misinterpreted by the MDX parser.
  return content.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function extractSections() {
  return (tree, { sections }) => {
    slugify.reset()

    visit(tree, (node) => {
      if (node.type === 'heading' || node.type === 'paragraph') {
        let content = toString(excludeObjectExpressions(node))
        content = escapeTemplateTags(content)
        if (node.type === 'heading') {
          let hash = node.depth === 1 ? null : slugify(content)
          if (node.depth <= 2) {
            sections.push([content, hash, []])
          } else {
            sections.at(-1)?.[2].push(content)
          }
        } else {
          sections.at(-1)?.[2].push(content)
        }
        return SKIP
      }
    })
  }
}

export default function (nextConfig = {}) {
  let cache = new Map()

  return Object.assign({}, nextConfig, {
    webpack(config, options) {
      config.module.rules.push({
        test: __filename,
        use: [
          createLoader(function () {
            let appDir = path.resolve('./src/app')
            this.addContextDependency(appDir)

            let files = glob.sync('**/*.mdx', { cwd: appDir })
            let data = files.map((file) => {
              let url =
                '/' +
                file.replace(/\/page\.mdx$/, '').replace(/^page\.mdx$/, '')
              // Handle root page case
              if (url === '/') url = ''

              let mdx = fs.readFileSync(path.join(appDir, file), 'utf8')

              let sections = []

              if (cache.get(file)?.[0] === mdx) {
                sections = cache.get(file)[1]
              } else {
                let vfile = { value: mdx, sections }
                processor.runSync(processor.parse(vfile), vfile)
                cache.set(file, [mdx, sections])
              }

              // Special handling for FAQ page to include FAQ data
              if (file === 'debugging/frequently-asked-questions/page.mdx') {
                console.log('=== PROCESSING FAQ PAGE ===')
                try {
                  const faqDataPath = path.resolve('./src/data/faq-data.js')
                  const faqDataContent = fs.readFileSync(faqDataPath, 'utf8')
                  console.log('FAQ data content length:', faqDataContent.length)

                  // Extract FAQ content from the data file using a more robust approach
                  // Use a more robust regex approach that handles multi-line strings with quotes
                  // The searchText is a multi-line string that ends with a single quote
                  const searchTextMatch = faqDataContent.match(
                    /searchText:\s*'([\s\S]*?)',/,
                  )
                  const questionMatch = faqDataContent.match(
                    /question:\s*'([\s\S]*?)',/,
                  )
                  const idMatch = faqDataContent.match(/id:\s*'([^']+)',/)

                  if (searchTextMatch && questionMatch && idMatch) {
                    const searchText = searchTextMatch[1]
                    const question = questionMatch[1]
                    const id = idMatch[1]

                    console.log('FAQ found:', {
                      id: id,
                      question: (question?.substring(0, 50) || '') + '...',
                      searchText: (searchText?.substring(0, 50) || '') + '...',
                    })

                    if (question && searchText && id) {
                      // Clean the content to ensure it serializes properly
                      const cleanQuestion = question.replace(/['"`]/g, "'")
                      const cleanSearchText = searchText.replace(/['"`]/g, "'")

                      // Add the FAQ section with the ID as the hash for deep linking
                      // Also add the FAQ page title for context
                      sections.push([cleanQuestion, id, [cleanSearchText]])
                      
                      // Add a section for the FAQ page title to provide context
                      sections.push(['Frequently Asked Questions (FAQ)', null, ['FAQ page containing common questions and answers']])
                      console.log('Added FAQ to sections')
                      console.log('FAQ section added:', {
                        title: cleanQuestion.substring(0, 50),
                        id: id,
                        content: cleanSearchText.substring(0, 100),
                        contentLength: cleanSearchText.length,
                      })
                    }
                  }
                  console.log(
                    'Total sections after FAQ processing:',
                    sections.length,
                  )
                  console.log(
                    'All sections after FAQ processing:',
                    sections.map(([title, hash, content]) => ({
                      title: title?.substring(0, 50),
                      contentLength: content?.length || 0,
                    })),
                  )
                } catch (error) {
                  console.warn(
                    'Could not process FAQ data file:',
                    error.message,
                  )
                }
              }

              // Debug: Check if FAQ data is being returned correctly
              if (url === '/debugging/frequently-asked-questions') {
                console.log('=== RETURNING FAQ DATA ===')
                console.log('URL:', url)
                console.log('Sections count:', sections.length)
                console.log(
                  'Sections:',
                  sections.map(([title, hash, content]) => ({
                    title: title?.substring(0, 50),
                    contentLength: content?.length || 0,
                    contentPreview: content?.[0]?.substring(0, 100),
                  })),
                )
              }

              return { url, sections }
            })

            // When this file is imported within the application
            // the following module is loaded:
            return `
              console.log('=== BUILDING SEARCH INDEX ===')
              import FlexSearch from 'flexsearch'

              let sectionIndex = new FlexSearch.Document({
                tokenize: 'forward',
                document: {
                  id: 'url',
                  index: [
                    {
                      field: 'title',
                      tokenize: 'forward',
                      optimize: true,
                      resolution: 9
                    },
                    {
                      field: 'content',
                      tokenize: 'forward',
                      optimize: true,
                      resolution: 9,
                      minlength: 1,
                      context: true
                    }
                  ],
                  store: ['title', 'pageTitle', 'content']
                }
              })
              
              console.log('FlexSearch Document created:', typeof sectionIndex)
              console.log('FlexSearch Document properties:', Object.keys(sectionIndex))

              let data = ${JSON.stringify(data)}

              console.log('Total pages to index: ' + data.length)
              // Debug: Show all URLs being indexed
              console.log('All URLs being indexed:', data.map(d => d.url))
              
              
              
              for (let { url, sections } of data) {
                if (url === '/debugging/frequently-asked-questions') {
                  console.log('=== INDEXING FAQ PAGE ===')
                  console.log('FAQ sections count: ' + sections.length)
                  console.log('FAQ sections:', sections.map(([title, hash, content]) => ({
                    title: title?.substring(0, 50),
                    contentLength: content?.length || 0,
                    contentPreview: content?.[0]?.substring(0, 100)
                  })))
                }
                for (let [title, hash, content] of sections) {
                  const indexedContent = [title, ...content].join('\\n')
                  if (url === '/debugging/frequently-asked-questions') {
                    console.log('  FAQ Section: "' + (title?.substring(0, 50) || '') + '"')
                    console.log('  FAQ Content preview: ' + indexedContent.substring(0, 200) + '...')
                  }
                  try {
                    sectionIndex.add({
                      url: url + (hash ? ('#' + hash) : ''),
                      title,
                      content: indexedContent,
                      pageTitle: hash ? sections[0][0] : undefined,
                    })
                  } catch (error) {
                    console.error('  Error adding to index:', error)
                  }
                }
              }

              function findMatchContext(text, query, contextLength = 100) {
                const lowerText = text.toLowerCase()
                const lowerQuery = query.toLowerCase()
                const index = lowerText.indexOf(lowerQuery)
                if (index === -1) return null
                
                let start = Math.max(0, index - contextLength)
                let end = Math.min(text.length, index + query.length + contextLength)
                
                // Adjust to word boundaries
                while (start > 0 && text[start - 1].match(/\w/)) start--
                while (end < text.length && text[end].match(/\w/)) end++
                
                let preview = text.slice(start, end)
                if (start > 0) preview = '...' + preview
                if (end < text.length) preview = preview + '...'
                
                // Calculate the adjusted match position in the preview
                const matchStartInPreview = index - start
                const matchEndInPreview = matchStartInPreview + query.length
                
                return {
                  text: preview,
                  matchStart: matchStartInPreview,
                  matchEnd: matchEndInPreview
                }
              }

              export function search(query, options = {}) {
                console.log('Searching for: "' + query + '"')
                

                
                // Try different search strategies
                let results = sectionIndex.search(query, {
                  ...options,
                  enrich: true,
                  field: ['title', 'content']
                })

                console.log('Found ' + results.length + ' result sets with default options')
                
                // If no results, try with more lenient options
                if (results.length === 0) {
                  results = sectionIndex.search(query, {
                    ...options,
                    enrich: true,
                    suggest: true,
                    field: ['title', 'content']
                  })
                  console.log('Found ' + results.length + ' result sets with suggest: true')
                }
                
                // If still no results, try with threshold
                if (results.length === 0) {
                  results = sectionIndex.search(query, {
                    ...options,
                    enrich: true,
                    threshold: 1,
                    field: ['title', 'content']
                  })
                  console.log('Found ' + results.length + ' result sets with threshold: 1')
                }

                if (results.length === 0) {
                  console.log('No results found with any strategy')
                  return []
                }

                // Convert all results to our format
                const allResults = results.flatMap((resultSet, index) => {
                  const isFromTitleField = index === 0 // title field results come first
                  return resultSet.result.map(item => {
                    const preview = findMatchContext(item.doc.content, query)
                    return {
                      url: item.id,
                      title: item.doc.title,
                      pageTitle: item.doc.pageTitle,
                      preview,
                      isTitleMatch: isFromTitleField
                    }
                  })
                })

                // Deduplicate based on content (title + preview)
                const seen = new Set()
                const uniqueResults = allResults.filter(item => {
                  // Create a unique key based on the content that matters
                  const key = JSON.stringify({
                    title: item.title,
                    pageTitle: item.pageTitle,
                    previewText: item.preview?.text,
                    matchStart: item.preview?.matchStart,
                    matchEnd: item.preview?.matchEnd
                  })
                  
                  if (seen.has(key)) {
                    return false
                  }
                  seen.add(key)
                  return true
                })

                // Sort with title matches first
                return uniqueResults.sort((a, b) => {
                  if (a.isTitleMatch && !b.isTitleMatch) return -1
                  if (!a.isTitleMatch && b.isTitleMatch) return 1
                  return 0
                })
              }
            `
          }),
        ],
      })

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
  })
}
