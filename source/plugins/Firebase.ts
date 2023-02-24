import { initializeApp, FirebaseApp, getApps, deleteApp, FirebaseOptions } from 'firebase/app';
import { getDatabase, Database } from 'firebase/database';

import { getAuth, Auth, } from 'firebase/auth';
import { Context } from '@nuxt/types';

declare global {
	var firebaseClient: FirebaseApp;
	var firebaseDB: Database;
	var firebaseAuth: Auth;
}

export const deleteActiveInstances = () => getApps().forEach(deleteApp);

export default async (context?: Context) => {

	// Wipeout all instances that was stared early. 
	if (context?.isDev) deleteActiveInstances();

	const { utils: { randHashGenerator } } = await import('~/utils');

	const applicationHash = randHashGenerator(12);
	const DOMEN = process.env.FIREBASE_DOMEN || String();

	const CONFIG: FirebaseOptions = {

		appId: process.env.FIREBASE_API_APP,
		apiKey: process.env.FIREBASE_API_KEY,

		authDomain: `${DOMEN}.firebaseapp.com`,
		projectId: DOMEN,
		databaseURL: `https://${DOMEN}.firebaseio.com`,
		storageBucket: `${DOMEN}.appspot.com`,
		messagingSenderId: '975378208350',
		measurementId: 'G-W49JBK6546',

	};

	globalThis.firebaseClient = initializeApp(CONFIG, applicationHash);
	globalThis.firebaseDB = getDatabase(globalThis.firebaseClient);
	globalThis.firebaseAuth = getAuth(globalThis.firebaseClient);

};