'use client'
/**
 * This component is used to dynamically import images from the images directory.
 * It is used to avoid the need to manually import images in the component.
 * There is a Cursor snippet dimg that will expand to a <DynamicImage /> component.
 * Example:
 *
 * ```tsx
 * <DynamicImage src="image.png" />
 * <DynamicImage src="image.png" alt="Image" width={100} height={100} className="w-100 h-100" />
 * ```
 */
import React from 'react'

// Type for the image props
interface ImageProps {
  src: string
  alt: string
  width?: number | string
  height?: number | string
  className?: string
}

export function Image({ src, alt, width, height, className }: ImageProps) {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Dynamically import any image from the images directory
    const importImage = async () => {
      try {
        const imageModule = await import(`@/images/${src}`)
        setImageSrc(imageModule.default.src)
        setIsLoading(false)
      } catch (error) {
        console.error(`Failed to import image: ${src}`, error)
        setIsLoading(false)
      }
    }

    importImage()
  }, [src])

  if (isLoading) {
    return <div className="h-32 w-full animate-pulse rounded bg-gray-200" />
  }

  if (!imageSrc) {
    return (
      <div className="rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
        Failed to load image: {src}
      </div>
    )
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  )
}

// Convenience function for easier usage
export function Img(props: ImageProps) {
  return <Image {...props} />
}

// Even simpler - just pass the filename
export function DynamicImage({ src, alt, ...props }: ImageProps) {
  return <Image src={src} alt={alt} {...props} />
}
