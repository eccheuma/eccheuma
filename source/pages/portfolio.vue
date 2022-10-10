<template>
  <main class="portfolio-container">

    <promo-banner promo-type="Stylistics" :order="0" />

		<section class="portfolio-content">

			<section-header>
				<template #header>	
					<span>Выполненные работы</span>
				</template>
				<template #default>
					<span>Разбитые на категории работы, с указание цены, отзывов, и технологий</span>
				</template>
			</section-header>

			<navigation :category="HeaderMenu" />

			<nuxt-child :key="$route.path" />

		</section>

  </main>
</template>

<style lang="scss" scoped>

	main {
		display: grid;
		grid-template-columns: 1fr;
		row-gap: 2vh;
	}

	.portfolio {
		&-content {

			@include gradient_border(block);
			@include component-shadow;

			padding: 0 1vw;
			display: flex;
			flex-direction: column;
			gap: 2vh;

			border-radius: var(--border-radius);

		}
	}

</style>

<script lang="ts">

	import Vue from 'vue';
// VUEX
	import { mapState } from 'vuex';

// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound';

// TYPE
	import { Portfolio } from '~/types/Portfolio';
	import { navigation } from '~/types/Navigation';
	import type { VuexMap } from '~/types/VuexMap';

// COMPONENTS
	import SectionHeader from '~/components/common/SectionHeader.vue';

// PAGE DESCRIPTION
	import { opengraph } from '~/utils/opengraph';
	import { getLocale, languages } from '~/lang';

	export const PageDescription: opengraph.struct = {
		title				: 'Eccheuma | Портфолио',
		description	: 'Предложения по оказанию услуг. В зависимости от сезона и нагруженности тут появляются выгодные предложения на разные виды услуг.',
		url					: '',
		image				: require('~/assets/images/NotificationBadge.png?resize&size=600').src,
	};

// MODULE
	export default Vue.extend({
		components: {
			SectionHeader,
			PromoBanner	: () => import('~/components/promo/PromoBanner.vue'),
			Navigation	: () => import('~/components/common/Navigation.vue'),
		},
		mixins: [ EmitSound ],
		layout: 'Application',
		scrollToTop: false,
		transition: 'opacity-transition',
		data() {
			return {
				HeaderMenu: [
					{
						disabled: false,
						route: `/${ navigation.routeSections.portfolio }/${ Portfolio.sections.landings.toLowerCase() }`,
						name: getLocale(languages.Russian).Application.Landing,
						icon: 'JS',
						discription:
							'Главная страница. Тут собраны статьи на завязанные на профильную тему.',
					},
					{
						disabled: false,
						route: `/${ navigation.routeSections.portfolio }/${ Portfolio.sections.logo.toLowerCase()  }`,
						name: getLocale(languages.Russian).Graphic.Logo,
						icon: 'Vector',
						discription:
							'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.',
					},
					{
						disabled: true,
						route: `/${ navigation.routeSections.portfolio }/${ Portfolio.sections.mockups.toLowerCase() }`,
						name: getLocale(languages.Russian).Graphic.MockupBlock,
						icon: 'Blank',
						discription:
							'Предложения по оказанию услуг. В зависимости от сезона и нагруженности тут появляются выгодные предложения на разные виды услуг.',
					},
					{
						disabled: true,
						route: `/${ navigation.routeSections.portfolio }/${ Portfolio.sections.applications.toLowerCase() }`,
						name: getLocale(languages.Russian).Application.Applications,
						icon: 'Vue',
						discription:
							'Предложения по оказанию услуг. В зависимости от сезона и нагруженности тут появляются выгодные предложения на разные виды услуг.',
					},
				],
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
		computed: {
			...mapState({
				Lang: state => (state as VuexMap).App.Lang
			}),
		},
	});

</script>
