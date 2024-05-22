"use client"
import { MEMBER_ROLE, server_tbl } from '@prisma/client'
import React from 'react'
import { ServerWithMemberWithProfile } from '../../types'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { ChevronDown, LogOut, PlusCircle, Settings, Trash, UserPlus, Users } from 'lucide-react'
import { useModal } from '../../hooks/use-modal-store'


interface ServerHeaderProps {
  server: ServerWithMemberWithProfile
  role?: MEMBER_ROLE
}
const ServerHeader: React.FC<ServerHeaderProps> = ({
  server, role
}) => {
  const { onOpen } = useModal()
  const isAdmin = role === MEMBER_ROLE.ADMIN
  const isModerator = isAdmin || role === MEMBER_ROLE.MODERATOR
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='w-full text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'>
          {server.name}
          <ChevronDown className='h-5 w-5 ml-auto' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-[2px]'>
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className='text-emerald-600 dark:text-emerald-400 px-3 py-2 text-sm cursor-pointer'>
            Invite People
            <UserPlus className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("update-server", { server })}
            className='text-emerald-600 dark:text-emerald-400 px-3 py-2 text-sm cursor-pointer'>
            Server Settings
            <Settings className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("members", { server })}
            className='text-emerald-600 dark:text-emerald-400 px-3 py-2 text-sm cursor-pointer'>
            Manage Members
            <Users className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("create-channel")}
            className='text-emerald-600 dark:text-emerald-400 px-3 py-2 text-sm cursor-pointer'>
            Create Channel
            <PlusCircle className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuSeparator />
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("delete-server", { server })}
            className='text-rose-600 dark:text-rose-400 px-3 py-2 text-sm cursor-pointer'>
            Delete Server
            <Trash className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen("leave-server", { server })}
            className='text-rose-600 dark:text-rose-400 px-3 py-2 text-sm cursor-pointer'>
            Leave Server
            <LogOut className='w-4 h-4 ml-auto' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader