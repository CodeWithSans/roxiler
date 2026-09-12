export default function StatCard({ label, value }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-gray-800">{value}</p>
    </div>
  )
}
