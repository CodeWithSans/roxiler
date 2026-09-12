import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl">Page not found</h1>
      <Link to="/" className="text-blue-600 underline">Go home</Link>
    </div>
  )
}
