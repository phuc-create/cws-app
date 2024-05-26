'use client'

import { MEMBER_ROLE, member_tbl, profile_tbl } from '@prisma/client'
import React from 'react'
import UserAvatar from '../user-avatar'
import { ActionTooltip } from '../action-tooltip'
import { FileIcon, ShieldAlert, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

interface ChatItemProps {
  id: string
  content: string
  member: member_tbl & {
    profile: profile_tbl
  }
  timestamp: string
  fileURL?: string | null
  deleted: boolean
  currentMember: member_tbl
  isUpdated: boolean
  socketURL: string
  socketQuery: Record<string, string>
}

const roleToIcon: { [u in MEMBER_ROLE]: React.ReactNode | null } = {
  GUEST: null,
  ADMIN: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-emerald-500" />
}

const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileURL,
  deleted,
  currentMember,
  isUpdated,
  socketURL,
  socketQuery
}: ChatItemProps) => {
  const fileType = fileURL?.split('.').pop()
  const isAdmin = member.role === 'ADMIN'
  const isModerator = member.role === 'MODERATOR'
  const isOwner = currentMember.id === member.id
  const canDeleteMsg = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMsg = !deleted && isOwner && !fileURL
  const isPDF = fileType === 'pdf' && fileURL
  const isImage = !isPDF && fileURL
  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p className="mr-1 cursor-pointer text-sm font-semibold hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role} side={'top'} align={'end'}>
                {roleToIcon[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square h-48 w-48 items-center overflow-hidden rounded-md border bg-secondary"
            >
              <Image
                src={fileURL}
                alt={content}
                fill
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
              <FileIcon className="h-10 w-10 rounded-full fill-indigo-200 stroke-emerald-400 object-cover" />
              <a
                href={fileURL}
                className="ml-2 text-sm text-emerald-500 hover:underline"
                target="_blank"
                rel="noopener roreferrer"
              >
                PDF file
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatItem
