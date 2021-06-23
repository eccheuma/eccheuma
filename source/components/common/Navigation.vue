<template>
	<nav id="Navigation" class="portfolio_navigation-container">
	<template v-for="(link, index) in category">

		<nuxt-link ref="links" :key="index" :to="link.route" :class="{ active: link.route === $route.path }">

			<transition name="opacity-transition">
				<span v-if="link.route === $route.path" />
			</transition>

			<i :class="link.icon" /> {{ link.name }}

			<!-- <popover target="Navigation">
				<i class="fas fa-info-circle" />
				{{ link.discription }}
			</popover> -->

		</nuxt-link>

	</template>
	</nav>
</template>

<style lang="scss">

.portfolio_navigation {
	&-container {

		@include gradient_border(both);

		width: 100%;
		display: grid;

		grid-template: {
			columns: repeat(auto-fit, minmax(160px, 1fr));
		}

		padding: 0 25%;

		.active {

			opacity: 1 !important;
			color: rgb(var(--color-5));

			i {
				transform: rotate(15deg);
				color: rgb(var(--color-5));
			}

		}

		a {

			position: relative;

			justify-self: center;

			width: 100%;

			color: rgb(var(--color-4));

			padding: 20px 3vw;

			text: {
				align: center;
			}

			transition: all 250ms ease-in-out;

			font: {
				weight: 700;
				size: .65rem;
			}

			span {
				content: '';
				position: absolute;

				top: -1px; left: 0;
				height: .1px; width: 100%;

				background: linear-gradient(90deg, transparent 0%, rgb(var(--color-5)) 50%, transparent 100%);

			}

			i {

				transition: all 500ms ease-in-out;

				color: rgb(var(--color-4));

				display: block;

				font: {
					size: 1rem;
				}

				margin: { bottom: 2vh };

			}

			&:after {

				$W: 4px; $H: 10px;

				content: '';

				position: absolute;

				width: $W; height: $H; 

				top: calc(50% - #{$H / 2}); right: #{$W / 2};

				border-radius: .7rem;

				background: {
					color: rgb(var(--color-3));
				}
			}

			&:last-of-type {
				&:after {
					display: none;
				}
			}

			&:hover {
				text-decoration: none;
			}

		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// COMPONENTS
	// import Popover from '~/components/common/Popover.vue'

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

	// TYPES
	import type { ROUTES } from '~/typescript/Navigation'

	type NAV_ITEM = {
		ID: number 
		disabled: boolean
		route: ROUTES
		name: string
		icon: string
		discription: string
	}

	// MODULE
	export default Vue.extend({
		// components: {
		// 	Popover
		// },
		mixins: [ EmitSound ],
		props: {
			category: {
				type: Array,
				required: true,
			} as PropOptions< NAV_ITEM[] >,
		},
		computed: {
			CurentRoute(): ROUTES {
				return this.$route.path as ROUTES
			},
		},
		created() {
			this.setSounds([
				{
					file: 'Tap',
					name: 'PortfolionNavHover',
					settings: { rate: 1.25 }
				},
			])
		},
		mounted() {

			const LINK_COMPONENTS = this.$refs.links as Vue[]

			LINK_COMPONENTS.forEach((component) => {
				component.$el.addEventListener('mouseenter', () => this.playSound(this.Sounds.get('PortfolionNavHover')))
			})

		},
		methods: {
			GoRouterTo(path: ROUTES) {

				if ( this.$route.path !== path ) {
					this.$router.push({ path })
				}

			},
		},
	})

</script>
