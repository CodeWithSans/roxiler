import { Link } from 'react-router'

const VARIANTS = {
  primary: 'bg-ink text-white hover:bg-ink-soft',
  secondary: 'border border-line bg-surface text-ink hover:bg-subtle',
  ghost: 'text-muted hover:bg-subtle hover:text-ink',
}

function buttonClasses(variant, className) {
  return `inline-flex h-9 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium
    transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20
    focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:cursor-not-allowed disabled:opacity-50
    ${VARIANTS[variant]} ${className}`
}

export function Button({ variant = 'primary', type = 'button', className = '', ...props }) {
  return <button type={type} className={buttonClasses(variant, className)} {...props} />
}

export function LinkButton({ variant = 'primary', className = '', ...props }) {
  return <Link className={buttonClasses(variant, className)} {...props} />
}
