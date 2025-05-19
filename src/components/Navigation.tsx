'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useMobileNavigationStore } from '@/components/MobileNavigation'
import { Section, useSectionStore } from '@/components/SectionProvider'
import { Tag } from '@/components/Tag'
import { remToPx } from '@/lib/remToPx'

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        fill="currentColor"
      />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10l-3.293-3.293a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        fill="currentColor"
      />
    </svg>
  )
}

interface NavGroupLink {
  title: string
  href: string
  children?: Array<{
    title: string
    href: string
  }>
}

interface NavGroup {
  title: string
  href?: string
  links: Array<NavGroupLink>
}

function useInitialValue<T>(value: T, condition = true) {
  let initialValue = useRef(value).current
  return condition ? initialValue : value
}

function TopLevelNavItem({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <li className="md:hidden">
      <Link
        href={href}
        className="block py-1 text-sm text-zinc-600 transition hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
      >
        {children}
      </Link>
    </li>
  )
}

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false,
}: {
  href: string
  children: React.ReactNode
  tag?: string
  active?: boolean
  isAnchorLink?: boolean
}) {
  const handleClick = (e: React.MouseEvent) => {
    // Store the current scroll position
    const nav = document.querySelector('nav')
    if (nav) {
      localStorage.setItem('navScrollPosition', nav.scrollTop.toString())
    }
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-current={active ? 'page' : undefined}
      className={`flex justify-between gap-2 ${
        isAnchorLink ? 'pl-7' : 'pl-4'
      } rounded-lg py-2 pr-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 dark:text-zinc-400'
      }`}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  )
}

function VisibleSectionHighlight({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  let [sections, visibleSections] = useSectionStore((state) => [
    state.sections,
    state.visibleSections,
  ])

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0],
    ),
  )

  let itemHeight = remToPx(2)
  let height = isPresent ? Math.max(1, visibleSections.length) * itemHeight : 0
  let top =
    isPresent && visibleSections.length > 0
      ? remToPx(2) + firstVisibleSectionIndex * itemHeight
      : 0

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-4 top-0 bg-zinc-50 will-change-transform dark:bg-zinc-800/50"
      style={{ borderRadius: 8, height, top }}
    />
  )
}

function ActivePageMarker({
  group,
  pathname,
}: {
  group: NavGroup
  pathname: string
}) {
  let itemHeight = remToPx(2)
  let offset = remToPx(0.25)
  let activePageIndex = group.links.findIndex((link) => link.href === pathname)
  let top = offset + activePageIndex * itemHeight

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-amber-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  )
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroup
  className?: string
}) {
  let { isOpen } = useMobileNavigationStore()
  let [sections, visibleSections] = useSectionStore((state) => [
    state.sections,
    state.visibleSections,
  ])
  let pathname = usePathname()
  let isActiveGroup =
    group.links.findIndex((link) => link.href === pathname) !== -1

  return (
    <li className={clsx('relative mt-0', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        {!isOpen && (
          <VisibleSectionHighlight group={group} pathname={pathname} />
        )}
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <AnimatePresence initial={false}>
          <motion.ul
            role="list"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.1 },
            }}
            exit={{ opacity: 0 }}
            className="border-l border-transparent"
          >
            {group.links.map((link) => (
              <motion.li key={link.href} layout="position" className="relative">
                <NavLink href={link.href} active={link.href === pathname}>
                  {link.title}
                </NavLink>
                {link.href === pathname && sections.length > 0 && (
                  <motion.ul
                    role="list"
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      transition: { delay: 0.1 },
                    }}
                    exit={{ opacity: 0 }}
                  >
                    {sections.map((section) => (
                      <motion.li key={section.id} layout="position">
                        <NavLink
                          href={`${link.href}#${section.id}`}
                          tag={section.tag}
                          isAnchorLink
                          active={visibleSections.includes(section.id)}
                        >
                          {section.title}
                        </NavLink>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </motion.li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>
    </li>
  )
}

const navigation: Array<NavGroup> = [
  {
    title: 'Getting Started',
    links: [
      { title: 'Introduction', href: '/getting-started/templating-intro' },
      {
        title: 'Installation',
        href: '/getting-started/templating-installation',
      },
      { title: 'Basic Concepts', href: '/templating-terminology' },
      { title: 'Common Use Cases', href: '/templating-miscellaneous' },
    ],
  },
  {
    title: 'Core Features',
    links: [
      { title: 'Template Anatomy', href: '/core-features/templating-anatomy' },
      { title: 'Template Syntax', href: '/core-features/templating-syntax' },
      { title: 'Template Tags', href: '/core-features/templating-tags' },
      {
        title: 'Template Commands',
        href: '/core-features/templating-commands',
      },
      { title: 'Prompts', href: '/core-features/templating-prompts' },
    ],
  },
  {
    title: 'Built-in Modules',
    links: [
      {
        title: 'Date Module',
        href: '/built-in-modules/templating-modules-date',
      },
      {
        title: 'Time Module',
        href: '/built-in-modules/templating-modules-time',
      },
      {
        title: 'Tasks Module',
        href: '/built-in-modules/templating-modules-tasks',
      },
      {
        title: 'Note Module',
        href: '/built-in-modules/templating-modules-note',
      },
      {
        title: 'System Module',
        href: '/built-in-modules/templating-modules-system',
      },
      { title: 'Web Module', href: '/built-in-modules/templating-modules-web' },
      {
        title: 'Utility Module',
        href: '/built-in-modules/templating-modules-utility',
      },
      {
        title: 'Miscellaneous Module',
        href: '/built-in-modules/templating-modules-miscellaneous',
      },
    ],
  },
  {
    title: 'Advanced Features',
    links: [
      {
        title: 'Javascript in Templates',
        href: '/advanced-features/javascript-in-templates',
      },
      {
        title: 'Conditional Logic',
        href: '/advanced-features/templating-examples-conditional',
      },
      {
        title: 'Looping',
        href: '/advanced-features/templating-examples-looping',
      },
      {
        title: 'Frontmatter',
        href: '/advanced-features/templating-examples-frontmatter',
      },
      {
        title: 'String Interpolation',
        href: '/advanced-features/templating-examples-string-interpolation',
      },
      {
        title: 'Import/Include code or content',
        href: '/advanced-features/import-include',
      },
      { title: 'File Blocks', href: '/advanced-features/file-blocks' },
    ],
  },
  {
    title: 'Examples & Templates',
    links: [
      {
        title: 'Javascript in Templates',
        href: '/examples-templates/templating-examples-js-weather',
      },
      {
        title: 'Web Services',
        href: '/examples-templates/templating-examples-web',
      },
      {
        title: 'Date/Time Examples',
        href: '/examples-templates/templating-examples-datetime',
      },
      {
        title: 'Quick Notes',
        href: '/examples-templates/templating-quicknotes',
      },
    ],
  },
  {
    title: 'Configuration',
    links: [
      { title: 'Plugin Settings', href: '/configuration/templating-settings' },
    ],
  },
  {
    title: 'Developer Guide',
    links: [
      {
        title: 'Plugin Integration',
        href: '/developer-guide/plugin-integration',
      },
      {
        title: 'Example 1: Hello World',
        href: '/developer-guide/plugin-integration/example-1',
      },
      {
        title: 'Example 2: Using Variables',
        href: '/developer-guide/plugin-integration/example-2',
      },
      {
        title: 'Example 3: Using Methods',
        href: '/developer-guide/plugin-integration/example-3',
      },
    ],
  },
]

export { navigation }

export function Navigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  // Restore scroll position on mount
  useEffect(() => {
    const nav = document.querySelector('nav')
    if (nav) {
      const savedPosition = localStorage.getItem('navScrollPosition')
      if (savedPosition) {
        nav.scrollTop = parseInt(savedPosition)
        localStorage.removeItem('navScrollPosition')
      }
    }
  }, [])

  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">Home</TopLevelNavItem>
        <TopLevelNavItem href="/getting-started/templating-intro">
          Documentation
        </TopLevelNavItem>
        <TopLevelNavItem href="/developer-guide/plugin-integration">
          API
        </TopLevelNavItem>
        {navigation.map((group) => (
          <NavigationGroup key={group.title} group={group} />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li>
      </ul>
    </nav>
  )
}
