import { useQueryClient } from '@tanstack/react-query'
import { useSocket } from '../components/providers/socket-provider'
import { member_tbl, message_tbl, profile_tbl } from '@prisma/client'
import { useEffect } from 'react'

type ChatSocketProps = {
  addKey: string
  updateKey: string
  queryKey: string
}

type MessageWithMember = message_tbl & {
  member: member_tbl & {
    profile: profile_tbl
  }
}

export const useChatSocket = ({
  addKey,
  updateKey,
  queryKey
}: ChatSocketProps) => {
  const { socket } = useSocket()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!socket) return
    socket.on(updateKey, (message: MessageWithMember) => {
      queryClient.setQueryData(
        [queryKey],
        (oldData: { pages: { items: MessageWithMember[] }[] }) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0) {
            return oldData
          }
          const newData = oldData.pages.map(page => {
            return {
              ...page,
              items: page.items.map((item: MessageWithMember) => {
                if (item.id === message.id) return message
                return item
              })
            }
          })
          return {
            ...oldData,
            pages: newData
          }
        }
      )
    })
    socket.on(addKey, (message: MessageWithMember) => {
      queryClient.setQueryData(
        [queryKey],
        (oldData: { pages: { items: MessageWithMember[] }[] }) => {
          if (!oldData || !oldData.pages || oldData.pages.length === 0)
            return {
              pages: [{ items: [message] }]
            }
          const newData = [...oldData.pages]
          newData[0] = {
            ...newData[0],
            items: [message, ...newData[0].items]
          }
          return {
            ...oldData,
            pages: newData
          }
        }
      )
    })
    return () => {
      socket.off(addKey)
      socket.off(updateKey)
    }
  }, [queryClient, addKey, queryKey, socket, updateKey])
}
