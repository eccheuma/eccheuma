<template>
	<section class="gallery-page">
		
		<vue-image v-for="(image, index) in Images" :key="`GALLERY-IMAGE-${ image.ID }`"
		
			class="gallery-item"

			v-observe-visibility="ObserveVisibilityOptions"

			:id="`GalleryImage_${ index }`"
			:style="`order: ${( BasePoint - image.ID ) + Images.length }`"
			:content="image.content" 
			:sections="{ date: true, description: true, zoom: true }" 
			:property="{ fit: 'cover', type: 'gallery', collumn: 10 }">

			{{ image.content.description }}

		</vue-image>

	</section>
</template>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
		import { mapActions, mapMutations, mapState } from 'vuex'

	// VUEX MODULE TYPE MAP
		import type { VuexModules } from '~/types/VuexModules';

	// FIREBASE
		import firebase from "firebase/app"
		import "firebase/database"

	// MIXINS
		import ViewPortAnimation from "~/assets/mixins/ViewPortAnimation"

	// TYPES
		import type { PAYLOAD } 				from '~/store/PageContent'
		import type { IMAGE_PROPERTY } 	from '~/types/Image.ts'

	// COMPONENTS
		import VueImage from '~/components/common/ImageComponent/Image.vue'

	// VARIABLES
	const DB_SECTION = 'Gallery'

	// MODULE
	export default Vue.extend({
		transition: 'OpacityTransition', 
		mixins: [ ViewPortAnimation ],
		components: {
			VueImage
		},
		async middleware({ params, query, redirect }) {

			const PAGE 			= Number( params.page.slice(-1) ) // Parse page_1: str => 1: int
			const LOADRANGE = Number( query.range ) || 6
			
			const QUANTITY 	= await firebase.database().ref('Gallery').once('value').then( data => data.numChildren() )

			const OutRange = QUANTITY + LOADRANGE < PAGE * LOADRANGE 

			if ( OutRange ) {
				return redirect('/error')
			}

    },
		async asyncData({ params, query }): Promise<any> {

			const Page 			= Number( params.page.slice(-1) ) // page_1 => 1
			const LoadRange = Number( query.range ) || 6
			
			return { Page, LoadRange }

		},
		head(): any {
			return {
				title: `Eccheuma | Галлерея | ${ this.Page } Страница`
			}
		},
		async fetch() {
			await this.GetData()
		},
		data() {
			return {

				Ready: false,
				
				Page: 1,
				LoadRange: 0,
				BasePoint: 0,

			}
		},
		watch: {
			GalleryData: {
				handler() {
					this.Ready = true
				}
			}
		},
		computed: {

			...mapState({
				Images: state => (state as VuexModules).PageContent.Content as IMAGE_PROPERTY[]
			}),

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
		created() {
			this.ChangePage(this.Page)
		}
	})
	
</script>
