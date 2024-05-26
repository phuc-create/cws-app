'use client'

import { member_tbl, message_tbl, profile_tbl } from '@prisma/client'
import React, { Fragment } from 'react'
import { format } from 'date-fns'
import ChatWelcome from './chat-welcome'
import { useChatQuery } from '../../hooks/use-chat-query'
import { Loader2, ServerCrash } from 'lucide-react'
import ChatItem from './chat-item'
import { ScrollArea } from '../ui/scroll-area'

interface ChatMessagesProps {
  name: string
  member: member_tbl
  chatID: string
  apiURL: string
  socketURL: string
  socketQuery: Record<string, string>
  paramKey: 'channelID' | 'conversationID'
  paramValue: string
  type: 'channel' | 'conversation'
}

type MessageItem = message_tbl & {
  member: member_tbl & { profile: profile_tbl }
}

const ChatMessages = ({
  name,
  member,
  chatID,
  apiURL,
  socketQuery,
  socketURL,
  paramKey,
  paramValue,
  type
}: ChatMessagesProps) => {
  const queryKey = `chat:${chatID}`
  const { data, fetchNextPage, hasNextPage, status, isFetchingNextPage } =
    useChatQuery({ apiURL, paramKey, paramValue, queryKey })
  if (status === 'pending') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    )
  }
  if (status === 'error') {
    return (
      <div className="flex flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    )
  }
  return (
    <ScrollArea className="flex flex-1 flex-col py-4">
      {/* <div className="flex flex-1 flex-col overflow-y-auto py-4"> */}
      <div className="flex-1" />
      <ChatWelcome type={type} name={name} />
      <div className="mt-auto flex flex-col-reverse">
        {data?.pages.map((group, i) => {
          return (
            <Fragment key={i}>
              {(group.items || []).map((item: MessageItem) => {
                return (
                  <ChatItem
                    key={item.id}
                    id={item.id}
                    content={item.content}
                    member={item.member}
                    fileURL={item.fileURL}
                    timestamp={format(
                      new Date(item.createdAt),
                      'd MMM yyyy, HH:mm'
                    )}
                    deleted={item.deleted}
                    currentMember={member}
                    isUpdated={item.createdAt !== item.updatedAt}
                    socketURL={socketURL}
                    socketQuery={socketQuery}
                  />
                )
              })}
            </Fragment>
          )
        })}
      </div>
      {/* </div> */}
    </ScrollArea>
  )
}

export default ChatMessages
