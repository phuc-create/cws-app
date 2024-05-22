"use client"
import React, { useEffect } from 'react'
import { useModal } from '../../hooks/use-modal-store'

const OpenCreateServer = () => {
  const { onOpen } = useModal()
  useEffect(() => {
    onOpen("create-server")
  }, [onOpen])
  return (
    <div></div>
  )
}

export default OpenCreateServer