import Link from 'next/link'
import { Calculator, AlertTriangle, Calendar, TrendingUp, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { FORM_910_DEADLINES } from '@/lib/constants/tax-2026'
import type { Business } from '@/types'

function getNextDeadline(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  if (month < 8 || (month === 8 && now.getDate() <= 15)) {
    return `${FORM_910_DEADLINES.H1_filing} (ф. 910)`
  }
  return `${FORM_910_DEADLINES.H2_filing} (ф. 910)`
}

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

const REGIME_DISPLAY: Record<string, { label: string; badge: string; color: string }> = {
  'упрощёнка': {
    label: 'Упрощёнка',
    badge: 'bg-blue-100 text-blue-800',
    color: 'text-blue-700',
  },
  'ОУР': {
    label: 'ОУР',
    badge: 'bg-purple-100 text-purple-800',
    color: 'text-purple-700',
  },
  'неизвестно': {
    label: 'Не определён',
    badge: 'bg-gray-100 text-gray-600',
    color: 'text-gray-500',
  },
}

export default async function DashboardPage() {
  const supabase = await createClient()

  // Fetch current user's business profile (RLS enforced on Supabase side)
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .maybeSingle() as { data: Business | null }

  const regime = business
    ? (REGIME_DISPLAY[business.tax_regime] ?? REGIME_DISPLAY['неизвестно'])
    : null

  const statCards = [
    {
      label: 'Налоговый режим',
      value: business ? regime!.label : 'Не указан',
      subtext: business ? 'Форма 910.00' : 'Заполните профиль',
      color: business ? regime!.color : 'text-gray-400',
      badge: business ? regime!.badge : 'bg-gray-100 text-gray-500',
    },
    {
      label: 'Следующий дедлайн',
      value: getNextDeadline(),
      subtext: 'Сдача отчётности',
      color: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      label: 'Риск-статус',
      value: 'Не оценён',
      subtext: 'Запустите риск-сканер',
      color: 'text-gray-500',
      badge: 'bg-gray-100 text-gray-600',
    },
  ]

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

      {/* No profile banner */}
      {!business && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-300 bg-amber-50 px-5 py-4">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800">
              Заполните профиль бизнеса для персонализированных расчётов
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Укажите ИИН/БИН, тип бизнеса и налоговый режим, чтобы получить
              точные данные.
            </p>
          </div>
          <Link
            href="/onboarding"
            className="shrink-0 rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            Заполнить →
          </Link>
        </div>
      )}

      {/* Business summary (when profile exists) */}
      {business && (
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
            {business.entity_type}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 text-gray-600">
            {business.region}
          </span>
          <span className="rounded-full bg-gray-100 px-3 py-1 font-mono text-gray-500">
            {business.bin_iin}
          </span>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
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
