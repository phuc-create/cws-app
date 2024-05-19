import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import "./globals.css"

const inter = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CWS App",
  description: "Welcome to chat with Sam project",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  )
}