'use client'

import { MEMBER_ROLE, member_tbl, profile_tbl } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import UserAvatar from '../user-avatar'
import { ActionTooltip } from '../action-tooltip'
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react'
import Image from 'next/image'
import { cn } from '../../lib/utils'
import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Form, FormControl, FormField, FormItem } from '../ui/form'
import queryString from 'query-string'
import axios from 'axios'
import { useModal } from '../../hooks/use-modal-store'
import { useParams, useRouter } from 'next/navigation'

interface ChatItemProps {
  id: string
  content: string
  member: member_tbl & {
    profile: profile_tbl
  }
  timestamp: string
  fileURL?: string | null
  deleted: boolean
  currentMember: member_tbl
  isUpdated: boolean
  socketURL: string
  socketQuery: Record<string, string>
}

const roleToIcon: { [u in MEMBER_ROLE]: React.ReactNode | null } = {
  GUEST: null,
  ADMIN: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  MODERATOR: <ShieldCheck className="ml-2 h-4 w-4 text-emerald-500" />
}
const formSchema = z.object({
  content: z.string().min(1)
})
const ChatItem = ({
  id,
  content,
  member,
  timestamp,
  fileURL,
  deleted,
  currentMember,
  isUpdated,
  socketURL,
  socketQuery
}: ChatItemProps) => {
  const { onOpen } = useModal()
  const router = useRouter()
  const params = useParams()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = queryString.stringifyUrl({
        url: `${socketURL}/${id}`,
        query: socketQuery
      })
      await axios.patch(url, values)
      form.reset()
    } catch (error) {
      console.log(error)
    } finally {
      setIsEditing(false)
    }
  }
  const onMemberClick = async () => {
    if (member.id === currentMember.id) return
    router.push(`/servers/${params?.serverID}/conversations/${member.id}`)
  }
  const isLoading = form.formState.isSubmitting
  useEffect(() => {
    form.reset({
      content: content
    })
  }, [content, form])

  const fileType = fileURL?.split('.').pop()
  const isAdmin = member.role === 'ADMIN'
  const isModerator = member.role === 'MODERATOR'
  const isOwner = currentMember.id === member.id
  const canDeleteMsg = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMsg = !deleted && isOwner && !fileURL
  const isPDF = fileType === 'pdf' && fileURL
  const isImage = !isPDF && fileURL
  return (
    <div className="group relative flex w-full items-center p-4 transition hover:bg-black/5">
      <div className="group flex w-full items-start gap-x-2">
        <div className="cursor-pointer transition hover:drop-shadow-md">
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex w-full flex-col">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center" onClick={onMemberClick}>
              <p className="mr-1 cursor-pointer text-sm font-semibold hover:underline">
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role} side={'top'} align={'center'}>
                {roleToIcon[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          {isImage && (
            <a
              href={fileURL}
              target="_blank"
              rel="noopener noreferrer"
              className="relative mt-2 flex aspect-square h-64 w-64 items-center 
              overflow-hidden rounded-md border bg-secondary"
            >
              <Image
                src={fileURL}
                alt={content}
                fill
                sizes="300"
                className="object-cover"
              />
            </a>
          )}
          {isPDF && (
            <div className="relative mt-2 flex items-center rounded-md bg-background/10 p-2">
              <FileIcon className="h-10 w-10 rounded-full fill-indigo-200 stroke-emerald-400 object-cover" />
              <a
                href={fileURL}
                className="ml-2 text-sm text-emerald-500 hover:underline"
                target="_blank"
                rel="noopener roreferrer"
              >
                PDF file
              </a>
            </div>
          )}
          {!fileURL && !isEditing && (
            <p
              className={cn(
                'text-zinc-600 dark:text-zinc-300',
                deleted &&
                'mt-1 text-xs italic text-zinc-500 dark:text-zinc-400'
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="mx-2 text-[10px] text-zinc-500 dark:to-zinc-400">
                  (edited)
                </span>
              )}
            </p>
          )}
          {!fileURL && isEditing && (
            <Form {...form}>
              <form
                className="flex w-full items-center gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            className="border-0 border-none bg-zinc-200 p-2 text-zinc-600 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700/75 dark:text-zinc-200"
                            placeholder="Edit message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button disabled={isLoading} size={'sm'} variant={'green'}>
                  Save
                </Button>
              </form>
              <span className="mt-1 text-[10px] text-zinc-400">
                Press esc to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMsg && (
        <div className="absolute -top-2 right-5 hidden items-center gap-x-2 rounded-sm border bg-white p-1 group-hover:flex dark:bg-zinc-800">
          {canEditMsg && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="ml-auto h-4 w-4 cursor-pointer text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen('message-delete', {
                  apiURL: `${socketURL}/${id}`,
                  query: socketQuery
                })
              }
              className="ml-auto h-4 w-4 cursor-pointer 
              text-zinc-500 transition hover:text-zinc-600 dark:hover:text-zinc-300"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}

export default ChatItem
