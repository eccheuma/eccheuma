<template>
	<main class="gallery-container">

		<promo-banner promo-type="Gallery"></promo-banner>

		<section class="gallery-title">

			<span>Закреплённые изображения</span>
			<hr>
			<span>Работы которые пришлись самому больше по душе</span>

		</section>

		<section class="gallery-pinned">
			<vue-image
				:content="{ path: 'Promo/1', title: 'TEST' }" 
				:sections="{ date: false, description: true, zoom: true }" 
				:property="{ fit: 'cover', type: 'promo', collumn: 6 }">

				А теперь с помощь Slot'a я могу вполне комфорто вливать описание изображения. Ну или получать его из json.

			</vue-image>

			<vue-image 
				:content="{ path: 'Promo/4', title: 'TEST' }" 
				:sections="{ date: false, description: true, zoom: true }" 
				:property="{ fit: 'cover', type: 'promo', collumn: 6 }">

				А теперь с помощь Slot'a я могу вполне комфорто вливать описание изображения. Ну или получать его из json.

			</vue-image>
		</section>


		<section class="gallery-title">

			<span>Галлерея изображений</span>
			<hr>
			<span>Наброски логотипов, UI интерфейсов, и прочего.</span>

		</section>

		<section class="gallery-content">

			<page-selector :payload="PageParams"/>

			<nuxt-child :key="$route.path" :load-range="LoadRange" />

			<page-selector :payload="PageParams"/>

		</section>

	</main>
</template>

<style lang="scss">

.gallery {
	&-page {

		display: grid;
		padding: 10px 15px;
		gap: 15px;
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));

		@media screen and ( max-width: $MobileBreakPoint ) {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
		
	}
	&-container {

	}
	&-content {

		padding: 0px 10px;

	}
	&-pinned {

		display: grid; padding: 10px 15px; margin: 0 auto; 
		
		max-width: 1040px;

		gap: 15px;

		grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));

		@media screen and ( max-width: $MobileBreakPoint ) {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}

	}
	&-title {

		border: { 
			top: 1px solid $color2;
		};

		margin: { top: 5vh }; padding: 3vh 0;

		span {
			
			display: block; text-align: center; font-weight: 600;

			&:nth-of-type(1) {
				font-size: $FontSize1; color: $color5; 
			}
			&:nth-of-type(2) {
				font-size: $FontSize3; color: $color4;
			}
			
		}

		hr {
			background-color: $color3; width: 50%;
		}	

	}
}


</style>

<script lang="ts">

	import Vue from 'vue'

	import firebase from "firebase/app"
	import "firebase/database"

	import { mapMutations } from 'vuex'

	import TransitionSound from '~/assets/mixins/TransitionSound'

	const LOAD_RANGE = 6
	
	export default Vue.extend({ 
		layout: 'Application', 
		scrollToTop: false, 
		loading: false, 
		transition: 'OpacityTransition',
		mixins: [ TransitionSound ],
		head () {
			return {
				title: `Eccheuma | Галерея`,
				meta: [
					{ 
						hid: 'description', name: 'description', 
						content: `Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.`
					}
				]
			}
		},
		data() {
			return {

				LoadRange: LOAD_RANGE,

				PageParams: {
					scrollTarget: 1833, 
					section: 'gallery', 
					collumns: 2, 
					params: `range=${LOAD_RANGE}`
				},

				GalleryWrap: false,

			}
		},
		components: {
			PageSelector: () => import('~/components/common/PageSelector.vue'),
			PromoBanner: () => import  ( '~/components/promo/PromoBanner.vue' ),
			VueImage: () => import  ( '~/components/common/ImageComponent/Image.vue' ),
		},
		methods: {
			...mapMutations({
				ChangePageQuantity: 'PageSelector/ChangePageQuantity'
			}),
			ShowGalleryWrap() {
				this.GalleryWrap = this.GalleryWrap == false ? true : false
			},
		},
		async created() {

			const GalleryQuantity: number = await firebase.database().ref("Gallery").once('value').then( data => data.numChildren() )

			const A = GalleryQuantity / this.LoadRange
			const B = A % 1 == 0 ? Math.trunc(A) : Math.trunc(A) + 1 

			this.ChangePageQuantity(B)

		}
	})

</script>
