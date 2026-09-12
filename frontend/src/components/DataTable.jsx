import { cardClass } from '../utils/styles.js'

const SKELETON_ROWS = 4

function SortIcon({ active, order }) {
  if (!active) {
    return <span className="text-faint opacity-0 transition-opacity group-hover:opacity-100">↕</span>
  }
  return <span className="text-ink">{order === 'asc' ? '↑' : '↓'}</span>
}

export default function DataTable({
  columns, rows = [], sortBy, order, onSort, isLoading, emptyText = 'No records found',
}) {
  return (
    <div className={`${cardClass} overflow-x-auto`}>
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="whitespace-nowrap px-4 py-3 text-xs font-medium uppercase tracking-wide text-muted"
                aria-sort={sortBy === col.key ? (order === 'asc' ? 'ascending' : 'descending') : undefined}
              >
                {col.sortable ? (
                  <button
                    type="button"
                    onClick={() => onSort(col.key)}
                    className="group inline-flex items-center gap-1 uppercase tracking-wide transition-colors hover:text-ink"
                  >
                    {col.label}
                    <SortIcon active={sortBy === col.key} order={order} />
                  </button>
                ) : (
                  col.label
                )}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {isLoading ? (
            Array.from({ length: SKELETON_ROWS }, (_, index) => (
              <tr key={index} className="border-b border-line last:border-0">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-4">
                    <div className="h-3 w-2/3 animate-pulse rounded bg-line" />
                  </td>
                ))}
              </tr>
            ))
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center text-sm text-muted">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, index) => (
              <tr key={row.id ?? index} className="border-b border-line transition-colors last:border-0 hover:bg-canvas">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-ink-soft">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
