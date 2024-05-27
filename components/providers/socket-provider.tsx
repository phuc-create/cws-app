'use client'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { Socket, io as IOClient } from 'socket.io-client'

interface SocketContextProps {
  socket?: Socket | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextProps>({
  socket: null,
  isConnected: false
})

const SocketContextProvider = ({ children }: { children: React.ReactNode }) => {
  const socket = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const socketInstance = new (IOClient as any)('/', {
      path: '/api/socket/io',
      addTrailingSlash: true
    })

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })
    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })
    socket.current = socketInstance
  }, [])
  return (
    <SocketContext.Provider value={{ socket: socket.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)

export default SocketContextProvider
