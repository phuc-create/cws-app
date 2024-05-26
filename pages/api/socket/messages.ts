import { NextApiRequest } from 'next'
import { NextAPIServerResponseIO } from '../../../types'
import { currentProfile } from '../../../lib/current-profile-pages'
import { db } from '../../../lib/db'

export default async function handler(
  req: NextApiRequest,
  res: NextAPIServerResponseIO
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'method not allowed!' })
  }
  try {
    const profile = await currentProfile(req)
    const { content, fileURL } = req.body
    const { serverID, channelID } = req.query
    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized!' })
    }

    if (!serverID) {
      return res.status(401).json({ error: 'Missing serverID!' })
    }

    if (!channelID) {
      return res.status(401).json({ error: 'Missing channelID!' })
    }

    if (!content) {
      return res.status(401).json({ error: 'Missing content!' })
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
      return res.status(404).json({ error: 'Server not found!' })
    }
    const channel = await db.channel_tbl.findFirst({
      where: {
        id: channelID as string,
        serverID: serverID as string
      }
    })
    if (!channel) {
      return res.status(404).json({ error: 'Channel not found!' })
    }
    const member = server.members.find(mem => mem.profileID === profile.id)
    if (!member) {
      return res.status(404).json({ error: 'Member not found!' })
    }

    const message = await db.message_tbl.create({
      data: {
        content,
        fileURL,
        channelID: channelID as string,
        memberID: member.id
      },
      include: {
        member: {
          include: {
            profile: true
          }
        }
      }
    })
    const channelKey = `chat:${channelID}:messages`
    res?.socket?.server.io.emit(channelKey, message)
    res.end()
  } catch (error) {
    console.log('MESSAGE POST ERROR: ', error)
    return res.status(500).json({ error: 'MESSAGE POST ERROR: ' + error })
  }
}
