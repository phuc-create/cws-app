import {
  channel_tbl,
  member_tbl,
  profile_tbl,
  server_tbl
} from '@prisma/client'
import { NextApiResponse } from 'next'
import { Server as SocketIOServer } from 'socket.io'
import { Socket, Server as NetServer } from 'net'

export type ServerWithMemberWithProfile = server_tbl & {
  channels: channel_tbl[]
  members: (member_tbl & { profile: profile_tbl })[]
}

export type NextAPIServerResponseIO = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}
