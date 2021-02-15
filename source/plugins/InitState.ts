import Vue from 'vue'

import firebase from 'firebase/app'; import 'firebase/database'

export default () => {

	Vue.prototype.CLIENT_RENDER_CHECK = process.client

	firebase.database()
		.ref('/App')
		.once('value')
		.then(data => {
			Vue.prototype.__SELF_KEY__ = data.val()['__SELF_KEY__']
		})

}

declare module 'vue/types/vue' {
	interface Vue {
		CLIENT_RENDER_CHECK: boolean
		__SELF_KEY__: 'tGOrAx0PyvWmxQ64gYcUxn3roNB3'
	}
}