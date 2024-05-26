'use client'
import React from 'react'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'

interface EmojiPickerProps {
  onChange: (value: string) => void
}

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Smile } from 'lucide-react'

const EmojiPicker = ({ onChange }: EmojiPickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Smile className="cursor-pointer dark:text-zinc-400" />
      </PopoverTrigger>

      <PopoverContent
        className="mb-16 border-none bg-transparent shadow-none drop-shadow-none"
        side="right"
        sideOffset={40}
      >
        <Picker
          data={data}
          onEmojiSelect={(emoji: Record<string, any>) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
