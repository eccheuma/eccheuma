<template>
	<main class="gallery-container">

		<promo-banner promo-type="Gallery" />

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

			<pagination :payload="PaginationParams" />

			<nuxt-child :key="$route.path" />

			<pagination :payload="PaginationParams" />

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

		@media screen and ( max-width: $mobile-breakpoint ) {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}

	}
	&-title {

		border: { 
			top: 1px solid rgb(var(--color-2));
		};

		padding: 3vh 0;

		span {
			
			display: block; text-align: center; font-weight: 600;

			&:nth-of-type(1) {
				font-size: var(--font-size-1); color: rgb(var(--color-6)); 
			}
			&:nth-of-type(2) {
				font-size: var(--font-size-3); color: rgb(var(--color-4));
			}
			
		}

		hr {
			background-color: rgb(var(--color-3)); width: 50%;
		}	

	}
}


</style>

<script lang="ts">

	import Vue from 'vue'

	import firebase from 'firebase/app'; import 'firebase/database';

	import { mapMutations } from 'vuex'

	import TransitionSound from '~/assets/mixins/TransitionSound'

// COMPONENTS
	import PromoBanner from '~/components/promo/PromoBanner.vue'

// LOAD POLITIC
	import { load_ranges } from '~/config/LoadPolitic.ts'

// MODULE
	export default Vue.extend({ 
		components: {
			PromoBanner,
			Pagination: 	() => import('~/components/common/Pagination.vue'),
			VueImage: 		() => import('~/components/common/ImageComponent/Image.vue'),
		},
		mixins: [ TransitionSound ],
		layout: 'Application', 
		scrollToTop: false, 
		transition: 'opacity-transition',
		loading: false, 
		data() {
			return {

				LoadRange: load_ranges.gallery,

				PaginationParams: {
					section: 'gallery', 
					params: `range=${ load_ranges.gallery }`
				},

				GalleryWrap: false,

			}
		},
		head () {
			return {
				title: 'Eccheuma | Галерея',
				meta: [
					{ 
						hid: 'description', 
						name: 'description', 
						content: 'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.'
					}
				]
			}
		},
		async created() {

			const GalleryQuantity: number = await firebase.database().ref('Gallery').once('value').then( data => data.numChildren() )

			this.ChangePageQuantity( Math.ceil(GalleryQuantity / this.LoadRange) )

		},
		methods: {
			...mapMutations({
				ChangePageQuantity: 'PageSelector/ChangePageQuantity'
			}),
			ShowGalleryWrap() {
				this.GalleryWrap = !this.GalleryWrap;
			},
		},
	})

</script>
