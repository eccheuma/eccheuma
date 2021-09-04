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

		<nav class="navigation-items">

			<template v-for="prop in HeaderMenu">
				
				<div 
					:key="prop.ID" 
					
					class="navigation-item"
					:class="[
						{ disabled: prop.disabled },
						{ active: CurentRoute === prop.route }
					]"
					@mouseenter="playSound(Sounds.get('Element::Hover'))" 
					@click="playSound(Sounds.get('Element::Action'))"
					>

					<transition name="route_selector">
						<span v-show="CurentRoute === prop.route" />
					</transition>

					<!-- prefetch -->
					<nuxt-link 
						:id="`nav_item-${ prop.ID }`"
						:to="prop.route"
						@click="ScrollPage"
						>

						<icon :name="prop.icon" />

						{{ prop.name }}		

					</nuxt-link>
					
					<popover v-if="!prop.disabled || !$isMobile" :target="`nav_item-${ prop.ID }`">
						<!-- <i class="fas fa-info-circle" /> -->
						{{ prop.discription }}
					</popover>

				</div>

				<span :key="`${ prop.ID }-separator`" class="navigation-separator" />

			</template>

		</nav>

		<div v-if="search" class="navigation-search">
			<search-bar />
		</div>

	</section>
</template>

<style lang="scss" scoped>

$TransitionDuration: 250ms;

.route_selector {
	&-enter {
		&-active {
			opacity: 0;
			transition: all $TransitionDuration ease;
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

		--navigation-background: rgb(var(--color-mono-200));
		
		@include gradient_border;

	}
}

.navigation {
	&-container {

		position: sticky; top: 0; z-index: 1010;

		padding-inline: 6vw;

		display: grid; 
		min-height: $GLOBAL-HeaderHeight;
		
		grid-template-columns: 1fr; 
		gap: 15px; 
		align-items: center;

		grid-template: {
			columns: var(--navigation-grid, 12fr);
		};

		background: {
			color: var(--navigation-background, transparent);
		};

		transition-duration: $TransitionDuration;
		.active {

			color: rgb(var(--color-mono-800));

			a {
				transform: translateY(-2vh);
			}

			i {
				--svg-fill: rgb(var(--color-mono-800)) !important;
				transform: translateY(-9vh) rotate(-10deg) scale(2);
			}

		}

	}
	&-items {

		width: 100%;
    height: 100%;
    display: inline-flex;
    justify-content: space-evenly;

	}
	&-search {

		padding: 0 1vw;
		
		@media screen and ( max-width: $mobile-breakpoint ) {
			display: none;
		}

	}
	&-item {

		position: relative;

		display: grid;
		align-content: center;
		text-align: center;

		width: 100%;

		@media screen and ( max-width: $mobile-breakpoint ) {
			margin: .5vh 0;
		}

		&:before {

			content: '';
			opacity: 0;
	
			display: block; 
			position: absolute; 
			top: -1px;

			width: 100%; 
			height: 1px;

			background: linear-gradient(90deg, transparent, var(--color-accent-lighting), transparent);
			transition-duration: 500ms;

		}

		&:hover {
			
			&:before {
				opacity: 1;
			}

			a {
				color: var(--color-accent-edges-300);
				text-decoration: none;
				i {
					--svg-fill: var(--color-accent-edges-300);
				}
			}

		}

		span {
			
			display: block; 
			position: absolute; 
			top: -1px;

			width: 100%; 
			height: 1px;
			
			background: linear-gradient(90deg, transparent, var(--color-accent-edges-200), transparent);

		}

		a {

			display: inline-grid;
			justify-items: center;

			cursor: pointer;

			font: {
				size: var(--font-size-24);
				family: var(--decor-font);
			}

			line-height: 6vh;
			letter-spacing: .2ch;

			transition-duration: $TransitionDuration;
			color: rgb(var(--color-mono-400));

			z-index: 1000;

			@media screen and ( max-width: $mobile-breakpoint ) {
				display: inline-flex;
				font-size: var(--font-size-20);
			}

			i {

				$size: 30px;

				width:  $size;
				height: $size;

				pointer-events: none;

				display: block;

				padding: 2vh 0 0px;
				transition-duration: $TransitionDuration;
				filter: drop-shadow(0px -5vh 0px rgba(var(--color-mono-900),0));

				@media screen and ( max-width: $mobile-breakpoint ) {
					margin-right: 1ch;
					display: none;
				}

				--svg-fill: rgb(var(--color-mono-400));

			}

		}

	}
	&-separator {

		display: block;
		align-self: center;

		width: 2%; 
		height: 10px;

		background-color: rgb(var(--color-mono-400));
		border-radius: var(--border-radius);

		&:last-of-type {
			display: none;
		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

	// COMPONENTS
	import Popover 		from '~/components/common/Popover.vue'
	import Icon				from '~/components/Icon.vue'

	// MODULE
	export default Vue.extend({
		components: {

			Popover,
			Icon,
			// ASYNC COMPONENTS
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
						ID: 0, 
						disabled: false,
						route: '/home', 
						name: 'Главная', 
						icon: 'Home',
						discription: 'Главная страница. Тут собраны статьи на завязанные на профильную тему.'
					},
					{
						ID: 1, 
						disabled: false,
						route: '/gallery', 
						name: 'Галерея', 
						icon: 'Gallery',
						discription: 'Галлерея изображений. Начиная от логотипов и полноценных макетов, заканчивая всякими набросками и непринятыми вариантами работ.'
					},
					{
						ID: 2, 
						disabled: true,
						route: '/recomend', 
						name: 'Рекомендации', 
						icon: 'Fire',
						discription: 'Предложения по оказанию услуг. В зависимости от сезона и нагруженности тут появляются выгодные предложения на разные виды услуг.'
					},
					{
						ID: 3, 
						disabled: false,
						route: '/portfolio', 
						name: 'Портфолио', 
						icon: 'Portfolio',
						discription: 'Принятые работы. С указанием сроков, цены, комментариев, и отзывов на выполненую работу.'
					},
					{
						ID: 4, 
						disabled: false,
						route: '/service', 
						name: 'Услуги', 
						icon: 'Service',
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

			if ( process.browser ) {
				this.setSounds([
					{ file: 'On', name: 'Element::Action', 	settings: { rate: 0.50 } },
					{ file: 'On', name: 'Element::Hover', 	settings: { rate: 0.25 } }
				])
			}

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
