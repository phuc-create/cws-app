"use client"
import React, { useEffect } from 'react'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FileUpload from '../file-upload'

import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useModal } from '../../hooks/use-modal-store'

const UpdateServerModal = () => {
  const { isOpen, onOpen, onClose, type, data } = useModal()
  const { server } = data
  const router = useRouter()

  const formSchema = z.object({
    name: z.string().min(1, "Server name is required!"),
    imageURL: z.string().min(1, "File is required!")
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      imageURL: ""
    }
  })

  useEffect(() => {
    if (server) {
      form.setValue("name", server.name)
      form.setValue("imageURL", server.imageUrl)
    }
  }, [server, form])

  const isLoading = form.formState.isLoading
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      await axios.patch(`/api/servers/${server?.id}`, values)

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

  return (
    <Dialog open={isOpen && type === "update-server"} onOpenChange={handleClose}>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Welcome to chat with Sam</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle className='text-left'>Update server information</DialogTitle>
          <DialogDescription className='text-left'>
            Build on your own server group chat
          </DialogDescription>
        </DialogHeader>
        <Form {...form} >
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="name" className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      type='text'
                      id="name"
                      className="col-span-3 bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                      placeholder='Enter server name'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="imageURL" render={({ field }) => (
                <FormItem className='flex item-center justify-center'>
                  <FormControl className='cursor-pointer'>
                    <FileUpload endpoint='serverImage' value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            </div>
            <DialogFooter className='w-full'>
              <Button className='w-full' disabled={isLoading} variant="green" type="submit">Save Update</Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>

  )
}

export default UpdateServerModal