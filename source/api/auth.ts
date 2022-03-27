import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  signOut 
} from 'firebase/auth';

import { getLocale, languages } from '~/lang';


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
    weekPass    = 'auth/weak-password',
		takedEmail  = 'auth/email-already-in-use',
  }

  export function defineError(e: error, lang: languages) {
    return getLocale(lang).authError[e]
  }

  export async function login(email: form.email, pass: string) {

    try {

      const { user } = await signInWithEmailAndPassword(globalThis.firebaseAuth, email, pass);
  
      if ( user === null ) throw new Error();
  
      return {
        email: user.email,
        uid: user.uid,
      } as form.loginPass

    } catch (e: any) {
      return e.code as auth.error
    }

  }

  export function logout() {
    return signOut(globalThis.firebaseAuth);
  }

  export async function register(email: form.email, pass: string): Promise<auth.error | form.loginPass> {

    try {

      const { user } = await createUserWithEmailAndPassword(globalThis.firebaseAuth, email, pass);

      if (!user) throw new Error(auth.error.notUser);

      return {
        email: user.email as form.email,
        uid: user.uid,
      };

    } catch (e: any) {

      return e?.code as auth.error;

    }

  }

  export async function applyPassword(code: string, pass: string) {
    return await confirmPasswordReset(globalThis.firebaseAuth, code, pass)
  }

  export async function requirePassword(email: form.email) {
    return await sendPasswordResetEmail(globalThis.firebaseAuth, email)
  }

}
