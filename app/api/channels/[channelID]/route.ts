import { NextResponse } from 'next/server'
import { currentProfile } from '../../../../lib/current-profile'
import { db } from '../../../../lib/db'
import { MEMBER_ROLE } from '@prisma/client'

export const PATCH = async (
  req: Request,
  { params }: { params: { channelID: string } }
) => {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)
    const serverID = searchParams.get('serverID')
    if (!serverID) {
      return new NextResponse('Missing Server ID', { status: 400 })
    }
    if (!params?.channelID) {
      return new NextResponse('Missing Member ID', { status: 400 })
    }
    const server = await db.server_tbl.update({
      where: {
        id: serverID,
        members: {
          some: {
            profileID: profile.id,
            role: {
              in: [MEMBER_ROLE.ADMIN, MEMBER_ROLE.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          update: {
            where: {
              id: params?.channelID,
              name: {
                not: 'general'
              }
            },
            data: {
              name,
              type
            }
          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log(error)
    return new NextResponse('[PATCH CHANNEL ERROR]: ' + error, { status: 500 })
  }
}

export const DELETE = async (
  req: Request,
  { params }: { params: { channelID: string } }
) => {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const serverID = searchParams.get('serverID')
    if (!serverID) {
      return new NextResponse('Missing Server ID', { status: 400 })
    }
    if (!params?.channelID) {
      return new NextResponse('Missing Member ID', { status: 400 })
    }
    const server = await db.server_tbl.update({
      where: {
        id: serverID,
        members: {
          some: {
            profileID: profile.id,
            role: {
              in: [MEMBER_ROLE.ADMIN, MEMBER_ROLE.MODERATOR]
            }
          }
        }
      },
      data: {
        channels: {
          delete: {
            id: params?.channelID,
            name: {
              not: 'general'
            }
          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log(error)
    return new NextResponse('[DELETE CHANNEL ERROR]: ' + error, { status: 500 })
  }
}
