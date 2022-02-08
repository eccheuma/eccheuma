import Vue from 'vue'

import firebase from 'firebase/app'; 
import 'firebase/database'

import type { Context } from '@nuxt/types';

export default ({ env, isDev }: Context) => {

	Vue.config.ignoredElements = ['eccheuma-wrapper', 'eccheuma-layout', 'eccheuma-intersection', 'eccheuma-collapse']

	Vue.prototype.BUILD_HASH					= env.buildHash
	Vue.prototype.BROWSER 						= process.browser;
	Vue.prototype.SSR 								= process.server;
	Vue.prototype.DEVELOPMENT 				= isDev;

	firebase.database().ref('/App').once('value').then((data) => {
		Vue.prototype.__SELF_KEY__  = data.val().__SELF_KEY__
	})

	if ( isDev && process.browser ) {
		console.log(`%cEccheuma | Build: ${ env.buildHash }`,
		'background-color: #141418; padding: 4px 20px; border-radius: 4px;')
	}

}

declare module 'vue/types/vue' {
	interface Vue {
		BUILD_HASH: string
		BROWSER: boolean
		SSR: boolean
		DEVELOPMENT: boolean
		__SELF_KEY__: string
	}
}
