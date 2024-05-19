import type { Metadata } from "next"


export const metadata: Metadata = {
  title: "CWS App",
  description: "Welcome to chat with Sam project",
}

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-full flex justify-center items-center">
      {children}
    </div>
  )
}