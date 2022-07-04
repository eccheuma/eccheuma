import Vue from 'vue'

// TYPES
import type { Context } from '@nuxt/types';

// UTILS
import { gpu } from '~/utils/gpu';

export default ({ env, isDev }: Context) => {

	Vue.config.ignoredElements = ['eccheuma-layout'];

	Vue.prototype.application = {
		hash: env.buildHash,
		dev: isDev,
		gpu: gpu,
		context: {
			browser	: process.browser,
			server	: process.server,
		},
	}

	if ( isDev && process.browser ) {
<<<<<<< HEAD
		console.log(`%cEccheuma | Build: ${ env.buildHash } | Слышу ZOV ебать AZOV`,
=======
		console.log(`%cEccheuma | Build: ${ env.buildHash } | Z`,
>>>>>>> master
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
			},
		}
	}
}
