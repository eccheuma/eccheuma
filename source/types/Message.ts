import { User } from '~/types/User'

export namespace Message {

  export type struct = {
    ID: string
<<<<<<< HEAD
    userID: User.struct['UserID'] 
    from: User.struct['UserName']
=======
    userID: User.state['UserID'] 
    from: User.state['UserName']
>>>>>>> master
    date: number
    message: string
    readed: boolean
  }

<<<<<<< HEAD
  export function builder(): struct {
		return {
			ID: String(),
      userID: String(),
      date: Number(),
      from: String(),
      message: String(),
      readed: false,
		}
	}

=======
>>>>>>> master
}
