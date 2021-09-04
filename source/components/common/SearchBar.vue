<template>
	<div class="search-wrap" @mouseenter.once="preparedInteraction = true">
		<input v-model="searchData" type="text" placeholder="Поиск по сайту">
		<icon name="Search" />
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

	// COMPONENTS
	import Icon	from '~/components/Icon.vue'

	// MODULE
	export default Vue.extend({
		components: {
			Icon
		},
		mixins: [ EmitSound ],
		data() {
			return {

				preparedInteraction: false,
				
				searchData: '' as string,

			}
		},
		watch: {
			searchData: {
				handler(n: string, o: string) {
					this.playSound(this.Sounds.get(n.length > o.length ? 'Input::Increment' : 'Input::Decrement'))
				}
			}
		},
		mounted() {

			const watcherPrepared = this.$watch('preparedInteraction', () => {

				console.log('watcherPrepared');

				this.setSounds([
					{ file: 'On', 	name: 'Input::Increment',  settings: { rate: 1.00, volume: 0.25 } },
					{ file: 'Off', 	name: 'Input::Decrement',  settings: { rate: 1.00, volume: 0.25 } },
				])

				watcherPrepared();

			})
	
		},
	})

</script>

<style lang="scss">

.search {
	&-wrap {

		position: relative;
		display: inline-flex;
		align-items: center;

		background: rgb(var(--color-mono-300));
		color: rgb(var(--color-mono-800)); 
		border: 1px solid var(--color-accent-edges-100);
		border-radius: var(--border-radius);

		width: 100%;
		padding: 1vh 1vw;
		overflow: hidden;

		input {

			width: 100%;
			background: inherit;
			color: inherit; 
			border: unset;

			font: {
				size: var(--font-size-14);
				weight: 800;
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

			--svg-fill: transparent;

    }

		&:focus {
			outline: 2px solid rgb(var(--color-accent-pass)) !important;
		}

	}
}

</style>
