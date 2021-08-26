<template>
	<div class="search-wrap">
		<input v-model="SearchInput" type="text" placeholder="Поиск по сайту">
		<icon name="Search" />
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	// COMPONENTS
	import Icon									from '~/components/Icon.vue'

	// MODULE
	export default Vue.extend({
		components: {
			Icon
		},
		data() {
			return {
				SearchInput: ''
			}
		}
	})

</script>

<style lang="scss">

.search {
	&-wrap {

		position: relative;
		display: inline-flex;
		align-items: center;

		width: 100%;
		background: rgb(var(--mono-800));
		color: rgb(var(--mono-200)); 
		border-radius: .7rem;

		overflow: hidden;

		input {

			width: 100%;

			background: {
				color: rgb(var(--mono-800));
			}

			border: 0px solid transparent;

			padding: 0 1vw;

			font: {
				size: var(--font-size-14);
				weight: 800;
			}

			line-height: 4vh;

			&:focus {
				outline: 0px solid transparent !important;
			}

		}

		i { @include icon-size(3.5vh);

			cursor: pointer;

			padding: {
				right: 2.5vw;
			}

			background: {
				color: rgb(var(--mono-400));
			};

    }

		&:focus {
			outline: 2px solid rgb(var(--color-accent-pass)) !important;
		}

	}
}

</style>
