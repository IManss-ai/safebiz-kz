import {
  SIMPLIFIED_REGIME_RATES,
  PAYROLL_DEDUCTION_THRESHOLD,
  VAT_THRESHOLD,
  SIMPLIFIED_REGIME_ANNUAL_LIMIT,
  FORBIDDEN_OKED,
  CIT_RATE,
  VAT_RATE,
  SOCIAL_TAX_RATE,
} from '@/lib/constants/tax-2026'
import type {
  TaxCalculationInput,
  TaxResult,
  RegimeComparison,
  TransferRiskInput,
  RiskAssessment,
} from '@/types'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function formatCurrency(amount: number): string {
  const rounded = Math.round(amount)
  return rounded.toLocaleString('ru-RU').replace(/,/g, ' ') + ' тг'
}

/** Returns the numeric ОКЭД prefix of a code string, e.g. "64.1 - Банки" → "64" */
function okedPrefix(code: string): string {
  return code.split(' ')[0].split('.')[0].trim()
}

/** Returns the forbidden entry that matches a given input code, or null */
function findForbiddenMatch(inputCode: string): string | null {
  const inputPrefix = okedPrefix(inputCode)
  for (const forbidden of FORBIDDEN_OKED) {
    const forbiddenPrefix = okedPrefix(forbidden)
    if (inputPrefix === forbiddenPrefix) return forbidden
  }
  return null
}

// ---------------------------------------------------------------------------
// 1. Упрощёнка (форма 910)
// ---------------------------------------------------------------------------

export function calculateSimplifiedTax(input: TaxCalculationInput): TaxResult {
  const regionalRate =
    SIMPLIFIED_REGIME_RATES[input.region] ?? SIMPLIFIED_REGIME_RATES['default']

  // In 2026, payroll deduction applies only above the threshold
  const tax_base =
    input.annual_revenue > PAYROLL_DEDUCTION_THRESHOLD
      ? Math.max(0, input.annual_revenue - input.payroll_expenses)
      : input.annual_revenue

  const income_tax = tax_base * regionalRate
  const social_tax = 0 // included in упрощёнка rate under 2026 НК РК
  const vat_amount = 0 // exempt while on упрощёнка
  const total_tax = income_tax
  const effective_rate =
    input.annual_revenue > 0 ? (total_tax / input.annual_revenue) * 100 : 0

  const warnings: string[] = []

  if (input.annual_revenue > VAT_THRESHOLD) {
    warnings.push(
      '⚠️ Ваш доход превышает порог НДС (43,25 млн тг). Требуется регистрация плательщиком НДС'
    )
  }

  if (input.annual_revenue > SIMPLIFIED_REGIME_ANNUAL_LIMIT) {
    warnings.push(
      '❌ Доход превышает лимит упрощёнки. Необходим переход на ОУР'
    )
  }

  for (const code of input.oked_codes) {
    const match = findForbiddenMatch(code)
    if (match) {
      warnings.push(`❌ ОКЭД ${code} запрещён для упрощёнки`)
    }
  }

  return {
    regime: 'упрощёнка',
    tax_base,
    income_tax,
    social_tax,
    vat_amount,
    total_tax,
    effective_rate,
    warnings,
  }
}

// ---------------------------------------------------------------------------
// 2. ОУР — Общеустановленный режим
// ---------------------------------------------------------------------------

export function calculateGeneralTax(input: TaxCalculationInput): TaxResult {
  const taxable_income = Math.max(
    0,
    input.annual_revenue - input.annual_expenses
  )

  const income_tax = taxable_income * CIT_RATE // КПН 20%

  const vat_amount =
    input.annual_revenue > VAT_THRESHOLD
      ? input.annual_revenue * VAT_RATE
      : 0

  const social_tax = taxable_income * SOCIAL_TAX_RATE // Социальный налог 6%

  const total_tax = income_tax + vat_amount + social_tax
  const effective_rate =
    input.annual_revenue > 0 ? (total_tax / input.annual_revenue) * 100 : 0

  const warnings: string[] = []

  if (input.annual_expenses === 0) {
    warnings.push('💡 Укажите расходы для точного расчёта КПН')
  }

  if (input.annual_revenue > VAT_THRESHOLD) {
    warnings.push(
      'ℹ️ На ОУР с доходом выше 43,25 млн тг — обязательна регистрация плательщиком НДС (16%)'
    )
  }

  return {
    regime: 'ОУР',
    tax_base: taxable_income,
    income_tax,
    social_tax,
    vat_amount,
    total_tax,
    effective_rate,
    warnings,
  }
}

// ---------------------------------------------------------------------------
// 3. Сравнение режимов
// ---------------------------------------------------------------------------

export function compareRegimes(input: TaxCalculationInput): RegimeComparison {
  const simplified = calculateSimplifiedTax(input)
  const general = calculateGeneralTax(input)

  const hasForbiddenOked = simplified.warnings.some((w) =>
    w.startsWith('❌ ОКЭД')
  )

  let recommended: 'упрощёнка' | 'ОУР'
  let explanation: string

  const simplifiedStr = formatCurrency(simplified.total_tax)
  const simplifiedRate = simplified.effective_rate.toFixed(2)
  const generalStr = formatCurrency(general.total_tax)
  const generalRate = general.effective_rate.toFixed(2)
  const annual_savings = Math.abs(simplified.total_tax - general.total_tax)
  const savingsStr = formatCurrency(annual_savings)

  if (hasForbiddenOked) {
    recommended = 'ОУР'
    explanation =
      `На упрощёнке ваш налог составил бы ${simplifiedStr} (эффективная ставка ${simplifiedRate}%). ` +
      `На ОУР — ${generalStr} (${generalRate}%). ` +
      `Однако ваш вид деятельности (ОКЭД) запрещён для упрощёнки — обязателен переход на ОУР.`
  } else if (simplified.total_tax <= general.total_tax) {
    recommended = 'упрощёнка'
    explanation =
      `На упрощёнке ваш налог составит ${simplifiedStr} (эффективная ставка ${simplifiedRate}%). ` +
      `На ОУР — ${generalStr} (${generalRate}%). ` +
      `Рекомендуем упрощёнку: экономия ${savingsStr} в год.`
  } else {
    recommended = 'ОУР'
    explanation =
      `На упрощёнке ваш налог составит ${simplifiedStr} (эффективная ставка ${simplifiedRate}%). ` +
      `На ОУР — ${generalStr} (${generalRate}%). ` +
      `Рекомендуем ОУР: экономия ${savingsStr} в год.`
  }

  return {
    simplified,
    general,
    recommended,
    annual_savings,
    explanation,
  }
}

// ---------------------------------------------------------------------------
// 4. Риск-сканер переводов
// ---------------------------------------------------------------------------

const RISK_RECOMMENDATIONS: Record<RiskAssessment['level'], string[]> = {
  critical: [
    '🚨 Немедленно прекратите принимать переводы от физлиц на личный счёт',
    '📱 Подключите бизнес QR-код Kaspi/Halyk — переводы на QR не считаются скрытым предпринимательством',
    '📋 Подготовьте документацию: договоры и акты для всех клиентов',
    '⚡ Рассмотрите срочный переход на бизнес-счёт',
  ],
  high: [
    '⚠️ Ограничьте количество уникальных отправителей до 80 в месяц',
    '📱 Подключите Kaspi QR или терминал оплаты',
    '📋 Ведите реестр всех входящих переводов с обоснованием',
  ],
  medium: [
    '💡 Следите за количеством уникальных отправителей (лимит: 100/мес)',
    '📱 Рассмотрите подключение бизнес QR-кода',
    '📊 Документируйте назначение каждого перевода',
  ],
  low: [
    '✅ Ваш профиль переводов в норме',
    '💡 Продолжайте вести учёт входящих переводов',
  ],
}

export function calculateTransferRisk(
  input: TransferRiskInput
): RiskAssessment {
  const months = [
    { senders: input.month1_senders, amount: input.month1_amount },
    { senders: input.month2_senders, amount: input.month2_amount },
    { senders: input.month3_senders, amount: input.month3_amount },
  ]

  const total_amount = months.reduce((sum, m) => sum + m.amount, 0)
  const max_senders = Math.max(...months.map((m) => m.senders))

  // Count consecutive months from most recent (month3 → month2 → month1)
  // where senders >= 100
  const SENDER_THRESHOLD = 100
  let consecutive_months = 0
  for (let i = months.length - 1; i >= 0; i--) {
    if (months[i].senders >= SENDER_THRESHOLD) {
      consecutive_months++
    } else {
      break
    }
  }

  // КГД threshold: 1,020,000 тг total over 3 months (≈ 340,000/мес)
  const AMOUNT_THRESHOLD = 1_020_000

  let score: number
  let level: RiskAssessment['level']

  if (consecutive_months >= 3 && total_amount > AMOUNT_THRESHOLD) {
    score = 95
    level = 'critical'
  } else if (consecutive_months >= 3) {
    score = 80
    level = 'critical'
  } else if (consecutive_months >= 2) {
    score = 65
    level = 'high'
  } else if (consecutive_months >= 1) {
    score = 40
    level = 'medium'
  } else if (max_senders >= 80) {
    score = 25
    level = 'medium'
  } else {
    score = 10
    level = 'low'
  }

  return {
    score,
    level,
    consecutive_months,
    max_senders,
    total_amount,
    recommendations: RISK_RECOMMENDATIONS[level],
  }
}
