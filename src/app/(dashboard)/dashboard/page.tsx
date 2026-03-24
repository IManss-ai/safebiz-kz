import Link from 'next/link'
import { Calculator, AlertTriangle, Calendar, TrendingUp } from 'lucide-react'
import { FORM_910_DEADLINES } from '@/lib/constants/tax-2026'

function getNextDeadline(): string {
  const now = new Date()
  const month = now.getMonth() + 1 // 1-12
  // H1 deadline: file by Aug 15, pay by Aug 25
  // H2 deadline: file by Feb 15, pay by Feb 25
  if (month < 8 || (month === 8 && now.getDate() <= 15)) {
    return `${FORM_910_DEADLINES.H1_filing} (ф. 910)`
  }
  if (month < 2 || (month === 2 && now.getDate() <= 15)) {
    return `${FORM_910_DEADLINES.H2_filing} (ф. 910)`
  }
  return `${FORM_910_DEADLINES.H2_filing} (ф. 910)`
}

const statCards = [
  {
    label: 'Налоговый режим',
    value: 'Упрощёнка',
    subtext: 'Форма 910.00',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    badge: 'bg-blue-100 text-blue-800',
  },
  {
    label: 'Следующий дедлайн',
    value: getNextDeadline(),
    subtext: 'Сдача отчётности',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    label: 'Риск-статус',
    value: 'Не оценён',
    subtext: 'Запустите риск-сканер',
    color: 'text-gray-500',
    bg: 'bg-gray-50',
    badge: 'bg-gray-100 text-gray-600',
  },
]

const featureCards = [
  {
    href: '/dashboard/calculator',
    icon: Calculator,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    title: 'Калькулятор налогов',
    description:
      'Сравните налоговую нагрузку при упрощёнке и ОУР. Узнайте, какой режим выгоднее для вашего бизнеса в 2026 году.',
  },
  {
    href: '/dashboard/risk-scanner',
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    title: 'Риск-сканер переводов',
    description:
      'Оцените риски по мобильным переводам согласно критериям КГД. Узнайте, грозит ли вам камеральный контроль.',
  },
  {
    href: '/dashboard/calendar',
    icon: Calendar,
    iconColor: 'text-green-600',
    iconBg: 'bg-green-100',
    title: 'Налоговый календарь',
    description:
      'Все сроки сдачи отчётности и уплаты налогов на 2026 год в одном месте. Не пропустите ни одного дедлайна.',
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-5xl">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Добро пожаловать в SafeBiz KZ
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Ваш AI-помощник по налоговому соответствию в Казахстане
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className={`rounded-xl border border-gray-200 bg-white p-5 shadow-sm`}
          >
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {card.label}
            </p>
            <p className={`mt-2 text-lg font-bold ${card.color}`}>
              {card.value}
            </p>
            <span
              className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${card.badge}`}
            >
              {card.subtext}
            </span>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Инструменты
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {featureCards.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div
                  className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${card.iconBg}`}
                >
                  <Icon className={`h-5 w-5 ${card.iconColor}`} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                    {card.title}
                  </h4>
                  <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="mt-auto flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-700">
                  Открыть
                  <TrendingUp className="ml-1.5 h-4 w-4" />
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
