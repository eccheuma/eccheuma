<template>
	<nav :key="$route.path" class="pagination">

		<nuxt-link
			tag="span" 
			:class="{ disabled: PageSelector.Page == 1 }"  
			:to="getPath(PageSelector.Page - 1)"  
		>
			{{ PageSelector.Page <= 2 ? 'Начальная' : 'Предыдущая' }}
		</nuxt-link>

		<span style="pointer-events: none">
			Cтраница {{ PageSelector.Page }} из {{ PageSelector.PageQuantity }} 
		</span>

		<nuxt-link 
			tag="span"
			:class="{ disabled: PageSelector.Page == PageSelector.PageQuantity }"  
			:to="getPath(PageSelector.Page + 1)" 
			>
			{{ PageSelector.Page + 1 === PageSelector.PageQuantity ? 'Последняя' : 'Следующая' }}
		</nuxt-link>

	</nav>
</template>

<style lang="scss">

$h: 10vh;

.pagination {

	@include gradient_border;
	@include component-shadow;

	height: $h;

	display: grid;
	grid-template: {
		columns: repeat(3, auto);
	};

  column-gap: 4vw;

	border-radius: .7rem;

	align-content: center;
	justify-content: center;

	span {

		position: relative;
		cursor: pointer;

		text-align: center;
		color: rgb(var(--color-mono-700));

		;
		font: {
			size: var(--font-size-2);
			weight: 500;
			family: var(--decor-font);
		}

		letter-spacing: .125ch;
		line-height: $h;

		&::after {

			opacity: 0;

			content: '';
			position: absolute;

			top: -1px; 
			left: 0;

			width: 100%; 
			height: 1px;

			background: linear-gradient(to left, transparent, rgb(var(--color-mono-800)), transparent);

			transition-duration: 250ms;

		}

		transition-duration: 250ms;
		&:hover {

			color: rgb(var(--color-mono-800));

			&::after {
				opacity: 1;
			}

		}

	}

}

</style>
 
<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	import { mapState } from 'vuex'

	import type { VuexModules } from '~/typescript/VuexModules'

	type PageSelectorProperty = {
		section: string
		params?: string
	}

	export default Vue.extend({
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions<PageSelectorProperty>
		},
		computed: {
			...mapState({
				PageSelector: (state: any) => ( state as VuexModules).PageSelector
			}),
		},
		methods: {

			getPath(page: number) {

				const QUERY_PARAMS = this.payload.params ? `?${ this.payload.params }` : ''

				return `/${ this.payload.section }/page_${ page }${ QUERY_PARAMS }`

			}

		},
	})

</script>
