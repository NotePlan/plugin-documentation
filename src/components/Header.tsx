'use client'

import { usePathname } from 'next/navigation'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { Logo } from '@/components/Logo'
import dynamic from 'next/dynamic'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TopLevelNavItem } from '@/components/TopLevelNavItem'
import {
  MobileNavigation,
  MobileNavigationDialog,
} from '@/components/MobileNavigation'
import { clsx } from 'clsx'

// `ssr: false` ensures the component is only rendered in the browser.
const Search = dynamic(
  async () => {
    const mod = await import('@/components/Search')
    return mod.Search
  },
  { ssr: false },
)

export function Header() {
  let pathname = usePathname()
  let isHomePage = pathname === '/'
  let { isOpen: isMobileNavOpen } = useMobileNavigationStore()

  return (
    <div
      className={clsx(
        'fixed inset-x-0 top-0 z-50 flex h-14 items-center justify-between gap-12 px-4 transition sm:px-6 lg:z-30 lg:px-8',
        'bg-white/80 backdrop-blur-sm dark:bg-zinc-900/80',
      )}
    >
      <div className="flex items-center gap-x-4">
        <div className="lg:hidden">
          <MobileNavigation />
        </div>
        <Logo />
      </div>
      <div className="flex items-center gap-x-6">
        <div className="hidden md:flex md:gap-x-6">
          <TopLevelNavItem href="https://noteplan.co/templates">
            Template Gallery
          </TopLevelNavItem>
          <TopLevelNavItem href="https://help.noteplan.co/article/70-javascript-plugin-api">
            NotePlan API
          </TopLevelNavItem>
          <TopLevelNavItem href="https://discord.gg/D4268MT">
            Support
          </TopLevelNavItem>
        </div>
        <div className="flex items-center gap-x-4 sm:gap-x-6">
          <div className="-ml-0.5">
            <Search />
          </div>
          <div className="hidden md:block md:h-5 md:w-px md:bg-zinc-900/10 md:dark:bg-white/15" />
          <ThemeToggle />
        </div>
      </div>
      <MobileNavigationDialog />
    </div>
  )
}
