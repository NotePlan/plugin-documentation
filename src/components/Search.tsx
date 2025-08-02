'use client'

import {
  forwardRef,
  Fragment,
  Suspense,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  type AutocompleteApi,
  createAutocomplete,
  type AutocompleteState,
  type AutocompleteCollection,
} from '@algolia/autocomplete-core'
import { Dialog, Transition } from '@headlessui/react'
import clsx from 'clsx'

type Result = {
  url: string
  title: string
  pageTitle?: string
  preview?: {
    text: string
    matchStart: number
    matchEnd: number
  }
  isTitleMatch: boolean
}

type Autocomplete = AutocompleteApi<
  Result,
  React.SyntheticEvent,
  React.MouseEvent,
  React.KeyboardEvent
>

function useAutocomplete({ close }: { close: () => void }) {
  let id = useId()
  let router = useRouter()
  let [autocompleteState, setAutocompleteState] = useState<
    AutocompleteState<Result>
  >({
    collections: [],
    completion: null,
    context: {
      searchQuery: '',
    },
    isOpen: false,
    activeItemId: null,
    status: 'idle',
    query: '',
  })

  let [autocomplete] = useState<Autocomplete>(() =>
    createAutocomplete<
      Result,
      React.SyntheticEvent,
      React.MouseEvent,
      React.KeyboardEvent
    >({
      id,
      placeholder: 'Find something...',
      defaultActiveItemId: 0,
      onStateChange({ state }) {
        setAutocompleteState(state)
      },
      shouldPanelOpen({ state }) {
        return state.query !== ''
      },
      getSources({ query }) {
        // Temporarily disabled search to isolate metadata issue
        return Promise.resolve([
          {
            sourceId: 'documentation',
            getItems() {
              return []
            },
            getItemUrl({ item }) {
              return item.url
            },
            getItemInputValue({ item }) {
              return item.title
            },
            onSelect({ item }) {
              router.push(item.url)
              close()
            },
          },
        ])
      },
      navigator: {
        navigate({ itemUrl }) {
          close()
          router.push(itemUrl)
        },
      },
    }),
  )

  return { autocomplete, autocompleteState }
}

function SearchIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.25 4.25 0 1 0-6.02-6 4.25 4.25 0 0 0 6.02 6Zm0 0 3.24 3.25"
      />
    </svg>
  )
}

function NoResultsIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12.01 12a4.237 4.237 0 0 0 1.24-3c0-.62-.132-1.207-.37-1.738M12.01 12c-.333.333-.692.62-1.07.86M12.01 12l3.24 3.25m-3.715-9.661a4.25 4.25 0 0 0-5.975 5.908M4.5 15.5l11-11"
      />
    </svg>
  )
}

function LoadingIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  let id = useId()

  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <circle cx="10" cy="10" r="5.5" strokeLinejoin="round" />
      <path
        stroke={`url(#${id})`}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.5 10a5.5 5.5 0 1 0-5.5 5.5"
      />
      <defs>
        <linearGradient
          id={id}
          x1="13"
          x2="9.5"
          y1="9"
          y2="15"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="currentColor" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function SearchButton(props: React.ComponentPropsWithoutRef<'button'>) {
  let [modifierKey, setModifierKey] = useState<string>()

  useEffect(() => {
    setModifierKey(
      /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform) ? '⌘' : 'Ctrl ',
    )
  }, [])

  return (
    <button
      type="button"
      className="hidden h-8 w-full items-center gap-2 rounded-full bg-white pl-2 pr-3 text-sm text-zinc-500 ring-1 ring-zinc-900/10 transition hover:ring-zinc-900/20 dark:bg-white/5 dark:text-zinc-400 dark:ring-inset dark:ring-white/10 dark:hover:ring-white/20 lg:flex focus:[&:not(:focus-visible)]:outline-none"
      {...props}
    >
      <SearchIcon className="h-5 w-5 stroke-current" />
      Find something...
      <kbd className="ml-auto text-2xs text-zinc-400 dark:text-zinc-500">
        <kbd className="font-sans">{modifierKey}</kbd>
        <kbd className="font-sans">K</kbd>
      </kbd>
    </button>
  )
}

function HighlightedText({
  text,
  matchStart,
  matchEnd,
}: {
  text: string
  matchStart: number
  matchEnd: number
}) {
  if (!text) return null
  if (matchStart === -1) return <>{text}</>

  return (
    <>
      {text.slice(0, matchStart)}
      <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
        {text.slice(matchStart, matchEnd)}
      </strong>
      {text.slice(matchEnd)}
    </>
  )
}

function SearchDialog({
  open,
  setOpen,
  className,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  className?: string
}) {
  let formRef = useRef<HTMLFormElement>(null)
  let panelRef = useRef<HTMLDivElement>(null)
  let inputRef = useRef<HTMLInputElement>(null)

  let close = useCallback(() => {
    setOpen(false)
  }, [setOpen])

  let { autocomplete, autocompleteState } = useAutocomplete({
    close,
  })

  useEffect(() => {
    if (!open) {
      return
    }

    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key === 'k' &&
        (event.metaKey || event.ctrlKey) &&
        !event.defaultPrevented
      ) {
        event.preventDefault()
        close()
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => autocomplete.setQuery('')}
    >
      <Dialog onClose={close} className={clsx('fixed inset-0 z-50', className)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-400/25 backdrop-blur-sm dark:bg-black/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto px-4 py-4 sm:px-6 sm:py-20 md:py-32 lg:px-8 lg:py-[15vh]">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto overflow-hidden rounded-lg bg-zinc-50 shadow-xl ring-1 ring-zinc-900/7.5 dark:bg-zinc-900 dark:ring-zinc-800 sm:max-w-3xl">
              <div {...autocomplete.getRootProps({})}>
                <form
                  ref={formRef}
                  {...autocomplete.getFormProps({
                    inputElement: inputRef.current,
                  })}
                >
                  <div className="relative">
                    <SearchIcon className="pointer-events-none absolute left-3 top-3.5 h-5 w-5 stroke-zinc-400 dark:stroke-zinc-500" />
                    <input
                      ref={inputRef}
                      className="block w-full appearance-none bg-transparent py-4 pl-10 pr-4 text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:text-white sm:text-sm"
                      {...autocomplete.getInputProps({
                        inputElement: inputRef.current,
                      })}
                    />
                  </div>

                  {autocompleteState.isOpen && (
                    <div
                      ref={panelRef}
                      className="border-t border-zinc-200 bg-white empty:hidden dark:border-zinc-100/5 dark:bg-white/2.5"
                      {...autocomplete.getPanelProps({})}
                    >
                      {autocompleteState.collections.map(
                        (collection, index) => {
                          let items = collection.items

                          if (items.length === 0) {
                            return (
                              <div className="p-6 text-center" key={index}>
                                <NoResultsIcon className="mx-auto h-5 w-5 stroke-zinc-900 dark:stroke-zinc-600" />
                                <p className="mt-2 text-xs text-zinc-700 dark:text-zinc-400">
                                  Nothing found for{' '}
                                  <strong className="break-words font-semibold text-zinc-900 dark:text-white">
                                    {autocompleteState.query}
                                  </strong>
                                  . Please try again.
                                </p>
                              </div>
                            )
                          }

                          return items.map((item, itemIndex) => (
                            <div
                              className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                              {...autocomplete.getItemProps({
                                item,
                                source: collection.source,
                              })}
                              key={itemIndex}
                            >
                              {item.pageTitle && (
                                <div className="text-sm font-semibold text-zinc-900 dark:text-white">
                                  {item.pageTitle}
                                </div>
                              )}
                              <div
                                className={clsx(
                                  'text-sm font-semibold text-zinc-900 dark:text-white',
                                  !item.pageTitle && 'text-base',
                                  item.pageTitle &&
                                    'mt-1 font-normal text-zinc-600 dark:text-zinc-400',
                                )}
                              >
                                {item.title}
                              </div>
                              {item.preview && (
                                <div className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">
                                  <HighlightedText
                                    text={item.preview.text}
                                    matchStart={item.preview.matchStart}
                                    matchEnd={item.preview.matchEnd}
                                  />
                                </div>
                              )}
                            </div>
                          ))
                        },
                      )}
                    </div>
                  )}

                  {autocompleteState.status === 'stalled' && (
                    <div className="p-4">
                      <div className="flex justify-center">
                        <LoadingIcon className="h-5 w-5 animate-spin stroke-zinc-200 text-zinc-900 dark:stroke-zinc-800 dark:text-emerald-400" />
                      </div>
                    </div>
                  )}
                </form>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export function Search() {
  let [isOpen, setIsOpen] = useState(false)
  let buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (
        event.key === 'k' &&
        (event.metaKey || event.ctrlKey) &&
        !event.defaultPrevented
      ) {
        event.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
        aria-label="Find something..."
        onClick={() => setIsOpen(true)}
      >
        <SearchIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
      </button>
      <SearchDialog open={isOpen} setOpen={setIsOpen} />
    </>
  )
}
