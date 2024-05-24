'use client'
import { MEMBER_ROLE, member_tbl, profile_tbl } from '@prisma/client'
import React from 'react'
import { ServerWithMemberWithProfile } from '../../types'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '../../lib/utils'
import UserAvatar from '../user-avatar'

interface ServerMembersProps {
  member: member_tbl & { profile: profile_tbl }
  server: ServerWithMemberWithProfile
}

const roleToIcon: { [u in MEMBER_ROLE]: React.ReactNode | null } = {
  GUEST: null,
  ADMIN: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-emerald-500" />
}

const ServerMembers = ({ member, server }: ServerMembersProps) => {
  const params = useParams()
  const router = useRouter()

  const onGoToConversation = () => {
    router.push(`/servers/${server.id}/conversations/${member.id}`)
  }
  return (
    <button
      onClick={onGoToConversation}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.memberID === member.id && 'bg-zinc-700/20 dark:bg-zinc-700'
      )}
    >
      <UserAvatar
        src={member.profile.imageUrl}
        className="h-8 w-8 md:h-8 md:w-8"
      />
      <p
        className={cn(
          'line-clamp-1 w-24 text-ellipsis text-left text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-300 dark:group-hover:text-zinc-300',
          params?.memberID === member.id
            ? 'text-primary dark:text-zinc-200'
            : ''
        )}
      >
        {member.profile.name}
      </p>
      {roleToIcon[member.role]}
    </button>
  )
}

export default ServerMembers
