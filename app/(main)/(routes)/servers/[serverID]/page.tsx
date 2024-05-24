import React from 'react'
import { currentProfile } from '../../../../../lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { db } from '../../../../../lib/db'
import { redirect } from 'next/navigation'
interface ServerPageProps {
  params: {
    serverID: string
  }
}
const ServerPage: React.FC<ServerPageProps> = async ({ params }) => {
  const profile = await currentProfile()
  if (!profile) {
    return auth().redirectToSignIn()
  }
  const server = await db.server_tbl.findUnique({
    where: {
      id: params.serverID,
      members: {
        some: {
          profileID: profile.id
        }
      }
    },
    include: {
      channels: {
        where: {
          name: 'general'
        },
        orderBy: {
          createdAt: 'asc'
        }
      }
    }
  })
  const initChannel = server?.channels[0]
  if (initChannel?.name !== 'general') return null
  return redirect(`/servers/${server?.id}/channels/${initChannel.id}`)
}

export default ServerPage
