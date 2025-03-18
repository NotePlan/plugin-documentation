'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { AnimatePresence, motion, useIsPresent } from 'framer-motion'

import { Button } from '@/components/Button'
import { useIsInsideMobileNavigation } from '@/components/MobileNavigation'
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
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'flex justify-between gap-2 py-1 pr-3 text-sm transition',
        isAnchorLink ? 'pl-7' : 'pl-4',
        active
          ? 'text-zinc-900 dark:text-white'
          : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white',
      )}
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
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation(),
  )

  let isPresent = useIsPresent()
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: '_top' }, ...sections].findIndex(
      (section) => section.id === visibleSections[0],
    ),
  )
  let itemHeight = remToPx(2)
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight
  let top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
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
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation()
  let [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation,
  )

  let isActiveGroup =
    group.links.findIndex((link) => link.href === pathname) !== -1

  return (
    <li className={clsx('relative mt-6', className)}>
      <motion.h2
        layout="position"
        className="text-xs font-semibold text-zinc-900 dark:text-white"
      >
        {group.title}
      </motion.h2>
      <div className="relative mt-3 pl-2">
        <AnimatePresence initial={!isInsideMobileNavigation}>
          {isActiveGroup && (
            <VisibleSectionHighlight group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <motion.div
          layout
          className="absolute inset-y-0 left-2 w-px bg-zinc-900/10 dark:bg-white/5"
        />
        <AnimatePresence initial={false}>
          {isActiveGroup && (
            <ActivePageMarker group={group} pathname={pathname} />
          )}
        </AnimatePresence>
        <ul role="list" className="border-l border-transparent">
          <NavigationLinks
            links={group.links}
            pathname={pathname}
            sections={sections}
          />
        </ul>
      </div>
    </li>
  )
}

function NavigationLinks({
  links,
  pathname,
  sections,
}: {
  links: Array<NavGroupLink>
  pathname: string
  sections: Array<Section>
}) {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const initialCollapseStates: Record<string, boolean> = {}
    links.forEach((link) => {
      initialCollapseStates[link.title] = true
    })
    return initialCollapseStates
  })

  const toggleCollapse = (event: React.MouseEvent, title: string) => {
    event.preventDefault()
    setIsCollapsed((prevState) => ({
      ...prevState,
      [title]: !prevState[title],
    }))
  }

  return (
    <>
      {links.map((link) => (
        <motion.li key={link.href} layout="position" className="relative">
          <NavLink href={link.href} active={link.href === pathname}>
            {/* {link.title} */}

            <button
              onClick={(event) => toggleCollapse(event, link.title)}
              className="flex items-center "
            >
              <span>{link.title}</span>
              {link.children && (
                <span>
                  {!isCollapsed[link.title] ? (
                    <ChevronDownIcon />
                  ) : (
                    <ChevronRightIcon />
                  )}
                </span>
              )}
            </button>

            {!isCollapsed[link.title] &&
              link.children &&
              link.children.map((child) => (
                <NavLink key={child.href} href={`${child.href}`}>
                  {child.title}
                </NavLink>
              ))}
          </NavLink>
          <AnimatePresence mode="popLayout" initial={false}>
            {link.href === pathname && sections.length > 0 && (
              <motion.ul
                role="list"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { delay: 0.1 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15 },
                }}
              >
                {sections.map((section) => (
                  <li key={section.id}>
                    <NavLink
                      href={`${link.href}#${section.id}`}
                      tag={section.tag}
                      isAnchorLink
                    >
                      {section.title}
                    </NavLink>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </motion.li>
      ))}
    </>
  )
}

export const navigation: Array<NavGroup> = [
  {
    title: 'Start',
    links: [
      { title: 'Introduction', href: '/' },
      // { title: 'Full Plugin List', href: '/pluginlist' },
    ],
  },
  
  {
    title: 'Templating',
    links: [
      { title: 'Getting Started', href: '/templating-intro' },
      { title: 'Installation', href: '/templating-installation' },
      { title: 'Plugin Settings', href: '/templating-settings' },
      {
        title: 'Definitions',
        href: '',
        children: [
          { title: 'Anatomy', href: '/templating-anatomy' },
          { title: 'Tags', href: '/templating-tags' },
          { title: 'Terminology', href: '/templating-terminology' },
          { title: 'Modules', href: '/templating-modules' },
          { title: 'Prompts', href: '/templating-examples-prompt' },
          {
            title: 'Miscellaneous',
            href: '/templating-miscellaneous',
          },

          { title: 'Syntax', href: '/templating-syntax' },
        ],
      },

      {
        title: 'Commands',
        href: '',
        children: [
          { title: 'Overview', href: '/templating-commands' },
          { title: 'Quick Notes', href: '/templating-quicknotes' },
          { title: 'Template Runner', href: '/templating-templateRunner' },
        ],
      },

      {
        title: 'Examples',
        href: '',
        children: [
          // { title: 'Simple', href: '/templating-examples-simple' },

          {
            title: 'Date & Time',
            href: '/templating-examples-datetime',
          },
          // { title: 'Arrays', href: '/templating-examples-arrays' },
          { title: 'Async', href: '/templating-examples-async' },
          {
            title: 'Conditional',
            href: '/templating-examples-conditional',
          },
          {
            title: 'Looping & Arrays',
            href: '/templating-examples-looping',
          },

          {
            title: 'Frontmatter',
            href: '/templating-examples-frontmatter',
          },

          // missing objects

          // {
          //   title: 'Custom Plugins',
          //   href: '/templating-custom-plugins-example',
          // },
          { title: 'Prompts', href: '/templating-examples-prompt' },

          // {
          //   title: 'Displaying Tasks',
          //   href: '/templating-examples-tasks',
          // },

          {
            title: 'String Interpolation',
            href: '/templating-examples-string-interpolation',
          },
          {
            title: 'Web Services',
            href: '/templating-examples-web',
          },
          {
            title: 'Using JavaScript in Templates',
            href: '/templating-examples-js-weather',
          },
        ],
      },
      {
        title: 'Modules',
        href: '',
        children: [
          {
            title: 'Overview',
            href: '/templating-modules-overview',
          },
          {
            title: 'Date Module',
            href: '/templating-modules-date',
          },
          { title: 'Time Module', href: '/templating-modules-time' },
          // {
          //   title: 'FrontMatter Module',
          //   href: '/templating-modules-frontmatter',
          // },
          {
            title: 'Note Module',
            href: '/templating-modules-note',
          },

          {
            title: 'System Module',
            href: '/templating-modules-system',
          },

          {
            title: 'Utility Module',
            href: '/templating-modules-utility',
          },

          {
            title: 'Web Module',
            href: '/templating-modules-web',
          },

          // {
          //   title: 'Helpers',
          //   href: '/templating-modules-helpers',
          // },
        ],
      },
      // {
      //   title: 'Usage in Plugins',
      //   href: '',
      //   children: [
      //     {
      //       title: 'Overview',
      //       href: '/templating-integration-overview',
      //     },

      //     {
      //       title: 'Example 1: Hello World',
      //       href: '/templating-integration-helloworld',
      //     },

      //     {
      //       title: 'Example 2: Custom Variables',
      //       href: '/templating-integration-variables',
      //     },

      //     {
      //       title: 'Example 3: Custom Method',
      //       href: '/templating-integration-method',
      //     },

      //     {
      //       title: 'Example 4: Full Example',
      //       href: '/templating-integration-full',
      //     },
      //   ],
      // },
    ],
  },
]

export function Navigation(props: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav {...props}>
      <ul role="list">
        <TopLevelNavItem href="/">API</TopLevelNavItem>
        <TopLevelNavItem href="#">Documentation</TopLevelNavItem>
        <TopLevelNavItem href="#">Support</TopLevelNavItem>
        {navigation.map((group, groupIndex) => (
          <NavigationGroup
            key={group.title}
            group={group}
            className={groupIndex === 0 ? 'md:mt-0' : ''}
          />
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
