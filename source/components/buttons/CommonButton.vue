<template>
	<component 
		:is="type" 
		ref="button" 
		:class="[
			{ 'action': indicator },
			{ 'scheme::dark': scheme === 'dark' },
		]"
	>

		<cursor-visual />

		<span>
			<slot />
		</span>

	</component>
</template>

<style lang="scss" scoped>

	.scheme\:\:dark {
		--eccheuma-button-border: var(--color-accent-edges-100);
		--eccheuma-button-text: rgb(var(--color-mono-900));
		--eccheuma-button-color: rgb(var(--color-mono-300));
	}

	.action {

		animation: eccheuma-button-action 1s alternate infinite;
		@keyframes eccheuma-button-action {
			from {
				border-color: var(--eccheuma-button-text);
				// filter: drop-shadow(0 0 4px var(--eccheuma-button-color));
			}
			to {
				border-color: var(--eccheuma-button-color);
				// filter: drop-shadow(0 0 0 var(--eccheuma-button-color));
			}
		}

	}

	button, a, label {

		--eccheuma-button-border: var(--color-accent-edges-100);
		--eccheuma-button-border-active: var(--color-accent-edges-300);
		--eccheuma-button-text: rgb(var(--color-mono-300));
		--eccheuma-button-color: rgb(var(--color-mono-900));

		cursor: pointer;

		display: grid;
		position: relative;

		background: transparent;

		border: 2px solid var(--eccheuma-button-border); 
		border-radius: var(--border-radius);

		padding: 2px;
		min-width: 180px;

		font-size: var(--font-size-14);
		font-weight: 800; 

		transition-duration: .25s;

		&:hover {
			border-color: var(--eccheuma-button-border-active);
		}

		span {
			
			@extend %pattern-lines;
			
			width: 100%;
			height: 100%;
		
			text-align: center;
			line-height: 4vh;

			display: flex;
			justify-content: space-evenly;
			gap: 1vw;

			color: var(--eccheuma-button-text);
			background-color: var(--eccheuma-button-color);
			border-radius: calc(.7rem - 4px);

			padding: 0 2vw;

		}

		&:hover {
			text-decoration: none; 
		}

	}

</style>

<script lang="ts"> 

	import Vue, { PropOptions } from 'vue'

	// MIXINS
	import EmitSound      from '~/assets/mixins/EmitSound'
	import HashGenerator  from '~/assets/mixins/HashGenerator'
	
	// MODULE
	export default Vue.extend({
		components: {
			CursorVisual: 	() => import('~/components/common/CursorFX.vue'),
		},
		mixins: [ EmitSound, HashGenerator ],
		props: {
			type: {
				type: String,
				default: 'button',
			},
			link: {
				type: String,
				default: '',
			},
			scheme: {
				type: String,
				default: 'light'
			} as PropOptions<'light' | 'dark'>,
			indicator: {
				type: Boolean,
				default: false,
			},
			sound: {
				type: Boolean,
				default: true,
			}
		},
		data() {
			return {

				soundHash: ''

			}
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

			const ELEMENT = this.$refs.button as HTMLElement;

			if ( this.type === 'a' ) {
				ELEMENT.setAttribute('href', this.link)
			}

			if ( this.sound ) {
				ELEMENT.addEventListener('mouseenter',  () => this.playSound(this.Sounds.get('Element::Hover')));
				ELEMENT.addEventListener('click',       () => this.playSound(this.Sounds.get('Element::Action')));
			}

		}
	})

</script>
