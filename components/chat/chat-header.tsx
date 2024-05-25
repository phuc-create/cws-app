import { Hash } from 'lucide-react'
import React from 'react'
import MobileToggle from '../mobile-toggle'
import { Avatar, AvatarImage } from '../ui/avatar'
import UserAvatar from '../user-avatar'
import SocketIndicator from '../socket-indicator'

interface ChatHeaderProps {
  serverID?: string
  name: string
  type: 'channel' | 'conversation'
  imageURL?: string
}
const ChatHeader = ({ serverID, name, type, imageURL }: ChatHeaderProps) => {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverID={serverID || ''} />
      {type === 'channel' && (
        <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      )}
      {type === 'conversation' && (
        <UserAvatar src={imageURL} className="mr-2 h-8 w-8 md:h-8 md:w-8" />
      )}
      <p className="text-lg font-semibold text-black dark:text-white">{name}</p>
      <div className="ml-auto flex items-center">
        <SocketIndicator />
      </div>
    </div>
  )
}

export default ChatHeader
