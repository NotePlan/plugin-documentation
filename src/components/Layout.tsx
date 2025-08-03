'use client'

import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'
import { Logo } from '@/components/Logo'
import { Navigation } from '@/components/Navigation'
import { Section, SectionProvider } from '@/components/SectionProvider'

export function Layout({
  children,
  allSections,
}: {
  children: React.ReactNode
  allSections: Record<string, Section[]>
}) {
  let pathname = usePathname()
  let sections = allSections[pathname] ?? []

  return (
    <SectionProvider sections={sections}>
      <div className="relative flex h-full w-full max-w-full overflow-x-hidden">
        <motion.header
          layoutScroll
          className="contents lg:pointer-events-none lg:fixed lg:inset-0 lg:z-40 lg:flex"
        >
          <div className="contents lg:pointer-events-auto lg:block lg:w-72 lg:overflow-y-auto lg:border-r lg:border-zinc-900/10 lg:px-6 lg:pb-8 lg:pt-4 lg:dark:border-white/10 xl:w-80">
            <div className="hidden lg:flex">
              <Logo />
            </div>
            <Header />
            <Navigation className="hidden lg:mt-10 lg:block" />
          </div>
        </motion.header>
        <div className="w-full max-w-full flex-1 overflow-x-hidden lg:ml-72 xl:ml-80">
          <div className="relative flex h-full w-full max-w-full flex-col overflow-x-hidden px-4 pt-14 sm:px-6 lg:px-8">
            <main className="w-full max-w-full flex-auto overflow-x-hidden">
              {children}
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </SectionProvider>
  )
}
