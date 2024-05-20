"use client"
import React, { useEffect, useState } from 'react'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FileUpload from '../file-upload'

import axios from 'axios'
import { useRouter } from 'next/navigation'

const CreateServerModal = () => {
  const [mouted, setMouted] = useState(false)
  const router = useRouter()
  useEffect(() => {
    setMouted(true)
  }, [])
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

  const isLoading = form.formState.isLoading
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      await axios.post("/api/servers", values)

      form.reset()
      router.refresh()
      window.location.reload()
    } catch (error) {
      console.log(error)
    }
  }
  if (!mouted) return null
  return (
    <Dialog open>
      {/* <DialogTrigger asChild>
        <Button variant="outline">Welcome to chat with Sam</Button>
      </DialogTrigger> */}
      <DialogContent className="sm:max-w-[425px] bg-white text-black">
        <DialogHeader>
          <DialogTitle>Create a new server</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you`re done.
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
              <Button className='w-full' disabled={isLoading} variant="green" type="submit">Create server</Button>
            </DialogFooter>
          </form>
        </Form>

      </DialogContent>
    </Dialog>

  )
}

export default CreateServerModal