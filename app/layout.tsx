import type React from "react"
import type { Metadata } from "next"
import { Inter, Amarante, EB_Garamond } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const amarante = Amarante({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-amarante",
  display: "swap",
})
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-eb-garamond",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Magic Card Generator",
  description: "Create custom Magic: The Gathering style cards",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${amarante.variable} ${ebGaramond.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
