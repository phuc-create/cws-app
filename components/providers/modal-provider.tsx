'use client'
import { useEffect, useState } from 'react'
import CreateServerModal from '../modals/create-server-modal'
import InviteModal from '../modals/invite-modal'
import UpdateServerModal from '../modals/update-server-modal'
import MembersModal from '../modals/members-modal'
import CreateChannelModal from '../modals/create-channel-modal'
import LeaveServerModal from '../modals/leave-server-modal'
import DeleteServerModal from '../modals/delete-server-modal'
import DeleteChannelModal from '../modals/delete-channel-modal'
import UpdateChannelModal from '../modals/update-channel-modal'
import MessageFileModal from '../modals/message-file-modal'
import DeleteMessageModal from '../modals/delete-message-modal'

const ModalProvider = () => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  return (
    <>
      <CreateServerModal />
      <UpdateServerModal />
      <MembersModal />
      <InviteModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <UpdateChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  )
}

export default ModalProvider
