<template>
	<transition-group name="page_transition" class="home-page">


			<post v-for="( item, index ) in Posts"
				:key="`Post-${ index }`"
				:payload="item"
				:PostOrder="( BasePoint - item.ID ) + Posts.length "
			/>

			<promo-banner v-if="Posts.length >= 1"
				promo-type="Works"
				key="PromoID_Works"
				:order="1"
			/>
			
			<promo-banner v-if="Posts.length >= 3"
				promo-type="Adaptation"
				key="PromoID_Adaptation"
				:order="3"
			/>


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

	import Vue, { PropOptions } from 'vue'

	// VUEX
		import { mapActions, mapState, mapMutations } from 'vuex'

	// VUEX MODULE TYPE MAP
		import type { VuexModules } from '~/types/VuexModules';

	// FIREBASE
		import firebase from "firebase/app"
		import "firebase/database"

	// TYPES
		import type { PAYLOAD } from '~/store/PageContent'
		import type { POST } 		from '~/types/Post.ts'

	// COMPONENTS
		import PromoBanner 			from '~/components/promo/PromoBanner.vue'
		import Post 						from '~/components/post/Post.vue'

	// MODULE
	export default Vue.extend({
		transition: 'GalleryPageTransition',
		props: {
			LoadRange: {
				type: Number,
				required: true,
				default: 1,
			} as PropOptions<number>
		},
		components: {
			PromoBanner,
			Post,
		},
		async fetch() {

			await this.GetData();
			await this.GetBasePoint();

		},
		data() {
			return {

				Ready: false,

				Page: 1,
				BasePoint: 0

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