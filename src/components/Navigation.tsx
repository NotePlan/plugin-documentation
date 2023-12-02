"use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AnimatePresence, motion, useIsPresent } from "framer-motion";

import { Button } from "@/components/Button";
import { useIsInsideMobileNavigation } from "@/components/MobileNavigation";
import { useSectionStore } from "@/components/SectionProvider";
import { Tag } from "@/components/Tag";
import { remToPx } from "@/lib/remToPx";

interface NavGroup {
  title: string;
  links: Array<{
    title: string;
    href: string;
  }>;
}

function useInitialValue<T>(value: T, condition = true) {
  let initialValue = useRef(value).current;
  return condition ? initialValue : value;
}

function TopLevelNavItem({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
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
  );
}

function NavLink({
  href,
  children,
  tag,
  active = false,
  isAnchorLink = false,
}: {
  href: string;
  children: React.ReactNode;
  tag?: string;
  active?: boolean;
  isAnchorLink?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "flex justify-between gap-2 py-1 pr-3 text-sm transition",
        isAnchorLink ? "pl-7" : "pl-4",
        active
          ? "text-zinc-900 dark:text-white"
          : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white",
      )}
    >
      <span className="truncate">{children}</span>
      {tag && (
        <Tag variant="small" color="zinc">
          {tag}
        </Tag>
      )}
    </Link>
  );
}

function VisibleSectionHighlight({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  let [sections, visibleSections] = useInitialValue(
    [
      useSectionStore((s) => s.sections),
      useSectionStore((s) => s.visibleSections),
    ],
    useIsInsideMobileNavigation(),
  );

  let isPresent = useIsPresent();
  let firstVisibleSectionIndex = Math.max(
    0,
    [{ id: "_top" }, ...sections].findIndex(
      (section) => section.id === visibleSections[0],
    ),
  );
  let itemHeight = remToPx(2);
  let height = isPresent
    ? Math.max(1, visibleSections.length) * itemHeight
    : itemHeight;
  let top =
    group.links.findIndex((link) => link.href === pathname) * itemHeight +
    firstVisibleSectionIndex * itemHeight;

  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      className="absolute inset-x-0 top-0 bg-zinc-800/2.5 will-change-transform dark:bg-white/2.5"
      style={{ borderRadius: 8, height, top }}
    />
  );
}

function ActivePageMarker({
  group,
  pathname,
}: {
  group: NavGroup;
  pathname: string;
}) {
  let itemHeight = remToPx(2);
  let offset = remToPx(0.25);
  let activePageIndex = group.links.findIndex((link) => link.href === pathname);
  let top = offset + activePageIndex * itemHeight;

  return (
    <motion.div
      layout
      className="absolute left-2 h-6 w-px bg-amber-600"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { delay: 0.2 } }}
      exit={{ opacity: 0 }}
      style={{ top }}
    />
  );
}

function NavigationGroup({
  group,
  className,
}: {
  group: NavGroup;
  className?: string;
}) {
  // If this is the mobile navigation then we always render the initial
  // state, so that the state does not change during the close animation.
  // The state will still update when we re-open (re-render) the navigation.
  let isInsideMobileNavigation = useIsInsideMobileNavigation();
  let [pathname, sections] = useInitialValue(
    [usePathname(), useSectionStore((s) => s.sections)],
    isInsideMobileNavigation,
  );

  let isActiveGroup =
    group.links.findIndex((link) => link.href === pathname) !== -1;

  return (
    <li className={clsx("relative mt-6", className)}>
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
          {group.links.map((link) => (
            <motion.li key={link.href} layout="position" className="relative">
              <NavLink href={link.href} active={link.href === pathname}>
                {link.title}
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
        </ul>
      </div>
    </li>
  );
}

export const navigation: Array<NavGroup> = [
  {
    title: "Start",
    links: [
      { title: "Introduction", href: "/" },
      { title: "Plugin List", href: "/pluginlist" },
      { title: "Resources", href: "/resources" },
    ],
  },
  {
    title: "Plugins",
    links: [
      { title: "🎛 Dashboard", href: "/jgclark.Dashboard" },
      { title: "🕓 Event Helpers", href: "/jgclark.EventHelpers" },
      { title: "📦 Filer", href: "/jgclark.Filer" },
      { title: "⏱ Habits & Summaries", href: "/jgclark.Summaries" },
      { title: "💭 Journalling", href: "/jgclark.DailyJournal" },
      { title: "🔗 Link Creator", href: "/np.CallbackURLs" },
      { title: "🕸 Map of Contents", href: "/jgclark.MOCs" },
      { title: "✍️ Meeting Notes", href: "/np.MeetingNotes" },
      { title: "📙 Note Helpers", href: "/jgclark.NoteHelpers" },
      { title: "🔢 Note Statistics", href: "/np.statistics" },
      { title: " Preview", href: "/np.Preview" },
      { title: "⚡️ Quick Capture", href: "/jgclark.QuickCapture" },
      { title: "🔌 Plugin Information & Tester", href: "/np.plugin-test" },
      { title: "🔬 Projects + Reviews", href: "/jgclark.Reviews" },
      { title: "🔁 Repeat Extensions", href: "/jgclark.RepeatExtensions" },
      { title: "🔎 Search Extensions", href: "/jgclark.SearchExtensions" },
      { title: "📒 Templating", href: "/np.Templating" },
      { title: "🎨 Theme Chooser", href: "/np.ThemeChooser" },
      { title: "🧹  Tidy Up", href: "/np.Tidy" },
      { title: "🌤 Weather Lookup", href: "/np.WeatherLookup" },
      { title: "🖥️ Window Sets", href: "/jgclark.WindowSets" },
    ],
  },
  {
    title: "Templating",
    links: [
      { title: "Introduction", href: "/templating" },
      {
        title: "Getting Started",
        href: "/templating/templating-getting-started",
      },
      { title: "Installation", href: "/templating/templating-installation" },
      { title: "Plugin Settings", href: "/templating/templating-settings" },
      { title: "Miscellaneous", href: "/templating/templating-miscellaneous" },
      { title: "Prompts", href: "/templating/templating-prompts" },
      { title: "Syntax", href: "/templating/templating-syntax" },
      { title: "Tags", href: "/templating/templating-tags" },
      { title: "Terminology", href: "/templating/templating-terminology" },
      { title: "Quick Notes", href: "/templating/templating-quicknotes" },
      { title: "Definitions", href: "/templating-definitions" },
      { title: "Commands", href: "/templating-commands" },
      { title: "Examples", href: "/templating-exmaples" },
      { title: "Modules", href: "/templating/templating-modules" },
      { title: "Usage of Plugins", href: "/templating-use-of-plugins" },
      { title: "Plugins", href: "/templating-plugins" },
      { title: "FAQ", href: "/templating-faq" },
      {
        title: "Migrating Legacy Templates",
        href: "/templating-migrating-legacy-templates",
      },
      { title: "Community", href: "/templating-community" },
      { title: "Changelog", href: "/templating-changelog" },
    ],
  },
];

export function Navigation(props: React.ComponentPropsWithoutRef<"nav">) {
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
            className={groupIndex === 0 ? "md:mt-0" : ""}
          />
        ))}
        <li className="sticky bottom-0 z-10 mt-6 min-[416px]:hidden">
          <Button href="#" variant="filled" className="w-full">
            Sign in
          </Button>
        </li>
      </ul>
    </nav>
  );
}
