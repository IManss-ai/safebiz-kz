// =============================================================================
// SafeBiz KZ — Tax Engine: expected outputs
// НК РК ЗРК № 214-VIII (2026)
// =============================================================================

// ---------------------------------------------------------------------------
// Test 1: ИП, Алматы, доход 5 000 000 тг, нет расходов
// ---------------------------------------------------------------------------
// input: { annual_revenue: 5_000_000, annual_expenses: 0, payroll_expenses: 0,
//          employee_count: 1, region: 'Алматы', oked_codes: ['47 - Розничная торговля'],
//          entity_type: 'ИП' }
//
// calculateSimplifiedTax →
//   regional_rate = 0.03   (Алматы)
//   tax_base      = 5_000_000  (below PAYROLL_DEDUCTION_THRESHOLD of 103,800,000)
//   income_tax    = 5_000_000 × 0.03 = 150_000 тг
//   social_tax    = 0
//   vat_amount    = 0
//   total_tax     = 150_000 тг
//   effective_rate = 3.00%
//   warnings      = []   (revenue < 43,250,000 НДС threshold)

// ---------------------------------------------------------------------------
// Test 2: ИП, Алматы, доход 50 000 000 тг — НДС warning triggered
// ---------------------------------------------------------------------------
// input: { annual_revenue: 50_000_000, annual_expenses: 0, payroll_expenses: 0,
//          employee_count: 1, region: 'Алматы', oked_codes: ['47 - Розничная торговля'],
//          entity_type: 'ИП' }
//
// calculateSimplifiedTax →
//   tax_base      = 50_000_000
//   income_tax    = 50_000_000 × 0.03 = 1_500_000 тг
//   total_tax     = 1_500_000 тг
//   effective_rate = 3.00%
//   warnings[0]   = '⚠️ Ваш доход превышает порог НДС (43,25 млн тг). Требуется регистрация плательщиком НДС'
//
// calculateGeneralTax →
//   taxable_income = 50_000_000 - 0 = 50_000_000
//   income_tax    = 50_000_000 × 0.20 = 10_000_000
//   vat_amount    = 50_000_000 × 0.16 =  8_000_000   (revenue > VAT_THRESHOLD)
//   social_tax    = 50_000_000 × 0.06 =  3_000_000
//   total_tax     = 21_000_000 тг
//   effective_rate = 42.00%
//   warnings[0]   = '💡 Укажите расходы для точного расчёта КПН'
//   warnings[1]   = 'ℹ️ На ОУР с доходом выше 43,25 млн тг — обязательна регистрация плательщиком НДС (16%)'
//
// compareRegimes → recommended = 'упрощёнка', annual_savings = 19_500_000 тг

// ---------------------------------------------------------------------------
// Test 3: Риск-сканер — 3 месяца по 110 отправителей, сумма 2 000 000 тг
// ---------------------------------------------------------------------------
// input: { month1_senders: 110, month1_amount: 600_000,
//          month2_senders: 110, month2_amount: 700_000,
//          month3_senders: 110, month3_amount: 700_000 }
//
// consecutive_months = 3   (все три месяца ≥ 100 отправителей)
// total_amount       = 2_000_000  (> AMOUNT_THRESHOLD 1_020_000)
// max_senders        = 110
// score              = 95
// level              = 'critical'
// recommendations    = [
//   '🚨 Немедленно прекратите принимать переводы от физлиц на личный счёт',
//   '📱 Подключите бизнес QR-код Kaspi/Halyk — переводы на QR не считаются скрытым предпринимательством',
//   '📋 Подготовьте документацию: договоры и акты для всех клиентов',
//   '⚡ Рассмотрите срочный переход на бизнес-счёт',
// ]

// ---------------------------------------------------------------------------
// Test 4: ОКЭД "64" — forbidden warning on упрощёнка
// ---------------------------------------------------------------------------
// input: { annual_revenue: 5_000_000, annual_expenses: 0, payroll_expenses: 0,
//          employee_count: 1, region: 'Алматы', oked_codes: ['64 - Банки'],
//          entity_type: 'ИП' }
//
// calculateSimplifiedTax →
//   warnings[0] = '❌ ОКЭД 64 - Банки запрещён для упрощёнки'
//
// compareRegimes →
//   hasForbiddenOked = true
//   recommended      = 'ОУР'
//   explanation contains: 'ваш вид деятельности (ОКЭД) запрещён для упрощёнки'

// ---------------------------------------------------------------------------
// Test 5: formatCurrency edge cases
// ---------------------------------------------------------------------------
// formatCurrency(5_000_000)  → '5 000 000 тг'
// formatCurrency(150_000)    → '150 000 тг'
// formatCurrency(43_250_000) → '43 250 000 тг'
// formatCurrency(0)          → '0 тг'
// formatCurrency(1_500.75)   → '1 501 тг'  (rounds to nearest integer)

// ---------------------------------------------------------------------------
// Test 6: Шымкент regional rate (2% vs 3% Алматы)
// ---------------------------------------------------------------------------
// Same input as Test 1 but region = 'Шымкент'
// calculateSimplifiedTax →
//   regional_rate = 0.02
//   income_tax    = 5_000_000 × 0.02 = 100_000 тг  (saves 50,000 тг vs Алматы)
//   effective_rate = 2.00%

// ---------------------------------------------------------------------------
// Test 7: Payroll deduction threshold
// ---------------------------------------------------------------------------
// input: { annual_revenue: 110_000_000, payroll_expenses: 10_000_000, region: 'Алматы', ... }
// annual_revenue (110M) > PAYROLL_DEDUCTION_THRESHOLD (103,800,000)
// calculateSimplifiedTax →
//   tax_base   = 110_000_000 - 10_000_000 = 100_000_000
//   income_tax = 100_000_000 × 0.03 = 3_000_000 тг
