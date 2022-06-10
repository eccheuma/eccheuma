import { ref, 
  get as firebaseGet, 
  set as firebaseSet, 
  remove as firebaseRemove, 
  update as firebaseUpdate,
} from 'firebase/database';

import { onValue, onChildChanged  } from 'firebase/database';
import { query, startAt, endAt, limitToFirst, orderByKey } from 'firebase/database';

import type { DatabaseReference, EventType, Query, QueryConstraint } from 'firebase/database';

// TYPES
type GetParams = {
  mode    : database.mode
  limit   : number
  start   : number
  end     : number
}

// INNER FUNCTIONS
function defineQuery(ref: DatabaseReference, params: Partial<GetParams> = Object()): Query {

  let QUERY = Array<QueryConstraint>();

  if ( params?.start ) 
    QUERY.push(startAt(String(params.start)), orderByKey());
  if ( params?.end )
    QUERY.push(endAt(String(params.end)), orderByKey());
  if ( params?.limit )
    QUERY.push(limitToFirst(params.limit));

  return query(ref, ...QUERY);

}

// MODULE NAMESPACE
export namespace database {

  export const enum error {
    denied = 'PERMISSION_DENIED',
  }

  export const enum mode {
    child,
    whole,
  }

  export function get<T extends object | string>(path: string, params?: Partial<GetParams>): Promise<T> {

    const REF = ref(globalThis.firebaseDB, path);

    const query: Query = defineQuery(REF, params);

    return firebaseGet(query).then(snap => snap.val());
  
  }
  
  export function listen<C extends object | any>(path: string, callback: (value: C) => any, params?: Partial<GetParams>) {
  
    const REF = ref(globalThis.firebaseDB, path);
  
    const query: Query = defineQuery(REF, params);

    switch (params?.mode) {

      case mode.child:
        onChildChanged(query, (snap) => callback(snap.val())); break;

      case mode.whole: 
        onValue(query, (snap) => callback(snap.val())); break;

      default:
        onValue(query, (snap) => callback(snap.val())); break;
      
    }
  
  }
  
  export function getLength(path: string): Promise<number> {

    const Query: Query = query(ref(globalThis.firebaseDB, path));

    return firebaseGet(Query).then(snap => snap.size);

  }
  
  export async function set(path: string, data: any): Promise<Error | boolean> {
  
    return new Promise((res, rej) => {

      const REF = ref(globalThis.firebaseDB, path);

      try {
        
        firebaseSet(REF, data); res(true);

      } catch (error) {

        rej(error);

      }

    })
    
  }
  
  export function remove(path: string): Promise<error | boolean> {

    return firebaseRemove(ref(globalThis.firebaseDB, path))
      .then(() => true)
      .catch(e => e.code as error);

  }
  
  export function update(path: string, data: any): Promise<error | boolean> {

    return firebaseUpdate(ref(globalThis.firebaseDB, path), data)
      .then(() => true)
      .catch(e => e.code as error);

  }

}
