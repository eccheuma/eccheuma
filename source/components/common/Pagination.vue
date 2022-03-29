<template>
	<nav :key="$route.path" class="pagination">

		<nuxt-link
			tag="span" 
			:class="{ disabled: PageSelector.Page == 1 }"  
			:to="getPath(PageSelector.Page - 1)"  
		>
			{{ pageLabels.prev }}
		</nuxt-link>

		<span style="pointer-events: none">
			{{ PageSelector.Page }}-я cтраница из {{ PageSelector.PageQuantity }}-{{ getSuffix(PageSelector.PageQuantity) }} 
		</span>

		<nuxt-link 
			tag="span"
			:class="{ disabled: PageSelector.Page == PageSelector.PageQuantity }"  
			:to="getPath(PageSelector.Page + 1)" 
			>
			{{ pageLabels.next }}
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
		columns: repeat(3, minmax(160px, min-content));
	};

	border-radius: var(--border-radius);

	align-content: center;
	justify-content: center;

	span {

		position: relative;
		cursor: pointer;

		text-align: center;
		color: rgb(var(--color-mono-900));

		;
		font: {
			size: var(--font-size-24);
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

			background: linear-gradient(to left, transparent, rgb(var(--color-mono-900)), transparent);

			transition-duration: 250ms;

		}

		transition-duration: 250ms;
		&:hover {

			color: rgb(var(--color-mono-900));

			&::after {
				opacity: 1;
			}

		}

	}

}

</style>
 
<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapState } from 'vuex'

	// VUEX MAP
	import type { VuexMap } from '~/types/VuexMap'

	// UTILS
	import { getLocale, languages, russian } from '~/lang'

	// TYPES
	type PageSelectorProperty = {
		section: string
		params?: string
	}

	// MODULE
	export default Vue.extend({
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions<PageSelectorProperty>
		},
		computed: {
			...mapState({
				PageSelector	: state => (state as VuexMap).PageSelector,
				Lang					: state => (state as VuexMap).App.Lang,
			}),

			pageLabels(): { next: string, prev: string } {

				const locale = getLocale(this.Lang).Pagination;

				const next = this.PageSelector.Page + 1 >= this.PageSelector.PageQuantity
					? locale.last
					: locale.next

				const prev = 2 >= this.PageSelector.Page
					? locale.first
					: locale.prev

				return { next, prev }

			}

		},
		methods: {

			getPath(page: number) {

				const QUERY_PARAMS = this.payload.params ? `?${ this.payload.params }` : ''

				return `/${ this.payload.section }/page_${ page }${ QUERY_PARAMS }`

			},

			getSuffix(value: number) {
				switch (this.Lang) {
					case languages.Russian: return russian.getSuffix(value)
				}
			}

		},
	})

</script>
