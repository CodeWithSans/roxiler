export default function FormField({ label, error, rows, ...inputProps }) {
  const Input = rows ? 'textarea' : 'input'

  return (
    <label className="block space-y-1">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <Input
        rows={rows}
        className="w-full rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        {...inputProps}
      />
      {error && <span className="text-sm text-red-600">{error.message}</span>}
    </label>
  )
}
