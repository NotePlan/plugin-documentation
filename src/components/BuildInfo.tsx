import buildInfo from '@/generated/build-info.json'

interface BuildInfoProps {
  className?: string
}

/**
 * Component that displays the build timestamp
 * Shows when the site was last built/deployed
 */
export function BuildInfo({ className = '' }: BuildInfoProps) {
  return (
    <div className={`text-xs text-zinc-500 dark:text-zinc-500 ${className}`}>
      Updated: {buildInfo.buildTimeFormatted}
    </div>
  )
}
