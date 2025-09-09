import Link from 'next/link'

interface CustomLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  alt?: string
}

/**
 * Custom Link component that automatically handles base path for internal links
 * Internal links (starting with /) will be prefixed with the base path in production
 * External links (starting with http/https) will be passed through unchanged
 */
export default function CustomLink({
  href,
  children,
  className,
  alt,
  ...props
}: CustomLinkProps) {
  // Check if this is an internal link (starts with /)
  const isInternalLink = href.startsWith('/')

  // For internal links, let Next.js handle the basePath automatically
  // by not modifying the href at all - Next.js will apply basePath from config
  const finalHref = href

  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  )
}
