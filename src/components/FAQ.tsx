'use client'

import React, { useState } from 'react'
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'

interface FAQItem {
  id: string
  question: string
  answer: string // Plain text answer
}

interface FAQProps {
  items: FAQItem[]
  className?: string
}

/**
 * FAQ component that displays questions with collapsible answers
 * @param items - Array of FAQ items with question and answer
 * @param className - Optional CSS classes for styling
 */
export function FAQ({ items, className = '' }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  // Check for hash on mount and auto-open the corresponding item
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        const itemIndex = items.findIndex((item) => item.id === hash)
        if (itemIndex !== -1) {
          setOpenItems(new Set([itemIndex]))
          // Scroll to the item after a short delay to ensure DOM is ready
          setTimeout(() => {
            const element = document.getElementById(`faq-${hash}`)
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 500)
        }
      }
    }
  }, []) // Remove items dependency to prevent re-running

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    const item = items[index]

    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
      // Remove hash from URL when closing
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.hash = ''
        window.history.replaceState(null, '', url.toString())
      }
    } else {
      newOpenItems.add(index)
      // Add hash to URL when opening
      if (typeof window !== 'undefined') {
        const url = new URL(window.location.href)
        url.hash = item.id
        window.history.replaceState(null, '', url.toString())
      }
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index)

        return (
          <div
            key={index}
            id={`faq-${item.id}`}
            className="overflow-hidden rounded-lg border border-gray-200 shadow-sm"
          >
            <button
              onClick={() => toggleItem(index)}
              className="flex w-full items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 text-left transition-all duration-200 hover:from-blue-100 hover:to-indigo-100"
              aria-expanded={isOpen}
            >
              <div className="flex items-start space-x-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-600">
                  Q
                </div>
                <span className="pr-4 font-semibold leading-relaxed text-gray-900">
                  {item.question}
                </span>
              </div>
              {isOpen ? (
                <ChevronDownIcon className="h-5 w-5 flex-shrink-0 text-blue-500" />
              ) : (
                <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-blue-500" />
              )}
            </button>
            {isOpen && (
              <div className="border-t border-gray-200 bg-white px-6 py-5">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-600">
                    A
                  </div>
                  <div className="prose-sm faq-answer prose max-w-none leading-relaxed text-gray-700">
                    {item.answer.includes('<') ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item.answer
                            .split('\n\n')
                            .map((paragraph) => {
                              // Handle Markdown headers
                              if (paragraph.trim().startsWith('### ')) {
                                return `<h3 class="text-lg font-semibold text-gray-900 mb-3 mt-6 first:mt-0">${paragraph
                                  .trim()
                                  .substring(4)}</h3>`
                              }
                              if (paragraph.trim().startsWith('## ')) {
                                return `<h2 class="text-xl font-semibold text-gray-900 mb-4 mt-8 first:mt-0">${paragraph
                                  .trim()
                                  .substring(3)}</h2>`
                              }
                              if (paragraph.trim().startsWith('# ')) {
                                return `<h1 class="text-2xl font-bold text-gray-900 mb-6 mt-10 first:mt-0">${paragraph
                                  .trim()
                                  .substring(2)}</h1>`
                              }
                              return `<p class="mb-4 last:mb-0">${paragraph}</p>`
                            })
                            .join(''),
                        }}
                      />
                    ) : (
                      item.answer.split('\n\n').map((paragraph, index) => {
                        // Handle Markdown headers for plain text too
                        if (paragraph.trim().startsWith('### ')) {
                          return (
                            <h3
                              key={index}
                              className="mb-3 mt-6 text-lg font-semibold text-gray-900 first:mt-0"
                            >
                              {paragraph.trim().substring(4)}
                            </h3>
                          )
                        }
                        if (paragraph.trim().startsWith('## ')) {
                          return (
                            <h2
                              key={index}
                              className="mb-4 mt-8 text-xl font-semibold text-gray-900 first:mt-0"
                            >
                              {paragraph.trim().substring(3)}
                            </h2>
                          )
                        }
                        if (paragraph.trim().startsWith('# ')) {
                          return (
                            <h1
                              key={index}
                              className="mb-6 mt-10 text-2xl font-bold text-gray-900 first:mt-0"
                            >
                              {paragraph.trim().substring(2)}
                            </h1>
                          )
                        }
                        return (
                          <p key={index} className="mb-4 last:mb-0">
                            {paragraph}
                          </p>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
