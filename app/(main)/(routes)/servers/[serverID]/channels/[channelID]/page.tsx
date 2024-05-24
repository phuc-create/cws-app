import React from 'react'
import { currentProfile } from '../../../../../../../lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { db } from '../../../../../../../lib/db'
import { redirect } from 'next/navigation'
import ChatHeader from '../../../../../../../components/chat/chat-header'

interface ChannelPageProps {
  params: {
    serverID: string
    channelID: string
  }
}
const ChannelPage = async ({ params }: ChannelPageProps) => {
  const profile = await currentProfile()
  if (!profile) return auth().redirectToSignIn()
  const channel = await db.channel_tbl.findUnique({
    where: {
      id: params.channelID
    }
  })

  const server = await db.server_tbl.findUnique({
    where: {
      id: params.serverID
    }
  })
  const member = await db.member_tbl.findFirst({
    where: {
      serverID: params.serverID,
      profileID: profile.id
    }
  })
  if (!channel || !member) {
    return redirect('/')
  }
  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        serverID={server?.id}
        name={channel.name}
        imageURL={server?.imageUrl}
        type="channel"
      />
    </div>
  )
}

export default ChannelPage
