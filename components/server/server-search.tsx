"use client"
import { CHANNEL_TYPE, MEMBER_ROLE } from '@prisma/client'
import { Hash, Mic, SearchIcon, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import React, { useState } from 'react'
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../ui/command'
import { useParams, useRouter } from 'next/navigation'

interface ServerSearchProps {
  data: {
    label?: string,
    type: "channel" | "member",
    data: {
      id: string
      icon: React.ReactNode,
      name: string,
    }[] | undefined
  }[]
}

const ServerSearch: React.FC<ServerSearchProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  const [open, setOpen] = useState(false)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const onMoveToConversations = ({ id, type }: { id: string, type: "channel" | "member" }) => {
    if (type === "channel") {
      return router.push(`/servers/${params.serverID}/channels/${id}`)
    }
    if (type === "member") {
      return router.push(`/servers/${params.serverID}/conversations/${id}`)
    }
  }
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className='group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
        <SearchIcon className='w-4 h-4 text-zinc-500 dark:text-zinc-400' />
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'>
          Search
        </p>
        <kbd className='pointer-events-none inline-flex select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground ml-auto'>
          <span className='text-sm'>⌘ </span> K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search all channels and members' />
        <CommandList>
          <CommandEmpty>
            No result.
          </CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null
            return (
              <CommandGroup key={label} heading={label}>
                {data.map(({ id, icon, name }) => {
                  return (
                    <CommandItem key={id} onClick={() => onMoveToConversations({ id, type })}>
                      {icon}
                      <span className='mr-2'>{name}</span>
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch