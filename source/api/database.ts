// FIREBASE
import firebase from 'firebase/app';
import 'firebase/database';

// TYPES
type GetParams = {
  change  : boolean
  limit   : number
  start   : number
  end     : number
}

// INNER FUNCTIONS
function defineQuery(ref: firebase.database.Query, params: Partial<GetParams>): firebase.database.Query | undefined {

  let QUERY

  if ( params?.start ) 
    QUERY = ref.startAt(params.start);
  if ( params?.end )
    QUERY = ref.endAt(params.end);
  if ( params?.limit )
    QUERY = ref.limitToFirst(params.limit);

  return QUERY;

}

// MODULE NAMESPACE
export namespace database {

  export const enum error {
    denied = 'PERMISSION_DENIED',
  }

  export function get<T extends object | string>(path: string, params?: Partial<GetParams>): Promise<T> {

    const REF = firebase.database().ref(path);
  
    let QUERY;
  
    if ( params ) QUERY = defineQuery(REF, params)
  
    return (QUERY || REF).once('value').then(data => data.val());
  
  }
  
  export function listen<C extends object | any>(path: string, callback: (value: C) => any, params?: Partial<GetParams>) {
  
    const REF = firebase.database().ref(path);
  
    let QUERY;
  
    if ( params ) QUERY = defineQuery(REF, params);

    const databaseEvent: firebase.database.EventType = params?.change 
      ? 'child_changed' 
      : 'value';
  
    (QUERY || REF).on(databaseEvent, data => {
      callback(data.val());
    })
  
  }
  
  export function getLength(path: string): Promise<number> {
    return firebase.database().ref(path).once('value').then(data => data.numChildren());
  }
  
  export async function set(path: string, data: any): Promise<Error | boolean> {
  
    return new Promise((res, rej) => {
      firebase.database().ref(path).set(data, error => error ? rej(error) : res(true));
    })
    
  }
  
  export function remove(path: string): Promise<error | boolean> {

    return firebase.database().ref(path)
      .remove()
      .then(() => true)
      .catch(e => e.code as error)

  }
  
  export function update(path: string, data: any): Promise<error | boolean> {

    return firebase.database().ref(path)
      .update(data)
      .then(() => true)
      .catch(e => e.code as error)

  }

}
