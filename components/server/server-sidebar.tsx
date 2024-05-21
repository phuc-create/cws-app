import React from 'react'
import { currentProfile } from '../../lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { db } from '../../lib/db'
import { redirect } from 'next/navigation'
import { CHANNEL_TYPE } from '@prisma/client'
import ServerHeader from './server-header'

interface ServerSidebarProps {
  serverID: string
}

const ServerSidebar: React.FC<ServerSidebarProps> = async ({ serverID }) => {
  const profile = await currentProfile()
  if (!profile) return auth().redirectToSignIn()

  const server = await db.server_tbl.findUnique({
    where: {
      id: serverID,
      members: {
        some: {
          profileID: profile.id
        }
      }
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc"
        }
      },
      members: {
        include: {
          profile: true
        },
        orderBy: {
          role: "asc"
        }
      }
    }
  })
  if (!server) redirect("/")

  const textChannels = server.channels.filter(cn => cn.type === CHANNEL_TYPE.TEXT)
  const videoChannels = server.channels.filter(cn => cn.type === CHANNEL_TYPE.VIDEO)
  const audioChannels = server.channels.filter(cn => cn.type === CHANNEL_TYPE.AUDIO)

  const members = server.members.filter(mb => mb.profileID !== profile.id)
  const role = server.members.find(mb => mb.profileID === profile.id)?.role
  return (
    <div className='flex flex-col text-primary w-full'>
      <ServerHeader server={server} role={role} />
    </div>
  )
}

export default ServerSidebar