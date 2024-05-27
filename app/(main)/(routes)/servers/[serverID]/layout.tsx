import type { Metadata } from 'next'
import { currentProfile } from '../../../../../lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { db } from '../../../../../lib/db'
import { redirect } from 'next/navigation'
import ServerSidebar from '../../../../../components/server/server-sidebar'

export const metadata: Metadata = {
  title: 'CWS App',
  description: 'Welcome to chat with Sam project'
}

export default async function ServerIDLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: {
    serverID: string
  }
}>) {
  const profile = await currentProfile()
  if (!profile) return auth().redirectToSignIn()

  const server = await db.server_tbl.findUnique({
    where: {
      id: params?.serverID,
      members: {
        some: {
          profileID: profile.id
        }
      }
    }
  })
  if (!server) redirect('/')

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col bg-emerald-100 dark:bg-[#2B2D31] md:flex">
        <ServerSidebar serverID={server.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  )
}
