/* eslint-disable import/no-named-as-default-member */

// FIREBASE
import firebase from 'firebase/app';
import 'firebase/database';

// TYPES
type GetParams = {
  start: number,
  end: number,
  limit: number,
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

  export function get<T extends object | string>(path: string, params?: Partial<GetParams>): Promise<T> {

    const REF = firebase.database().ref(path);
  
    let QUERY;
  
    if ( params ) QUERY = defineQuery(REF, params!)
  
    return (QUERY || REF).once('value').then(data => data.val());
  
  }
  
  export function listen(path: string, callback: (value: any) => any, params?: Partial<GetParams>) {
  
    const REF = firebase.database().ref(path);
  
    let QUERY;
  
    if ( params ) QUERY = defineQuery(REF, params!);
  
    (QUERY || REF).on('value', data => {
      callback(data.val());
    })
  
  }
  
  export function getLength(path: string): Promise<number> {
    return firebase.database().ref(path).once('value').then(data => data.numChildren());
  }
  
  export function set(path: string, data: any): Promise<any> {
  
    console.log('setDatabaseData', path);
  
    return firebase.database().ref(path).set(data, (response) => {
      console.log(response);
    });
  
  }
  
  export function remove(path: string): Promise<any> {
  
    console.log('removeDatabaseData', path);
  
    return firebase.database().ref(path).remove();
  
  }
  
  export function update(path: string, data: any, callback: any = null): Promise<any> {
    return firebase.database().ref(path).update(data, callback)
  }

}
