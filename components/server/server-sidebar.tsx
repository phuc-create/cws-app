import React from 'react'
import { currentProfile } from '../../lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { db } from '../../lib/db'
import { redirect } from 'next/navigation'
import { CHANNEL_TYPE, MEMBER_ROLE } from '@prisma/client'
import ServerHeader from './server-header'
import { ScrollArea } from '../ui/scroll-area'
import ServerSearch from './server-search'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { Separator } from '../ui/separator'
import ServerSection from './server-section'
import ServerChannel from './server-channel'

interface ServerSidebarProps {
  serverID: string
}

const iconMap: { [x in CHANNEL_TYPE]: React.ReactNode } = {
  TEXT: <Hash className='mr-2 h-4 w-4' />,
  AUDIO: <Mic className='mr-2 h-4 w-4' />,
  VIDEO: <Video className='mr-2 h-4 w-4' />
}

const roleToIcon: { [u in MEMBER_ROLE]: React.ReactNode | null } = {
  GUEST: null,
  ADMIN: <ShieldAlert className='h-4 w-4 mr-2 text-rose-500' />,
  MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-emerald-500' />
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
      <ScrollArea className='flex-1  px-3'>
        <div className='mt-2'>
          <ServerSearch data={[{
            label: "Chat Channels",
            type: "channel",
            data: textChannels.map(c => ({
              id: c.id,
              name: c.name,
              icon: iconMap[c.type]
            }))
          }, {
            label: "Audio Channels",
            type: "channel",
            data: audioChannels.map(c => ({
              id: c.id,
              name: c.name,
              icon: iconMap[c.type]
            }))
          }, {
            label: "Video Channels",
            type: "channel",
            data: videoChannels.map(c => ({
              id: c.id,
              name: c.name,
              icon: iconMap[c.type]
            }))
          }, {
            label: "Members",
            type: "member",
            data: members.map(m => ({
              id: m.id,
              name: m.profile.name,
              icon: roleToIcon[m.role]
            }))
          }]} />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded my-2' />
        {!!textChannels.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channel'
              channelType={CHANNEL_TYPE.TEXT}
              role={role}
              label='Text channels'
            />
            {textChannels.map(channel => (
              <ServerChannel key={channel.id} role={role} channel={channel} server={server} />
            ))}
          </div>
        )}
        {!!audioChannels.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channel'
              channelType={CHANNEL_TYPE.AUDIO}
              role={role}
              label='Audio channels'
            />
            {audioChannels.map(channel => (
              <ServerChannel key={channel.id} role={role} channel={channel} server={server} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar