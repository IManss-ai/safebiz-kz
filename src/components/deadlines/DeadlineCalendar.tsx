import type { Deadline } from '@/lib/deadlines'
import DeadlineCard from './DeadlineCard'

const MONTH_NAMES_RU = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

interface MonthGroup {
  key: string      // "2026-03"
  label: string    // "Март 2026"
  deadlines: Deadline[]
  isCurrentMonth: boolean
  isPast: boolean
}

function groupByMonth(deadlines: Deadline[], today: string): MonthGroup[] {
  const sorted = [...deadlines].sort(
    (a, b) => a.due_date.localeCompare(b.due_date)
  )

  const map = new Map<string, Deadline[]>()
  for (const d of sorted) {
    const key = d.due_date.slice(0, 7) // "YYYY-MM"
    const arr = map.get(key) ?? []
    arr.push(d)
    map.set(key, arr)
  }

  const todayMonth = today.slice(0, 7)

  return Array.from(map.entries()).map(([key, items]) => {
    const [year, month] = key.split('-').map(Number)
    return {
      key,
      label: `${MONTH_NAMES_RU[month - 1]} ${year}`,
      deadlines: items,
      isCurrentMonth: key === todayMonth,
      isPast: key < todayMonth,
    }
  })
}

interface Props {
  deadlines: Deadline[]
  today: string // YYYY-MM-DD
}

export default function DeadlineCalendar({ deadlines, today }: Props) {
  const groups = groupByMonth(deadlines, today)

  return (
    <div className="space-y-10">
      {groups.map((group) => (
        <section key={group.key} id={group.key}>
          {/* Month header */}
          <div className="flex items-center gap-3 mb-4">
            <h3
              className={`text-sm font-bold uppercase tracking-wider ${
                group.isCurrentMonth
                  ? 'text-blue-700'
                  : group.isPast
                  ? 'text-gray-400'
                  : 'text-gray-700'
              }`}
            >
              {group.label}
            </h3>
            {group.isCurrentMonth && (
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                Текущий месяц
              </span>
            )}
            <span className="ml-auto text-xs text-gray-400">
              {group.deadlines.length}{' '}
              {group.deadlines.length === 1 ? 'дедлайн' : 'дедлайнов'}
            </span>
          </div>

          {/* Cards */}
          <div className="space-y-3">
            {group.deadlines.map((d) => (
              <DeadlineCard key={d.id} deadline={d} today={today} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
