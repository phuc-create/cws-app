'use client'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from '../ui/input'
import { Plus, Smile } from 'lucide-react'

interface ChatInputProps {
  apiURL: string
  query: Record<string, any>
  name: string
  type: 'channel' | 'conversation'
}

const ChatInput = ({ apiURL, query, name, type }: ChatInputProps) => {
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
                    type="button"
                    className="absolute left-8 top-7 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-zinc-500 p-1 transition hover:bg-zinc-600 dark:bg-zinc-400 dark:hover:bg-zinc-300"
                  >
                    <Plus className="text-emerald-500 dark:text-[#313338]" />
                  </button>
                  <Input
                    disabled={isLoading}
                    {...field}
                    className="border-0 border-none bg-zinc-200/90 px-14 py-6 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                    placeholder={`Message ${type === 'conversation' ? name : '# ' + name}`}
                  />
                  <div className="absolute right-8 top-7">
                    <Smile />
                  </div>
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
