<template>
	<section ref="page" class="home-page">

		<post 
			v-for="( item, index ) in Posts"
			:key="`Post-${ index }`"
			:order="Posts.length - index"
			:payload="item"
		/>

		<promo-banner 
			v-if="Posts.length >= 1"
			key="PromoID_Works"
			promo-type="Works"
			:style="`order: ${ 1 }`"
		/>
		
		<promo-banner 
			v-if="Posts.length >= 3"
			key="PromoID_Adaptation"
			promo-type="Adaptation"
			:style="`order: ${ 3 }`"
		/>

	</section>
</template>

<style lang="scss">

.home {
	&-page {
		display: grid;
	}
}

</style>

<script lang="ts">

	import Vue from 'vue';

	// VUEX
	import { mapActions, mapMutations, mapState } from 'vuex';

	// FIREBASE
	import firebase from 'firebase/app';
	import 'firebase/database';

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules';

	// MIXINS
	import ResetPageContent 				from '~/assets/mixins/ResetPageContent.ts'
	import PageTransitionProperty 	from '~/assets/mixins/PageTransitionProperty.ts'

	// TYPES
	import type { PAYLOAD } from '~/store/PageContent';

	// COMPONENTS
	import PromoBanner from '~/components/promo/PromoBanner.vue';
	import Post from '~/components/post/Post.vue';

	// LOAD POLITIC
	import { load_ranges } from '~/config/LoadPolitic.ts'

	// MODULE
	export default Vue.extend({
		components: {
			PromoBanner,
			Post,
		},
		mixins: [ ResetPageContent, PageTransitionProperty ],
		async middleware({ params, query, redirect }) {

			const PAGE 			= Number( params.page.slice(-1) ) // page_1 => 1
			const LOADRANGE = Number( query.range || load_ranges.posts );
			const QUANTITY 	= await firebase.database().ref('Posts').once('value').then( data => data.numChildren() )

			const OutRange = QUANTITY + LOADRANGE < PAGE * LOADRANGE 

			if ( OutRange ) { redirect('/error') }

    },
		//
		transition: {
			name: 'opacity-enterDelayed-transition',
			mode: 'out-in',
		},
		//
		asyncData({ params, query }) {

			const PAGE 				= Number( params.page.slice(-1) ) || 1 // page_1 => 1
			const LOAD_RANGE 	= Number( query.range || load_ranges.posts )

			return { PAGE, LOAD_RANGE }

		},
		data() {
			return {

				Ready: false,

			// ASYNC DATA
				PAGE: 1,
				LOAD_RANGE: load_ranges.posts,

			}
		},
		async fetch() {

			await this.GetData();

		},
		head(): any {
			return {
				title: `Eccheuma | Главная | ${ this.PAGE } Страница`
			}
		},
		computed: {
			...mapState({
				Posts: state => (state as VuexModules).PageContent.Content.Posts
			}),
		},
		// watch: {
		// 	Posts: {
		// 		handler() {
		// 			this.$nextTick().then(() => this.animateTransitionPage('in')); this.Ready = true;
		// 		}
		// 	}
		// },
		created() {
			this.ChangePage(this.PAGE)
		},
		beforeDestroy() {
			// this.animateTransitionPage('out');
		},
		mounted() {
			// this.animateTransitionPage('in');
		},
		methods: {

			...mapActions({
				GetContent: 'PageContent/GetContent',
			}),

			...mapMutations({
				ChangePage: 'PageSelector/ChangePage'
			}),

			animateTransitionPage(direction: 'in' | 'out' = 'in') {

				this.$AnimeJS({
					targets: this.$refs.page,
					direction: direction === 'in' ? 'normal' : 'reverse',
					opacity: [0, 1],
					delay: 1000,
					duration: 750,
					easing: 'easeInOutSine',
				})

			},

			async GetData() {

				const DATA = await firebase.database().ref('Posts').once('value')

				const REM: number = DATA.numChildren() - ( this.LOAD_RANGE * this.PAGE )

				const PAYLOAD: PAYLOAD = {
					REF: 'Posts',
					LOAD_PROPERTY: {
						LoadRange: REM < 0 ? this.LOAD_RANGE + REM : this.LOAD_RANGE,
						LoadPoint: REM < 0 ? 0 : REM
					}
				}

				await this.GetContent(PAYLOAD)

			}

		},
	})
	
</script>
