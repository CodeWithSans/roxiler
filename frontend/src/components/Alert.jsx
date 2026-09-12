export default function Alert({ children }) {
  return (
    <p role="alert" className="rounded-lg border border-danger/15 bg-danger-soft px-3 py-2 text-sm text-danger">
      {children}
    </p>
  )
}
