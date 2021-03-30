import Vue from 'vue'

import { mapMutations } from 'vuex'

export default Vue.extend({
	destroyed() {

		this.resetPageContent()

	},
	methods: {

		...mapMutations({
			setContent: 'PageContent/setContent'
		}),

		resetPageContent() {
			this.setContent({ data: [], from: 'reset' })
		}

	}
})
