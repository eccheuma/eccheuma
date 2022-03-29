import { Product, Purchase } from '~/types/Services';
import { User } from '~/types/User';
import { Image } from '~/types/Image' 
import { Workcase } from '~/types/WorkCase'
import { Message } from '~/types/Message'
import { Post } from '~/types/Post'

// TYPES
  type HASH_LIKE = string;

// MODULE
  export type DatabaseContract = {
    App: {
      BuildTime: HASH_LIKE,
      Cache: {
        Gallery: HASH_LIKE,
        Posts: HASH_LIKE,
        Vk: HASH_LIKE
      },
      Version: HASH_LIKE,
      __SELF_KEY__: User.state['UserID']
    },
    Cases: {
      [ K in keyof typeof Product ]: {
        [index: `CaseID-${ number }`]: Workcase.struct
      }
    },
    Gallery: {
      [index: `PostID-${ number }`]: Image.struct
    },
    Posts: {
      [index: `PostID-${ number }`]: Post.struct
    },
    Service: {
      [ K in keyof typeof Product ]: Array<Purchase.struct<K>>
    },
    Users: {
      [index: string]: {
        requests: Array<Purchase.order<any>>,
        messages: Array<Message.struct>,
        state: User.state,
      }
    }
  }
