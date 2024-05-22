"use client"
import { CHANNEL_TYPE, MEMBER_ROLE } from '@prisma/client'
import React from 'react'
import { ServerWithMemberWithProfile } from '../../types'


interface ServerSectionProps {
  label: string,
  role?: MEMBER_ROLE,
  sectionType: "channel" | "member",
  channelType: CHANNEL_TYPE,
  server: ServerWithMemberWithProfile
}
const ServerSection: React.FC<ServerSectionProps> = () => {
  return (
    <div>ServerSection</div>
  )
}

export default ServerSection