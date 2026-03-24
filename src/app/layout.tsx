import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SafeBiz KZ — Защита бизнеса от налоговых рисков',
  description:
    'AI-powered налоговый советник для казахстанского бизнеса (ИП и ТОО). Оптимизация налогового режима, риск-сканер переводов, календарь сдачи отчётности по НК РК 2026.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.className}>
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  )
}
