import Link from 'next/link'

interface SimpleLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  alt?: string
}

/**
 * Simple link component that adds base path to internal links
 */
export default function SimpleLink({
  href,
  children,
  className,
  alt,
  ...props
}: SimpleLinkProps) {
  // Add base path to internal links
  const basePath = '/templates/docs'
  const finalHref = href.startsWith('/') ? `${basePath}${href}` : href

  return (
    <Link href={finalHref} className={className} {...props}>
      {children}
    </Link>
  )
}
