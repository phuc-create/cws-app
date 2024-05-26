'use client'
import { channel_tbl, CHANNEL_TYPE, MEMBER_ROLE } from '@prisma/client'
import React from 'react'
import { ServerWithMemberWithProfile } from '../../types'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '../../lib/utils'
import { ActionTooltip } from '../action-tooltip'
import { ModalType, useModal } from '../../hooks/use-modal-store'

interface ServerChannelProps {
  channel: channel_tbl
  role?: MEMBER_ROLE
  server?: ServerWithMemberWithProfile
}
const iconMap: { [x in CHANNEL_TYPE]: React.ReactNode } = {
  TEXT: <Hash className="mr-2 h-4 w-4" />,
  AUDIO: <Mic className="mr-2 h-4 w-4" />,
  VIDEO: <Video className="mr-2 h-4 w-4" />
}

const ServerChannel: React.FC<ServerChannelProps> = ({
  channel,
  role,
  server
}) => {
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()

  const onMoveToChannel = () => {
    router.push(`/servers/${server?.id}/channels/${channel.id}`)
  }

  const onEventClick = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { server, channel })
  }

  return (
    <button
      onClick={onMoveToChannel}
      className={cn(
        'group mb-1 flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50',
        params?.channelID === channel.id &&
        'bg-zinc-700/20 text-emerald-500 dark:bg-zinc-700 dark:text-primary'
      )}
    >
      {iconMap[channel.type]}
      <ActionTooltip
        side="top"
        align="center"
        label={channel.name.split(' ').join('-')}
      >
        <p
          className={cn(
            'line-clamp-1 w-24 text-ellipsis text-left text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-300 dark:group-hover:text-zinc-300',
            params?.channelID === channel.id
              ? 'text-emerald-500 dark:text-white'
              : ''
          )}
        >
          {channel.name.split(' ').join('-')}
        </p>
      </ActionTooltip>
      {channel.name !== 'general' && role !== 'GUEST' && (
        <div className="ml-auto flex items-center gap-x-2">
          <ActionTooltip side="top" align="center" label="Edit">
            <Edit
              onClick={e => onEventClick(e, 'edit-channel')}
              className="h-4 w-4 text-zinc-500 opacity-0 transition hover:text-zinc-600 group-hover:opacity-100 dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
          <ActionTooltip side="top" align="center" label="Delete">
            <Trash
              onClick={e => onEventClick(e, 'delete-channel')}
              className="h-4 w-4 text-zinc-500 opacity-0 transition hover:text-zinc-600 group-hover:opacity-100 dark:text-zinc-400 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
      {channel.name === 'general' && (
        <Lock className="ml-auto h-4 w-4 text-zinc-500 dark:text-zinc-400" />
      )}
    </button>
  )
}

export default ServerChannel
