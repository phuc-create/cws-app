"use client"
import { MEMBER_ROLE, server_tbl } from '@prisma/client'
import React from 'react'
import { ServerWithMemberWithProfile } from '../../types'


interface ServerHeaderProps {
  server: ServerWithMemberWithProfile
  role?: MEMBER_ROLE
}
const ServerHeader: React.FC<ServerHeaderProps> = ({
  server, role
}) => {
  return (
    <div>ServerHeader</div>
  )
}

export default ServerHeader