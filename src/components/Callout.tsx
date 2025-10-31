import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { XCircleIcon } from '@heroicons/react/20/solid'
import { InformationCircleIcon } from '@heroicons/react/20/solid'
import Parser from 'html-react-parser'

/**
 * Process inline markdown elements like **bold**, `code`, etc.
 * @param text - The text to process
 * @returns Processed text with HTML tags
 */
function processInlineMarkdown(text: string): string {
  // First process bold (**text**) - must happen before italic
  let processed = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  
  // Then process italic (*text*) - but not single asterisks that are part of **
  processed = processed.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
  
  // Finally handle inline code
  processed = processed.replace(
    /`([^`]+)`/g,
    '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>',
  )
  
  // Don't escape HTML tags - let them pass through
  // This allows existing HTML tags in the content to work properly
  return processed
}

/**
 * Process markdown description with support for paragraphs and lists
 * @param description - The markdown description to process
 * @returns Processed HTML string
 */
function processDescription(description: string): string {
  const paragraphs = description
    .trim()
    .split('\n\n')
    .filter((p) => p.trim().length > 0)

  return paragraphs
    .map((paragraph) => {
      // Handle lists (lines starting with - or *)
      if (
        paragraph.trim().startsWith('- ') ||
        paragraph.trim().startsWith('* ')
      ) {
        const listItems = paragraph
          .trim()
          .split('\n')
          .filter(
            (line) =>
              line.trim().startsWith('- ') || line.trim().startsWith('* '),
          )
        if (listItems.length > 0) {
          const listHtml = listItems
            .map(
              (item) =>
                `<li>${processInlineMarkdown(
                  item.trim().substring(2),
                )}</li>`,
            )
            .join('')
          return `<ul class="mt-2 ml-6 list-disc">${listHtml}</ul>`
        }
      }

      // Process inline markdown and wrap in paragraph
      return `<p class="mb-2 last:mb-0">${processInlineMarkdown(paragraph)}</p>`
    })
    .join('')
}

export default function Callout({
  type,
  title,
  description,
  children,
}: {
  type: string
  title: string
  description: string
  children: React.ReactNode
}) {
  let bgColor = ''
  let textColor = ''

  switch (type) {
    case 'warning':
      bgColor = 'bg-yellow-50 dark:bg-yellow-900/20'
      textColor = 'text-yellow-800 dark:text-yellow-400'
      break
    case 'critical':
      bgColor = 'bg-red-50 dark:bg-red-900/20'
      textColor = 'text-red-700 dark:text-red-400'
      break
    default:
      bgColor = 'bg-blue-50 dark:bg-blue-900/20'
      textColor = 'text-blue-700 dark:text-blue-400'
  }

  return (
    <div className={`rounded-md p-4 ` + bgColor}>
      <div className="flex">
        <div className="mt-0.5 flex-shrink-0">
          {type == 'warning' ? (
            <ExclamationTriangleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          ) : type == 'critical' ? (
            <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
          ) : (
            <InformationCircleIcon
              className="h-5 w-5 text-blue-400"
              aria-hidden="true"
            />
          )}
        </div>
        <div className="ml-3">
          {title && (
            <h3 className={`m-0 text-sm font-medium ` + textColor}>{title}</h3>
          )}
          {description ? (
            <div className={`${title ? 'mt-2 ' : ''}text-sm ` + textColor}>
              {Parser(processDescription(description))}
            </div>
          ) : children ? (
            <div
              className={
                `callout-content ${title ? 'mt-2 ' : ''}text-sm ` + textColor
              }
            >
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
