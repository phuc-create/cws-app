'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'

import axios from 'axios'
import { useModal } from '../../hooks/use-modal-store'
import { useRouter } from 'next/navigation'
import qs from 'query-string'

const DeleteChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { server, channel } = data
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onConfirmDeleteChannel = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverID: server?.id
        }
      })
      await axios.delete(url)
      onClose()
      router.push(`/servers/${server?.id}`)
      router.refresh()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen && type === 'delete-channel'} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <>
          <DialogTitle className="text-left">DELETE CHANNEL!</DialogTitle>
          <DialogDescription className="text-left">
            Are you sure that you want to delete channel <br />
            <span className="font-semibold text-rose-600">
              #{channel?.name.split(' ').join('-')}
            </span>
            ?
          </DialogDescription>
        </>
        <DialogFooter className="flex w-full items-center justify-between bg-gray-200 px-6 py-4">
          <Button disabled={isLoading} variant={'ghost'} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant={'green'}
            onClick={onConfirmDeleteChannel}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteChannelModal
