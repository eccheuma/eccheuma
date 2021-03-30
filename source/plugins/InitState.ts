import Vue from 'vue'

import firebase from 'firebase/app'; import 'firebase/database'

type PAGE_CONTENT = 'Posts' | 'Gallery'

const LOAD_RANGES: {[K in PAGE_CONTENT]: number} = {
	Posts: 4,
	Gallery: 8
}

export default () => {

	Vue.prototype.CLIENT_RENDER_CHECK = process.browser
	Vue.prototype.LOAD_RANGES 				= LOAD_RANGES
	Vue.prototype.DEVELOPMENT 				= process.env.NODE_ENV === 'development'

	firebase.database()
		.ref('/App')
		.once('value')
		.then(( data ) => {
			Vue.prototype.__SELF_KEY__ = data.val().__SELF_KEY__
		})

}

declare module 'vue/types/vue' {
	interface Vue {
		CLIENT_RENDER_CHECK: boolean
		DEVELOPMENT: boolean
		__SELF_KEY__: string
		LOAD_RANGES: typeof LOAD_RANGES
	}
}
