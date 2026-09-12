import { inputClass } from '../utils/styles.js'

export default function FormField({ label, error, rows, options, ...inputProps }) {
  const Input = options ? 'select' : rows ? 'textarea' : 'input'

  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-ink-soft">{label}</span>
      <Input
        rows={rows}
        aria-invalid={error ? true : undefined}
        className={`${inputClass} ${rows ? 'resize-none' : ''}`}
        {...inputProps}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </Input>
      {error && <span className="block text-xs text-danger">{error.message}</span>}
    </label>
  )
}
