'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface TopLevelNavItemProps {
  href: string
  children: React.ReactNode
}

function NavLink({ href, children }: TopLevelNavItemProps) {
  let isActive = usePathname() === href

  return (
    <Link
      href={href}
      className={
        'text-sm leading-5 transition hover:text-black dark:hover:text-white ' +
        (isActive
          ? 'text-black dark:text-white'
          : 'text-zinc-600 dark:text-zinc-400')
      }
    >
      {children}
    </Link>
  )
}

export function TopLevelNavItem(props: TopLevelNavItemProps) {
  return <NavLink {...props} />
}
