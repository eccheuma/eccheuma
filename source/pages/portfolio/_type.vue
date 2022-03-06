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
	min-height: 100vh;

	display: flex;
	flex-direction: column-reverse;
	gap: 2vh;

}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapState } from 'vuex';

	// VUEX MAP
	import { VuexMap } from '~/typescript/VuexMap';

	// UTILS
	import { Meta } from '~/utils/meta';

	// API
	import { database } from '~/api/database';

	// TYPES
	import { Workcase } from '~/typescript/WorkCase';
	import { Portfolio } from '~/typescript/Portfolio';
	import { navigation } from '~/typescript/Navigation';

	// MODULE
	export default Vue.extend({
		components: {
			WorkCase: () => import('~/components/WorkCase.vue')
		},
		transition: {
			name: 'opacity-enterDelayed-transition',
			mode: 'out-in',
		},
		asyncData({ params, redirect }) {

			let Type: Portfolio.sections = Portfolio.sections.landings;

			switch (params.type) {

				case 'landings'	: Type = Portfolio.sections.landings; 
					break;
				case 'logo'			: Type = Portfolio.sections.logo; 
					break;	
				case 'mockups'	: Type = Portfolio.sections.mockups; 
					break;
				default: redirect('/error'); break;
			}

			return { Type };

		},
		data() {
			return {

				Case: new Array() as Array<Workcase.struct>,

				Type: Portfolio.sections.landings,

			}
		},
		computed: {

			...mapState({
				Posts	: state => (state as VuexMap).PageContent.Content.Posts,
				Lang 	: state => (state as VuexMap).App.Lang,
			}),

		},
		head(): any {

			return {
				title: Meta.conctructTitle(this.Lang, { 
					page: this.Type, 
					section: navigation.routeSections.portfolio
				}),
			}

		},
		async mounted() {
			this.Case = await this.GetCases();
		},
		methods: {
			async GetCases(): Promise<Array<Workcase.struct>> {

				return await database
					.get(`Cases/${ this.Type }`)
					.then(data => Object.values(data || new Object()))

			},
		}
	})

</script>
