import { User } from '~/types/User'

export namespace Message {

  export type struct = {
    ID: string
    userID: User.state['UserID'] 
    from: User.state['UserName']
    date: number
    message: string
    readed: boolean
  }

}
