/* eslint-disable import/no-named-as-default-member */
import firebase from 'firebase/app';
import 'firebase/auth';

import { getLocale, languages } from '~/lang'

export namespace form {

  export type email = `${ string }@${ string }.${ string }`

  export type registration = {
    [i: string] : string,
    email			  : email
    password	  : string
    name        : string
  }

  export type loginPass = {
    email: email,
    uid: string,
  }

}

export namespace auth {

  export const enum error {
    network     = 'auth/network-request-failed',
		notUser     = 'auth/user-not-found',
		email       = 'auth/invalid-email',
		password    = 'auth/wrong-password',
		takedEmail  = 'auth/email-already-in-use',
  }

  export function defineError(e: error, lang: languages) {
    return getLocale(lang).authError[e]
  }

  export async function login(email: form.email, pass: string) {

    try {

      const { user } = await firebase.auth().signInWithEmailAndPassword(email, pass);
  
      if ( user === null ) throw new Error();
  
      return {
        email: user.email,
        uid: user.uid,
      } as form.loginPass

    } catch (e: any) {
      return e.code as auth.error
    }

  }

  export async function register(email: form.email, pass: string): Promise<form.loginPass | auth.error> {

    try {

      const { user } = await firebase.auth().createUserWithEmailAndPassword(email, pass);
  
      if ( !user ) throw new Error();

      return {
        email: user.email as form.email,
        uid: user.uid,
      }


    } catch (e: any) {
      return e.code as auth.error
    }

  }

  export async function applyPassword(email: form.email, passcode: string) {
    return await firebase.auth().confirmPasswordReset(passcode, email)
  }

  export async function requirePassword(email: form.email, returnURL: string) {
    return await firebase.auth().sendPasswordResetEmail(email, {
      url: returnURL
    })
  }

}
