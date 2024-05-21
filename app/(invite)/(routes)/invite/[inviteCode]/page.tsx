import React from 'react'
import { currentProfile } from '../../../../../lib/current-profile'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '../../../../../lib/db'

interface InviteCodePageProps {
  params: {
    inviteCode: string
  }
}

const InviteCodePage: React.FC<InviteCodePageProps> = async ({ params }) => {
  const profile = await currentProfile()
  if (!profile) return auth().redirectToSignIn()

  if (!params.inviteCode) redirect("/")

  const existingServer = await db.server_tbl.findFirst({
    where: {
      inviteCode: params.inviteCode,
      members: {
        some: {
          profileID: profile.id
        }
      }
    }
  })

  if (existingServer) redirect(`/servers/${existingServer.id}`)

  const server = await db.server_tbl.update({
    where: {
      inviteCode: params.inviteCode
    },
    data: {
      members: {
        create: [
          {
            profileID: profile.id
          }
        ]
      },

    }
  })

  if (server) redirect(`/servers/${server.id}`)
  return null
}

export default InviteCodePage