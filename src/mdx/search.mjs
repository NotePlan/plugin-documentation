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
  return content.replace(/<%/g, '<%').replace(/%>/g, '%>')
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
              let url = '/' + file.replace(/(^|\/)page\.mdx$/, '')
              let mdx = fs.readFileSync(path.join(appDir, file), 'utf8')
              mdx = escapeTemplateTags(mdx)

              let sections = []

              if (cache.get(file)?.[0] === mdx) {
                sections = cache.get(file)[1]
              } else {
                let vfile = { value: mdx, sections }
                processor.runSync(processor.parse(vfile), vfile)
                cache.set(file, [mdx, sections])
              }

              return { url, sections }
            })

            // When this file is imported within the application
            // the following module is loaded:
            return `
              import FlexSearch from 'flexsearch'

              let sectionIndex = new FlexSearch.Document({
                tokenize: 'full',
                document: {
                  id: 'url',
                  index: [
                    {
                      field: 'title',
                      tokenize: 'full',
                      optimize: true,
                      resolution: 9
                    },
                    {
                      field: 'content',
                      tokenize: 'full',
                      optimize: true,
                      resolution: 9,
                      minlength: 2,
                      context: true
                    }
                  ],
                  store: ['title', 'pageTitle', 'content']
                }
              })

              let data = ${JSON.stringify(data)}

              for (let { url, sections } of data) {
                for (let [title, hash, content] of sections) {
                  sectionIndex.add({
                    url: url + (hash ? ('#' + hash) : ''),
                    title,
                    content: [title, ...content].join('\\n'),
                    pageTitle: hash ? sections[0][0] : undefined,
                  })
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
                // Search in both title and content fields
                const results = sectionIndex.search(query, {
                  ...options,
                  enrich: true,
                  field: ['title', 'content']
                })

                if (results.length === 0) {
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
