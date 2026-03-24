import { Calendar, Clock, AlertCircle, CheckCircle2, FileText } from 'lucide-react'
import { FORM_910_DEADLINES } from '@/lib/constants/tax-2026'

interface DeadlineItem {
  date: string
  isoDate: string // YYYY-MM-DD for comparison
  label: string
  form: string
  type: 'filing' | 'payment'
  period: 'H1' | 'H2'
  description: string
}

const DEADLINES: DeadlineItem[] = [
  {
    date: FORM_910_DEADLINES.H1_filing,
    isoDate: '2026-08-15',
    label: 'Сдача декларации за I полугодие',
    form: 'Форма 910.00',
    type: 'filing',
    period: 'H1',
    description:
      'Декларация по упрощённому налогу за январь–июнь 2026. Подаётся через портал Eqyzmet или Кабинет налогоплательщика.',
  },
  {
    date: FORM_910_DEADLINES.H1_payment,
    isoDate: '2026-08-25',
    label: 'Уплата налога за I полугодие',
    form: 'Форма 910.00',
    type: 'payment',
    period: 'H1',
    description:
      'Уплата исчисленного налога по упрощённой декларации за I полугодие. Просрочка — штраф 2,5% за каждый день + пеня 1,25× базовой ставки НБ РК.',
  },
  {
    date: FORM_910_DEADLINES.H2_filing,
    isoDate: '2027-02-15',
    label: 'Сдача декларации за II полугодие',
    form: 'Форма 910.00',
    type: 'filing',
    period: 'H2',
    description:
      'Декларация по упрощённому налогу за июль–декабрь 2026. Подаётся через портал Eqyzmet или Кабинет налогоплательщика.',
  },
  {
    date: FORM_910_DEADLINES.H2_payment,
    isoDate: '2027-02-25',
    label: 'Уплата налога за II полугодие',
    form: 'Форма 910.00',
    type: 'payment',
    period: 'H2',
    description:
      'Уплата исчисленного налога по упрощённой декларации за II полугодие.',
  },
]

// Additional static deadlines common for ИП/ТОО on упрощёнка
const MONTHLY_OBLIGATIONS = [
  {
    deadline: '25-е число каждого месяца',
    label: 'ОПВ и СО с зарплаты',
    description:
      'Обязательные пенсионные взносы (10%) и социальные отчисления (3,5%) за наёмных работников.',
  },
  {
    deadline: '25-е число следующего месяца',
    label: 'ИПН у источника выплаты',
    description:
      'Индивидуальный подоходный налог (10%), удержанный из зарплаты сотрудников.',
  },
  {
    deadline: '25-е число квартала',
    label: 'Форма 200.00 (ежеквартально)',
    description:
      'Декларация по ИПН и социальному налогу при наличии наёмных работников.',
  },
]

function getStatus(
  isoDate: string,
  today = '2026-03-24'
): 'past' | 'upcoming' | 'soon' {
  const diff =
    (new Date(isoDate).getTime() - new Date(today).getTime()) /
    (1000 * 60 * 60 * 24)
  if (diff < 0) return 'past'
  if (diff <= 30) return 'soon'
  return 'upcoming'
}

const STATUS_STYLE = {
  past: {
    dot: 'bg-gray-400',
    badge: 'bg-gray-100 text-gray-500',
    badgeText: 'Истёк',
    icon: CheckCircle2,
    iconColor: 'text-gray-400',
    border: 'border-gray-200',
  },
  soon: {
    dot: 'bg-amber-500 animate-pulse',
    badge: 'bg-amber-100 text-amber-700',
    badgeText: 'Скоро',
    icon: AlertCircle,
    iconColor: 'text-amber-500',
    border: 'border-amber-300',
  },
  upcoming: {
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700',
    badgeText: 'Предстоит',
    icon: Clock,
    iconColor: 'text-blue-500',
    border: 'border-blue-200',
  },
}

export default function CalendarPage() {
  // Today is 2026-03-24 per AGENTS.md
  const TODAY = '2026-03-24'

  return (
    <div className="max-w-3xl space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
          <Calendar className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Налоговый календарь 2026</h2>
          <p className="text-sm text-gray-500">
            Сроки отчётности и уплаты налогов для упрощёнки (ф. 910)
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {(['upcoming', 'soon', 'past'] as const).map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${STATUS_STYLE[s].dot.replace('animate-pulse', '')}`}
            />
            <span className="text-gray-600">{STATUS_STYLE[s].badgeText}</span>
          </div>
        ))}
      </div>

      {/* Key deadlines — форма 910 */}
      <section>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Форма 910.00 — Упрощённая декларация
        </h3>
        <div className="space-y-3">
          {DEADLINES.map((d) => {
            const status = getStatus(d.isoDate, TODAY)
            const style = STATUS_STYLE[status]
            const Icon = style.icon

            return (
              <div
                key={d.isoDate}
                className={`relative rounded-xl border bg-white p-5 ${style.border}`}
              >
                {/* Left accent */}
                <div
                  className={`absolute left-0 top-4 bottom-4 w-1 rounded-r-full ${style.dot.replace('animate-pulse', '')}`}
                />

                <div className="pl-3">
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}
                    >
                      <Icon className={`h-3 w-3 ${style.iconColor}`} />
                      {style.badgeText}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        d.type === 'filing'
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <FileText className="h-3 w-3" />
                      {d.type === 'filing' ? 'Отчётность' : 'Уплата'}
                    </span>
                    <span className="ml-auto text-xs text-gray-400 font-medium">
                      {d.period === 'H1' ? 'I полугодие 2026' : 'II полугодие 2026'}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-semibold text-gray-900 text-sm leading-snug">
                      {d.label}
                    </h4>
                    <span className="shrink-0 text-base font-bold text-gray-700">
                      {d.date}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs text-gray-500 leading-relaxed">
                    {d.description}
                  </p>

                  <p className="mt-2 text-xs font-medium text-gray-400">
                    {d.form}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Monthly / regular obligations */}
      <section>
        <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Регулярные обязательства (при наличии сотрудников)
        </h3>
        <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-100">
          {MONTHLY_OBLIGATIONS.map((o, i) => (
            <div key={i} className="flex items-start gap-4 px-5 py-4">
              <Clock className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-gray-800">{o.label}</p>
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full whitespace-nowrap">
                    {o.deadline}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  {o.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="flex items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs text-gray-500">
        <AlertCircle className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
        <p>
          Данные основаны на НК РК ЗРК № 214-VIII (2026). При наличии
          дополнительных видов деятельности или специальных налоговых режимов
          сроки могут отличаться. Уточняйте актуальные даты на{' '}
          <span className="font-medium text-gray-600">cabinet.salyk.kz</span>.
        </p>
      </div>
    </div>
  )
}
