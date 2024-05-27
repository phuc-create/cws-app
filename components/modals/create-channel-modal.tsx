'use client'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { CHANNEL_TYPE } from '@prisma/client'
import axios from 'axios'
import { useParams, useRouter } from 'next/navigation'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { useModal } from '../../hooks/use-modal-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'

const CreateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const [loading, setLoading] = useState(false)
  const { channelType } = data
  const router = useRouter()
  const params = useParams()

  const formSchema = z.object({
    name: z
      .string()
      .min(1, 'Channel name is required!')
      .refine(name => name !== 'general', {
        message: "channel name can not be 'general'"
      }),
    type: z.nativeEnum(CHANNEL_TYPE)
  })
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: channelType || CHANNEL_TYPE.TEXT
    }
  })

  useEffect(() => {
    if (channelType) {
      form.setValue('type', channelType)
    }
  }, [channelType, form])

  const isLoading = form.formState.isLoading
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels`,
        query: {
          serverID: params?.serverID
        }
      })
      await axios.post(url, values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }
  return (
    <Dialog
      open={isOpen && type === 'create-channel'}
      onOpenChange={handleClose}
    >
      <DialogContent className="bg-white text-black sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-left">Create a new channel</DialogTitle>
          <DialogDescription className="text-left">
            New channel help you chat with a specific team or squad
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
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        id="name"
                        className="col-span-3 border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Enter channel name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      htmlFor="name"
                      className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70"
                    >
                      Channel type
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(CHANNEL_TYPE).map(type => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="w-full">
              <Button
                className="w-full"
                disabled={isLoading || loading}
                variant="green"
                type="submit"
              >
                Create channels
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default CreateChannelModal
