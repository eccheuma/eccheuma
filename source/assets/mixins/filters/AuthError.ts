
import Vue from 'vue';

import type { AUTH_ERRORS } 	from '~/store/Auth/Auth.ts';

const METHODS = {
	DefineAuthError(e: AUTH_ERRORS): string {

		enum ERROR {
			'auth/network-request-failed'	= 'Ошибка соединения',
			'auth/user-not-found' 				= 'Пользователя с такой почтой не существует',
			'auth/invalid-email' 					= 'Поле не соответствует критериям почты',
			'auth/wrong-password'					=	'Неверный пароль',
			'auth/email-already-in-use' 	= 'Данная почта занята другим пользователем',
		}
	
		return ERROR[e] ?? e
		
	},
}

declare module 'vue/types/vue' {
	interface Vue {
		DefineAuthError: typeof METHODS['DefineAuthError']
	}
}

export default Vue.extend({
	methods: {
		...METHODS
	}
})

