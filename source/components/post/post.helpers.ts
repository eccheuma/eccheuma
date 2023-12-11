import { database } from "~/api/database";
import { User } from "~/contracts/User";
import { utils } from "~/utils";
import { IAnswer } from "./post.types";

export namespace helpers {
  
  const MentionRE = new RegExp("@.+?,","g");

  export function asAnswer({ message, user }: IAnswer): IAnswer["message"] {
    return `@${ user.name }, ${ message }`;
  }

  export async function getAddresseeID(message: string): Promise<Array<User.struct["uid"]>> {

    const addressees = extractAddressee(message);

    const users: utils.types.asIterableObject<User.state> = await database.get("users");

    return Object.values(users)
      .filter(user => addressees.some(x => x === user.state.name))
      .map(user => user.state.uid);

  }

  function extractAddressee(message: string): Array<string> {

    const relatedUsers = (message.match(MentionRE) || []).map(str => {
      return str.substring(1, str.length - 1);
    });

    return relatedUsers;

  }

}
