import clsx from 'clsx'

const variantStyles = {
  medium: 'rounded-lg px-1.5 ring-1 ring-inset',
  small: 'rounded px-1 ring-1 ring-inset',
}

const colorStyles = {
  emerald: {
    small:
      'ring-emerald-700 bg-emerald-400/10 text-emerald-700 dark:text-emerald-400',
    medium:
      'ring-emerald-700 bg-emerald-400/10 text-emerald-700 dark:text-emerald-400',
  },
  sky: {
    small: 'ring-sky-700 bg-sky-400/10 text-sky-700 dark:text-sky-400',
    medium: 'ring-sky-700 bg-sky-400/10 text-sky-700 dark:text-sky-400',
  },
  amber: {
    small: 'ring-amber-700 bg-amber-400/10 text-amber-700 dark:text-amber-400',
    medium: 'ring-amber-700 bg-amber-400/10 text-amber-700 dark:text-amber-400',
  },
  rose: {
    small: 'ring-rose-700 bg-rose-400/10 text-rose-700 dark:text-rose-400',
    medium: 'ring-rose-700 bg-rose-400/10 text-rose-700 dark:text-rose-400',
  },
  zinc: {
    small: 'ring-zinc-700 bg-zinc-400/10 text-zinc-700 dark:text-zinc-400',
    medium: 'ring-zinc-700 bg-zinc-400/10 text-zinc-700 dark:text-zinc-400',
  },
}

const valueColorMap = {
  GET: 'amber',
  POST: 'sky',
  PUT: 'amber',
  DELETE: 'rose',
} as Record<string, keyof typeof colorStyles>

type TagProps = {
  children: React.ReactNode
  variant?: keyof typeof variantStyles
  color?: keyof typeof colorStyles
}

export function Tag({
  children,
  variant = 'medium',
  color = 'emerald',
}: TagProps) {
  return (
    <span
      className={`inline-flex items-center font-medium ${variantStyles[variant]} ${colorStyles[color][variant]}`}
    >
      {children}
    </span>
  )
}
