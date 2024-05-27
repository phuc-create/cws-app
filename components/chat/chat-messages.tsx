'use client'

import { member_tbl, message_tbl, profile_tbl } from '@prisma/client'
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { format } from 'date-fns'
import ChatWelcome from './chat-welcome'
import { useChatQuery } from '../../hooks/use-chat-query'
import { Loader2, ServerCrash } from 'lucide-react'
import ChatItem from './chat-item'
import { useChatSocket } from '../../hooks/use-chat-socket'
import { Button } from '../ui/button'
import useScrollMessage from '../../hooks/use-scroll-message'

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
  const addKey = `chat:${chatID}:messages`
  const updateKey = `chat:${chatID}:messages:update`

  const [isLoadMore, setIsLoadMore] = useState(false)
  const topViewRef = useRef<HTMLDivElement>(null)
  const messageViewRef = useRef<HTMLDivElement>(null)

  const { data, fetchNextPage, hasNextPage, status, isFetchingNextPage } =
    useChatQuery({ apiURL, paramKey, paramValue, queryKey })

  useChatSocket({ queryKey, updateKey, addKey })
  useScrollMessage({
    topRef: topViewRef,
    bottomRef: messageViewRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage
  })
  const onLoadMoreMessages = async () => {
    setIsLoadMore(true)
    await fetchNextPage()
    // topViewRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    if (!isLoadMore) {
      scrollToBottom()
    }
  }, [data, isLoadMore])

  const scrollToBottom = () => {
    messageViewRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

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
    <div ref={topViewRef} className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />
      {!hasNextPage && <ChatWelcome type={type} name={name} />}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 animate-spin text-zinc-400" />
          ) : (
            <Button onClick={onLoadMoreMessages} variant={'ghost'} size={'sm'}>
              Load previous messages
            </Button>
          )}
        </div>
      )}
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

      <div ref={messageViewRef}></div>
    </div>
  )
}

export default ChatMessages
