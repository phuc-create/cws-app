'use client'
import { MEMBER_ROLE } from '@prisma/client'
import React from 'react'
import { ServerWithMemberWithProfile } from '../../types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users
} from 'lucide-react'
import { useModal } from '../../hooks/use-modal-store'

interface ServerHeaderProps {
  server: ServerWithMemberWithProfile
  role?: MEMBER_ROLE
}
const ServerHeader: React.FC<ServerHeaderProps> = ({ server, role }) => {
  const { onOpen } = useModal()
  const isAdmin = role === MEMBER_ROLE.ADMIN
  const isModerator = isAdmin || role === MEMBER_ROLE.MODERATOR
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button className="text-md flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition hover:bg-zinc-700/10 dark:border-neutral-800 dark:hover:bg-zinc-700/50">
          {server.name}
          <ChevronDown className="ml-auto h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('invite', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400"
          >
            Invite People
            <UserPlus className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('update-server', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400"
          >
            Server Settings
            <Settings className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('members', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400"
          >
            Manage Members
            <Users className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('create-channel')}
            className="cursor-pointer px-3 py-2 text-sm text-emerald-600 dark:text-emerald-400"
          >
            Create Channel
            <PlusCircle className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('delete-server', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-rose-600 dark:text-rose-400"
          >
            Delete Server
            <Trash className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('leave-server', { server })}
            className="cursor-pointer px-3 py-2 text-sm text-rose-600 dark:text-rose-400"
          >
            Leave Server
            <LogOut className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader
