<template>
	<nav class="container navigation_wrapper">
		<div class="row no-gutters">
			<div class="col">
				<nav class="row justify-content-center px-lg-5" id="BottomNavigationContainer">

					<div class="navigation_item" 
						v-for="prop in category" :key="prop.ID"
						:id="`navigation_header-${prop.ID}`"
						@mouseenter="EmitSound(`On`)"
						:class="[
							{ 'not_active_link': prop.disabled },
							`col-${ col }`
						]">

						<transition name="route_selector">
							<span v-if="CurentRoute == `${prop.route}`"></span>
						</transition>

						<nuxt-link 
							prefetch 
							:to="prop.route"
							:class="{'navigation_curentRoute': CurentRoute == `${prop.route}`}">
								<i class="d-none d-lg-block" :class="prop.icon" style="pointer-events: none"></i>
								{{ prop.name }}
						</nuxt-link>

						<b-popover
							container="BottomNavigationContainer" 
							:target="`navigation_header-${prop.ID}`" 
							triggers="hover"
							placement="bottom"
							:delay="{ show: 250, hide: 0 }">
							<i class="fas fa-info-circle"></i>
							{{ prop.discription }}
						</b-popover>

					</div>
					
				</nav>
			</div>
		</div>
	</nav>
</template>

<script>

	import EmitSound from '~/assets/mixins/EmitSound'

	export default {
		mixins: [ EmitSound ],
		props: {
			category: {
				default: [
					{
						ID: 0, disabled: false,
						route: 'Home', name: 'Главная', icon: 'fa-scroll',
						discription: 'Главная страница. Тут собраны статьи на завязанные на профильную тему.'
					},
				]
			},
			col: {
				default: 3
			}
		},
		computed: {
			CurentRoute() { // Текущий рут
				return this.$route.path
			},
		},
		methods: {
			GoRouterTo(prop) { // Переход на рут
				if ( this.$route.path != prop ) {
					this.$router.push({ path: prop })
				}
			},
		},
	}

</script>

<style lang="sass" scoped>

$TransitionDuration: .25s

.route_selector
	&-enter 
		&-active
			opacity: 0
			transition: all $TransitionDuration ease
			transition-delay: $TransitionDuration
		&-to
			opacity: 1
	&-leave 
		&-active
			opacity: 1
			transition: all $TransitionDuration ease
		&-to
			opacity: 0

.navigation
	&_wrapper
		position: sticky
		top: 0
		z-index: 2050
		margin: 0 auto
		max-width: 1420px
		text-align: center
		// height: 12.5vh
		background-color: $color1
		@extend %gradient_border
		nav 
			margin: 0px 1vw
			color: rgba($color6,.5)
			a 			
				will-change: transform, color, filter
				cursor: pointer
				display: block
				line-height: 6vh
				font-size: 11.5px
				font-weight: 600
				border-radius: 12px
				margin-top: -1px
				transition-duration: $TransitionDuration
				color: $color4
				@media screen and ( max-width: $MobileBreakPoint )
					color: rgba($color6, .75)
					line-height: 8vh
				i 
					display: block
					font-size: $FontSize3
					color: $color3 
					padding: 2vh 0 0px
					filter: drop-shadow(0px -5vh 0px rgba($color5,0))
					transition-duration: $TransitionDuration
				&:before 
					content: ''
					display: block
					width: 100%
					height: 1px
					transform: scaleX(0)
					background: linear-gradient(90deg, rgba($color5,0) 0%, rgba($color5,1) 50%, rgba($color5,0) 100%)
					transition-duration: $TransitionDuration
				&:hover
					text-decoration: none
					color: $color5
					transform: translateY(-6px)
					i 
						color: $color5
						transform: scale(1.5) translateY(-5vh)
						filter: drop-shadow(0px 5px 10px $color5)
					&:before 
						transform: scaleX(1) translateY(6px)
						filter: drop-shadow(0px 0px 6px $color5)
	&_curentRoute
		color: $color5 !important
		i 
			transition-duration: $TransitionDuration
			display: block
			font-size: $FontSize3
			color: $color5 !important
	&_item
		// position: relative
		&::after
			content: ''
			display: block
			position: absolute
			top: 3vh
			left: -0.125rem
			border-radius: .7rem
			width: .25rem
			height: 2vh
			background-color: $color3 
		&:nth-child(1)
			&::after
				display: none
		span
			text-align: center
			display: block
			width: 100%
			height: 1px
			transform: translateY(-1px)
			margin: 0px 0px -1px 
			background: linear-gradient(90deg, rgba($color5,.0) 0%, rgba($color5,1) 50%, rgba($color5,.0) 100%) !important 
			filter: drop-shadow(0px 0px 6px $color5)
</style>