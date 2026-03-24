import Link from 'next/link'
import { Shield, Calculator, AlertTriangle, Bot, ArrowRight } from 'lucide-react'

const features = [
  {
    icon: Calculator,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    title: 'Оптимизатор режима',
    description:
      'Автоматическое сравнение упрощёнки (ф. 910) и общеустановленного режима (ОУР). Рассчитайте реальную экономию с учётом регионального коэффициента 2026 года.',
    badge: null,
  },
  {
    icon: AlertTriangle,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    title: 'Риск-сканер переводов',
    description:
      'Проверьте, попадаете ли вы под камеральный контроль КГД по мобильным переводам. Оценка по критериям: количество отправителей, сумма, количество месяцев.',
    badge: null,
  },
  {
    icon: Bot,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    title: 'AI налоговый помощник',
    description:
      'Задавайте вопросы о налоговом кодексе 2026 года на русском языке. ИИ-ассистент даёт ответы со ссылками на конкретные статьи НК РК.',
    badge: 'Скоро',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Shield className="h-7 w-7 text-blue-600" />
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              SafeBiz KZ
            </span>
          </div>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Войти
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-24 sm:py-32">
          <div className="pointer-events-none absolute -top-20 -right-20 h-80 w-80 rounded-full bg-blue-500/30 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-60 w-60 rounded-full bg-blue-800/40 blur-3xl" />

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-400/40 bg-blue-500/20 px-4 py-1.5 text-sm text-blue-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-300 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-300" />
              </span>
              Обновлено под НК РК 2026
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
                href="/dashboard"
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
          </div>
        </section>

        {/* Features */}
        <section className="py-20 sm:py-28 bg-[#F8FAFC]">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-14">
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Всё необходимое для налоговой безопасности
              </h2>
              <p className="mt-4 text-gray-500 text-lg max-w-xl mx-auto">
                Три ключевых инструмента, разработанных специально для
                казахстанского бизнеса
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="relative flex flex-col gap-5 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
                  >
                    {feature.badge && (
                      <span className="absolute top-5 right-5 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                        {feature.badge}
                      </span>
                    )}
                    <div
                      className={`inline-flex w-12 h-12 items-center justify-center rounded-xl ${feature.iconBg}`}
                    >
                      <Icon className={`h-6 w-6 ${feature.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className="py-16 bg-white">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
              Готовы к работе по новому НК РК?
            </h2>
            <p className="mt-3 text-gray-500">
              Начните использовать SafeBiz KZ бесплатно уже сейчас
            </p>
            <Link
              href="/dashboard"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              Начать бесплатно
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-700">SafeBiz KZ</span>
          </div>
          <p className="text-xs text-gray-400 text-center">
            © 2026 | Данные основаны на НК РК ЗРК № 214-VIII
          </p>
        </div>
      </footer>
    </div>
  )
}
