'use client'
import React from 'react'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form'
import FileUpload from '../file-upload'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModal } from '../../hooks/use-modal-store'
import queryString from 'query-string'

const MessageFileModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { apiURL, query } = data
  const router = useRouter()

  const formSchema = z.object({
    fileURL: z.string().min(1, 'File is required!')
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileURL: ''
    }
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: apiURL || '',
        query: query
      })
      await axios.post(url, { ...values, content: values.fileURL })

      form.reset()
      handleClose()
      router.refresh()
    } catch (error) {
      console.log(error)
    } finally {
      onClose()
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isOpen && type === 'message-file'} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Welcome to chat with Sam</Button>
      </DialogTrigger> */}
      <DialogContent className="bg-white text-black sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left">Attach file</DialogTitle>
          <DialogDescription className="text-left">
            Send a file as message
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="fileURL"
                render={({ field }) => (
                  <FormItem className="item-center flex justify-center">
                    <FormControl className="cursor-pointer">
                      <FileUpload
                        endpoint="messageFile"
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="w-full">
              <Button
                className="w-full"
                disabled={isLoading}
                variant="green"
                type="submit"
              >
                Send
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal
