// Казахстан 2026 — Налоговые константы (НК РК ЗРК № 214-VIII)

export const MRP = 4325 // Месячный расчётный показатель (тг)
export const MZP = 85000 // Минимальная заработная плата (тг)

export const VAT_RATE = 0.16 // НДС 16%
export const CIT_RATE = 0.20 // КПН (Корпоративный подоходный налог) 20%
export const SOCIAL_TAX_RATE = 0.06 // Социальный налог 6%
export const OPV_RATE = 0.10 // Обязательные пенсионные взносы 10%

export const VAT_THRESHOLD = 10_000 * MRP // 43 250 000 тг — порог постановки на НДС

export const SIMPLIFIED_REGIME_ANNUAL_LIMIT = 600_000 * MRP // Годовой лимит упрощёнки

export const PAYROLL_DEDUCTION_THRESHOLD = 24_000 * MRP // 103 800 000 тг — порог вычета расходов на оплату труда

export const SIMPLIFIED_REGIME_RATES: Record<string, number> = {
  'Алматы': 0.03,
  'Астана': 0.03,
  'Шымкент': 0.02,
  'Атырауская': 0.02,
  'Мангистауская': 0.02,
  'default': 0.03,
}

export const FORM_910_DEADLINES = {
  H1_filing: '15 августа',
  H1_payment: '25 августа',
  H2_filing: '15 февраля',
  H2_payment: '25 февраля',
}

export const FORBIDDEN_OKED: string[] = [
  '64 - Финансовые услуги',
  '65 - Страхование',
  '66 - Вспомогательная финансовая деятельность',
  '69 - Юридические услуги',
  '70.2 - Консультации по управлению',
  '71 - Архитектура и инжиниринг (крупные)',
  '73 - Реклама (крупные агентства)',
  '75 - Ветеринария (стационар)',
  '85 - Высшее образование',
  '92 - Азартные игры',
]
