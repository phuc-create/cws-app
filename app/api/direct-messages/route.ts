import { NextResponse } from 'next/server'
import { currentProfile } from '../../../lib/current-profile'
import { db } from '../../../lib/db'
import { direct_message_tbl } from '@prisma/client'

const MESSAGES_BATCH = 10
export const GET = async (req: Request) => {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { searchParams } = new URL(req.url)

    const cursor = searchParams.get('cursor')
    const conversationID = searchParams.get('conversationID')

    if (!conversationID) {
      return new NextResponse('Missing conversationID', { status: 400 })
    }
    let messages: direct_message_tbl[] = []
    if (cursor) {
      messages = await db.direct_message_tbl.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor
        },
        where: {
          conversationID: conversationID || ''
        },
        include: {
          member: {
            include: { profile: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    } else {
      messages = await db.direct_message_tbl.findMany({
        take: MESSAGES_BATCH,
        where: {
          conversationID
        },
        include: {
          member: {
            include: { profile: true }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      })
    }

    let nextCursor = null
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id
    }
    return NextResponse.json({
      items: messages,
      nextCursor
    })
  } catch (error) {
    return new NextResponse('FETCH DIRECT MESSAGE INTERNAL ERROR: ' + error, {
      status: 500
    })
  }
}
