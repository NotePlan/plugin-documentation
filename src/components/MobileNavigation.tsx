'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '@/components/Navigation'
import { create } from 'zustand'

interface MobileNavigationStore {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useMobileNavigationStore = create<MobileNavigationStore>(
  (set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    close: () => set({ isOpen: false }),
  }),
)

function MenuIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function XIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M6 18L18 6M6 6l12 12"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function MobileNavigation() {
  let { isOpen, open, close } = useMobileNavigationStore()
  let pathname = usePathname()
  let searchParams = useSearchParams()
  let initialPathname = useRef(pathname)
  let initialSearchParams = useRef(searchParams)

  useEffect(() => {
    if (
      pathname !== initialPathname.current ||
      searchParams !== initialSearchParams.current
    ) {
      close()
    }
  }, [pathname, searchParams, close])

  return (
    <>
      <button
        type="button"
        className="flex h-6 w-6 items-center justify-center rounded-md transition hover:bg-zinc-900/5 dark:hover:bg-white/5"
        aria-label="Toggle Navigation"
        onClick={open}
      >
        <MenuIcon className="h-5 w-5 stroke-zinc-900 dark:stroke-white" />
      </button>
    </>
  )
}

export function MobileNavigationDialog() {
  let { isOpen, close } = useMobileNavigationStore()

  return (
    <Dialog
      open={isOpen}
      onClose={close}
      className="fixed inset-0 z-50 flex items-start overflow-y-auto bg-zinc-900/50 backdrop-blur-sm lg:hidden"
    >
      <Dialog.Panel
        as={motion.div}
        initial={{ opacity: 0, x: -32 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -32 }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
        className="relative min-h-full w-[80vw] max-w-sm bg-white px-4 pb-12 pt-5 dark:bg-zinc-900 sm:px-6"
      >
        <div className="flex items-center">
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 outline-none"
            onClick={close}
          >
            <span className="sr-only">Close menu</span>
            <XIcon className="h-6 w-6 stroke-zinc-900 dark:stroke-white" />
          </button>
        </div>
        <Navigation className="mt-5 px-1" />
      </Dialog.Panel>
    </Dialog>
  )
}
