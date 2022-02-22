import Vue from 'vue'

// API
import type { Context } from '@nuxt/types';
import { database } from '~/api/database';

// UTILS
import { gpu } from '~/utils/gpu';

// CONTRACTS
import { DatabaseContract } from '~/typescript/FirebaseDatabase'

export default ({ env, isDev }: Context) => {

	Vue.config.ignoredElements = ['eccheuma-layout'];

	Vue.prototype.application = {
		hash: env.buildHash,
		dev: isDev,
		gpu: gpu,
		context: {
			browser	: process.browser,
			server	: process.server,
		}
	}

	database.get<DatabaseContract['App']>('App').then(response => {
		Vue.prototype.application.selfKey  = response.__SELF_KEY__
	})

	if ( isDev && process.browser ) {
		console.log(`%cEccheuma | Build: ${ env.buildHash }`,
		'background-color: #141418; padding: 4px 20px; border-radius: 4px; border: 1px solid #323236')
	}

}

declare module 'vue/types/vue' {
	interface Vue {
		application: {
			hash: string,
			dev: boolean,
			gpu: typeof gpu,
			context: {
				browser	: boolean,
				server	: boolean,
			}
		}
	}
}
