# SafeBiz KZ

Tax compliance tools for Kazakhstani small businesses under the 2026 Tax Code.

**Live:** https://safebiz-kz-production.up.railway.app

---

## The problem

Kazakhstan's 2026 Tax Code (ЗРК № 214-VIII) introduced new tax rates, tightened audit criteria for mobile payment transfers, and changed filing deadlines. Of the 1.7 million small businesses registered in Kazakhstan, most operate under simplified or general tax regimes without in-house accountants. The cost of getting it wrong — late filings, under-declared income, unexpected VAT registration — falls entirely on the owner.

SafeBiz KZ is a set of tools that makes the relevant rules legible without requiring a tax advisor.

---

## Features

**Tax regime calculator**
Compare tax liability under the simplified regime (Form 910) vs. the general regime (ОУР) given actual revenue and expenses. Shows which regime is cheaper and why.

**Mobile transfer risk scanner**
Analyzes whether a business's mobile payment activity crosses the audit thresholds used by the State Revenue Committee (КГД). Flags the specific criteria that apply.

**Deadline calendar**
All 2026 filing and payment deadlines in one place — VAT monthly submissions, IPN quarterly advances, pension and social contributions, Form 910 semi-annual, Form 200 quarterly, annual declarations. Color-coded by urgency.

**Auth and onboarding**
Email/password auth via Supabase. Business profile (BIN/IIN, tax regime, entity type, region) persists across sessions and personalizes calculations.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database / Auth | Supabase (Postgres + Row-Level Security) |
| Hosting | Railway |

---

## Local setup

**Prerequisites:** Node.js 18+, a Supabase project.

```bash
git clone https://github.com/IManss-ai/safebiz-kz
cd safebiz-kz
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
npm run dev
```

Open http://localhost:3000.

The Supabase schema expects a `businesses` table with columns: `id`, `user_id`, `bin_iin`, `entity_type`, `tax_regime`, `region`. Row-Level Security should be enabled with a policy scoped to `auth.uid() = user_id`.

---

## Roadmap

- [x] Landing page
- [x] Email auth (sign up, sign in, sign out)
- [x] Business profile onboarding
- [x] Tax regime calculator (simplified vs. general)
- [x] Mobile transfer risk scanner
- [x] Deadline calendar (2026 filing and payment dates)
- [ ] AI assistant — ask questions about your specific tax situation
- [ ] PDF export of tax calculation results
- [ ] Push / email deadline reminders
- [ ] Multi-user support (accountant access to client profiles)
- [ ] Kazakh language support

---

## Author

Mansur Zhiger — Almaty, Kazakhstan

- GitHub: [IManss-ai](https://github.com/IManss-ai)
- LinkedIn: [manss-zhiger-63b634324](https://www.linkedin.com/in/manss-zhiger-63b634324)
