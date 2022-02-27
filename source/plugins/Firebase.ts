/* eslint-disable import/no-named-as-default-member */
import firebase from 'firebase/app'

const CLIENT_CONFIG = {
	appId							: process.env.FIREBASE_API_APP,
	apiKey						: process.env.FIREBASE_API_KEY,
	authDomain				: 'escapefrommordorland.firebaseapp.com',
	projectId					: 'escapefrommordorland',
	databaseURL				: 'https://escapefrommordorland.firebaseio.com',
	storageBucket			: 'escapefrommordorland.appspot.com',
	messagingSenderId	: '975378208350',
	measurementId			: 'G-W49JBK6546',
};

if ( !firebase.apps.length ) {
	firebase.initializeApp(CLIENT_CONFIG);
}
