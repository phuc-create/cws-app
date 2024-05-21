import { NextResponse } from "next/server"
import { currentProfile } from "../../../lib/current-profile"
import { db } from "../../../lib/db"
import { MEMBER_ROLE } from "@prisma/client"

export const POST = async (req: Request) => {
  try {
    const { name, type } = await req.json()
    const { searchParams } = new URL(req.url)
    const serverID = searchParams.get("serverID")
    const profile = await currentProfile()
    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 })
    }
    if (!serverID) {
      return new NextResponse("Missing serverID", { status: 400 })
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
          },

        },
      },
      data: {
        channels: {
          create: {
            profileID: profile.id,
            name,
            type
          }
        }
      }
    })
    return NextResponse.json(server)
  } catch (error) {
    console.log(error)
    return new NextResponse("[CREATE CHANNEL ERROR] " + error, { status: 500 })
  }
}