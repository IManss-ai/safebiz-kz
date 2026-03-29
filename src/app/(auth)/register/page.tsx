'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Shield, Eye, EyeOff, Loader2, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const KZ_REGIONS = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Алматинская',
  'Акмолинская',
  'Атырауская',
  'Восточно-Казахстанская',
  'Западно-Казахстанская',
  'Жамбылская',
  'Карагандинская',
  'Костанайская',
  'Кызылординская',
  'Мангистауская',
  'Павлодарская',
  'Северо-Казахстанская',
  'Туркестанская',
  'Абайская',
  'Жетісу',
  'Улытау',
]

interface FormState {
  email: string
  password: string
  confirmPassword: string
  businessName: string
  binIin: string
  entityType: 'ИП' | 'ТОО'
  region: string
}

const INITIAL: FormState = {
  email: '',
  password: '',
  confirmPassword: '',
  businessName: '',
  binIin: '',
  entityType: 'ИП',
  region: 'Алматы',
}

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const errors: Partial<Record<keyof FormState, string>> = {}

    if (!form.email) errors.email = 'Введите email'
    if (form.password.length < 6) errors.password = 'Минимум 6 символов'
    if (form.confirmPassword !== form.password)
      errors.confirmPassword = 'Пароли не совпадают'
    if (!form.businessName.trim()) errors.businessName = 'Введите название'
    if (!/^\d{12}$/.test(form.binIin))
      errors.binIin = 'ИИН/БИН должен содержать ровно 12 цифр'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          business_name: form.businessName,
          bin_iin: form.binIin,
          entity_type: form.entityType,
          region: form.region,
        },
      },
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 shadow-lg mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">SafeBiz KZ</h1>
          <p className="text-sm text-gray-500 mt-1">Налоговая защита бизнеса</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Создать аккаунт
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <Field label="Email" error={fieldErrors.email}>
              <input
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={(e) => setField('email', e.target.value)}
                placeholder="you@example.com"
                className={inputCls(!!fieldErrors.email)}
              />
            </Field>

            {/* Password */}
            <Field label="Пароль" error={fieldErrors.password} hint="Минимум 6 символов">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => setField('password', e.target.value)}
                  placeholder="••••••••"
                  className={inputCls(!!fieldErrors.password) + ' pr-10'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>

            {/* Confirm password */}
            <Field label="Подтвердите пароль" error={fieldErrors.confirmPassword}>
              <input
                type="password"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={(e) => setField('confirmPassword', e.target.value)}
                placeholder="••••••••"
                className={inputCls(!!fieldErrors.confirmPassword)}
              />
            </Field>

            {/* Business name */}
            <Field label="Название бизнеса / Ваше имя" error={fieldErrors.businessName}>
              <input
                type="text"
                value={form.businessName}
                onChange={(e) => setField('businessName', e.target.value)}
                placeholder="ИП Иванов или ТОО «Ромашка»"
                className={inputCls(!!fieldErrors.businessName)}
              />
            </Field>

            {/* BIN/IIN */}
            <Field label="ИИН / БИН" error={fieldErrors.binIin} hint="12 цифр">
              <input
                type="text"
                inputMode="numeric"
                maxLength={12}
                value={form.binIin}
                onChange={(e) =>
                  setField('binIin', e.target.value.replace(/\D/g, '').slice(0, 12))
                }
                placeholder="123456789012"
                className={inputCls(!!fieldErrors.binIin)}
              />
            </Field>

            {/* Entity type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Тип бизнеса
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['ИП', 'ТОО'] as const).map((type) => (
                  <label
                    key={type}
                    className={`flex items-center gap-2.5 rounded-lg border px-3.5 py-2.5 cursor-pointer text-sm font-medium transition-colors ${
                      form.entityType === type
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="entityType"
                      value={type}
                      checked={form.entityType === type}
                      onChange={() => setField('entityType', type)}
                      className="accent-blue-600"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Region */}
            <Field label="Регион">
              <div className="relative">
                <select
                  value={form.region}
                  onChange={(e) => setField('region', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-300 py-2.5 pl-3.5 pr-10 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  {KZ_REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
            </Field>

            {/* Global error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Создаём аккаунт...
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>
        </div>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
            Войти →
          </Link>
        </p>
      </div>
    </div>
  )
}

// ---- helpers ----

function inputCls(hasError: boolean) {
  return `w-full rounded-lg border py-2.5 px-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 ${
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-400'
      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  }`
}

function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string
  hint?: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}
