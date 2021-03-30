<template>
	<section class="gallery-page">

		<vue-image
			v-for="(image, index) in Images" 

			:id="`GalleryImage_${ index }`"
			:key="`GALLERY-IMAGE-${ image.ID }`"

			ref="images" 
		
			class="gallery-item"
			:style="`order: ${( BasePoint - image.ID ) + Images.length }`"

			:content="image.content" 
			:sections="{ date: true, description: true, zoom: true }" 
			:property="{ fit: 'cover', type: 'gallery', collumn: 10 }"
		>

			{{ image.content.description }}

		</vue-image>

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
		import type { VuexModules } from '~/types/VuexModules';

	// MIXINS
		import ResetPageContent 				from '~/assets/mixins/ResetPageContent.ts'
		import PageTransitionProperty 	from '~/assets/mixins/PageTransitionProperty.ts'
		import IntersectionObserver 		from '~/assets/mixins/IntersectionObserver.ts'

	// TYPES
		import type { PAYLOAD } 				from '~/store/PageContent'

	// LOAD POLITIC
		import { load_ranges } from '~/config/LoadPolitic.ts'

	// COMPONENTS
		import VueImage from '~/components/common/ImageComponent/Image.vue'

	// MODULE
	export default Vue.extend({
		components: {
			VueImage
		},
		mixins: [ ResetPageContent, PageTransitionProperty, IntersectionObserver ],
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

			await this.GetData();
			
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
			}
		},
		created() {
			this.ChangePage(this.Page)
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

			}
		},
	})
	
</script>
