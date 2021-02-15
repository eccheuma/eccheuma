import Vue from 'vue'

import VueYandexMetrika from 'vue-yandex-metrika'  

/* global process */

export default (context) => {

	Vue.use(VueYandexMetrika, {
		id: 62771104,
		router: context.app.router,
		env: process.env.NODE_ENV
	})

}
