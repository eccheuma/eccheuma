import Vue from 'vue';

import type { USER_STATUS } from '~/typescript/User'

type VALUES = USER_STATUS[keyof USER_STATUS]

const METHODS = {
	DefineUserStatus(s: keyof USER_STATUS): VALUES {
		
		const STATUS: USER_STATUS = {
			0: 'Администратор',
			1: 'Модератор',
			2: 'Пользователь',
		}

		return STATUS[s] || 'Пользователь'

	},
}

declare module 'vue/types/vue' {
	interface Vue {
		DefineUserStatus: typeof METHODS['DefineUserStatus']
	}
}

export default Vue.extend({
	methods: {
		...METHODS
	}
})
