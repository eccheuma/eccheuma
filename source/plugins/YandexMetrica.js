import Vue from 'vue'

import VueYandexMetrika from 'vue-yandex-metrika'  

export default (context) => {

	window.onload = function() {
		setTimeout(() => {
			Vue.use(VueYandexMetrika, {
				id: 62771104,
				router: context.app.router,
				env: process.env.NODE_ENV
			})
		}, 5000)
	}

}
