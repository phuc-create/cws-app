import type { Metadata } from "next"
import { currentProfile } from "../../../../../lib/current-profile"
import { auth } from "@clerk/nextjs/server"
import { db } from "../../../../../lib/db"
import { redirect } from "next/navigation"
import ServerSidebar from "../../../../../components/server/server-sidebar"

export const metadata: Metadata = {
  title: "CWS App",
  description: "Welcome to chat with Sam project",
}

export default async function ServerIDLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode,
  params: {
    serverID: string
  }
}>) {
  const profile = await currentProfile()
  if (!profile) return auth().redirectToSignIn()

  const server = await db.server_tbl.findUnique({
    where: {
      id: params.serverID,
      members: {
        some: {
          profileID: profile.id
        }
      }
    }
  })
  if (!server) redirect("/")

  return (
    <div className="h-full">
      <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
        <ServerSidebar serverID={server.id} />
      </div>
      <main className="h-full md:pl-60">
        {children}

      </main>
    </div>
  )
}