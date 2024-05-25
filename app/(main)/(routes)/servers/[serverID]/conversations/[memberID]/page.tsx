import React from 'react'
import { currentProfile } from '../../../../../../../lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { db } from '../../../../../../../lib/db'
import { redirect } from 'next/navigation'
import { getOrCreateConvesation } from '../../../../../../../lib/conversation'
import ChatHeader from '../../../../../../../components/chat/chat-header'

interface MemberConversationPageProps {
  params: {
    memberID: string
    serverID: string
  }
}
const MemberConversationPage = async ({
  params
}: MemberConversationPageProps) => {
  const profile = await currentProfile()
  if (!profile) {
    return auth().redirectToSignIn()
  }
  const currentMember = await db.member_tbl.findFirst({
    where: {
      serverID: params.serverID,
      profileID: profile.id
    },
    include: {
      profile: true
    }
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConvesation(
    currentMember.id,
    params.memberID
  )
  if (!conversation) {
    return redirect(`/servers/${params.serverID}`)
  }

  const { memberOne, memberTwo } = conversation

  const otherMember =
    memberOne.profile.id === profile.id ? memberTwo : memberOne
  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        imageURL={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        type={'conversation'}
      />
    </div>
  )
}

export default MemberConversationPage
