'use client'

import { useState } from 'react'
import { AlertTriangle, Users, Banknote, TrendingUp, Shield } from 'lucide-react'
import { calculateTransferRisk, formatCurrency } from '@/lib/tax-engine'
import type { TransferRiskInput, RiskAssessment } from '@/types'

const DEFAULT_INPUT: TransferRiskInput = {
  month1_senders: 0,
  month1_amount: 0,
  month2_senders: 0,
  month2_amount: 0,
  month3_senders: 0,
  month3_amount: 0,
}

const LEVEL_CONFIG: Record<
  RiskAssessment['level'],
  { label: string; color: string; bg: string; border: string; bar: string; icon: typeof Shield }
> = {
  low: {
    label: 'Низкий риск',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    bar: 'bg-green-500',
    icon: Shield,
  },
  medium: {
    label: 'Средний риск',
    color: 'text-yellow-700',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    bar: 'bg-yellow-400',
    icon: AlertTriangle,
  },
  high: {
    label: 'Высокий риск',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
    bar: 'bg-orange-500',
    icon: AlertTriangle,
  },
  critical: {
    label: 'Критический риск',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
    bar: 'bg-red-600',
    icon: AlertTriangle,
  },
}

function MonthInput({
  monthLabel,
  senders,
  amount,
  onSendersChange,
  onAmountChange,
}: {
  monthLabel: string
  senders: number
  amount: number
  onSendersChange: (v: number) => void
  onAmountChange: (v: number) => void
}) {
  const overThreshold = senders >= 100

  return (
    <div
      className={`rounded-xl border p-4 space-y-3 transition-colors ${
        overThreshold
          ? 'border-red-300 bg-red-50'
          : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800 text-sm">{monthLabel}</h4>
        {overThreshold && (
          <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-0.5 rounded-full">
            ≥100 отправителей
          </span>
        )}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          <span className="inline-flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            Уникальных отправителей
          </span>
        </label>
        <input
          type="number"
          min={0}
          value={senders || ''}
          onChange={(e) => onSendersChange(Number(e.target.value))}
          placeholder="0"
          className={`w-full rounded-lg border py-2 px-3 text-sm focus:outline-none focus:ring-1 ${
            overThreshold
              ? 'border-red-300 bg-white focus:border-red-500 focus:ring-red-400'
              : 'border-gray-300 bg-white focus:border-blue-500 focus:ring-blue-500'
          }`}
        />
        <p className="mt-1 text-xs text-gray-400">Лимит КГД: 100 человек/мес</p>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          <span className="inline-flex items-center gap-1">
            <Banknote className="h-3.5 w-3.5" />
            Сумма переводов
          </span>
        </label>
        <div className="relative">
          <input
            type="number"
            min={0}
            value={amount || ''}
            onChange={(e) => onAmountChange(Number(e.target.value))}
            placeholder="0"
            className="w-full rounded-lg border border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            тг
          </span>
        </div>
      </div>
    </div>
  )
}

function ScoreMeter({ score, level }: { score: number; level: RiskAssessment['level'] }) {
  const config = LEVEL_CONFIG[level]

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-700">Индекс риска</span>
        <span className={`font-bold text-2xl ${config.color}`}>{score}</span>
      </div>
      <div className="h-3 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${config.bar}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  )
}

export default function RiskScannerPage() {
  const [input, setInput] = useState<TransferRiskInput>(DEFAULT_INPUT)
  const [result, setResult] = useState<RiskAssessment | null>(null)

  function setField<K extends keyof TransferRiskInput>(key: K, value: number) {
    setInput((prev) => ({ ...prev, [key]: value }))
  }

  function handleScan() {
    setResult(calculateTransferRisk(input))
  }

  const config = result ? LEVEL_CONFIG[result.level] : null
  const LevelIcon = config?.icon ?? AlertTriangle

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Риск-сканер переводов</h2>
          <p className="text-sm text-gray-500">
            Оценка риска камерального контроля КГД по мобильным переводам
          </p>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <strong>Критерии КГД:</strong> получение переводов от 100+ уникальных физлиц в месяц
        на протяжении 3 последовательных месяцев с общей суммой свыше 1 020 000 тг
        квалифицируется как скрытое предпринимательство.
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Input form */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Данные за последние 3 месяца
          </h3>

          <MonthInput
            monthLabel="Месяц 1 (самый ранний)"
            senders={input.month1_senders}
            amount={input.month1_amount}
            onSendersChange={(v) => setField('month1_senders', v)}
            onAmountChange={(v) => setField('month1_amount', v)}
          />
          <MonthInput
            monthLabel="Месяц 2"
            senders={input.month2_senders}
            amount={input.month2_amount}
            onSendersChange={(v) => setField('month2_senders', v)}
            onAmountChange={(v) => setField('month2_amount', v)}
          />
          <MonthInput
            monthLabel="Месяц 3 (последний)"
            senders={input.month3_senders}
            amount={input.month3_amount}
            onSendersChange={(v) => setField('month3_senders', v)}
            onAmountChange={(v) => setField('month3_amount', v)}
          />

          <button
            onClick={handleScan}
            className="w-full rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 transition-colors"
          >
            Оценить риск
          </button>
        </div>

        {/* Result panel */}
        <div className="lg:col-span-2">
          {!result ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 text-center">
              <TrendingUp className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-500">
                Введите данные за 3 месяца
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Результат оценки появится здесь
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Score card */}
              <div
                className={`rounded-xl border p-5 ${config!.bg} ${config!.border}`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <LevelIcon className={`h-5 w-5 ${config!.color}`} />
                  <span className={`font-bold text-base ${config!.color}`}>
                    {config!.label}
                  </span>
                </div>

                <ScoreMeter score={result.score} level={result.level} />

                <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-lg bg-white/70 px-2 py-2.5">
                    <p className="text-xs text-gray-500 mb-0.5">Подряд мес.</p>
                    <p className={`text-lg font-bold ${config!.color}`}>
                      {result.consecutive_months}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/70 px-2 py-2.5">
                    <p className="text-xs text-gray-500 mb-0.5">Макс. отпр.</p>
                    <p className={`text-lg font-bold ${config!.color}`}>
                      {result.max_senders}
                    </p>
                  </div>
                  <div className="rounded-lg bg-white/70 px-2 py-2.5">
                    <p className="text-xs text-gray-500 mb-0.5">Сумма</p>
                    <p className={`text-xs font-bold ${config!.color}`}>
                      {formatCurrency(result.total_amount)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2.5">
                <h4 className="text-sm font-semibold text-gray-800">
                  Рекомендации
                </h4>
                {result.recommendations.map((rec, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-700 leading-relaxed"
                  >
                    <span className="shrink-0">{rec.split(' ')[0]}</span>
                    <span>{rec.split(' ').slice(1).join(' ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
