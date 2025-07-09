'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import logoLight from '@/images/logos/plugins-logo.png'
import logoDark from '@/images/logos/plugins-logo-dark.png'

function LogoImage() {
  const { theme } = useTheme()

  return (
    <Image
      src={theme === 'dark' ? logoDark : logoLight}
      alt="NotePlan Plugins"
      width={99}
      height={24}
      className="h-6 w-auto"
      priority
    />
  )
}

export function Logo() {
  return (
    <Link href="/" aria-label="Home" className="flex items-center">
      <LogoImage />
    </Link>
  )
}
