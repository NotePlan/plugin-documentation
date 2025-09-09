'use client'

import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { BuildInfo } from '@/components/BuildInfo'

function SmallPrint() {
  return (
    <div className="flex flex-col items-center justify-between gap-5 border-t border-zinc-900/5 pt-8 dark:border-white/5 sm:flex-row">
      <div className="flex flex-col items-center gap-2 sm:items-start">
        <p className="text-xs text-zinc-600 dark:text-zinc-400">
          &copy; Copyright {new Date().getFullYear()}. All rights reserved.
        </p>
        <BuildInfo />
      </div>
      <div className="flex gap-4">
        <Link
          href="/privacy"
          className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          Privacy
        </Link>
        <Link
          href="/terms"
          className="text-xs text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
        >
          Terms
        </Link>
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-2xl space-y-10 pb-16 lg:max-w-5xl">
      <div className="flex flex-col items-center gap-5">
        {/* Logo already includes its own <Link>; avoid nesting links to prevent hydration errors */}
        <Logo />
        <nav className="flex gap-8 text-sm font-medium text-zinc-800 dark:text-zinc-200">
          <Link href="/docs">Documentation</Link>
          <Link href="/support">Support</Link>
          <Link href="/github">GitHub</Link>
        </nav>
      </div>
      <SmallPrint />
    </footer>
  )
}
