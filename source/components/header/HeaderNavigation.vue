<template>

	<section 
		id="header-navigation" 
		class="navigation-container" 
		:class="[
			{'module-background': background }, 
			{'module-search': search }
		]"
		@mouseover="CursorInArea = true" 
		>

		<client-only>
			<CursorFX v-if="Ready && CursorInArea && !$isMobile" />
		</client-only>

		<nav class="navigation-items" :style="`--hngic: ${ $isMobile ? 1 : HeaderMenu.length }`">

			<div 
				v-for="prop in HeaderMenu" 

				:id="`HNI-${prop.ID}`"  
				:key="prop.ID" 
				
				class="navigation-item"
				:class="{ disabled: prop.disabled }"

				@mouseenter="EmitSound('On', { rate: 1.25 })" 
				@click="EmitSound('On', { rate: 1 })"
				>

				<transition name="route_selector">
					<span v-if="CurentRoute === prop.route" />
				</transition>

				<nuxt-link 
					:id="`nav_item-${ prop.ID }`"
					:to="prop.route"

					:class="[{ active: CurentRoute === prop.route }]"
					
					no-prefetch

					@click="ScrollPage"
				>

						<i class="fas" :class="prop.icon" style="pointer-events: none" />

						{{ prop.name }}		

				</nuxt-link>
				
				<popover v-if="!prop.disabled || !$isMobile" :target="`nav_item-${ prop.ID }`">
					<!-- <i class="fas fa-info-circle"></i> -->
					{{ prop.discription }}
				</popover>

			</div>

		</nav>

		<div v-if="search" class="navigation-search">
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

.module {
	&-search {

		--navigation-grid: 9fr 3fr;

		@media screen and ( max-width: $mobile-breakpoint ) {
			--navigation-grid: 12fr;
		} 

	}
	&-background {

		--navigation-background: rgb(var(--color-1));
		@extend %gradient_border;

	}
}

.navigation {
	&-container {

		position: sticky; top: 0; z-index: 1010; padding: 0 5vw;

		display: grid; 
		
		grid-template-columns: 1fr; 
		gap: 15px; 
		align-items: center;

		grid-template: {
			columns: var(--navigation-grid, 12fr);
		};

		background: {
			color: var(--navigation-background, transparent);
		};

	}
	&-items {

		width: 100%;
    display: grid;
    justify-content: center;
    grid-template-columns: repeat(auto-fill, minmax(100px, calc(100% / var(--hngic))));

	}
	&-search {
		padding: 0 10%;

		@media screen and ( max-width: $mobile-breakpoint ) {
			display: none;
		}

	}
	&-item {
		position: relative;
		text-align: center;

		@media screen and ( max-width: $mobile-breakpoint ) {
			margin: .5vh 0;
		}

		&:before {
			content: '';
			display: block; position: absolute; top: -1px;
			width: 100%; height: .6px;
			opacity: 0;
			background: linear-gradient(90deg, rgba(var(--color-6),.0) 0%, rgba(var(--color-6),1) 50%, rgba(var(--color-6),.0) 100%) !important ;
			transition-duration: .5s;
		}

		&:after {
			content: ''; display: block; position: absolute;
			top: 4.5vh; left: -0.125rem;
			width: .25rem; height: 10px;
			opacity: 1 !important;
			background-color: rgb(var(--color-4)) !important;
			border-radius: .7rem;
			@media screen and ( max-width: $mobile-breakpoint ) {
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
			width: 100%; height: .6px;
			opacity: 1;
			background: linear-gradient(90deg, rgba(var(--color-6),.0) 0%, rgba(var(--color-6),1) 50%, rgba(var(--color-6),.0) 100%) !important ;
			transition-duration: .5s;
		}

		a {
			cursor: pointer;
			display: block;
			line-height: 6vh;
			font-size: var(--font-size-4);
			font-weight: 600;
			border-radius: 12px;
			transition-duration: $TransitionDuration;
			color: rgb(var(--color-4));
			z-index: 2000;

			@media screen and ( max-width: $mobile-breakpoint ) {
				display: inline-flex;
				font-size: var(--font-size-3);
			}

			i {
				display: block;
				// font-size: var(--font-size-3);
				color: rgb(var(--color-3));
				padding: 2vh 0 0px;
				transition-duration: $TransitionDuration;
				filter: drop-shadow(0px -5vh 0px rgba(var(--color-6),0));

				@media screen and ( max-width: $mobile-breakpoint ) {
					margin-right: 1ch;
					display: none;
				}

			}
			&:hover {
				text-decoration: none;
				color: rgb(var(--color-6));
				transform: translateY(-1.5vh);
				i {
					color: rgb(var(--color-6));
					transform: scale(1.5) translateY(-5vh);
				}

				@media screen and ( max-width: $mobile-breakpoint ) {

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

		.disabled {
			pointer-events: none;
			a {
				opacity: .1 !important 
			}
			&:before {
				display: none !important
			}
		}

		.active {

			color: rgb(var(--color-5)) !important;

			@media screen and ( mix-width: $mobile-breakpoint ) {
				transform: translateY(-1.5vh);
			}

			i {

				transition-duration: $TransitionDuration;
				display: block;
				font-size: var(--font-size-3);
				color: rgb(var(--color-5)) !important;

				@media screen and ( mix-width: $mobile-breakpoint ) {
					transform: scale(1.5) translateY(-5vh) !important;
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
		components: {
			// ASYNC COMPONENTS
			Popover: 		() => import('~/components/common/Popover.vue'),
			SearchBar: 	() => import('~/components/common/SearchBar.vue'),
			CursorFX: 	() => import('~/components/common/CursorFX.vue'),
		},
		mixins: [ EmitSound ],
		props: {
			search: {
				type: Boolean,
				default: true
			},
			background: {
				type: Boolean,
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
		mounted() {
			this.Ready = true;
		},
		methods: {
			ScrollPage(): void {

				window.scrollTo({
					top: ( window.innerHeight * .725 ),
					behavior: 'smooth'
				})

			},
		},
	})

</script>