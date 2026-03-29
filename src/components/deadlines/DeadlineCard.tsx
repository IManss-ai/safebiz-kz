import type { Deadline, DeadlineCategory } from '@/lib/deadlines'

// ── Status ────────────────────────────────────────────────────────────────────

type Status = 'past' | 'urgent' | 'warning' | 'soon' | 'normal'

function getStatus(isoDate: string, today: string): Status {
  const diff = Math.floor(
    (new Date(isoDate).getTime() - new Date(today).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  if (diff < 0) return 'past'
  if (diff < 3) return 'urgent'
  if (diff < 7) return 'warning'
  if (diff <= 14) return 'soon'
  return 'normal'
}

function getDaysLabel(isoDate: string, today: string): string {
  const diff = Math.floor(
    (new Date(isoDate).getTime() - new Date(today).getTime()) /
      (1000 * 60 * 60 * 24)
  )
  if (diff < 0) return `${Math.abs(diff)} д. назад`
  if (diff === 0) return 'Сегодня!'
  if (diff === 1) return 'Завтра'
  return `Через ${diff} дн.`
}

const STATUS_STYLES: Record<
  Status,
  { border: string; accent: string; badge: string; badgeText: string }
> = {
  past: {
    border: 'border-gray-200',
    accent: 'bg-gray-300',
    badge: 'bg-gray-100 text-gray-500',
    badgeText: 'Истёк',
  },
  urgent: {
    border: 'border-red-300',
    accent: 'bg-red-500',
    badge: 'bg-red-100 text-red-700',
    badgeText: 'Срочно',
  },
  warning: {
    border: 'border-orange-300',
    accent: 'bg-orange-500',
    badge: 'bg-orange-100 text-orange-700',
    badgeText: 'Скоро',
  },
  soon: {
    border: 'border-yellow-300',
    accent: 'bg-yellow-400',
    badge: 'bg-yellow-100 text-yellow-700',
    badgeText: 'На подходе',
  },
  normal: {
    border: 'border-gray-200',
    accent: 'bg-green-500',
    badge: 'bg-green-100 text-green-700',
    badgeText: 'Запланировано',
  },
}

// ── Category ──────────────────────────────────────────────────────────────────

const CATEGORY_STYLES: Record<
  DeadlineCategory,
  { label: string; className: string }
> = {
  ipn: { label: 'ИПН', className: 'bg-blue-100 text-blue-700' },
  vat: { label: 'НДС', className: 'bg-purple-100 text-purple-700' },
  social: { label: 'ОПВ / СО / СН', className: 'bg-teal-100 text-teal-700' },
  cit: { label: 'КПН', className: 'bg-indigo-100 text-indigo-700' },
  simplified: { label: 'Упрощёнка 910', className: 'bg-emerald-100 text-emerald-700' },
  payroll: { label: 'Форма 200', className: 'bg-amber-100 text-amber-700' },
}

// ── Date formatter ─────────────────────────────────────────────────────────────

const MONTHS_RU = [
  'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
  'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря',
]

function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  return `${day} ${MONTHS_RU[month - 1]} ${year}`
}

// ── Component ─────────────────────────────────────────────────────────────────

interface Props {
  deadline: Deadline
  today: string // YYYY-MM-DD
}

export default function DeadlineCard({ deadline, today }: Props) {
  const status = getStatus(deadline.due_date, today)
  const style = STATUS_STYLES[status]
  const category = CATEGORY_STYLES[deadline.category]
  const isPast = status === 'past'

  return (
    <div
      className={`relative rounded-xl border bg-white p-5 transition-shadow hover:shadow-sm ${style.border} ${isPast ? 'opacity-60' : ''}`}
    >
      {/* Left accent bar */}
      <div
        className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${style.accent}`}
      />

      <div className="pl-3">
        {/* Top row: status badge + category badge + days label */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}
          >
            {style.badgeText}
          </span>
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${category.className}`}
          >
            {category.label}
          </span>
          {!isPast && (
            <span className="ml-auto text-xs font-medium text-gray-400">
              {getDaysLabel(deadline.due_date, today)}
            </span>
          )}
        </div>

        {/* Name + date */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-snug">
              {deadline.name_ru}
            </p>
            <p className="mt-0.5 text-xs text-gray-400">
              {deadline.name_en}
            </p>
          </div>
          <span className="shrink-0 text-sm font-bold text-gray-700 whitespace-nowrap">
            {formatDate(deadline.due_date)}
          </span>
        </div>

        {/* Description */}
        <p className="mt-2 text-xs text-gray-500 leading-relaxed">
          {deadline.description}
        </p>
      </div>
    </div>
  )
}
