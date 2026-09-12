import { useState } from 'react'

export default function StarRating({ value, onRate, disabled }) {
  const [hover, setHover] = useState(0)
  const shown = hover || value || 0

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          aria-label={`Rate ${star} out of 5`}
          className={`text-xl leading-none disabled:cursor-not-allowed ${
            star <= shown ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
