import React, { useEffect, useState } from 'react'
interface UseScrollMessageProps {
  bottomRef: React.RefObject<HTMLDivElement>
  topRef: React.RefObject<HTMLDivElement>

  shouldLoadMore: boolean
  loadMore: () => void
}
const useScrollMessage = ({
  bottomRef,
  topRef,
  shouldLoadMore,
  loadMore
}: UseScrollMessageProps): void => {
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const topDiv = topRef.current
    const scrollCheck = () => {
      const scrollTop = topDiv?.scrollTop
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore()
      }
    }
    topDiv?.addEventListener('scroll', scrollCheck)
    return () => {
      topDiv?.removeEventListener('scroll', scrollCheck)
    }
  }, [loadMore, shouldLoadMore, topRef])

  useEffect(() => {
    const bottomDiv = bottomRef.current
    const topDiv = topRef.current
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true)
        return true
      }
      if (!topDiv) return false
      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      return distanceFromBottom <= 100
    }
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }, [bottomRef, hasInitialized, topRef])
}

export default useScrollMessage
