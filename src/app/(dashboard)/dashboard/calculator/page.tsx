'use client'

import { useState } from 'react'
import { Calculator, ChevronDown, AlertCircle, CheckCircle2, Info } from 'lucide-react'
import {
  compareRegimes,
  formatCurrency,
} from '@/lib/tax-engine'
import type { TaxCalculationInput, RegimeComparison } from '@/types'
import { SIMPLIFIED_REGIME_RATES } from '@/lib/constants/tax-2026'

const REGIONS = Object.keys(SIMPLIFIED_REGIME_RATES).filter((k) => k !== 'default')

const ENTITY_TYPES = ['ИП', 'ТОО'] as const

const DEFAULT_INPUT: TaxCalculationInput = {
  annual_revenue: 0,
  annual_expenses: 0,
  payroll_expenses: 0,
  employee_count: 1,
  region: 'Алматы',
  oked_codes: [],
  entity_type: 'ИП',
}

function InputField({
  label,
  hint,
  value,
  onChange,
  suffix = 'тг',
}: {
  label: string
  hint?: string
  value: number
  onChange: (v: number) => void
  suffix?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1.5">{hint}</p>}
      <div className="relative">
        <input
          type="number"
          min={0}
          value={value || ''}
          onChange={(e) => onChange(Number(e.target.value))}
          placeholder="0"
          className="w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-14 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
          {suffix}
        </span>
      </div>
    </div>
  )
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-300 bg-white py-2.5 pl-4 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>
    </div>
  )
}

function TaxCard({
  result,
  isRecommended,
}: {
  result: RegimeComparison['simplified'] | RegimeComparison['general']
  isRecommended: boolean
}) {
  const isSimplified = result.regime === 'упрощёнка'

  return (
    <div
      className={`relative rounded-xl border p-6 ${
        isRecommended
          ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-400'
          : 'border-gray-200 bg-white'
      }`}
    >
      {isRecommended && (
        <span className="absolute -top-3 left-4 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">
          Рекомендуется
        </span>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 text-base">
          {isSimplified ? 'Упрощёнка (ф. 910)' : 'ОУР (ф. 100/700)'}
        </h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
            isSimplified
              ? 'bg-green-100 text-green-700'
              : 'bg-purple-100 text-purple-700'
          }`}
        >
          {result.effective_rate.toFixed(2)}% эфф.
        </span>
      </div>

      <div className="space-y-2.5 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Налоговая база</span>
          <span className="font-medium text-gray-800">
            {formatCurrency(result.tax_base)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">
            {isSimplified ? 'Налог (упрощёнка)' : 'КПН (20%)'}
          </span>
          <span className="font-medium text-gray-800">
            {formatCurrency(result.income_tax)}
          </span>
        </div>
        {!isSimplified && (
          <>
            <div className="flex justify-between">
              <span className="text-gray-500">НДС (16%)</span>
              <span className="font-medium text-gray-800">
                {formatCurrency(result.vat_amount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Социальный налог (6%)</span>
              <span className="font-medium text-gray-800">
                {formatCurrency(result.social_tax)}
              </span>
            </div>
          </>
        )}
        <div className="border-t border-gray-200 pt-2.5 flex justify-between">
          <span className="font-semibold text-gray-700">Итого налогов</span>
          <span className="font-bold text-gray-900 text-base">
            {formatCurrency(result.total_tax)}
          </span>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="mt-4 space-y-2">
          {result.warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-800"
            >
              <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0 text-amber-500" />
              <span>{w}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CalculatorPage() {
  const [input, setInput] = useState<TaxCalculationInput>(DEFAULT_INPUT)
  const [result, setResult] = useState<RegimeComparison | null>(null)
  const [okedInput, setOkedInput] = useState('')

  function set<K extends keyof TaxCalculationInput>(
    key: K,
    value: TaxCalculationInput[K]
  ) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  function handleCalculate() {
    if (input.annual_revenue <= 0) return
    setResult(compareRegimes(input))
  }

  function addOked() {
    const trimmed = okedInput.trim()
    if (trimmed && !input.oked_codes.includes(trimmed)) {
      set('oked_codes', [...input.oked_codes, trimmed])
    }
    setOkedInput('')
  }

  function removeOked(code: string) {
    set(
      'oked_codes',
      input.oked_codes.filter((c) => c !== code)
    )
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
          <Calculator className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Калькулятор налоговых режимов
          </h2>
          <p className="text-sm text-gray-500">
            Сравнение упрощёнки и ОУР по НК РК 2026
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Form */}
        <div className="lg:col-span-2 space-y-5 rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wider">
            Параметры бизнеса
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {ENTITY_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => set('entity_type', type)}
                className={`rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                  input.entity_type === type
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <SelectField
            label="Регион"
            value={input.region}
            options={REGIONS}
            onChange={(v) => set('region', v)}
          />

          <InputField
            label="Годовой доход"
            hint="Общая выручка за год"
            value={input.annual_revenue}
            onChange={(v) => set('annual_revenue', v)}
          />

          <InputField
            label="Годовые расходы"
            hint="Для расчёта КПН на ОУР"
            value={input.annual_expenses}
            onChange={(v) => set('annual_expenses', v)}
          />

          <InputField
            label="Расходы на зарплату"
            hint="Вычитается при доходе > 103,8 млн тг"
            value={input.payroll_expenses}
            onChange={(v) => set('payroll_expenses', v)}
          />

          <InputField
            label="Количество сотрудников"
            value={input.employee_count}
            onChange={(v) => set('employee_count', v)}
            suffix="чел"
          />

          {/* OKED */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Коды ОКЭД
            </label>
            <p className="text-xs text-gray-400 mb-1.5">
              Например: 47.1, 56, 62.01
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={okedInput}
                onChange={(e) => setOkedInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addOked()}
                placeholder="64 - Финансы..."
                className="flex-1 rounded-lg border border-gray-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                onClick={addOked}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            {input.oked_codes.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {input.oked_codes.map((code) => (
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
            onClick={handleCalculate}
            disabled={input.annual_revenue <= 0}
            className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Рассчитать
          </button>
        </div>

        {/* Results */}
        <div className="lg:col-span-3 space-y-4">
          {!result ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <Calculator className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">
                Введите данные и нажмите «Рассчитать»
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Результат появится здесь
              </p>
            </div>
          ) : (
            <>
              {/* Explanation banner */}
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-semibold text-gray-800">
                      Рекомендуем:{' '}
                      <span className="text-blue-700">{result.recommended}</span>
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {result.explanation}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-green-700">
                    Экономия: {formatCurrency(result.annual_savings)} в год
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <TaxCard
                  result={result.simplified}
                  isRecommended={result.recommended === 'упрощёнка'}
                />
                <TaxCard
                  result={result.general}
                  isRecommended={result.recommended === 'ОУР'}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
