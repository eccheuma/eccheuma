<template>
	<nav id="Navigation" class="navigation-container">
		<template v-for="(link, index) in category">

			<div 
				class="navigation-item" 
				:key="index" 
				:class="[
					{ disabled: link.disabled },
					{ active: curentRoute === link.route }
				]">

				<transition name="opacity-transition">
					<span v-if="link.route === curentRoute" />
				</transition>

				<nuxt-link ref="links" :to="link.route">

				<icon :name="link.icon" />
				{{ link.name }}

				</nuxt-link>

			</div>

			<span class="navigation-separator" :key="`${ index }-separator`" />

		</template>
	</nav>
</template>

<style lang="scss">

$TransitionDuration: 250ms;

.navigation {
	&-container {

		@include gradient_border(block);
		@include component-shadow;

		height: 15vh;
		width: 100%;

    display: inline-flex;
    justify-content: center;
		gap: 2vw;

		background-color: rgb(var(--color-mono-200));
		border-radius: var(--border-radius);

		.active {

			color: rgb(var(--color-mono-900)) !important;

			i {
				fill: rgb(var(--color-mono-900)) !important;
			}

		}

	}
	&-item {

		position: relative;

		display: grid;
		align-content: center;
		text-align: center;

		width: 10vw;

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
					fill: var(--color-accent-edges-300);
				}
			}

		}

		> span {
			
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
				// display: inline-flex;
				font-size: var(--font-size-20);
			}

			i {

				$size: 30px;

				width:  $size;
				height: $size;

				pointer-events: none;

				display: block;

				padding: 2vh 0 0px;
				transition-property: transform;
				transition-duration: $TransitionDuration;
				filter: drop-shadow(0px -5vh 0px rgba(var(--color-mono-1000),0));

				@media screen and ( max-width: $mobile-breakpoint ) {
					margin-right: 1ch;
					display: none;
				}

				fill: rgb(var(--color-mono-400));

			}

		}

	}
	&-separator {

		display: block;
		align-self: center;

		width: 4px; 
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

	import Vue, { PropOptions } from 'vue';

	// COMPONENTS
	// import Popover from '~/components/common/Popover.vue'
	import Icon from '~/components/common/Icon.vue';

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound';

	// TYPES
	import type { navigation } from '~/contracts/Navigation';

	type NAV_ITEM = {
		ID					: number 
		disabled		: boolean
		route				:	keyof typeof navigation.routeSections
		name				: string
		icon				: string
		discription	: string
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
			curentRoute(): string {
				return this.$route.path;
			},
		},
		created() {
			if ( process.browser ) {
				this.setSounds([
					{ file: 'On', name: 'Element::Action', 	settings: { rate: 0.50 } },
					{ file: 'On', name: 'Element::Hover', 	settings: { rate: 0.25 } }
				]);
			}
		},
		mounted() {

			const LINK_COMPONENTS = this.$refs.links as Vue[];

			LINK_COMPONENTS.forEach((component) => {
				component.$el.addEventListener('mouseenter', 	() => this.playSound(this.Sounds.get('Element::Hover')));
				component.$el.addEventListener('click', 			() => this.playSound(this.Sounds.get('Element::Action')));
			});

		},
	});

</script>
