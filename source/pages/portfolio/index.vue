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

			this.Case = await this.GetCases()

		},
		methods: {
			async GetCases() {

				return await database.get('Cases/Landings').then(data => Object.values(data))

			},
		}
	})

</script>
