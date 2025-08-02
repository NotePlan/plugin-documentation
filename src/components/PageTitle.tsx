'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { navigation } from '@/data/navigation'

export function PageTitle() {
  const pathname = usePathname()

  useEffect(() => {
    // Find the page title from navigation data
    const allLinks = navigation.flatMap(section => section.links)
    const currentPage = allLinks.find(link => link.href === pathname)
    
    if (currentPage) {
      document.title = `${currentPage.title} - NotePlan Templating Documentation`
    } else if (pathname === '/') {
      document.title = 'Templating Documentation - NotePlan Templating Documentation'
    } else {
      document.title = 'NotePlan Templating Documentation'
    }
  }, [pathname])

  return null
} 