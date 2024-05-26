'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '../ui/input'
import { Plus, SendHorizonal } from 'lucide-react'
import queryString from 'query-string'
import axios from 'axios'
import { useModal } from '../../hooks/use-modal-store'
import EmojiPicker from '../emoji-picker'

interface ChatInputProps {
  apiURL: string
  query: Record<string, any>
  name: string
  type: 'channel' | 'conversation'
}

const ChatInput = ({ apiURL, query, name, type }: ChatInputProps) => {
  const { onOpen } = useModal()
  const formSchema = z.object({
    content: z.string().min(1)
  })
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      content: ''
    },
    resolver: zodResolver(formSchema)
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    try {
      const url = queryString.stringifyUrl({
        url: apiURL,
        query
      })
      await axios.post(url, values)
      form.reset()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4 pb-6">
                  <button
                    onClick={() => onOpen('message-file', { apiURL, query })}
                    type="button"
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-emerald-500 dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    {...field}
                    className="border-0 border-none bg-zinc-200/90 px-12 py-6 text-base text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={`Message ${type === 'conversation' ? name : '#' + name}`}
                  />
                  <div className="absolute right-16 top-7">
                    <EmojiPicker
                      onChange={(emj: string) =>
                        field.onChange(field.value + ' ' + emj)
                      }
                    />
                  </div>
                  <button
                    onClick={form.handleSubmit(onSubmit)}
                    type="button"
                    className="absolute right-6 top-6 flex items-center justify-center rounded-full p-1 transition"
                  >
                    <SendHorizonal className="h-6 w-6 dark:text-zinc-400" />
                  </button>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput
