import { database } from '~/api/database';
import { User } from '~/types/User';
import { utils } from '~/utils';
import { IAnswer } from './post.types';

export namespace helpers {
  
  const MentionRE = new RegExp('@.+?,','g');

  export function asAnswer({ message, user }: IAnswer): IAnswer['message'] {
    return `@${ user.UserName }, ${ message }`;
  }

  export async function getAddresseeID(message: string): Promise<Array<User.struct['UserID']>> {

    const addressees = extractAddressee(message);

    const users = await database.get<utils.types.asIterableObject<User.state>>('Users');

    return Object.values(users)
      .filter(user => addressees.some(x => x === user.state.UserName))
      .map(user => user.state.UserID);

  }

  function extractAddressee(message: string): Array<string> {

    const relatedUsers = (message.match(MentionRE) || []).map(str => {
      return str.substring(1, str.length - 1);
    });

    return relatedUsers;

  }

}
