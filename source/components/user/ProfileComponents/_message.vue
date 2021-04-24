<template>
	<section>
		<strong>{{ payload.From }}</strong>
		<span>{{ MessageDate }}</span>
		<span>{{ payload.Message }}</span>
	</section>
</template>

<style lang="scss" scoped>

section {
	display: grid;
	grid-template-columns: 70% 30%;
	row-gap: 15px;
	font-size: var(--font-size-4);
	strong {
		text-align: left;
	}
	span {
		&:nth-of-type(1) {
			text-align: right;
			font-weight: 700;
		}
		&:nth-of-type(2) {
			text-align:	left;
			white-space: pre-line;
		}
	}
} 

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapActions } from 'vuex'

	// TYPES
	import type { Message } from '~/store/User/Messages'
	import type { FORMATED_DATE } from '~/store'

	// MODULE
	export default Vue.extend({
		props: {
			payload: {
				required: true
			} as PropOptions< Pick<Message, "From" | "Message" | "Date"> >
		},
		data() {
			return {
				MessageDate: ''
			}
		},
		methods: {
			...mapActions({
				GetLocalTime: 'GetLocalTime'
			}),
		},
		async mounted() {

			const T: FORMATED_DATE = await this.GetLocalTime(this.payload.Date)

			this.MessageDate = `${ T.Day } в ${ T.Time }`

		}
	})
</script>