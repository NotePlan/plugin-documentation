import { type Section } from '@/components/SectionProvider'
import { Layout } from '@/components/Layout'
import { Providers } from '@/app/providers'
import { PageTitle } from '@/components/PageTitle'
import { type Metadata, type Viewport } from 'next'

import '@/styles/tailwind.css'

export interface PageProps {
  params: Record<string, string>
  searchParams: Record<string, string>
}

interface RootLayoutProps {
  children: React.ReactNode
}

function getAllSections() {
  let allSections: Record<string, Section[]> = {}

  try {
    // In a real implementation, we would use a build-time solution to gather all MDX files
    // For now, we'll return a static structure
    allSections = {
      '/': [
        {
          id: 'getting-started',
          title: 'Getting Started',
          tag: 'Guide',
        },
      ],
      '/quickstart': [
        {
          id: 'installation',
          title: 'Installation',
          tag: 'Guide',
        },
      ],
    }
  } catch (error) {
    console.error('Error loading sections:', error)
    return {}
  }

  return allSections
}

export const metadata: Metadata = {
  title: {
    template: '%s - NotePlan Templating Documentation',
    default: 'NotePlan Templating Documentation',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: RootLayoutProps) {
  let allSections = getAllSections()

  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="flex min-h-full w-full max-w-full overflow-x-hidden bg-white dark:bg-zinc-900">
        <Providers>
          <Layout allSections={allSections}>
            <PageTitle />
            {children}
          </Layout>
        </Providers>
      </body>
    </html>
  )
}
