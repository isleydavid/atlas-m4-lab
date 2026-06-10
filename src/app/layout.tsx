import type { Metadata } from "next"
import { Exo_2, Saira } from "next/font/google"
import "./globals.css"

const exo2 = Exo_2({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
})

const saira = Saira({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-body",
})

export const metadata: Metadata = {
  title: "Atlas",
  description: "Atlas — plataforma de compliance e monitoramento",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${exo2.variable} ${saira.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
