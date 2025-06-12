import type React from "react"
import type { Metadata } from "next"
import { Inter, Amarante } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const amarante = Amarante({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-amarante",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Magic Card Generator",
  description: "Create custom Magic: The Gathering style cards",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${amarante.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
