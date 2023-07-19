<template>
	<main class="gallery-container">

		<promo-banner promo-type="Works" />

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

			<notion lang="ru">
				Все представленные изображения в данной секции являются интеллектуальной собственностью. В следствии чего, любое их коммерческое использование юр.лицами без согласования с их владельцем - Несёт за собой юридические последствия.
				<a href="http://kodeks.systecs.ru/gk_rf/gk_glava69/gk_st1252.html" target="_blank">ст. 1252 ГК РФ.</a>
				<br>
				TLDR: Не воруй. А если и воруешь, хотя бы признавайся.
			</notion>

		</section>

	</main>
</template>

<style lang="scss">

.gallery {

	&-page {

		display: grid;
		gap: 15px;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		
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
			grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));

			column-gap: 1vw;
			row-gap: 2vh;

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

}

</style>

<script lang="ts">

	import Vue from 'vue';

// VUEX
	import { mapMutations } from 'vuex';

// API
	import { database } from '~/api/database';
	
// LOAD POLITIC
	import { Ranges } from '~/config/LoadPolitic';

// COMPONENTS
	import PromoBanner 		from '~/components/promo/PromoBanner.vue';
	import SectionHeader 	from '~/components/common/SectionHeader.vue';

// PAGE DESCRIPTION
	import { opengraph } from '~/utils/opengraph';

	export const PageDescription: opengraph.struct = {
		title				: 'Eccheuma | Галерея',
		description	: 'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.',
		url					: '',
		image				: require('~/assets/images/NotificationBadge.png?resize&size=600').src,
	};

// MODULE
	export default Vue.extend({ 
		components: {
			PromoBanner,
			SectionHeader,
			Pagination		: () => import('~/components/common/Pagination.vue'),
			EccheumaImage	: () => import('~/components/image/Image.vue'),
			Notion        : () => import('~/components/common/Notion.vue'),
		},
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

				PageQuantity: 0,

			};
		},
		head () {
			return {
				title: PageDescription.title,
				meta: [
					...new opengraph.Meta(PageDescription).buildMeta()
				],
			};
		},

		async mounted() {

			const GalleryQuantity = await database.getLength('gallery');

			this.PageQuantity = Math.ceil( GalleryQuantity / Ranges.gallery );

			this.ChangePageQuantity(this.PageQuantity);

		},

		methods: {

			...mapMutations({
				ChangePageQuantity: 'PageSelector/ChangePageQuantity'
			}),

		},
	});

</script>
