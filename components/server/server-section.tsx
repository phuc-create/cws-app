'use client'
import { CHANNEL_TYPE, MEMBER_ROLE } from '@prisma/client'
import React from 'react'
import { ServerWithMemberWithProfile } from '../../types'
import { ActionTooltip } from '../action-tooltip'
import { Plus, Settings } from 'lucide-react'
import { useModal } from '../../hooks/use-modal-store'

interface ServerSectionProps {
  label: string
  role?: MEMBER_ROLE
  sectionType: 'channel' | 'member'
  channelType?: CHANNEL_TYPE
  server?: ServerWithMemberWithProfile
}
const ServerSection: React.FC<ServerSectionProps> = ({
  label,
  role,
  sectionType,
  channelType,
  server
}) => {
  const { onOpen } = useModal()
  return (
    <div className="flex items-center justify-between py-2">
      <p className="text-xs font-semibold uppercase text-zinc-500 dark:text-zinc-400">
        {label}
      </p>
      {role !== 'GUEST' && sectionType === 'channel' && (
        <ActionTooltip label="Create Channel" side="top" align={'center'}>
          <button
            onClick={() => onOpen('create-channel', { channelType })}
            className="text-zinc-500 transition 
            hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Plus className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
      {role === 'ADMIN' && sectionType === 'member' && (
        <ActionTooltip label="Manage Mebmbers" side="top" align={'center'}>
          <button
            onClick={() => onOpen('members')}
            className="text-zinc-500 transition hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300"
          >
            <Settings className="h-4 w-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerSection
