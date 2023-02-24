<template>
	<section class="home-page">

		<template v-for="( item, index ) in Posts">
			<post :key="item.date" :style="`order: ${ Posts.length - index }`" :payload="item" :opened="!index"/>
		</template>
		
		<promo-banner
			v-if="Posts.length >= 1"
			key="Adaptation"
			promo-type="Adaptation"
			:style="`order: ${ 1 }`"
		/>

		<promo-banner
			v-if="Posts.length >= 4"
			key="Style"
			promo-type="Style"
			:style="`order: ${ 4 }`"
		/>

	</section>
</template>

<script lang="ts">

	import Vue from 'vue';

	// VUEX
	import { mapActions, mapMutations, mapState } from 'vuex';

	// API
	import { database } from '~/api/database';

	// VUEX MODULE TYPE MAP
	import type { VuexMap } from '~/contracts/VuexMap';

	// MIXINS
	import PageTransitionProperty 	from '~/assets/mixins/PageTransitionProperty';

	// TYPES
	import { PayloadQuery, Reference } from '~/store/PageContent';
	import { navigation } from '~/contracts/Navigation';

	// COMPONENTS
	import PromoBanner 					from '~/components/promo/PromoBanner.vue';
	import Post 								from '~/components/post/view.vue';

	// LOAD POLITIC
	import { Ranges } from '~/config/LoadPolitic';
	
	// UTILS
	import { Meta } from '~/utils/meta';

	// MODULE
	export default Vue.extend({
		components: {
			PromoBanner,
			Post,
		},
		mixins: [ PageTransitionProperty ],
		async middleware({ params, query, redirect }) {

			const Page 			= Number( params.page.slice(-1) ); // page_1 => 1
			const LOADRANGE = Number( query.range || Ranges.posts );
			const QUANTITY 	= await database.getLength('Posts');

			const OutRange = QUANTITY + LOADRANGE < Page * LOADRANGE; 

			if ( OutRange ) { redirect('/error'); }

    },
		//
		transition: {
			name: 'opacity-enterDelayed-transition',
			mode: 'out-in',
		},
		//
		asyncData({ params, query }) {

			const Page 				= Number( params.page.slice(-1) ) || 1; // page_1 => 1
			const LOAD_RANGE 	= Number( query.range || Ranges.posts );

			return { Page, LOAD_RANGE };

		},
		data() {
			return {

				Ready: false,

			// ASYNC DATA
				Page: 1,
				LOAD_RANGE: Ranges.posts,

			};
		},
		async fetch() {

			await this.getDatabaseData();

		},
		head(): any {

			return {
				title: Meta.conctructTitle(this.Lang, { 
					page: this.Page, 
					section: navigation.routeSections.home
				}),
			};

		},
		computed: {
			...mapState({
				Posts	: state => (state as VuexMap).PageContent.Content.Posts,
				Lang 	: state => (state as VuexMap).App.Lang,
			}),
		},
		created() {

			this.ChangePage(this.Page);

			// Fix fetching on diferrent routes for some reasons...
			if ( process.browser && this.$router.currentRoute.name === 'home' ) {
				this.getDatabaseData();
			}

		},
		methods: {

			...mapActions({
				GetContent: 'PageContent/GetContent',
			}),

			...mapMutations({
				ChangePage: 'PageSelector/ChangePage'
			}),

			async getDatabaseData() {

				const QUANTITY = await database.getLength('Posts');

				const REM: number = QUANTITY - ( this.LOAD_RANGE * this.Page );

				const Query: PayloadQuery = {
					ref: Reference.Posts,
					loadQuery: {
						LoadRange: REM < 0 ? this.LOAD_RANGE + REM : this.LOAD_RANGE,
						LoadPoint: REM < 0 ? 0 : REM
					}
				};

				await this.GetContent(Query);

			}

		},
	});
	
</script>
