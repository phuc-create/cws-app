'use client'
import React, { useEffect, useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import FileUpload from '../file-upload'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModal } from '../../hooks/use-modal-store'

const CreateServerModal = () => {
  const { isOpen, onClose, type } = useModal()
  const [mouted, setMouted] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setMouted(true)
  }, [])
  const formSchema = z.object({
    name: z.string().min(1, 'Server name is required!'),
    imageURL: z.string().min(1, 'File is required!')
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageURL: ''
    }
  })

  const isLoading = form.formState.isSubmitting
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      await axios.post('/api/servers', values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }
  if (!mouted) return null
  return (
    <Dialog
      open={isOpen && type === 'create-server'}
      onOpenChange={handleClose}
    >
      {/* <DialogTrigger asChild>
        <Button variant="outline">Welcome to chat with Sam</Button>
      </DialogTrigger> */}
      <DialogContent className="bg-white text-black sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left">Create a new server</DialogTitle>
          <DialogDescription className="text-left">
            Build on your own server group chat
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="name"
                      className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70"
                    >
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="name"
                        className="col-span-3 border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter server name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageURL"
                render={({ field }) => (
                  <FormItem className="item-center flex justify-center">
                    <FormControl className="cursor-pointer">
                      <FileUpload
                        endpoint="serverImage"
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
                Create server
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateServerModal
