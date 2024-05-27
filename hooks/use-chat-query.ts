import qs from 'query-string'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useSocket } from '../components/providers/socket-provider'
import axios from 'axios'

interface ChatQueryProps {
  queryKey: string
  apiURL: string
  paramKey: 'channelID' | 'conversationID'
  paramValue: string
}

export const useChatQuery = ({
  queryKey,
  apiURL,
  paramKey,
  paramValue
}: ChatQueryProps) => {
  const { isConnected } = useSocket()
  const fetchMessages = async ({
    pageParam
  }: {
    pageParam: number | undefined | null
  }) => {
    const url = qs.stringifyUrl(
      {
        url: apiURL,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue
        }
      },
      { skipNull: true }
    )
    const res = await axios.get(url)
    return await res.data
  }
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      initialPageParam: null,
      queryKey: [queryKey],
      queryFn: ({ pageParam }) => fetchMessages({ pageParam }),
      getNextPageParam: lastPage => {
        return lastPage?.nextCursor
      },
      refetchInterval: isConnected ? false : 1000
    })
  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  }
}
