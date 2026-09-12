import { cardClass } from '../utils/styles.js'

export default function StatCard({ label, value, hint }) {
  return (
    <div className={`${cardClass} p-5`}>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-faint">{hint}</p>}
    </div>
  )
}
