import type { Metadata } from "next"
import { Open_Sans } from "next/font/google"
import NavigationSidebar from "../../components/navigation/navigation-sidebar"

const inter = Open_Sans({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CWS App",
  description: "Welcome to chat with Sam project",
}

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="md:pl-[72px] h-full">

        {children}
      </main>
    </div>
  )
}