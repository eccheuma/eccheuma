import { User } from '~/contracts/User';

export namespace Message {

  export type struct = {
    ID: string
    userID: User.struct['UserID'] 
    from: User.struct['UserName']
    date: number
    message: string
    readed: boolean
  }

  export function builder(): struct {
		return {
			ID: String(),
      userID: String(),
      from: String(),
      date: Number(),
      message: String(),
      readed: false,
		};
	}

}
