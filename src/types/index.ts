export interface Business {
  id: string
  user_id: string
  bin_iin: string
  entity_type: 'ИП' | 'ТОО'
  tax_regime: 'упрощёнка' | 'ОУР' | 'неизвестно'
  oked_codes: string[]
  region: string
  employee_count: number
  vat_registered: boolean
  created_at: string
}

export interface TaxCalculationInput {
  annual_revenue: number
  annual_expenses: number
  payroll_expenses: number
  employee_count: number
  region: string
  oked_codes: string[]
  entity_type: 'ИП' | 'ТОО'
}

export interface TaxResult {
  regime: string
  tax_base: number
  income_tax: number
  social_tax: number
  vat_amount: number
  total_tax: number
  effective_rate: number
  warnings: string[]
}

export interface RegimeComparison {
  simplified: TaxResult
  general: TaxResult
  recommended: 'упрощёнка' | 'ОУР'
  annual_savings: number
  explanation: string
}

export interface TransferRiskInput {
  month1_senders: number
  month1_amount: number
  month2_senders: number
  month2_amount: number
  month3_senders: number
  month3_amount: number
}

export interface RiskAssessment {
  score: number
  level: 'low' | 'medium' | 'high' | 'critical'
  consecutive_months: number
  max_senders: number
  total_amount: number
  recommendations: string[]
}
