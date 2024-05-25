'use client'
import React from 'react'
import { useSocket } from './providers/socket-provider'
import { Badge } from './ui/badge'
const SocketIndicator = () => {
  const { isConnected } = useSocket()
  if (!isConnected) {
    return (
      <Badge
        variant={'outline'}
        className="border-none bg-orange-600 text-white"
      >
        Falling back
      </Badge>
    )
  }
  return (
    <Badge
      variant={'outline'}
      className="border-none bg-emerald-600 text-white"
    >
      Live: real-time update
    </Badge>
  )
}

export default SocketIndicator
