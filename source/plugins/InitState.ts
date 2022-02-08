import Vue from 'vue'

// API
import { database } from '~/api/database';

// CONTRACTS
import { DatabaseContract } from '~/typescript/FirebaseDatabase'

import type { Context } from '@nuxt/types';

export default ({ env, isDev }: Context) => {

	Vue.config.ignoredElements = ['eccheuma-wrapper', 'eccheuma-layout', 'eccheuma-intersection', 'eccheuma-collapse']

	Vue.prototype.BUILD_HASH					= env.buildHash
	Vue.prototype.BROWSER 						= process.browser;
	Vue.prototype.SSR 								= process.server;
	Vue.prototype.DEVELOPMENT 				= isDev;

	database.get<DatabaseContract['App']>('App').then(response => {
		Vue.prototype.__SELF_KEY__  = response.__SELF_KEY__
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
		__SELF_KEY__: DatabaseContract['App']['__SELF_KEY__']
	}
}
