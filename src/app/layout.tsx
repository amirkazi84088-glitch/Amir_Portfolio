import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Amir Kazi | Cybersecurity & Full Stack Developer',
  description: 'Portfolio of Amir Kazi — Cybersecurity enthusiast and Full Stack Developer. Spring Boot, Angular, Penetration Testing.',
  keywords: 'Amir Kazi, Cybersecurity, Full Stack Developer, Spring Boot, Angular, Penetration Testing',
  openGraph: {
    title: 'Amir Kazi | Cybersecurity & Developer',
    description: 'Cybersecurity enthusiast and Full Stack Developer from India.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
