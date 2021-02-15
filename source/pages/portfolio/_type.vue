<template>
	<div class="row no-gutters Portfolio-Case">

		<work-case v-for="workcase in Case" :key="workcase.ID" 
			v-observe-visibility="ObserveVisibilityOptions"
			:content="workcase.content"
			:properties="workcase.properties"
		/>
		
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	import firebase from "firebase/app"
	import "firebase/database"

	import ViewPortAnimation from "~/assets/mixins/ViewPortAnimation"

	import type { WORKCASE } from '~/types/WorkCase'

	export default Vue.extend({
		transition: 'page_transition',
		mixins: [
			ViewPortAnimation
		],
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

				const T = this.$route.params.type.split('')

				const PATH = [T[0].toUpperCase(), ...T.slice(1)].join('')

				firebase.database()
					.ref(`Cases/${ PATH }`)
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