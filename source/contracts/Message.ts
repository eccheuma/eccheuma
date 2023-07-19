import { User } from '~/contracts/User';

export namespace Message {

  export type struct = {
    uid: string
    userID: User.struct['uid'] 
    from: User.struct['name']
    date: number
    message: string
    readed: boolean
  }

  export function builder(): struct {
		return {
			uid: String(),
      userID: String(),
      from: String(),
      date: Number(),
      message: String(),
      readed: false,
		};
	}

}
