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

	// // UTILS
	// import { utils } from '~/utils';

	// API
	import { database } from '~/api/database';

	// TYPES
	import type { Workcase } from '~/typescript/WorkCase'

	// MODULE
	export default Vue.extend({
		components: {
			WorkCase: () => import('~/components/WorkCase.vue')
		},
		transition: {
			name: 'opacity-enterDelayed-transition',
			mode: 'out-in',
		},
		data() {
			return {

				Case: new Array() as Array<Workcase.struct>,

			}
		},
		async mounted() {

			this.Case = await this.GetCases()

		},
		methods: {
			async GetCases(): Promise<Array<Workcase.struct>> {

				// ! Refactor this piece of shit as soon as posible
				// @ That path defenition is a mess

				const T = this.$route.params.type.split('')

				const PATH = [T[0].toUpperCase(), ...T.slice(1)].join('');

				return await database.get(`Cases/${ PATH }`).then(data => Object.values(data))

			},
		}
	})

</script>
