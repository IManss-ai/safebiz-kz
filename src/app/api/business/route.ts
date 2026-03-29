import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('businesses')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found — not an error for us
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ business: data ?? null })
}

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Validate ИИН/БИН
  const binIin: string = String(body.bin_iin ?? '')
  if (!/^\d{12}$/.test(binIin)) {
    return NextResponse.json(
      { error: 'ИИН/БИН должен содержать ровно 12 цифр' },
      { status: 400 }
    )
  }

  const payload = {
    user_id: user.id,
    bin_iin: binIin,
    entity_type: body.entity_type ?? 'ИП',
    tax_regime: body.tax_regime ?? 'неизвестно',
    oked_codes: Array.isArray(body.oked_codes) ? body.oked_codes : [],
    region: body.region ?? 'Алматы',
    employee_count: Number(body.employee_count) || 0,
    vat_registered: Boolean(body.vat_registered),
  }

  const { data, error } = await supabase
    .from('businesses')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ business: data })
}
