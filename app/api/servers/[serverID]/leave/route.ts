import { NextResponse } from 'next/server'
import { currentProfile } from '../../../../../lib/current-profile'
import { db } from '../../../../../lib/db'

export const PATCH = async (
  req: Request,
  { params }: { params: { serverID: string } }
) => {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!params?.serverID) {
      return new NextResponse('Missing Server ID', { status: 400 })
    }
    const server = await db.server_tbl.update({
      where: {
        id: params?.serverID,
        profileID: {
          not: profile.id
        },
        members: {
          some: {
            profileID: profile.id
          }
        }
      },
      data: {
        members: {
          deleteMany: {
            profileID: profile.id
          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('[SERVER ERROR]: ', error)
    return new NextResponse('Internal Server Error: ' + error, { status: 500 })
  }
}
