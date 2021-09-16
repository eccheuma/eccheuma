import firebase from 'firebase/app'

const firebaseConfig = {
	appId: '1:975378208350:web:035b126946313338b1c6cf',
	apiKey: 'AIzaSyBEBGoS40SumxF1clG4C561QwUj_ioduQg',
	authDomain: 'escapefrommordorland.firebaseapp.com',
	projectId: 'escapefrommordorland',
	databaseURL: 'https://escapefrommordorland.firebaseio.com',
	storageBucket: 'escapefrommordorland.appspot.com',
	messagingSenderId: '975378208350',
	measurementId: 'G-W49JBK6546',
};

if ( !firebase.apps.length ) {
	firebase.initializeApp(firebaseConfig);
}
