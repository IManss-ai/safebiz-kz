// Kazakhstan 2026 Tax Deadlines — НК РК ЗРК № 214-VIII
// Weekend-adjusted: Jan 25→26, Apr 25→27, Jul 25→27, Oct 25→26

export type DeadlineCategory =
  | 'ipn'       // Индивидуальный подоходный налог
  | 'vat'       // НДС
  | 'social'    // ОПВ + СО + СН (пенсия и социальные)
  | 'cit'       // КПН (корпоративный подоходный налог)
  | 'simplified'// Упрощённая декларация (Форма 910)
  | 'payroll'   // Форма 200.00 (ИПН + СН с зарплаты, квартальная)

export interface Deadline {
  id: string
  name_en: string
  name_ru: string
  due_date: string // YYYY-MM-DD
  category: DeadlineCategory
  description: string
}

export const DEADLINES_2026: Deadline[] = [
  // ─── JANUARY ──────────────────────────────────────────────────────────
  {
    id: 'vat-dec25',
    name_en: 'VAT Declaration — December 2025',
    name_ru: 'Декларация по НДС — декабрь 2025',
    due_date: '2026-01-26',
    category: 'vat',
    description:
      'Декларация по НДС за декабрь 2025 (Форма 300.00). Подаётся плательщиками НДС через Кабинет налогоплательщика (cabinet.salyk.kz).',
  },
  {
    id: 'social-jan',
    name_en: 'Pension & Social Contributions — January',
    name_ru: 'ОПВ, СО, СН — январь',
    due_date: '2026-01-26',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за январь 2026.',
  },
  {
    id: 'ipn-src-jan',
    name_en: 'IPN Withholding at Source — January',
    name_ru: 'ИПН у источника выплаты — январь',
    due_date: '2026-01-26',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за январь 2026.',
  },

  // ─── FEBRUARY ─────────────────────────────────────────────────────────
  {
    id: 'vat-jan26',
    name_en: 'VAT Declaration — January 2026',
    name_ru: 'Декларация по НДС — январь 2026',
    due_date: '2026-02-25',
    category: 'vat',
    description:
      'Декларация по НДС за январь 2026 (Форма 300.00).',
  },
  {
    id: 'social-feb',
    name_en: 'Pension & Social Contributions — February',
    name_ru: 'ОПВ, СО, СН — февраль',
    due_date: '2026-02-25',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за февраль 2026.',
  },
  {
    id: 'ipn-src-feb',
    name_en: 'IPN Withholding at Source — February',
    name_ru: 'ИПН у источника выплаты — февраль',
    due_date: '2026-02-25',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за февраль 2026.',
  },

  // ─── MARCH ────────────────────────────────────────────────────────────
  {
    id: 'cit-annual',
    name_en: 'Corporate Income Tax — Annual Declaration 2025',
    name_ru: 'КПН — Годовая декларация за 2025',
    due_date: '2026-03-31',
    category: 'cit',
    description:
      'Годовая декларация по корпоративному подоходному налогу за 2025 год (Форма 100.00). Для юридических лиц на общеустановленном режиме.',
  },
  {
    id: 'ipn-annual-240',
    name_en: 'Individual Income Tax — Annual Declaration 2025',
    name_ru: 'ИПН — Годовая декларация за 2025 (Форма 240.00)',
    due_date: '2026-03-31',
    category: 'ipn',
    description:
      'Годовая декларация по ИПН за 2025 год (Форма 240.00). Для ИП на ОУР и физических лиц, имевших доходы не у источника выплаты.',
  },
  {
    id: 'vat-feb26',
    name_en: 'VAT Declaration — February 2026',
    name_ru: 'Декларация по НДС — февраль 2026',
    due_date: '2026-03-25',
    category: 'vat',
    description:
      'Декларация по НДС за февраль 2026 (Форма 300.00).',
  },
  {
    id: 'social-mar',
    name_en: 'Pension & Social Contributions — March',
    name_ru: 'ОПВ, СО, СН — март',
    due_date: '2026-03-25',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за март 2026.',
  },
  {
    id: 'ipn-src-mar',
    name_en: 'IPN Withholding at Source — March',
    name_ru: 'ИПН у источника выплаты — март',
    due_date: '2026-03-25',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за март 2026.',
  },
  {
    id: 'ipn-q1-advance',
    name_en: 'IPN Quarterly Advance — Q1 2026',
    name_ru: 'Авансовый платёж ИПН — I квартал 2026',
    due_date: '2026-03-25',
    category: 'ipn',
    description:
      'Авансовый платёж по ИПН за I квартал 2026 для ИП на общеустановленном налоговом режиме (ОУР). Рассчитывается исходя из предполагаемого дохода.',
  },

  // ─── APRIL ────────────────────────────────────────────────────────────
  {
    id: 'vat-mar26',
    name_en: 'VAT Declaration — March 2026',
    name_ru: 'Декларация по НДС — март 2026',
    due_date: '2026-04-27',
    category: 'vat',
    description:
      'Декларация по НДС за март 2026 (Форма 300.00). Срок перенесён: 25 апреля — суббота.',
  },
  {
    id: 'social-apr',
    name_en: 'Pension & Social Contributions — April',
    name_ru: 'ОПВ, СО, СН — апрель',
    due_date: '2026-04-27',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за апрель 2026.',
  },
  {
    id: 'ipn-src-apr',
    name_en: 'IPN Withholding at Source — April',
    name_ru: 'ИПН у источника выплаты — апрель',
    due_date: '2026-04-27',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за апрель 2026.',
  },

  // ─── MAY ──────────────────────────────────────────────────────────────
  {
    id: 'form-200-q1',
    name_en: 'Form 200.00 — Q1 Declaration (IPN + Social Tax)',
    name_ru: 'Форма 200.00 — Декларация за I квартал',
    due_date: '2026-05-15',
    category: 'payroll',
    description:
      'Квартальная декларация по ИПН и социальному налогу за I квартал 2026 (Форма 200.00). Для работодателей, имеющих наёмных работников.',
  },
  {
    id: 'vat-apr26',
    name_en: 'VAT Declaration — April 2026',
    name_ru: 'Декларация по НДС — апрель 2026',
    due_date: '2026-05-25',
    category: 'vat',
    description:
      'Декларация по НДС за апрель 2026 (Форма 300.00).',
  },
  {
    id: 'social-may',
    name_en: 'Pension & Social Contributions — May',
    name_ru: 'ОПВ, СО, СН — май',
    due_date: '2026-05-25',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за май 2026.',
  },
  {
    id: 'ipn-src-may',
    name_en: 'IPN Withholding at Source — May',
    name_ru: 'ИПН у источника выплаты — май',
    due_date: '2026-05-25',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за май 2026.',
  },

  // ─── JUNE ─────────────────────────────────────────────────────────────
  {
    id: 'vat-may26',
    name_en: 'VAT Declaration — May 2026',
    name_ru: 'Декларация по НДС — май 2026',
    due_date: '2026-06-25',
    category: 'vat',
    description:
      'Декларация по НДС за май 2026 (Форма 300.00).',
  },
  {
    id: 'social-jun',
    name_en: 'Pension & Social Contributions — June',
    name_ru: 'ОПВ, СО, СН — июнь',
    due_date: '2026-06-25',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за июнь 2026.',
  },
  {
    id: 'ipn-src-jun',
    name_en: 'IPN Withholding at Source — June',
    name_ru: 'ИПН у источника выплаты — июнь',
    due_date: '2026-06-25',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за июнь 2026.',
  },
  {
    id: 'ipn-q2-advance',
    name_en: 'IPN Quarterly Advance — Q2 2026',
    name_ru: 'Авансовый платёж ИПН — II квартал 2026',
    due_date: '2026-06-25',
    category: 'ipn',
    description:
      'Авансовый платёж по ИПН за II квартал 2026 для ИП на ОУР.',
  },

  // ─── JULY ─────────────────────────────────────────────────────────────
  {
    id: 'vat-jun26',
    name_en: 'VAT Declaration — June 2026',
    name_ru: 'Декларация по НДС — июнь 2026',
    due_date: '2026-07-27',
    category: 'vat',
    description:
      'Декларация по НДС за июнь 2026 (Форма 300.00). Срок перенесён: 25 июля — суббота.',
  },
  {
    id: 'social-jul',
    name_en: 'Pension & Social Contributions — July',
    name_ru: 'ОПВ, СО, СН — июль',
    due_date: '2026-07-27',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за июль 2026.',
  },
  {
    id: 'ipn-src-jul',
    name_en: 'IPN Withholding at Source — July',
    name_ru: 'ИПН у источника выплаты — июль',
    due_date: '2026-07-27',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за июль 2026.',
  },

  // ─── AUGUST ───────────────────────────────────────────────────────────
  {
    id: 'form-910-h1-filing',
    name_en: 'Form 910.00 — H1 Filing',
    name_ru: 'Форма 910.00 — Сдача за I полугодие',
    due_date: '2026-08-15',
    category: 'simplified',
    description:
      'Декларация по упрощённому налогу за I полугодие 2026 (Форма 910.00). Для ИП и ТОО на специальном налоговом режиме упрощённого декларирования.',
  },
  {
    id: 'form-200-q2',
    name_en: 'Form 200.00 — Q2 Declaration',
    name_ru: 'Форма 200.00 — Декларация за II квартал',
    due_date: '2026-08-15',
    category: 'payroll',
    description:
      'Квартальная декларация по ИПН и социальному налогу за II квартал 2026 (Форма 200.00).',
  },
  {
    id: 'vat-jul26',
    name_en: 'VAT Declaration — July 2026',
    name_ru: 'Декларация по НДС — июль 2026',
    due_date: '2026-08-25',
    category: 'vat',
    description:
      'Декларация по НДС за июль 2026 (Форма 300.00).',
  },
  {
    id: 'form-910-h1-payment',
    name_en: 'Form 910.00 — H1 Tax Payment',
    name_ru: 'Форма 910.00 — Уплата налога за I полугодие',
    due_date: '2026-08-25',
    category: 'simplified',
    description:
      'Уплата налога по упрощённой декларации за I полугодие 2026. Просрочка: штраф 2,5% за каждый день + пеня 1,25× базовой ставки НБ РК.',
  },
  {
    id: 'social-aug',
    name_en: 'Pension & Social Contributions — August',
    name_ru: 'ОПВ, СО, СН — август',
    due_date: '2026-08-25',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за август 2026.',
  },
  {
    id: 'ipn-src-aug',
    name_en: 'IPN Withholding at Source — August',
    name_ru: 'ИПН у источника выплаты — август',
    due_date: '2026-08-25',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за август 2026.',
  },

  // ─── SEPTEMBER ────────────────────────────────────────────────────────
  {
    id: 'vat-aug26',
    name_en: 'VAT Declaration — August 2026',
    name_ru: 'Декларация по НДС — август 2026',
    due_date: '2026-09-25',
    category: 'vat',
    description:
      'Декларация по НДС за август 2026 (Форма 300.00).',
  },
  {
    id: 'social-sep',
    name_en: 'Pension & Social Contributions — September',
    name_ru: 'ОПВ, СО, СН — сентябрь',
    due_date: '2026-09-25',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за сентябрь 2026.',
  },
  {
    id: 'ipn-src-sep',
    name_en: 'IPN Withholding at Source — September',
    name_ru: 'ИПН у источника выплаты — сентябрь',
    due_date: '2026-09-25',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за сентябрь 2026.',
  },
  {
    id: 'ipn-q3-advance',
    name_en: 'IPN Quarterly Advance — Q3 2026',
    name_ru: 'Авансовый платёж ИПН — III квартал 2026',
    due_date: '2026-09-25',
    category: 'ipn',
    description:
      'Авансовый платёж по ИПН за III квартал 2026 для ИП на ОУР.',
  },

  // ─── OCTOBER ──────────────────────────────────────────────────────────
  {
    id: 'vat-sep26',
    name_en: 'VAT Declaration — September 2026',
    name_ru: 'Декларация по НДС — сентябрь 2026',
    due_date: '2026-10-26',
    category: 'vat',
    description:
      'Декларация по НДС за сентябрь 2026 (Форма 300.00). Срок перенесён: 25 октября — воскресенье.',
  },
  {
    id: 'social-oct',
    name_en: 'Pension & Social Contributions — October',
    name_ru: 'ОПВ, СО, СН — октябрь',
    due_date: '2026-10-26',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за октябрь 2026.',
  },
  {
    id: 'ipn-src-oct',
    name_en: 'IPN Withholding at Source — October',
    name_ru: 'ИПН у источника выплаты — октябрь',
    due_date: '2026-10-26',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за октябрь 2026.',
  },

  // ─── NOVEMBER ─────────────────────────────────────────────────────────
  {
    id: 'form-200-q3',
    name_en: 'Form 200.00 — Q3 Declaration',
    name_ru: 'Форма 200.00 — Декларация за III квартал',
    due_date: '2026-11-15',
    category: 'payroll',
    description:
      'Квартальная декларация по ИПН и социальному налогу за III квартал 2026 (Форма 200.00).',
  },
  {
    id: 'vat-oct26',
    name_en: 'VAT Declaration — October 2026',
    name_ru: 'Декларация по НДС — октябрь 2026',
    due_date: '2026-11-25',
    category: 'vat',
    description:
      'Декларация по НДС за октябрь 2026 (Форма 300.00).',
  },
  {
    id: 'social-nov',
    name_en: 'Pension & Social Contributions — November',
    name_ru: 'ОПВ, СО, СН — ноябрь',
    due_date: '2026-11-25',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за ноябрь 2026.',
  },
  {
    id: 'ipn-src-nov',
    name_en: 'IPN Withholding at Source — November',
    name_ru: 'ИПН у источника выплаты — ноябрь',
    due_date: '2026-11-25',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за ноябрь 2026.',
  },

  // ─── DECEMBER ─────────────────────────────────────────────────────────
  {
    id: 'vat-nov26',
    name_en: 'VAT Declaration — November 2026',
    name_ru: 'Декларация по НДС — ноябрь 2026',
    due_date: '2026-12-25',
    category: 'vat',
    description:
      'Декларация по НДС за ноябрь 2026 (Форма 300.00).',
  },
  {
    id: 'social-dec',
    name_en: 'Pension & Social Contributions — December',
    name_ru: 'ОПВ, СО, СН — декабрь',
    due_date: '2026-12-25',
    category: 'social',
    description:
      'Обязательные пенсионные взносы (10%), социальные отчисления (3,5%) и социальный налог (9,5%) с заработной платы за декабрь 2026.',
  },
  {
    id: 'ipn-src-dec',
    name_en: 'IPN Withholding at Source — December',
    name_ru: 'ИПН у источника выплаты — декабрь',
    due_date: '2026-12-25',
    category: 'ipn',
    description:
      'Перечисление ИПН (10%), удержанного из заработной платы сотрудников за декабрь 2026.',
  },
  {
    id: 'ipn-q4-advance',
    name_en: 'IPN Quarterly Advance — Q4 2026',
    name_ru: 'Авансовый платёж ИПН — IV квартал 2026',
    due_date: '2026-12-25',
    category: 'ipn',
    description:
      'Авансовый платёж по ИПН за IV квартал 2026 для ИП на ОУР.',
  },

  // ─── JANUARY–FEBRUARY 2027 (H2 deadlines) ────────────────────────────
  {
    id: 'form-910-h2-filing',
    name_en: 'Form 910.00 — H2 Filing',
    name_ru: 'Форма 910.00 — Сдача за II полугодие',
    due_date: '2027-02-15',
    category: 'simplified',
    description:
      'Декларация по упрощённому налогу за II полугодие 2026 (Форма 910.00). Подаётся через Кабинет налогоплательщика или портал Eqyzmet.',
  },
  {
    id: 'form-200-q4',
    name_en: 'Form 200.00 — Q4 Declaration',
    name_ru: 'Форма 200.00 — Декларация за IV квартал',
    due_date: '2027-02-15',
    category: 'payroll',
    description:
      'Квартальная декларация по ИПН и социальному налогу за IV квартал 2026 (Форма 200.00).',
  },
  {
    id: 'form-910-h2-payment',
    name_en: 'Form 910.00 — H2 Tax Payment',
    name_ru: 'Форма 910.00 — Уплата налога за II полугодие',
    due_date: '2027-02-25',
    category: 'simplified',
    description:
      'Уплата налога по упрощённой декларации за II полугодие 2026. Просрочка: штраф 2,5% за каждый день + пеня 1,25× базовой ставки НБ РК.',
  },
]
