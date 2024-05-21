"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModal } from '../../hooks/use-modal-store'
import { Label } from '../ui/label'
import { Check, Copy, RefreshCw } from 'lucide-react'
import useOrigin from '../../hooks/use-origin'

const InviteModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal()
  const { server } = data
  const origin = useOrigin()
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const inviteURL = `${origin}/invite/${server?.inviteCode || ''}`

  const onCopy = () => {
    navigator.clipboard.writeText(inviteURL)
    setCopied(true)

    setTimeout(() => {
      setCopied(() => false)
    }, 1000)
  }

  const onCreateNewLink = async () => {
    setLoading(() => true)
    try {
      const res = await axios.patch(`/api/servers/${server?.id}/invite-code`)
      onOpen("invite", { server: res.data })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen && type === "invite"} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className='text-left'>Invite Friends</DialogTitle>
          <DialogDescription className='text-left'>
            Bring your friends to here and have fun!
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="name" className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
            Name
          </Label>
          <div className='flex items-center mt-2 gap-x-2'>
            <Input
              disabled={loading}
              type='text'
              id="name"
              className="col-span-3 bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
              value={inviteURL}
              readOnly
            />
            <Button size="icon" onClick={onCopy} disabled={loading}>
              {copied ? <Check className='w-4 h-4 text-emerald-600' /> : <Copy className='w-4 h-4' />}
            </Button>
          </div>
          <Button
            onClick={onCreateNewLink}
            variant="link"
            size="sm"
            className='text-sm text-zinc-500 mt-4'
            disabled={loading}>Generate new link
            <RefreshCw className='h-4 w-4 ml-2' />
          </Button>
        </div>
      </DialogContent>
    </Dialog>

  )
}

export default InviteModal