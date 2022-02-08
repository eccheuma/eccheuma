<template>
  <main class="portfolio-container">

    <promo-banner promo-type="Style" :order="0" />

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

<script>

// MIXINS
	import TransitionSound 	from '~/assets/mixins/TransitionSound';
	import EmitSound 				from '~/assets/mixins/EmitSound';

// COMPONENTS
	import SectionHeader 		from '~/components/common/SectionHeader.vue'

// MODULE
	export default {
		components: {
			SectionHeader,
			PromoBanner: () => import('~/components/promo/PromoBanner.vue'),
			Navigation: () => import('~/components/common/Navigation.vue'),
		},
		mixins: [ TransitionSound, EmitSound ],
		layout: 'Application',
		scrollToTop: false,
		transition: 'opacity-transition',
		data() {
			return {
				HeaderMenu: [
					{
						disabled: false,
						route: '/portfolio/landings',
						name: 'Лэндинги',
						icon: 'JS',
						discription:
							'Главная страница. Тут собраны статьи на завязанные на профильную тему.',
					},
					{
						disabled: false,
						route: '/portfolio/logo',
						name: 'Логотипы',
						icon: 'Vector',
						discription:
							'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.',
					},
					{
						disabled: false,
						route: '/portfolio/banners',
						name: 'Макеты',
						icon: 'Blank',
						discription:
							'Предложения по оказанию услуг. В зависимости от сезона и нагруженности тут появляются выгодные предложения на разные виды услуг.',
					},
				],
			};
		},
		head() {
			return {
				title: 'Eccheuma | Портфолио',
				meta: [
					{
						hid: 'description',
						name: 'description',
						content:
							'Принятые работы. С указанием сроков, цены, комментариев, и отзывов на выполненую работу.',
					},
				],
			};
		},
	}

</script>
