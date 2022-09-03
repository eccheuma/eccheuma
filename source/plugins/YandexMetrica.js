import Vue from 'vue';

import VueYandexMetrika from 'vue-yandex-metrika';  

export default (context) => {

	window.onload = function() {
		Vue.use(VueYandexMetrika, {
			id: 87558820,
			router: context.app.router,
			env: process.env.NODE_ENV,
		});
	};

};
