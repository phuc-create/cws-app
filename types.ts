import {
  channel_tbl,
  member_tbl,
  profile_tbl,
  server_tbl
} from '@prisma/client'

export type ServerWithMemberWithProfile = server_tbl & {
  channels: channel_tbl[]
  members: (member_tbl & { profile: profile_tbl })[]
}
