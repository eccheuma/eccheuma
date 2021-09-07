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
		mixins: [TransitionSound, EmitSound],
		layout: 'Application',
		scrollToTop: false,
		transition: 'opacity-transition',
		data() {
			return {
				HeaderMenu: [
					{
						ID: 0,
						disabled: false,
						route: '/portfolio/landings',
						name: 'Лэндинги',
						icon: 'JS',
						discription:
							'Главная страница. Тут собраны статьи на завязанные на профильную тему.',
					},
					{
						ID: 1,
						disabled: false,
						route: '/portfolio/logo',
						name: 'Логотипы',
						icon: 'Vector',
						discription:
							'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.',
					},
					{
						ID: 2,
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
		computed: {
			CurentRoute() {
				return this.$route.path;
			},
		},
		methods: {
			GoRouterTo(prop) {
				if (this.$route.path !== prop) {
					setTimeout(() => {
						this.EmitSound('Out');
					}, 750);

					this.$router.push({ path: prop });
				}
			},
		},
	}

</script>

<style lang="sass">

.CurentRoute
	cursor: pointer
	padding: 15px 0px
	display: block
	font-size: 12px
	font-weight: 700
	border-radius: 12px
	color: rgb(var(--color-mono-900)) !important
	transition-duration: .5s
	&:after
		transition-duration: .5s
		content: ''
		display: block
		width: 100%
		height: 1px
		transform: scaleX(1) translateY(-47px)
		background-color: rgba(var(--color-mono-900),1)
		@media screen and ( max-width: $mobile-breakpoint )
			transform: scaleX(1) translateY(-36px)

$TransitionDuration: .25s

.PageSelector
	position: sticky
	top: 0
	z-index: 30
	padding: 0 10vh
	text-align: center
	&_Item
		position: relative
		&:nth-of-type(1)
			&::after
				display: none
		&:after
			content: ''
			display: block
			position: absolute
			top: calc(30px - 1vh)
			left: -0.125rem
			border-radius: .7rem
			width: .25rem
			height: 2vh
			background-color: rgb(var(--color-mono-400))
	nav
		margin: 0px 15px
		color: rgba(var(--color-mono-800),.70)
		a
			cursor: pointer
			padding: 15px 0px
			display: block
			font-size: .65rem
			font-weight: 700
			line-height: 30px
			border-radius: 12px
			i
				display: block
				font-size: var(--font-size-14)
				margin-bottom: 12px
				color: rgb(var(--color-mono-400))
			&:before
				transition-duration: $TransitionDuration
				content: ''
				display: block
				width: 100%
				height: 1px
				transform: scaleX(0) translateY(-16px)
				background-color: grey
			&:hover
				text-decoration: none
				color: rgba(var(--color-mono-900), 1)
				transition-duration: $TransitionDuration
				i
					transition-duration: $TransitionDuration
					color: rgb(var(--color-mono-500))
				&:before
					transition-duration: $TransitionDuration
					content: ''
					text-align: center
					display: block
					width: 100%
					height: 1px
					transform: scaleX(1) translateY(-16px)
					background-color: #ffffff
					box-shadow: 0px 0px 6px 0px

.Portfolio-Case
	min-height: 400px
	background-color: rgb(var(--color-mono-200))

</style>
