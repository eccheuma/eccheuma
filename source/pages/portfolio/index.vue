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

	import firebase from 'firebase/app'
	import 'firebase/database'

	import type { WORKCASE } from '~/typescript/WorkCase.ts'

	export default Vue.extend({
		components: {
			WorkCase: () => import('~/components/common/WorkCase.vue')
		},
		transition: 'page_transition',
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

				firebase.database()
					.ref('Cases/Landings')
					.on( 'value', (data) => {

						this.Case = Object.values( data.val() )

					})

			},
		}
	})

</script>
