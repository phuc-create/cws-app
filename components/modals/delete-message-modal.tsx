'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'

import axios from 'axios'
import { useModal } from '../../hooks/use-modal-store'
import qs from 'query-string'

const DeleteMessageModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { apiURL, query } = data
  const [isLoading, setIsLoading] = useState(false)

  const onConfirmDeleteMessage = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiURL || '',
        query: query
      })
      await axios.delete(url)
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen && type === 'message-delete'} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black">
        <>
          <DialogTitle className="text-left">DELETE MESSAGE!</DialogTitle>
          <DialogDescription className="text-left">
            Are you sure that you want to delete this message ?
          </DialogDescription>
        </>
        <DialogFooter className="flex w-full items-center justify-between bg-gray-200 px-6 py-4">
          <Button disabled={isLoading} variant={'ghost'} onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            variant={'green'}
            onClick={onConfirmDeleteMessage}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteMessageModal
