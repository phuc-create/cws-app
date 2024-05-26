'use client'
import { Hash } from 'lucide-react'
import React from 'react'

interface ChatWelcomeProps {
  type: 'channel' | 'conversation'
  name: string
}
const ChatWelcome = ({ type, name }: ChatWelcomeProps) => {
  return (
    <div className="my-4 space-y-2 px-4">
      {type === 'channel' && (
        <div className="flex h-[75px] w-[75px] items-center justify-center bg-zinc-500 dark:bg-zinc-700">
          <Hash className="h-12 w-12 text-white" />
        </div>
      )}
      <p className="text-xl font-bold md:text-3xl">
        {type === 'channel' ? 'welcome to #' : ''}
        {name}
      </p>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {type === 'channel'
          ? `This is the start of the #${name} channel`
          : `this is the start of your conversation with ${name}`}
      </p>
    </div>
  )
}

export default ChatWelcome
