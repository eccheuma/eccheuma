import { Context } from '@nuxt/types';

import { utils } from '~/utils';

import { initializeApp, FirebaseApp } 	from 'firebase/app';
import { getDatabase, Database } 				from 'firebase/database';
import { getAuth, Auth } from 'firebase/auth';

declare global {
	var firebaseClient	: FirebaseApp;
	var firebaseDB			: Database;
	var firebaseAuth		: Auth;
}

export default (context?: Context) => {

	const CONFIG = {
		appId							: context?.env.FIREBASE_API_APP || process.env.FIREBASE_API_APP,
		apiKey						: context?.env.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
		authDomain				: 'escapefrommordorland.firebaseapp.com',
		projectId					: 'escapefrommordorland',
		databaseURL				: 'https://escapefrommordorland.firebaseio.com',
		storageBucket			: 'escapefrommordorland.appspot.com',
		messagingSenderId	: '975378208350',
		measurementId			: 'G-W49JBK6546',
	};

	globalThis.firebaseClient ||= initializeApp(CONFIG, utils.hashGenerator());
	globalThis.firebaseDB 		||= getDatabase(globalThis.firebaseClient);
	globalThis.firebaseAuth		||= getAuth(globalThis.firebaseClient);

}