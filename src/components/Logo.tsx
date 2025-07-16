import React, { useEffect } from 'react'
import logoLight from '@/images/logos/templating-logo.png'
import logoDark from '@/images/logos/plugins-logo-dark.png'
import { useTheme } from 'next-themes'

export const Logo = () => {
  let { resolvedTheme, setTheme } = useTheme()
  const [source, setSource] = React.useState(logoLight.src)

  useEffect(() => {
    if (resolvedTheme === 'dark') {
      setSource(logoDark.src)
    } else {
      setSource(logoLight.src)
    }
  }, [resolvedTheme])

  return (
    <div className="h-6">
      <img className="h-7" alt="logo" src={source} key={resolvedTheme} />
    </div>
  )
}

export default Logo
