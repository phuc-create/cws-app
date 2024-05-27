import { NextResponse } from 'next/server'
import { currentProfile } from '../../../../lib/current-profile'
import { db } from '../../../../lib/db'

export const PATCH = async (
  req: Request,
  { params }: { params: { memberID: string } }
) => {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthrized', { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const { role } = await req.json()
    const serverID = searchParams.get('serverID')
    if (!serverID) {
      return new NextResponse('Missing Server ID', { status: 400 })
    }
    if (!params?.memberID) {
      return new NextResponse('Missing Member ID', { status: 400 })
    }
    const server = await db.server_tbl.update({
      where: {
        id: serverID,
        profileID: profile.id
      },
      data: {
        members: {
          update: {
            where: {
              id: params?.memberID,
              profileID: {
                not: profile.id
              }
            },
            data: { role }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log('[MEMBER UPDATE ERROR]: ', error)
    return new NextResponse('Internal Server Error: ' + error, { status: 500 })
  }
}

export const DELETE = async (
  req: Request,
  { params }: { params: { memberID: string } }
) => {
  try {
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse('Unauthrized', { status: 401 })
    }
    const { searchParams } = new URL(req.url)
    const serverID = searchParams.get('serverID')
    if (!serverID) {
      return new NextResponse('Missing Server ID', { status: 400 })
    }
    if (!params?.memberID) {
      return new NextResponse('Missing Member ID', { status: 400 })
    }
    const server = await db.server_tbl.update({
      where: {
        id: serverID,
        profileID: profile.id
      },
      data: {
        members: {
          deleteMany: {
            id: params?.memberID,
            profileID: {
              not: profile.id
            }
          }
        }
      },
      include: {
        members: {
          include: {
            profile: true
          },
          orderBy: {
            role: 'asc'
          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log(error)
    return new NextResponse('[KICK USER ERROR]: ' + error, { status: 500 })
  }
}
