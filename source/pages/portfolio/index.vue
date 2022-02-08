<template>
	<section class="workcases-container">
		<work-case 
			v-for="(workcase, index) in Case" 
			:key="workcase.ID" 
			:style="`order: ${ Case.length - index }`"
			:content="workcase.content"
			:properties="workcase.properties"
		/>
	</section>
</template>

<style lang="scss">

.portfolio-container {
	padding-inline: 1vw;
	padding-block: 2vh;
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// API
	import { database } from '~/api/database';

	// TYPES
	import type { WORKCASE } from '~/typescript/WorkCase'

	// MODULE
	export default Vue.extend({
		components: {
			WorkCase: () => import('~/components/WorkCase.vue')
		},
		transition: 'page_transition',
		data() {
			return {

				Case: [] as WORKCASE[],

			}
		},
		async mounted() {

			this.Case = await this.GetCases();

		},
		methods: {
			async GetCases(): Promise<Array<WORKCASE>> {

				//! Refactor this piece of shit as soon as posible
				//@ That path defenition is a mess

				const T = this.$route.params.type.split('')

				const PATH = [T[0].toUpperCase(), ...T.slice(1)].join('');

				return await database.get(`Cases/${ PATH }`).then(data => Object.values(data))

			},
		}
	})

</script>
