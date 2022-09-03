<template>
	<div :id="`search-${ hash }`" class="search-wrap" @mouseenter.once="preparedInteraction = true">

		<div class="search-container" :class="{ process: inProcess }">
			<input 
				ref="input"
				v-model="userRequest" 
				type="text" 
				placeholder="Поиск по сайту" 
				@input="inputSound" 
				@change="searchData"
			>
			<icon name="Search" />
		</div>

		<transition name="verticalSlide-transition">
			<div v-if="preparedInteraction && userRequest && result" class="search-results">
				<h6>Результаты</h6>
				<hr>
				<span>
					По запросу "<i>{{ userRequest }}</i>" ничего не найдено. Простите.
				</span>
			</div>
		</transition>

	</div>
</template>

<style lang="scss">

.search {
	&-wrap {
		position: relative;

		@keyframes inProgress {
			from {
				border-color: var(--color-accent-edges-100);
			}
			to {
				border-color: var(--color-accent-edges-200);
			}
		}

		.process {

			@include component-shadow;

			animation: inProgress 250ms ease-in-out 0s infinite alternate;
			transform: translateY(-1vh);
		}

	}
	&-container {

		position: relative;
		display: inline-flex;
		align-items: center;

		background: rgb(var(--color-mono-300));
		color: rgb(var(--color-mono-900)); 
		border: 2px solid var(--color-accent-edges-100);
		border-radius: var(--border-radius);

		width: 100%;
		padding: 1vh 1vw;
		overflow: hidden;

		transition-duration: 500ms;
		transition-property: transform;

		input {

			width: 100%;
			background: inherit;
			color: inherit; 
			border: unset;

			font: {
				size: var(--font-size-14);
				weight: 600;
			}

			line-height: var(--font-size-14);

			&:focus {
				outline: 0px solid transparent !important;
			}

		}

		i { @include icon-size(3.5vh);

			cursor: pointer;

			padding: {
				right: 2.5vw;
			}

			fill: transparent;
			stroke: var(--color-accent-edges-300);

    }

		&:focus {
			outline: 2px solid rgb(var(--color-accent-pass)) !important;
		}

	}
	&-results {

		@include component-shadow;
		@include gradient_border;

		position: absolute;
		top: -22vh;
		height: 20vh;
		width: 100%;
		background: rgb(var(--color-mono-200), 0.75);
		border-radius: var(--border-radius);

		padding: 2vh 2vw;

		backdrop-filter: blur(20px);

		display: flex;
		flex-direction: column;
		place-content: center;
		place-items: center;

		text-align: center;

		h6 {

			font: {
				family: var(--decor-font);
				size: var(--font-size-32);
			}

			letter-spacing: .15ch;
			line-height: var(--font-size-32);

		}

		hr {
			margin: 1vh;
			background-color: var(--color-accent-edges-100);
			width: 100%;
		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue';

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound';

	// COMPONENTS
	import Icon			from '~/components/common/Icon.vue';

	// MODULE
	export default Vue.extend({
		components: {
			Icon, 
		},
		mixins: [ EmitSound ],
		data() {
			return {

				inProcess: false,

				preparedInteraction: false,
				userRequest: String() as string,

				result: null as any,

				hash: Math.random().toString(36).substr(2),

			};
		},
		watch: {
			userRequest: {
				handler() {
					this.result = null;
				}
			},
			result: {
				handler() {
					setTimeout(() => {
						this.result = null;
					}, 15000);
				}
			}
		},
		mounted() {

			const watcherPrepared = this.$watch('preparedInteraction', () => {

				this.setSounds([
					{ file: 'On', 	name: 'Input::Increment',  settings: { rate: 1.00, volume: 0.25 } },
					{ file: 'Off', 	name: 'Input::Decrement',  settings: { rate: 1.00, volume: 0.25 } },
				]);

				watcherPrepared();

			});
	
		},
		methods: {
			inputSound({ data }: InputEvent) {
				this.playSound(this.Sounds.get(data ? 'Input::Increment' : 'Input::Decrement'));
			},
			searchData() {

				if ( this.userRequest ) {

					this.inProcess = true;
	
					setTimeout(() => {
						this.result = 'NOTHING'; this.inProcess = false;
					}, 5000);
					
				}

			}
		}
	});

</script>
