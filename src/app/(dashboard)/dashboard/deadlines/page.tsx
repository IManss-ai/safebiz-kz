import { CalendarDays, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { DEADLINES_2026 } from '@/lib/deadlines'
import DeadlineCalendar from '@/components/deadlines/DeadlineCalendar'

// Force dynamic rendering so urgency badges reflect the real current date
export const dynamic = 'force-dynamic'

// ── Helpers ───────────────────────────────────────────────────────────────────

function daysUntil(isoDate: string, today: string): number {
  return Math.floor(
    (new Date(isoDate).getTime() - new Date(today).getTime()) /
      (1000 * 60 * 60 * 24)
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function DeadlinesPage() {
  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD
  const currentMonth = today.slice(0, 7)              // YYYY-MM

  const thisMonthDeadlines = DEADLINES_2026.filter(
    (d) => d.due_date.slice(0, 7) === currentMonth
  )

  const urgentDeadlines = DEADLINES_2026.filter((d) => {
    const diff = daysUntil(d.due_date, today)
    return diff >= 0 && diff < 3
  })

  const upcomingCount = DEADLINES_2026.filter(
    (d) => daysUntil(d.due_date, today) >= 0
  ).length

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
          <CalendarDays className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Дедлайны по налогам 2026
          </h2>
          <p className="text-sm text-gray-500">
            Все сроки сдачи и уплаты налогов по НК РК на 2026 год
          </p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <CalendarDays className="h-5 w-5 shrink-0 text-blue-500" />
          <div>
            <p className="text-xs text-gray-500">В этом месяце</p>
            <p className="text-lg font-bold text-gray-900">
              {thisMonthDeadlines.length}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
            urgentDeadlines.length > 0
              ? 'border-red-200 bg-red-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <AlertTriangle
            className={`h-5 w-5 shrink-0 ${
              urgentDeadlines.length > 0 ? 'text-red-500' : 'text-gray-400'
            }`}
          />
          <div>
            <p className="text-xs text-gray-500">Срочных (менее 3 дней)</p>
            <p
              className={`text-lg font-bold ${
                urgentDeadlines.length > 0 ? 'text-red-700' : 'text-gray-900'
              }`}
            >
              {urgentDeadlines.length}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
          <div>
            <p className="text-xs text-gray-500">Предстоит всего</p>
            <p className="text-lg font-bold text-gray-900">{upcomingCount}</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs">
        {[
          { dot: 'bg-green-500', label: 'Более 14 дней' },
          { dot: 'bg-yellow-400', label: '7–14 дней' },
          { dot: 'bg-orange-500', label: '3–7 дней' },
          { dot: 'bg-red-500', label: 'Менее 3 дней' },
          { dot: 'bg-gray-300', label: 'Истёк' },
        ].map(({ dot, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`inline-block h-2.5 w-2.5 rounded-full ${dot}`} />
            <span className="text-gray-500">{label}</span>
          </div>
        ))}
      </div>

      {/* Calendar */}
      <DeadlineCalendar deadlines={DEADLINES_2026} today={today} />

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
        <AlertTriangle className="h-4 w-4 shrink-0 text-gray-400 mt-0.5" />
        <p>
          Данные основаны на НК РК ЗРК № 214-VIII (2026). При наличии
          специальных режимов, льгот или отсрочек сроки могут отличаться.
          Уточняйте актуальные даты на{' '}
          <span className="font-medium text-gray-600">cabinet.salyk.kz</span>.
        </p>
      </div>
    </div>
  )
}
