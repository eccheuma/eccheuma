import { ref, 
  get as firebaseGet, 
  set as firebaseSet, 
  remove as firebaseRemove, 
  update as firebaseUpdate,
} from 'firebase/database';

import { onValue, onChildChanged  } from 'firebase/database';
import { query, startAt, endAt, limitToFirst } from 'firebase/database';

import type { DatabaseReference, EventType, Query, QueryConstraint } from 'firebase/database';

// TYPES
type GetParams = {
  mode    : database.mode
  limit   : number
  start   : number
  end     : number
}

// INNER FUNCTIONS
function defineQuery(ref: DatabaseReference, params?: Partial<GetParams>): Query {

  let QUERY = Array<QueryConstraint>();

  if ( params?.start ) 
    QUERY.push(startAt(params.start));
  if ( params?.end )
    QUERY.push(endAt(params.end));
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

  /**
   * @param path Путь к данным в базе.
   * @param params Параметры запроса, будь то количество данных или их пложение.
   * @returns 
   */
  export async function get<T extends object | string>(path: string, params?: Partial<GetParams>): Promise<T> {

    const REF = ref(globalThis.firebaseDB, path);

    const query: Query = defineQuery(REF, params);

    return firebaseGet(query).then(snap => snap.val());
  
  }
  
  export function listen<C extends object | any>(path: string, callback: (value: C) => any, params?: Partial<GetParams>) {
  
    const REF = ref(globalThis.firebaseDB, path);
  
    let getQuery: Query = query(REF);
  
    if ( params ) getQuery = defineQuery(REF, params);

    const databaseEvent: EventType = params?.change 
      ? 'child_changed' 
      : 'value';

    switch (databaseEvent) {

      case 'child_changed':
        onChildChanged(getQuery, snap  => callback(snap.val())); break;

      case 'value': 
        onValue(getQuery, snap => callback(snap.val())); break;
      
    }
  
  }
  
  export async function getLength(path: string): Promise<number> {

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
  
  export async function remove(path: string): Promise<error | boolean> {

    return firebaseRemove(ref(globalThis.firebaseDB, path))
      .then(() => true)
      .catch(e => e.code as error);

  }
  
  export async function update(path: string, data: any): Promise<error | boolean> {

    return firebaseUpdate(ref(globalThis.firebaseDB, path), data)
      .then(() => true)
      .catch(e => e.code as error);

  }

}
