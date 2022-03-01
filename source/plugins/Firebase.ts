import { Context } from '@nuxt/types'

import firebase from 'firebase/app'

declare global {
	var firebaseClient: firebase.app.App
}

export default (context: Context) => {

	const CLIENT_CONFIG = {
		appId							: context.env.FIREBASE_API_APP,
		apiKey						: context.env.FIREBASE_API_KEY,
		authDomain				: 'escapefrommordorland.firebaseapp.com',
		projectId					: 'escapefrommordorland',
		databaseURL				: 'https://escapefrommordorland.firebaseio.com',
		storageBucket			: 'escapefrommordorland.appspot.com',
		messagingSenderId	: '975378208350',
		measurementId			: 'G-W49JBK6546',
	};
	
	if ( !firebase.apps.length ) {
		globalThis.firebaseClient = firebase.initializeApp(CLIENT_CONFIG);
	}

}