import { NextApiRequest } from 'next'
import { NextAPIServerResponseIO } from '../../../../types'
import { currentProfile } from '../../../../lib/current-profile-pages'
import { db } from '../../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextAPIServerResponseIO
) {
  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed!' })
  }
  try {
    const profile = await currentProfile(req)
    const { content } = req.body
    const { messageID, serverID, channelID } = req.query
    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized!' })
    }

    if (!serverID) {
      return res.status(401).json({ error: 'Missing serverID!' })
    }

    if (!channelID) {
      return res.status(401).json({ error: 'Missing channelID!' })
    }

    const server = await db.server_tbl.findFirst({
      where: {
        id: serverID as string,
        members: {
          some: {
            profileID: profile.id
          }
        }
      },
      include: {
        members: true
      }
    })
    if (!server) {
      return res.status(401).json({ error: 'Server not found!' })
    }
    const channel = await db.channel_tbl.findFirst({
      where: {
        id: channelID as string,
        serverID: server.id
      }
    })
    if (!channel) {
      return res.status(401).json({ error: 'Channel not found!' })
    }
    const member = server.members.find(mem => mem.profileID === profile.id)
    if (!member) {
      return res.status(401).json({ error: 'Member not found!' })
    }
    let message = await db.message_tbl.findFirst({
      where: {
        id: messageID as string,
        channelID: channel.id
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    })
    if (!message || message.deleted) {
      return res.status(401).json({ error: 'Message not found!' })
    }
    const isMessageOwner = message.memberID === member.id
    const isAdmin = member.role === 'ADMIN'
    const isModerator = member.role === 'MODERATOR'
    const canModify = isMessageOwner || isAdmin || isModerator
    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized!' })
    }

    if (req.method === 'DELETE') {
      message = await db.message_tbl.update({
        where: {
          id: messageID as string
        },
        data: {
          fileURL: null,
          content: 'this message has been deleted.',
          deleted: true
        },
        include: {
          member: { include: { profile: true } }
        }
      })
    }
    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized!' })
      }
      message = await db.message_tbl.update({
        where: {
          id: messageID as string
        },
        data: {
          content: content
        },
        include: {
          member: { include: { profile: true } }
        }
      })
    }
    const updateKey = `chat:${channelID}:messages:update`
    console.log('server update socket check: ', res?.socket?.server?.io)
    res?.socket?.server?.io?.emit(updateKey, message)
    // res.end()
    return res.status(200).json(message)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Internal Error' })
  }
}
