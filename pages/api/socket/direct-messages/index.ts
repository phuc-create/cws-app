import { NextApiRequest } from 'next'
import { NextAPIServerResponseIO } from '../../../../types'
import { currentProfile } from '../../../../lib/current-profile-pages'
import { db } from '../../../../lib/db'

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
    const { conversationID } = req.query
    if (!profile) {
      return res.status(401).json({ error: 'Unauthorized!' })
    }

    if (!conversationID) {
      return res.status(401).json({ error: 'Missing conversationID!' })
    }

    if (!content) {
      return res.status(401).json({ error: 'Missing content!' })
    }
    const conversation = await db.conversation_tbl.findFirst({
      where: {
        id: conversationID as string,
        OR: [
          {
            memberOne: {
              profileID: profile.id
            }
          },
          {
            memberTwo: {
              profileID: profile.id
            }
          }
        ]
      },
      include: {
        memberOne: {
          include: {
            profile: true
          }
        },
        memberTwo: {
          include: {
            profile: true
          }
        }
      }
    })
    console.log(conversation)
    if (!conversation) {
      return res
        .status(404)
        .json({ error: 'Conversation not found!' + 'ID: ' + conversationID })
    }

    const member =
      conversation.memberOne.profileID === profile.id
        ? conversation.memberOne
        : conversation.memberTwo
    if (!member) {
      return res.status(404).json({ error: 'Member not found!' })
    }

    const message = await db.direct_message_tbl.create({
      data: {
        content,
        fileURL,
        conversationID: conversationID as string,
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
    const channelKey = `chat:${conversationID}:messages`
    res?.socket?.server.io.emit(channelKey, message)
    res.end()
  } catch (error) {
    console.log('DIRECT MESSAGE POST ERROR: ', error)
    return res.status(500).json({ error: 'MESSAGE POST ERROR: ' + error })
  }
}
