<template>
	<div class="search-wrap">
		<input v-model="SearchInput" type="text" placeholder="Поиск по сайту">
	</div>
</template>

<script>

  export default {
		data() {
			return {
				SearchInput: '',
			}
		},
  }
</script>

<style lang="scss">

.search {
	&-wrap {
		
		position: relative;

		input {
			border-radius: .7rem;
			width: 100%;
			background: {
				color: rgb(var(--color-5));
			}

			text-align: center;
			font: {
				size: var(--font-size-4);
				weight: 700;
			}

			line-height: 4vh;

		}
	}
}

</style>
