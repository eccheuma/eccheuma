<template>

	<section @mouseover="CursorInArea = true" id="header-navigation" class="navigation-wrap" :class="[{ 'module-background': background }, { 'module-search': search }]">

		<client-only>
			<CursorFX v-if="Ready && CursorInArea && !$isMobile"></CursorFX>
		</client-only>

		<nav class="navigation-container">

			<div class="navigation-item"

				v-for="prop in HeaderMenu" 
				
				:key="prop.ID" 
				:id="`HNI-${prop.ID}`"  
				:class="{ disabled: prop.disabled }"

				@mouseenter="EmitSound(`Off`)" 
				@click="EmitSound(`Tap`, { rate: .5 })">

				<transition name="route_selector">
					<span v-if="CurentRoute == `${ prop.route }`"></span>
				</transition>

				<nuxt-link no-prefetch 
					:to="prop.route"
					:id="`nav_item-${prop.ID}`"
					:class="[
						{'navigation-curent_route': CurentRoute == `${ prop.route }`}
					]"
					
					@click="ScrollPage">

						<i class="fas" :class="prop.icon" style="pointer-events: none"></i>

						{{ prop.name }}		

				</nuxt-link>
				
				<b-popover v-if="!prop.disabled"
					container="header-navigation" 
					:target="`nav_item-${prop.ID}`" 
					triggers="hover"
					placement="bottom"
					:delay="{ show: 250, hide: 0 }">
					<i class="fas fa-info-circle"></i>
					{{ prop.discription }}
				</b-popover>

			</div>

		</nav>

		<div class="navigation-search" v-if="search">
			<search-bar />
		</div>

	</section>
</template>

<style lang="scss" scoped>

$TransitionDuration: .25s;

.route_selector {
	&-enter {
		&-active {
			opacity: 0;
			transition: all $TransitionDuration ease;
			transition-delay: $TransitionDuration;
		}
		&-to {
			opacity: 1;
		}
	}
	&-leave {
		&-active {
			opacity: 1;
			transition: all $TransitionDuration ease;
		}
		&-to {
			opacity: 0;
		}
	}
}

.disabled {
	pointer-events: none;
	a {
		opacity: .1 !important 
	}
	&:before {
		display: none !important
	}
}

.module {
	&-search {
		grid-template-columns: 9fr 3fr !important;
	}
	&-background {
		background-color: $color1;
		@extend %gradient_border;
	}
}

.navigation {
	&-wrap {
		position: sticky; top: 0; z-index: 2000; padding: 0 5vw;
		display: grid; grid-template-columns: 1fr; gap: 15px; align-items: center;
	}
	&-container {
		width: 100%;
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
	&-search {
		padding: 0 10%;
	}
	&-curent_route {
		color: $color6 !important;
		transform: translateY(-1.5vh);
		i {
			transition-duration: $TransitionDuration;
			display: block;
			font-size: $FontSize3;
			color: $color6 !important;
			transform: scale(1.5) translateY(-5vh) !important;
		}
	}
	&-item {
		position: relative;
		text-align: center;
		&:before {
			content: '';
			display: block; position: absolute; top: -1px;
			width: 100%; height: 1px;
			opacity: 0;
			background: linear-gradient(90deg, rgba($color5,.0) 0%, rgba($color5,1) 50%, rgba($color5,.0) 100%) !important ;
			transition-duration: .5s;
		}
		&:after {
			content: ''; display: block; position: absolute;
			top: 4.5vh; left: -0.125rem;
			width: .25rem; height: 10px;
			opacity: 1 !important;
			background-color: $color4 !important;
			border-radius: .7rem;
			@media screen and ( max-width: $MobileBreakPoint ) {
				display: none;
			}
		}
		&:hover {
			&:before {
				opacity: 1
			}
		}
		&:nth-child(1) {
			&:after {
				display: none
			}
		}
		span {
			display: block; position: absolute; top: -1px;
			width: 100%; height: 1px;
			opacity: 1;
			background: linear-gradient(90deg, rgba($color5,.0) 0%, rgba($color5,1) 50%, rgba($color5,.0) 100%) !important ;
			transition-duration: .5s;
		}
		a {
			cursor: pointer;
			display: block;
			line-height: 6vh;
			font-size: 11.5px;
			font-weight: 600;
			border-radius: 12px;
			transition-duration: $TransitionDuration;
			color: $color4;
			z-index: 2000;

			@media screen and ( max-width: $MobileBreakPoint ) {
				display: inline-flex;
			}

			i {
				display: block;
				font-size: $FontSize3;
				color: $color3;
				padding: 2vh 0 0px;
				transition-duration: $TransitionDuration;
				filter: drop-shadow(0px -5vh 0px rgba($color5,0));

				@media screen and ( max-width: $MobileBreakPoint ) {
					margin-right: 1ch;
				}

			}
			&:hover {
				text-decoration: none;
				color: $color5;
				transform: translateY(-1.5vh);
				i {
					color: $color5;
					transform: scale(1.5) translateY(-5vh);
				}

				@media screen and ( max-width: $MobileBreakPoint ) {

					text-decoration: unset;
					color: unset;
					transform: unset;
					i {
						color: unset;
						transform: unset;
					}

				}

			}
		}	
	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	import EmitSound from '~/assets/mixins/EmitSound.ts'

	export default Vue.extend({
		mixins: [ EmitSound ],
		components: {
			SearchBar: 	() => import('~/components/common/SearchBar.vue'),
			CursorFX: 	() => import('~/components/common/CursorFX.vue')
		},
		props: {
			search: {
				default: true
			},
			background: {
				default: true
			}
		},
		data() {
			return {

				Ready: false,

				CursorInArea: false,

				HeaderMenu: [ // Пункты меню
					{
						ID: 0, disabled: false,
						route: '/home', name: 'Главная', icon: 'fa-scroll',
						discription: 'Главная страница. Тут собраны статьи на завязанные на профильную тему.'
					},
					{
						ID: 1, disabled: false,
						route: '/gallery', name: 'Галерея', icon: 'fa-clone',
						discription: 'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.'
					},
					{
						ID: 2, disabled: true,
						route: '/recomend', name: 'Рекомендации', icon: 'fa-fire',
						discription: 'Предложения по оказанию услуг. В зависимости от сезона и нагруженности тут появляются выгодные предложения на разные виды услуг.'
					},
					{
						ID: 3, disabled: false,
						route: '/portfolio', name: 'Портфолио', icon: 'fa-layer-group',
						discription: 'Принятые работы. С указанием сроков, цены, комментариев, и отзывов на выполненую работу.'
					},
					{
						ID: 4, disabled: false,
						route: '/service', name: 'Услуги', icon: 'fa-ruble-sign',
						discription: 'Услуги. Перечень оказываемых услуг, калькулятор стоимости, и форма обратной связи.'
					},
				]
			}
		},
		computed: {
			CurentRoute(): string { // Текущий рут
				return this.$route.matched?.[0].path
			},
		},
		methods: {
			ScrollPage(): void {

				window.scrollTo({
					top: ( window.innerHeight * .725 ),
					behavior: 'smooth'
				})

			},
		},
		mounted() {
			this.Ready = true;
		}
	})

</script>