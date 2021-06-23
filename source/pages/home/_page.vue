<template>
	<section class="home-page">

		<template v-for="( item, index ) in Posts">
			<!-- v-if="index === 0" -->
			<intesection-component 
				:key="`Post-${ index }`" 

				:style="`order: ${ Posts.length - index }`"
				:rootMargin="5"

				@isIntersecting="animateIntersection"
			>
				<post :order="0" :payload="item" />
			</intesection-component>
		</template>
		
		<promo-banner 
			v-if="Posts.length >= 1"
			key="Adaptation"
			promo-type="Adaptation"
			:style="`order: ${ 1 }`"
		/>

	</section>
</template>

<script lang="ts">

	import Vue from 'vue';

	// VUEX
	import { mapActions, mapMutations, mapState } from 'vuex';

	// FIREBASE
	import firebase from 'firebase/app';
	import 'firebase/database';

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/typescript/VuexModules';

	// MIXINS
	import ResetPageContent 				from '~/assets/mixins/ResetPageContent'
	import PageTransitionProperty 	from '~/assets/mixins/PageTransitionProperty'

	// TYPES
	import type { PAYLOAD } from '~/store/PageContent';

	// COMPONENTS
	import PromoBanner 					from '~/components/promo/PromoBanner.vue';
	import Post 								from '~/components/post/Post.vue';
	import IntesectionComponent from '~/components/intersectionComponent.vue'

	// LOAD POLITIC
	import { load_ranges } from '~/config/LoadPolitic'

	// INERSECTION OBSERVER ANIMATION
	const OBSERVER_ANIMATION = {
		in: {
			opacity: [0, 1],
			delay: 250,
		},
		out: {
			opacity: [1, 0],
		}
	}

	// MODULE
	export default Vue.extend({
		components: {
			PromoBanner,
			Post,
			IntesectionComponent,
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
		created() {
			this.ChangePage(this.PAGE)
		},
		beforeDestroy() {
		},
		methods: {

			...mapActions({
				GetContent: 'PageContent/GetContent',
			}),

			...mapMutations({
				ChangePage: 'PageSelector/ChangePage'
			}),

			animateIntersection(intersection: boolean, slotNode: Node) {

				this.$AnimeJS({
					targets: slotNode,
					easing: 'linear',

					...OBSERVER_ANIMATION[intersection ? 'in' : 'out']

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
