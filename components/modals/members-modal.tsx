"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import axios from 'axios'
import qs from 'query-string'
import { useModal } from '../../hooks/use-modal-store'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../user-avatar'
import { MEMBER_ROLE } from '@prisma/client'
import { Check, CircleX, Loader2, MoreVertical, OutdentIcon, Shield, ShieldAlert, ShieldCheck, ShieldQuestion } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useRouter } from 'next/navigation'

const roleToIcon: { [u in MEMBER_ROLE]: React.ReactNode | null } = {
  GUEST: null,
  ADMIN: <ShieldAlert className='h-4 w-4 text-rose-500' />,
  MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-emerald-500' />
}
const MembersModal = () => {
  const router = useRouter()
  const { isOpen, onOpen, onClose, type, data } = useModal()
  const { server } = data
  const [loadingID, setLoadingID] = useState("")

  const onKickUser = async (memberID: string) => {
    try {
      setLoadingID(memberID)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberID}`,
        query: {
          serverID: server?.id
        }
      })
      const res = await axios.delete(url)
      router.refresh()
      onOpen("members", { server: res.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingID("")
    }
  }
  const onRoleChange = async (memberID: string, role: MEMBER_ROLE) => {
    try {
      setLoadingID(memberID)

      const url = qs.stringifyUrl({
        url: `/api/members/${memberID}`,
        query: {
          serverID: server?.id,
          memberID
        }
      })
      const response = await axios.patch(url, { role })

      onOpen("members", { server: response.data })
      console.log(response.data)
      router.refresh()
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingID("")
    }
  }


  return (
    <Dialog open={isOpen && type === "members"} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className='text-left text-2xl font-bold'>Manage members</DialogTitle>
          <DialogDescription className='text-left text-zinc-500'>
            {(server?.members || []).length} members
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='mt-8 max-h-[420px] pr-6'>
          {(server?.members || []).map(member => {
            return (
              <div key={member.id} className='flex items-center gap-x-6 mb-6'>
                <UserAvatar src={member.profile.imageUrl} />
                <div className='flex flex-col gap-y-1'>
                  <div className='text-sm font-semibold flex items-center gap-x-1'>
                    {member.profile.name}
                    {roleToIcon[member.role]}
                  </div>
                  <p className='text-xs text-zinc-500'>
                    {member.profile.email}

                  </p>
                </div>
                {server?.profileID !== member.profileID && loadingID !== member.id && (
                  <div className='ml-auto'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className='h-4 w-4 text-zinc-500' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side='left'>
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            <ShieldQuestion className='w-4 h-4 mr-2' />
                            <span>role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, "GUEST")}>
                                <Shield className='h-4 w-4 mr-2' />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onRoleChange(member.id, "MODERATOR")}>
                                <ShieldCheck className='h-4 w-4 mr-2' />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className='h-4 w-4 ml-auto' />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onKickUser(member.id)}>
                          <CircleX className='w-4 h-4 mr-2' />
                          Kick!!
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
                {loadingID === member.id && (
                  <Loader2 className='animate-spin text-zinc-500 ml-auto w-4 h-4' />
                )}
              </div>
            )
          })}
        </ScrollArea>
        <div className='p-6'>
          members
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default MembersModal