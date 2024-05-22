"use client"
import { channel_tbl, CHANNEL_TYPE, MEMBER_ROLE } from '@prisma/client'
import React from 'react'
import { ServerWithMemberWithProfile } from '../../types'
import { Delete, Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '../../lib/utils'
import { ActionTooltip } from '../action-tooltip'

interface ServerChannelProps {
  channel: channel_tbl,
  role?: MEMBER_ROLE
  server?: ServerWithMemberWithProfile
}
const iconMap: { [x in CHANNEL_TYPE]: React.ReactNode } = {
  TEXT: <Hash className='mr-2 h-4 w-4' />,
  AUDIO: <Mic className='mr-2 h-4 w-4' />,
  VIDEO: <Video className='mr-2 h-4 w-4' />
}

const ServerChannel: React.FC<ServerChannelProps> = ({ channel, role, server }) => {
  const params = useParams()
  const router = useRouter()


  return (
    <button onClick={() => { }} className={cn("group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1",
      params.channelID === channel.id && "bg-zinc-700/20 dark:bg-zinc-700"
    )}>
      {iconMap[channel.type]}
      <ActionTooltip side='top' align='center' label={channel.name}>
        <p className={cn("line-clamp-1 w-24 text-ellipsis font-semibold text-sm text-zinc-500 text-left dark:text-zinc-300 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition", params.channelID === channel.id ? "text-white" : "")}>
          {channel.name}
        </p>
      </ActionTooltip>
      {channel.name !== "general" && role !== "GUEST" && (
        <div className='ml-auto flex items-center gap-x-2'>
          <ActionTooltip side='top' align='center' label='Edit'>
            <Edit className='opacity-0 group-hover:opacity-100 h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition' />
          </ActionTooltip>
          <ActionTooltip side='top' align='center' label='Edit'>
            <Trash className='opacity-0 group-hover:opacity-100 h-4 w-4 text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition' />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className='w-4 h-4 ml-auto text-zinc-500 dark:text-zinc-400' />
      )}
    </button>
  )
}

export default ServerChannel