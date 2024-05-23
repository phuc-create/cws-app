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
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useModal } from '../../hooks/use-modal-store'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../ui/select'
import { useEffect } from 'react'

const UpdateChannelModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const { channel, server } = data
  const router = useRouter()

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
      type: channel?.type || CHANNEL_TYPE.TEXT
    }
  })

  useEffect(() => {
    if (channel) {
      form.setValue('name', channel.name)
      form.setValue('type', channel.type)
    }
  }, [channel, form])

  const isLoading = form.formState.isLoading
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverID: server?.id
        }
      })
      await axios.patch(url, values)

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
    <Dialog open={isOpen && type === 'edit-channel'} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex gap-x-2 text-left">
            Update <p className="text-emerald-600">#{channel?.name}</p>
          </DialogTitle>
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
                disabled={isLoading}
                variant="green"
                type="submit"
              >
                Update channel
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateChannelModal
