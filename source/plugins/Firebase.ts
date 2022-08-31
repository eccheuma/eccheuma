import { Context } from '@nuxt/types';

import { utils } from '~/utils';

import { initializeApp, FirebaseApp, getApps, deleteApp } 	from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

import { getAuth, Auth } from 'firebase/auth';

declare global {
	var firebaseClient	: FirebaseApp;
	var firebaseDB			: Database;
	var firebaseAuth		: Auth;
}

const [ defaultApp ] = getApps();

const DOMEN = 'escapefrommordorland';

export default (context?: Context) => {

	const applicationHash = utils.hashGenerator(12);
	const CONFIG = {

		appId							: context?.env.FIREBASE_API_APP || process.env.FIREBASE_API_APP,
		apiKey						: context?.env.FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,

		authDomain				: `${ DOMEN }.firebaseapp.com`,
		projectId					: `${ DOMEN }`,
		databaseURL				: `https://${ DOMEN }.firebaseio.com`,
		storageBucket			: `${ DOMEN }.appspot.com`,
		messagingSenderId	: '975378208350',
		measurementId			: 'G-W49JBK6546',

	};

	globalThis.firebaseClient = defaultApp || initializeApp(CONFIG, applicationHash);
	globalThis.firebaseDB 		= getDatabase(globalThis.firebaseClient);
	globalThis.firebaseAuth		= getAuth(globalThis.firebaseClient);

};