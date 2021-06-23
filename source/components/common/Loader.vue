<template>

	<transition name="opacity-transition">
		<section v-if="!LoaderState.Status.Loaded" class="loader-container">

			<i />
			<span>{{ LoaderState.Message }}</span>

		</section>
	</transition>

</template>

<style lang="scss">

.loader {
	&-container {

		position: absolute;
		width: 100%; height: 100%;

		z-index: 1000;

		display: inline-grid;

		background: {
			color: rgba(var(--color-def-1), .95)
		}

		row-gap: 2vh;

		justify: {
			content: center;
		}

		aligh: {
			content: center;
		}

		i {

			align-self: end;
			justify-self: center;

			$s: 40px;

			height: $s; width: $s;

			border-radius: 3px;
			box-shadow: 0px 0px 0px 1px rgb(var(--color-def-6));
			transform: rotate(45deg);

			animation-timing-function: ease-in-out;
			animation: Loader 2s infinite;
			@keyframes Loader {
				0% {
					transform: rotate(45deg);
					box-shadow: 0px 0px 0px 1px rgb(var(--color-def-5));
					border-radius: 10px;
				}
				25% {
					transform: rotate(90deg) scale(1.15);
					box-shadow: 0px 0px 0px 4px rgb(var(--color-def-5));
					border-radius: 50px;
				}
				50% {
					transform: rotate(135deg);
					box-shadow: 0px 0px 0px 1px rgb(var(--color-def-5));
					border-radius: 10px;
				}
				75% {
					transform: rotate(180deg) scale(1.15);
					box-shadow: 0px 0px 0px 4px rgb(var(--color-def-5));
					border-radius: 50px;
				}
				100% {
					transform: rotate(225deg);
					box-shadow: 0px 0px 0px 1px rgb(var(--color-def-5));
					border-radius: 10px;
				}
			}

		}

		span {
			font: {
				size: var(--font-size-5);
				weight: 700;
			}
		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

	// VUEX
	import { mapState } from 'vuex'

	// TYPES
	import type { VuexModules } from '~/typescript/VuexModules.ts'

	// MODULE
	export default Vue.extend({
		computed: {

			...mapState({
				LoaderState: state => (state as VuexModules).Loader
			}),

		}
	})

</script>
