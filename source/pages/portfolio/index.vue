<template>
	<div class="portfolio-container">
		<work-case v-for="(workcase, index) in Case" :key="workcase.ID" 
			:style="`order: ${ Case.length - index }`"
			:content="workcase.content"
			:properties="workcase.properties"
		/>
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	import firebase from "firebase/app"
	import "firebase/database"

	import type { WORKCASE } from '~/types/WorkCase.ts'

	export default Vue.extend({
		transition: 'page_transition',
		data() {
			return {

				Case: [] as WORKCASE[],

			}
		},
		components: {
			WorkCase: () => import (`~/components/common/WorkCase.vue`)
		},
		methods: {
			GetCases() {

				firebase.database()
					.ref(`Cases/Landings`)
					.on( 'value', data => {

						this.Case = Object.values( data.val() )

					})

			},
		},
		mounted() {
			this.GetCases()
		}
	})

</script>