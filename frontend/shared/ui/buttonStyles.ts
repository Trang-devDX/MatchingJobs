import { cn } from '../lib/cn'

const variants = {
  primary: 'bg-accent text-white shadow-sm hover:bg-accent/90',
  secondary: 'border border-line bg-white text-ink hover:bg-canvas',
  ghost: 'text-accent hover:bg-canvas',
  danger: 'text-danger hover:bg-red-50',
} as const

export type ButtonVariant = keyof typeof variants

export function buttonClass(variant: ButtonVariant = 'primary', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    className,
  )
}
