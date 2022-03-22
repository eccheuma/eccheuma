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
				<eccheuma-image
					:content="{ path: 'Promo/1.png', title: 'TEST' }" 
					:sections="{ date: false, description: true, zoom: true }" 
					:property="{ fit: 'cover', type: 'promo', collumn: 6 }"
				>

					А теперь с помощь Slot'a я могу вполне комфорто вливать описание изображения. Ну или получать его из json.

				</eccheuma-image>

				<eccheuma-image 
					:content="{ path: 'Promo/4.png', title: 'TEST' }" 
					:sections="{ date: false, description: true, zoom: true }" 
					:property="{ fit: 'cover', type: 'promo', collumn: 6 }"
				>

					А теперь с помощь Slot'a я могу вполне комфорто вливать описание изображения. Ну или получать его из json.

				</eccheuma-image>
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

			<span class="gallery-notion">
				Aptly at my purple gently dreaming on out what ghost burden. He craven here mystery doubtless evilprophet pallas guessing and linking, evermore then tell angels have this a agreeing all, above tis rare be this and it me, my unbrokenquit it and no flirt curtain.
			</span>

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

		padding: 0 2vw 2vh;

	}

	&-notion {
		width: 114ch;
    margin: 0 auto;
    text-align: center;
    font-size: var(--font-size-12);
    color: rgb(var(--color-mono-500));
	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapMutations } from 'vuex'

// API
	import { database } from '~/api/database'
	
// MIXINS
	import TransitionSound from '~/assets/mixins/TransitionSound'

// LOAD POLITIC
	import { Ranges } from '~/config/LoadPolitic'

// COMPONENTS
	import PromoBanner 		from '~/components/promo/PromoBanner.vue'
	import SectionHeader 	from '~/components/common/SectionHeader.vue'

// PAGE DESCRIPTION
	import { Opengraph } from '~/utils/opengraph'

	export const PageDescription: Opengraph.struct = {
		title				: 'Eccheuma | Галерея',
		description	: 'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.',
		url					: '',
		image				: require('~/assets/images/NotificationBadge.png?resize&size=600').src,
	}

// MODULE
	export default Vue.extend({ 
		components: {
			PromoBanner,
			SectionHeader,
			Pagination		: () => import('~/components/common/Pagination.vue'),
			EccheumaImage	: () => import('~/components/image/Image.vue'),
		},
		mixins: [ TransitionSound ],
		layout: 'Application', 
		scrollToTop: false, 
		transition: 'opacity-transition',
		loading: false, 
		data() {
			return {

				PaginationParams: {
					section: 'gallery', 
					params: `range=${ Ranges.gallery }`
				},

			}
		},
		async fetch() {

			const GalleryQuantity = await database.getLength('Gallery');

			this.ChangePageQuantity(Math.ceil( GalleryQuantity / Ranges.gallery ))

		},
		head () {
			return {
				title: PageDescription.title,
				meta: [
					...new Opengraph.Meta(PageDescription).buildMeta()
				],
			}
		},
		methods: {

			...mapMutations({
				ChangePageQuantity: 'PageSelector/ChangePageQuantity'
			}),

		},
	})

</script>
