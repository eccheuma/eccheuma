import { USER_STATE } from '~/typescript/User'

export type MESSAGE = {
  ID: string
  UserID: USER_STATE['UserID']
  From: USER_STATE['UserName'],
  Date: number
  Message: string
  Read: boolean
}
