"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import axios from 'axios'
import { useModal } from '../../hooks/use-modal-store'
import { useRouter } from 'next/navigation'

const LeaveServerModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal()
  const { server } = data
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const onConfirmLeaveServer = async () => {
    try {
      setIsLoading(true)
      await axios.patch(`/api/servers/${server?.id}/leave`)
      onClose()
      router.refresh()
      router.push("/")
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen && type === "leave-server"} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <DialogHeader>
          <DialogTitle className='text-left'>LEAVE SERVER!</DialogTitle>
          <DialogDescription className='text-left'>
            Are you sure that you want to leave out <span className='text-emerald-600 font-semibold'>
              {server?.name}
            </span>
            ?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className='w-full bg-gray-200 flex justify-between items-center px-6 py-4'>
          <Button
            disabled={isLoading}
            variant={"ghost"}
            onClick={onClose}
          >Cancel</Button>
          <Button
            disabled={isLoading}
            variant={"green"}
            onClick={onConfirmLeaveServer}
          >Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  )
}

export default LeaveServerModal