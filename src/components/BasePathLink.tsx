import Link from 'next/link'

interface BasePathLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  alt?: string
}

/**
 * Link component that explicitly handles base path for static exports
 * This is a more explicit approach than relying on Next.js automatic basePath handling
 */
export default function BasePathLink({
  href,
  children,
  className,
  alt,
  ...props
}: BasePathLinkProps) {
  // Check if this is an internal link (starts with /)
  const isInternalLink = href.startsWith('/')

  // Get base path from environment variable or fallback to hardcoded value
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '/templates/docs'
  const finalHref = isInternalLink ? `${basePath}${href}` : href

  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  )
}
