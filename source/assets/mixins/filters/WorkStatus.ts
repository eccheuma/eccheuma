import Vue from 'vue'

import { REQUEST_STATUS } from '~/typescript/Services'

type VALUES = REQUEST_STATUS[keyof REQUEST_STATUS] | 'Не определён';

const METHODS = {
	DefineWorkStatus(s: keyof REQUEST_STATUS): VALUES {

		const STATUS: REQUEST_STATUS  = {
			0: 'Отправлен на рассмотрение',
			1: 'Поставлен в очередь',
			2: 'В процессе выполнения',
			3: 'Ожидает проверку'
		}

		return STATUS[s] ?? 'Не определён';
		
	}
}

declare module 'vue/types/vue' {
	interface Vue {
		DefineWorkStatus: typeof METHODS['DefineWorkStatus']
	}
}

export default Vue.extend({
	methods: {
		...METHODS
	}
})
