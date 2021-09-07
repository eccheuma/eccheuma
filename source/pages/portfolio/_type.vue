<template>
	<div class="cases-container">

		<work-case
			v-for="workcase in Case"
			:key="workcase.ID" 
			:content="workcase.content"
			:properties="workcase.properties"
		/>
		
	</div>
</template>

<style lang="scss">

.cases-container {
	padding: 2vh 0;
	min-height: 50vh;
}

</style>

<script lang="ts">

	import Vue from 'vue'

	import firebase from 'firebase/app'
	import 'firebase/database'

	import type { WORKCASE } from '~/typescript/WorkCase'

	export default Vue.extend({
		components: {
			WorkCase: () => import('~/components/common/WorkCase.vue')
		},
		transition: {
			name: 'opacity-enterDelayed-transition',
			mode: 'out-in',
		},
		data() {
			return {

				Case: [] as WORKCASE[],

			}
		},
		mounted() {

			this.GetCases()

		},
		methods: {
			GetCases() {

				const T = this.$route.params.type.split('')

				const PATH = [T[0].toUpperCase(), ...T.slice(1)].join('')

				firebase.database()
					.ref(`Cases/${ PATH }`)
					.on( 'value', (data) => {
						this.Case = Object.values( data.val() )
					})

			},
		}
	})

</script>
