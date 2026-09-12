export default function RatingBadge({ value, emptyText = 'No ratings' }) {
  if (!value) return <span className="text-faint">{emptyText}</span>

  return (
    <span className="inline-flex items-center gap-1 font-medium text-ink">
      <span className="text-star">★</span>
      {value}
    </span>
  )
}
