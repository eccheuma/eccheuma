<template>
	<transition-group name="page_transition" class="home-page">

		<template v-if="Ready">

			<post v-for="(item, index) in Posts"
				:key="`Post-${index}`"
				:payload="item"
				:PostOrder="( BasePoint - item.ID ) + Posts.length"
			/>

			<promo-banner v-if="Posts.length  >= 1" class="p-0" 
				promo-type="Works"
				key="PromoID_Works"
				:order="1"
			/>
			
			<promo-banner v-if="Posts.length >= 3" class="p-0" 
				promo-type="Adaptation"
				key="PromoID_Adaptation"
				:order="3"
			/>
			
		</template>

	</transition-group>
</template>

<style lang="scss" scoped>

.home {
	&-page {
		display: grid;
	}
}

</style>

<script lang="ts">

	import Vue from 'vue';

	// VUEX
	import { mapActions, mapState, mapMutations } from 'vuex';

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules';

	// FIREBASE
	import firebase from "firebase/app";
	import "firebase/database";

	// TYPES
	import type { PAYLOAD } from '~/store/PageContent';
	import type { POST } 		from '~/types/Post.ts';

	// COMPONENTS
	import PromoBanner from '~/components/promo/PromoBanner.vue';
	import Post from '~/components/post/Post.vue';

	// MODULE
	export default Vue.extend({
		transition: 'page_transition',
		components: {
			PromoBanner,
			Post,
		},
		async middleware({ params, query, redirect }) {

			const PAGE 			= Number( params.page.slice(-1) ) // page_1 => 1
			const LOADRANGE = Number( query.range ) || 4
			const QUANTITY 	= await firebase.database().ref("Posts").once('value').then( data => data.numChildren() )

			const OutRange = QUANTITY + LOADRANGE < PAGE * LOADRANGE 

			if ( OutRange ) {
				return redirect('/error')
			}

    },
		asyncData({ params, query }): { Page: number, LoadRange: number } {
			
			const Page 			= Number( params.page.slice(-1) ) // page_1 => 1
			const LoadRange = Number( query.range ) || 4 
			
			// console.log(Page, LoadRange, params.page, query.range )

			return { Page, LoadRange }

		},
		async fetch() {

			await this.GetData();
			await this.GetBasePoint();

		},
		data() {
			return {

				Ready: false,

				Page: 1,
				BasePoint: 0,
				LoadRange: 0,

			}
		},
		head(): any {
			return {
				title: `Eccheuma | Главная | ${ this.Page } Страница`
			}
		},
		watch: {
			Posts: {
				handler() {
					this.Ready = true
				}
			}
		},
		computed: {
			...mapState({
				Posts: state => (state as VuexModules).PageContent.Content as POST[]
			}),
		},
		methods: {

			...mapActions({
				GetContent: 'PageContent/GetContent',
			}),

			...mapMutations({
				ChangePage: 'PageSelector/ChangePage'
			}),

			async GetBasePoint() {

				const DATA = await firebase.database().ref("Posts").once('value')

				this.BasePoint = DATA.numChildren() - ( this.LoadRange * this.Page )

			},

			async GetData() {

				const POSTS = await firebase.database().ref('Posts').once('value')

				const REM: number = POSTS.numChildren() - ( this.LoadRange * this.Page )

				const PAYLOAD: PAYLOAD = {
					REF: 'Posts',
					LOAD_PROPERTY: {
						LoadRange: REM < 0 ? this.LoadRange + REM : this.LoadRange,
						LoadPoint: REM < 0 ? 0 : REM
					}
				}

				await this.GetContent(PAYLOAD)

			},

		},
		mounted() {
			this.ChangePage(this.Page)
		}
	})
	
</script>