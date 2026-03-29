import Link from 'next/link'
import {
  Shield,
  Calculator,
  AlertTriangle,
  Calendar,
  ArrowRight,
} from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Calculator,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    title: 'Калькулятор режима',
    description:
      'Сравните упрощёнку и ОУР по формулам НК РК 2026. Узнайте точную экономию за год.',
    href: '/dashboard/calculator',
  },
  {
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    title: 'Риск-сканер переводов',
    description:
      'Проверьте, грозит ли вам проверка КГД по мобильным переводам. Оценка риска за 30 секунд.',
    href: '/dashboard/risk-scanner',
  },
  {
    icon: Calendar,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    title: 'Календарь дедлайнов',
    description:
      '47 реальных дедлайнов на 2026 год. Никогда не пропустите сдачу отчёта или уплату налога.',
    href: '/dashboard/deadlines',
  },
]

const proofItems = [
  {
    stat: '185',
    label: 'запрещённых ОКЭД для упрощёнки в 2026 году',
  },
  {
    stat: '100',
    label: 'уникальных отправителей в месяц — триггер проверки КГД',
  },
  {
    stat: '16%',
    label: 'новая ставка НДС с 1 января 2026',
  },
]

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* ── Navbar ────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              SafeBiz KZ
            </span>
          </div>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Войти
          </Link>
        </div>
      </header>

      <main className="flex-1">

        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-24 sm:py-32">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-72 w-72 rounded-full bg-blue-800/40 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-6 text-center">

            {/* Pill badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-1.5 text-sm text-blue-100">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              Новый НК РК 2026 — вступил в силу
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Защитите свой бизнес от{' '}
              <span className="text-blue-200">налоговых рисков</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100 leading-relaxed">
              Новый Налоговый кодекс РК вступил в силу в 2026 году. SafeBiz KZ
              помогает ИП и ТОО разобраться в изменениях, выбрать выгодный
              налоговый режим и избежать штрафов.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition-all hover:shadow-xl"
              >
                Начать бесплатно
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard/calculator"
                className="inline-flex items-center gap-2 rounded-xl border border-blue-400/50 px-7 py-3.5 text-base font-medium text-white hover:bg-blue-600/50 transition-colors"
              >
                Рассчитать налоги
              </Link>
            </div>

            {/* Inline stats */}
            <div className="mt-12 flex flex-col items-center gap-6 sm:flex-row sm:justify-center sm:divide-x sm:divide-blue-400/30">
              {[
                { value: '1.7 млн', label: 'ИП и ТОО в Казахстане' },
                { value: '47', label: 'налоговых дедлайнов в 2026' },
                { value: '3%', label: 'ставка упрощёнки в Алматы' },
              ].map(({ value, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center sm:px-8 first:pl-0 last:pr-0"
                >
                  <span className="text-2xl font-extrabold text-white">
                    {value}
                  </span>
                  <span className="mt-0.5 text-xs text-blue-200">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Product Preview ────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-5xl px-6">

            {/* Label + heading */}
            <div className="mb-12 text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Продукт
              </p>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Всё что нужно для налоговой защиты
              </h2>
            </div>

            {/* Browser mockup */}
            <div className="rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/60 overflow-hidden">

              {/* Browser chrome */}
              <div className="flex items-center gap-2 bg-gray-100 px-4 py-3 border-b border-gray-200">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <div className="mx-3 flex-1 rounded-md bg-white border border-gray-200 px-3 py-1 text-xs text-gray-400 max-w-xs">
                  safebiz-kz.app/dashboard/calculator
                </div>
              </div>

              {/* Mockup content */}
              <div className="bg-[#F8FAFC] p-6 sm:p-10">

                {/* Mini dashboard header */}
                <div className="mb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Результат расчёта
                  </p>
                  <h3 className="text-lg font-bold text-gray-900">
                    Калькулятор налогового режима 2026
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Доход: 5 000 000 тг · Расходы: 1 500 000 тг · Регион: Алматы
                  </p>
                </div>

                {/* Regime cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">

                  {/* Simplified — recommended */}
                  <div className="relative rounded-xl border-2 border-blue-500 bg-white p-5 shadow-sm">
                    <div className="absolute -top-3 left-4">
                      <span className="rounded-full bg-blue-600 px-3 py-0.5 text-xs font-bold text-white shadow">
                        Рекомендуем
                      </span>
                    </div>
                    <div className="mt-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
                        Упрощёнка
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Форма 910.00 · Ставка 3% с оборота
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-gray-900">
                          150 000
                        </span>
                        <span className="text-sm font-medium text-gray-500">тг / год</span>
                      </div>
                      <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                        <div className="flex justify-between">
                          <span>Налог с оборота (3%)</span>
                          <span className="font-medium text-gray-700">150 000 тг</span>
                        </div>
                        <div className="flex justify-between">
                          <span>НДС</span>
                          <span className="font-medium text-gray-700">не облагается</span>
                        </div>
                        <div className="flex justify-between">
                          <span>КПН</span>
                          <span className="font-medium text-gray-700">не облагается</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* General regime */}
                  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                      ОУР
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Общеустановленный режим · КПН 20% + НДС 16%
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-gray-400">
                        1 300 000
                      </span>
                      <span className="text-sm font-medium text-gray-400">тг / год</span>
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>КПН (20% от прибыли)</span>
                        <span className="font-medium text-gray-700">700 000 тг</span>
                      </div>
                      <div className="flex justify-between">
                        <span>НДС к уплате (16%)</span>
                        <span className="font-medium text-gray-700">600 000 тг</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Социальный налог</span>
                        <span className="font-medium text-gray-700">включён</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Savings callout */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">
                      Экономия при выборе упрощёнки
                    </p>
                    <p className="text-xs text-emerald-600 mt-0.5">
                      По сравнению с ОУР за 2026 год
                    </p>
                  </div>
                  <span className="text-2xl font-extrabold text-emerald-700">
                    1 150 000 тг
                  </span>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────────── */}
        <section className="py-24 bg-[#F8FAFC]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="group flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm hover:border-gray-300 hover:shadow-md transition-all"
                  >
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${feature.iconBg}`}
                    >
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <Link
                      href={feature.href}
                      className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors"
                    >
                      Открыть
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Social Proof ──────────────────────────────────────────────────── */}
        <section className="py-24 bg-white">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              Почему SafeBiz KZ?
            </h2>
            <div className="space-y-0 divide-y divide-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
              {proofItems.map(({ stat, label }) => (
                <div
                  key={stat}
                  className="flex items-center gap-6 bg-white px-8 py-6 hover:bg-gray-50 transition-colors"
                >
                  <span className="w-20 shrink-0 text-3xl font-extrabold text-blue-600">
                    {stat}
                  </span>
                  <p className="text-sm text-gray-600 leading-relaxed">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-24">
          <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-60 w-60 rounded-full bg-blue-800/40 blur-3xl" />

          <div className="relative mx-auto max-w-2xl px-6 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Начните бесплатно сегодня
            </h2>
            <p className="mt-4 text-blue-100">
              Зарегистрируйтесь за 2 минуты. Никаких скрытых платежей.
            </p>
            <Link
              href="/register"
              className="group mt-10 inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-700 shadow-lg hover:bg-blue-50 transition-all hover:shadow-xl"
            >
              Создать аккаунт
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

      </main>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="bg-gray-950 pt-12 pb-8">
        <div className="mx-auto max-w-6xl px-6">
          {/* Top row */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between pb-10 border-b border-gray-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-5 w-5 text-blue-400" />
                <span className="text-base font-bold text-white">SafeBiz KZ</span>
              </div>
              <p className="text-sm text-gray-400">
                Налоговая защита бизнеса в Казахстане
              </p>
            </div>
            <div className="flex items-center gap-6">
              <a
                href="https://github.com/IManss-ai/safebiz-kz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                GitHub
              </a>
              <a
                href="https://safebiz-kz-production.up.railway.app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Приложение
              </a>
            </div>
          </div>
          {/* Bottom row */}
          <p className="mt-6 text-xs text-gray-600 text-center sm:text-left">
            © 2026 SafeBiz KZ · Основано на НК РК ЗРК № 214-VIII
          </p>
        </div>
      </footer>

    </div>
  )
}
