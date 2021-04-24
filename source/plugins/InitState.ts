import Vue from 'vue'

import firebase from 'firebase/app'; import 'firebase/database'

export default async () => {

	Vue.config.ignoredElements = ['eccheuma-wrapper', 'eccheuma-layout']

	const APP = await firebase.database()
		.ref('/App')
		.once('value')
		.then( data => data.val())

	Vue.prototype.APP_VERSION					= APP.Version;
	Vue.prototype.CLIENT_RENDER_CHECK = process.browser;
	Vue.prototype.DEVELOPMENT 				= process.env.NODE_ENV === 'development';
	Vue.prototype.__SELF_KEY__ 				= APP.__SELF_KEY__

}

declare module 'vue/types/vue' {
	interface Vue {
		APP_VERSION: string
		CLIENT_RENDER_CHECK: boolean
		DEVELOPMENT: boolean
		__SELF_KEY__: string
	}
}
