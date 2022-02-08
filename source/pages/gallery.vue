<template>
	<main class="gallery-container">

		<promo-banner promo-type="Gallery" />

		<section class="gallery-pinned">

			<section-header v-once>
				<template #header>	
					<span>Закреплённые изображения</span>
				</template>
				<template #default>
					<span>Работы которые пришлись самому больше по душе</span>
				</template>
			</section-header>

			<div class="gallery-pinned-body">
				<vue-image
					:content="{ path: 'Promo/1.png', title: 'TEST' }" 
					:sections="{ date: false, description: true, zoom: true }" 
					:property="{ fit: 'cover', type: 'promo', collumn: 6 }"
				>

					А теперь с помощь Slot'a я могу вполне комфорто вливать описание изображения. Ну или получать его из json.

				</vue-image>

				<vue-image 
					:content="{ path: 'Promo/4.png', title: 'TEST' }" 
					:sections="{ date: false, description: true, zoom: true }" 
					:property="{ fit: 'cover', type: 'promo', collumn: 6 }"
				>

					А теперь с помощь Slot'a я могу вполне комфорто вливать описание изображения. Ну или получать его из json.

				</vue-image>
			</div>

		</section>

		<section class="gallery-content">

			<section-header>
				<template #header>	
					<span>Галлерея изображений</span>
				</template>
				<template #default>
					<span>Наброски логотипов, UI интерфейсов, и прочего.</span>
				</template>
			</section-header>

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
		gap: 15px;
		grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
		
	}

	&-container {

		display: flex;
		flex-direction: column;

		padding: 2vh 1vw;
		row-gap: 2vh;

	}

	&-pinned {

		@extend %card-container;

		display: flex; 
		flex-direction: column;

		padding: 0 2vw 10vh;

		gap: 2vh;

		border-radius: var(--border-radius);

		&-body {

			display: grid;
			grid-template: {
				columns: 1fr 1fr
			};

			column-gap: 1vw;

			width: 100%;
			max-width: 1210px;
			
			margin-inline: auto;

		}

	}

	&-content {

		@extend %card-container;

		padding-inline: 2vw;

		display: grid;
		row-gap: 2vh;

		padding: 0 2vw 10vh;

	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

// FIREBASE
	import firebase from 'firebase/app'; 
	import 'firebase/database';
	
// VUEX
	import { mapMutations } from 'vuex'

// MIXINS
	import TransitionSound from '~/assets/mixins/TransitionSound'

// LOAD POLITIC
	import { load_ranges } from '~/config/LoadPolitic'

// COMPONENTS
	import PromoBanner 		from '~/components/promo/PromoBanner.vue'
	import SectionHeader 	from '~/components/common/SectionHeader.vue'

// MODULE
	export default Vue.extend({ 
		components: {
			PromoBanner,
			SectionHeader,
			Pagination: 	() => import('~/components/common/Pagination.vue'),
			VueImage: 		() => import('~/components/image/Image.vue'),
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
		async fetch() {

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
