import { NextResponse } from 'next/server'
import { currentProfile } from '../../../lib/current-profile'
import { db } from '../../../lib/db'
import { MEMBER_ROLE } from '@prisma/client'

export const POST = async (req: Request) => {
  try {
    const { name, imageURL } = await req.json()
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const server = await db.server_tbl.create({
      data: {
        profileID: profile.id,
        name,
        imageUrl: imageURL,
        inviteCode: crypto.randomUUID(),
        channels: {
          create: [
            {
              name: 'general',
              profileID: profile.id
            }
          ]
        },
        members: {
          create: [{ profileID: profile.id, role: MEMBER_ROLE.ADMIN }]
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    return new NextResponse('Error: ' + error, { status: 400 })
  }
}
