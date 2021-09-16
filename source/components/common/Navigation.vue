<template>
	<nav id="Navigation" class="common_navigation-container">
	<template v-for="(link, index) in category">

		<nuxt-link ref="links" :key="index" :to="link.route">

			<transition name="opacity-transition">
				<span v-if="link.route === $route.path" />
			</transition>

			<icon :name="link.icon" />
			{{ link.name }}

		</nuxt-link>

		<template v-if="index < category.length - 1">
			<span :key="`${ index }-separator`" class="common_navigation-separator" />
		</template>

	</template>
	</nav>
</template>

<style lang="scss">

.common_navigation {
	&-container {

		@include gradient_border(block);
		@include component-shadow;

		height: 15vh;
		width: 100%;
		// display: inline-grid;
		display: flex;
		background-color: rgb(var(--color-mono-200));

		// padding: 0 20vw;
		border-radius: var(--border-radius);

		// grid-template: {
		// 	columns: repeat(auto-fit, minmax(10px, min-content));
		// };

		column-gap: 1vw;

		align-items: center;
		justify-content: center;

		a {

			--nav-color: rgb(var(--color-mono-400));

			display: grid;
			row-gap: 1vh;
			place-items: center;
			place-content: center;
			position: relative;

			height: 100%;
			min-width: 160px;
	
			color: var(--nav-color);
			font: {
				size: var(--font-size-24);
				family: var(--decor-font);
			}

			letter-spacing: .25ch;

			span {
				position: absolute;
				top: -1px;
				left: 0;
				width: 100%;
				height: 1px;
				background: linear-gradient(90deg, transparent 0%, var(--color-accent-edges-300) 50%, transparent 100%)
			}

			i {
				@include icon-size(32px);
				fill: var(--nav-color);
				transition: inherit;
			}

			// transition-property: transform, color, fill;
			transition-duration: 250ms;

			&:hover {
				--nav-color: rgb(var(--color-mono-1000));
				i {
					transform: translateY(-9vh) scale(1.5);
					filter: drop-shadow(0px 0px 10px var(--color-accent-lighting));
				}
			}
			
		}

		.active {

			--nav-color: rgb(var(--color-mono-800));

			a {
				color: rgb(var(--color-mono-900));
			}
			
		}

	}
	&-separator {

		align-self: center;

		width: 5px;
    aspect-ratio: 1/3;

		background-color: rgb(var(--color-mono-500));
		border-radius: var(--border-radius);

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// COMPONENTS
	// import Popover from '~/components/common/Popover.vue'
	import Icon from '~/components/common/Icon.vue'

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
		components: {
			Icon
		},
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
			if ( process.browser ) {
				this.setSounds([
					{ file: 'On', name: 'Element::Action', 	settings: { rate: 0.50 } },
					{ file: 'On', name: 'Element::Hover', 	settings: { rate: 0.25 } }
				])
			}
		},
		mounted() {

			const LINK_COMPONENTS = this.$refs.links as Vue[]

			LINK_COMPONENTS.forEach((component) => {
				component.$el.addEventListener('mouseenter', 	() => this.playSound(this.Sounds.get('Element::Hover')))
				component.$el.addEventListener('click', 			() => this.playSound(this.Sounds.get('Element::Action')))
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
