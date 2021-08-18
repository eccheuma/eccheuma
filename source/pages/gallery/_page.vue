<template>
	<section ref="page" class="gallery-page">

		<template v-if="$isMobile">
			<vue-image

				v-for="(image, index) in Images"

				:id="`GalleryImage_${ index }`"
				:key="`GALLERY-IMAGE-${ image.ID }`"

				:ref="'images'" 
				:style="`order: ${( BasePoint - image.ID ) + Images.length }`"

				:content="image.content" 
				:sections="{ date: true, description: true, zoom: true }" 
				:property="{ fit: 'cover', type: 'gallery', collumn: 10 }"
			>

				{{ image.content.description }}

			</vue-image>
		</template>

		<template v-for="(image, index) in Images" v-else>
			<intesection-component 
				:key="`GALLERY-IMAGE-${ image.ID }`" 
				:style="`order: ${( BasePoint - image.ID ) + Images.length }`"
				:rootMargin="5" 
				@isIntersecting="animateImage"
				>
				<vue-image
					:id="`GalleryImage_${ index }`"
					:ref="'images'" 

					:content="image.content" 
					:sections="{ date: true, description: true, zoom: true }" 
					:property="{ fit: 'cover', type: 'gallery', collumn: 10 }"
					>

					{{ image.content.description }}

				</vue-image>
			</intesection-component>
		</template>

	</section>
</template>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
		import { mapActions, mapMutations, mapState } from 'vuex'

	// FIREBASE
		import firebase from  'firebase/app'
		import 'firebase/database'

	// VUEX MODULE TYPE MAP
		import type { VuexModules } from '~/typescript/VuexModules';

	// MIXINS
		import ResetPageContent 				from '~/assets/mixins/ResetPageContent'
		import PageTransitionProperty 	from '~/assets/mixins/PageTransitionProperty'

	// TYPES
		import type { PAYLOAD } 					from '~/store/PageContent'
		import type { ANIMATION_PAYLOAD } from '~/assets/mixins/IntersectionObserver'

	// LOAD POLITIC
		import { load_ranges } from '~/config/LoadPolitic'

	// COMPONENTS
		import VueImage 						from '~/components/common/ImageComponent/Image.vue'
		import IntesectionComponent from '~/components/intersectionComponent.vue'

	// INTERSECTION_ANIMATION
	const Animation: ANIMATION_PAYLOAD = {
		in: {
			opacity: [0, 1],
			translateY: [100, 0],
			duration: () => 500 + 500 * Math.random(),
		},
		out: {
			opacity: [1, 0],
			translateY: [0, 100],
			duration: () => 500 + 500 * Math.random(),
		}
	}

	// MODULE
	export default Vue.extend({
		components: {
			VueImage, IntesectionComponent
		},
		mixins: [ ResetPageContent, PageTransitionProperty ],
		async middleware({ params, query, redirect }) {

			const PAGE 			= Number( params.page.slice(-1) ) // Parse page_1: str => 1: int
			const LOADRANGE = Number( query.range ) || 6
			
			const QUANTITY 	= await firebase.database().ref('Gallery').once('value').then( data => data.numChildren() )

			const OutRange = QUANTITY + LOADRANGE < PAGE * LOADRANGE 

			if ( OutRange ) { redirect('/error') }

    },
		asyncData({ params, query }) {

			const Page 			= Number( params.page.slice(-1) ); // page_1 => 1
			const LoadRange = Number( query.range );
			
			return { Page, LoadRange }

		},
		data() {
			return {

				Ready: false,
				
				Page: 1,
				LoadRange: load_ranges.gallery,
				BasePoint: 0,

			}
		},
		async fetch() {

			if ( process.server && !this.CLIENT_RENDER_CHECK ) {
				await this.GetData();
			}
			
		},
		head(): {[index: string]: string } {
			return {
				title: `Eccheuma | Галлерея | ${ this.Page } Страница`
			}
		},
		computed: {

			...mapState({
				Images: state => (state as VuexModules).PageContent.Content.Gallery
			}),

		},
		watch: {
			GalleryData: {
				handler() {
					this.$nextTick().then(() => {
						this.Ready = true
					})
				}
			},
		},
		created() {
			this.ChangePage(this.Page);

			if ( process.browser && this.$router.currentRoute.name === 'gallery' ) {
				this.GetData();
			}

		},
		methods: {
			
			...mapActions({
				GetContent: 'PageContent/GetContent',
			}),
			...mapMutations({
				ChangePage: 'PageSelector/ChangePage'
			}),

			async GetData() {

				const DATA = await firebase.database().ref('Gallery').once('value')

				const REM: number = DATA.numChildren() - ( this.LoadRange * this.Page )

				const PAYLOAD: PAYLOAD = {
					REF: 'Gallery',
					LOAD_PROPERTY: {
						LoadRange: REM < 0 ? this.LoadRange + REM : this.LoadRange,
						LoadPoint: REM < 0 ? 0 : REM
					}
				}

				await this.GetContent(PAYLOAD)

			},

			animateImage(intersection: boolean, slotNode: Node) {

				this.$AnimeJS({
					targets: slotNode,
					easing: 'linear',

					...Animation[intersection ? 'in' : 'out']

				})

			}

		},
	})
	
</script>
