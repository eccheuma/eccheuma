// SUPABASE
import Supabase from '~/plugins/Supabase'

// FIREBASE
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

export function getLink(path: string): string | null {

  const { publicURL, error } = Supabase.storage.from('main').getPublicUrl(path);

  if ( error ) throw error;

  return publicURL

}

export function getData(path: string, cb: (data: any) => any): any {
  firebase.database().ref(path).on('value', (data) => cb(data.val()));
}

export function removeData(path: string): Promise<any> {
  return firebase.database().ref(path).remove();
}

export function setData(path: string, data: any): Promise<any> {
  return firebase.database().ref(path).set(data);
}