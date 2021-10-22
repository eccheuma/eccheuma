import { WebApplications, HTMLcode, GraphicalDesign, CATEGORY, SERVICE, ADDICTION } from '~/typescript/Services';
import { USER_STATE, USER_REQUEST } from '~/typescript/User';
import { IMAGE_PROPERTY } from '~/typescript/Image' 
import { WORKCASE }       from '~/typescript/WorkCase'
import { MESSAGE }        from '~/typescript/Message'
import { POST }           from '~/typescript/Post'

// TYPES
  type HASH_LIKE = string;

  type CASE_TYPE    = WebApplications | HTMLcode | GraphicalDesign;
  type SERVICE_TYPE = CATEGORY;

// MODULE
  export type FirebaseDatabaseContract = {
    App: {
      BuildTime: HASH_LIKE,
      Cache: {
        Gallery: HASH_LIKE,
        Posts: HASH_LIKE,
        Vk: HASH_LIKE
      },
      Version: HASH_LIKE,
      __SELF_KEY__: USER_STATE['UserID']
    },
    Cases: {
      [ k in CASE_TYPE ]: {
        [index: string]: WORKCASE
      }
    },
    Gallery: {
      [index: string]: IMAGE_PROPERTY
    },
    Posts: {
      [index: string]: POST
    },
    Service: {
      Addictions: {
        [k in CATEGORY]: Array<ADDICTION>
      },
      Products: {
        [k in SERVICE_TYPE]: Array<SERVICE>
      }
    },
    Users: {
      [index: string]: {
        requests: Array<USER_REQUEST>,
        messages: Array<MESSAGE>,
        state: USER_STATE,
      }
    }
  }
