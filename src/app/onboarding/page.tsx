'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, ChevronRight, Loader2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { compareRegimes, formatCurrency } from '@/lib/tax-engine'
import { SIMPLIFIED_REGIME_RATES } from '@/lib/constants/tax-2026'
import type { RegimeComparison } from '@/types'

const STEPS = ['Ваш бизнес', 'Налоговый режим', 'Быстрый расчёт'] as const

const TAX_REGIMES = [
  {
    value: 'упрощёнка' as const,
    label: 'Упрощённая декларация',
    sublabel: 'Форма 910.00',
    description: 'Ставка 3% в Алматы/Астане, подходит для большинства ИП',
    color: 'border-blue-400 bg-blue-50',
    activeText: 'text-blue-700',
  },
  {
    value: 'ОУР' as const,
    label: 'ОУР',
    sublabel: 'Общеустановленный режим',
    description: 'КПН 20% + НДС 16%, полная бухгалтерия',
    color: 'border-purple-400 bg-purple-50',
    activeText: 'text-purple-700',
  },
  {
    value: 'неизвестно' as const,
    label: 'Не знаю / Не уверен',
    sublabel: '',
    description: 'Мы поможем разобраться с помощью калькулятора',
    color: 'border-gray-300 bg-gray-50',
    activeText: 'text-gray-700',
  },
]

interface OnboardingState {
  // step 1
  businessName: string
  binIin: string
  entityType: 'ИП' | 'ТОО'
  region: string
  okedCodes: string[]
  okedInput: string
  // step 2
  taxRegime: 'упрощёнка' | 'ОУР' | 'неизвестно'
  // step 3
  annualRevenue: number
  calcResult: RegimeComparison | null
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-colors ${
                i < step
                  ? 'bg-blue-600 text-white'
                  : i === step
                  ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-400'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {i < step ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-sm font-medium hidden sm:block ${
                i === step ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-gray-300 mx-1 hidden sm:block" />
            )}
          </div>
        ))}
      </div>
      <div className="h-1.5 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-500"
          style={{ width: `${((step) / (STEPS.length - 1)) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-gray-400 text-right">
        Шаг {step + 1} из {STEPS.length}
      </p>
    </div>
  )
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)
  const [state, setState] = useState<OnboardingState>({
    businessName: '',
    binIin: '',
    entityType: 'ИП',
    region: 'Алматы',
    okedCodes: [],
    okedInput: '',
    taxRegime: 'упрощёнка',
    annualRevenue: 0,
    calcResult: null,
  })

  function set<K extends keyof OnboardingState>(key: K, value: OnboardingState[K]) {
    setState((prev) => ({ ...prev, [key]: value }))
  }

  function addOked() {
    const trimmed = state.okedInput.trim()
    if (trimmed && !state.okedCodes.includes(trimmed)) {
      setState((prev) => ({
        ...prev,
        okedCodes: [...prev.okedCodes, trimmed],
        okedInput: '',
      }))
    } else {
      set('okedInput', '')
    }
  }

  function removeOked(code: string) {
    set('okedCodes', state.okedCodes.filter((c) => c !== code))
  }

  function runCalculation() {
    if (state.annualRevenue <= 0) return
    const result = compareRegimes({
      annual_revenue: state.annualRevenue,
      annual_expenses: 0,
      payroll_expenses: 0,
      employee_count: 1,
      region: state.region,
      oked_codes: state.okedCodes,
      entity_type: state.entityType,
    })
    set('calcResult', result)
  }

  async function handleFinish() {
    setSaving(true)
    const supabase = createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const finalRegime =
      state.calcResult && state.taxRegime === 'неизвестно'
        ? state.calcResult.recommended
        : state.taxRegime

    await supabase.from('businesses').upsert(
      {
        user_id: user.id,
        bin_iin: state.binIin || user.user_metadata?.bin_iin || '000000000000',
        entity_type: state.entityType,
        tax_regime: finalRegime,
        oked_codes: state.okedCodes,
        region: state.region,
        employee_count: 0,
        vat_registered: false,
      },
      { onConflict: 'user_id' }
    )

    router.push('/dashboard')
  }

  const regionalRate =
    SIMPLIFIED_REGIME_RATES[state.region] ?? SIMPLIFIED_REGIME_RATES['default']

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Настройка SafeBiz KZ</h1>
          <p className="mt-1 text-sm text-gray-500">
            Займёт не более 2 минут
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <ProgressBar step={step} />

          {/* ---- STEP 1: Business info ---- */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Ваш бизнес</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Название бизнеса / Ваше имя
                </label>
                <input
                  type="text"
                  value={state.businessName}
                  onChange={(e) => set('businessName', e.target.value)}
                  placeholder="ИП Иванов или ТОО «Ромашка»"
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ИИН / БИН
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={12}
                  value={state.binIin}
                  onChange={(e) =>
                    set('binIin', e.target.value.replace(/\D/g, '').slice(0, 12))
                  }
                  placeholder="123456789012"
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Тип бизнеса
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['ИП', 'ТОО'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => set('entityType', type)}
                      className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                        state.entityType === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Регион
                </label>
                <p className="text-xs text-gray-400 mb-1">
                  Ставка упрощёнки в {state.region}: {(regionalRate * 100).toFixed(0)}%
                </p>
                <select
                  value={state.region}
                  onChange={(e) => set('region', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-2.5 px-3.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {Object.keys(SIMPLIFIED_REGIME_RATES)
                    .filter((k) => k !== 'default')
                    .map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                </select>
              </div>

              {/* OKED */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Коды ОКЭД
                </label>
                <p className="text-xs text-gray-400 mb-1.5">
                  Введите коды деятельности вашего бизнеса (например: 47.1, 62.01)
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={state.okedInput}
                    onChange={(e) => set('okedInput', e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addOked()}
                    placeholder="47 - Розничная торговля..."
                    className="flex-1 rounded-lg border border-gray-300 py-2.5 px-3.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={addOked}
                    className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
                {state.okedCodes.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {state.okedCodes.map((code) => (
                      <span
                        key={code}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
                      >
                        {code}
                        <button
                          onClick={() => removeOked(code)}
                          className="text-gray-400 hover:text-gray-600 leading-none"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Далее <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ---- STEP 2: Tax regime ---- */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Налоговый режим</h2>
              <p className="text-sm text-gray-500">
                Какой у вас сейчас налоговый режим?
              </p>

              <div className="space-y-3">
                {TAX_REGIMES.map((regime) => (
                  <button
                    key={regime.value}
                    onClick={() => set('taxRegime', regime.value)}
                    className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
                      state.taxRegime === regime.value
                        ? regime.color
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          className={`font-semibold text-sm ${
                            state.taxRegime === regime.value
                              ? regime.activeText
                              : 'text-gray-900'
                          }`}
                        >
                          {regime.label}
                          {regime.sublabel && (
                            <span className="ml-1.5 text-xs font-normal text-gray-500">
                              ({regime.sublabel})
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {regime.description}
                        </p>
                      </div>
                      <div
                        className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          state.taxRegime === regime.value
                            ? 'border-blue-600 bg-blue-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {state.taxRegime === regime.value && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  ← Назад
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  Далее <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ---- STEP 3: Quick calculation ---- */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Быстрый расчёт</h2>
              <p className="text-sm text-gray-500">
                Давайте рассчитаем ваши налоги
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Примерный годовой доход
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    value={state.annualRevenue || ''}
                    onChange={(e) => {
                      set('annualRevenue', Number(e.target.value))
                      set('calcResult', null)
                    }}
                    placeholder="5000000"
                    className="w-full rounded-lg border border-gray-300 py-2.5 pl-3.5 pr-14 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                    тг
                  </span>
                </div>
              </div>

              <button
                onClick={runCalculation}
                disabled={state.annualRevenue <= 0}
                className="w-full rounded-xl bg-gray-900 py-3 text-sm font-semibold text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Рассчитать
              </button>

              {/* Inline result */}
              {state.calcResult && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-gray-800">
                      Рекомендуем:{' '}
                      <span className="text-blue-700">
                        {state.calcResult.recommended}
                      </span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {state.calcResult.explanation}
                  </p>
                  <p className="text-sm font-semibold text-green-700">
                    Экономия: {formatCurrency(state.calcResult.annual_savings)} в год
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 rounded-xl border border-gray-300 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  ← Назад
                </button>
                <button
                  onClick={handleFinish}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Сохраняем...
                    </>
                  ) : (
                    <>
                      Перейти в кабинет
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
