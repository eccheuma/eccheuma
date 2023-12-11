<template>
	<nav :key="$route.path" class="pagination">

		<nuxt-link
			tag="span" 
			:class="{ disabled: PageSelector.Page == 1 }"  
			:to="getPath(PageSelector.Page - 1)"  
		>
			<icon v-if="$isMobile" name="Arrow" /> 
			<template v-else>
				{{ pageLabels.prev }}
			</template>
		</nuxt-link>

		<span style="pointer-events: none">
			{{ PageSelector.Page }}-я cтраница из {{ PageSelector.PageQuantity }}-{{ fmtSuffix(PageSelector.PageQuantity) }} 
		</span>

		<nuxt-link 
			tag="span"
			:class="{ disabled: PageSelector.Page == PageSelector.PageQuantity }"  
			:to="getPath(PageSelector.Page + 1)" 
			>
			<icon v-if="$isMobile" name="Arrow" style="transform: rotate(180deg)"/> 
			<template v-else>
				{{ pageLabels.next }}
			</template>
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

		border-radius: var(--border-radius);

		align-content: center;
		justify-content: center;
		align-items: center;

		column-gap: min(2vw,20px);
		
		.icon {
			fill: rgb(var(--color-mono-900));
			width: 40px;
			height: 40px;
		}

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

				top: 0px; 
				left: 0;

				width: 100%; 
				height: 1px;

				background: linear-gradient(to left, transparent, var(--color-accent-edges-300), transparent);

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

	import Vue, { PropOptions } from "vue";

	// VUEX
	import { mapState } from "vuex";

	// VUEX MAP
	import type { VuexMap } from "~/contracts/VuexMap";

	// UTILS
	import { getLocale, languages, russian } from "~/lang";

	// TYPES
	type PageSelectorProperty = {
		section: string
		params?: string
	}

	// CONSTANTS
	const RUSSIAN_CUSTOM_NUMERATOR: russian.types.CustomPlural = Array([ 3, "ёх" ], [ 4, "ёх" ], [ 11, "и" ]);

	// COMPONENTS
	import Icon from "~/components/common/Icon.vue";

	// MODULE
	export default Vue.extend({
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions<PageSelectorProperty>
		},
		components: {
			Icon
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
					: locale.next;

				const prev = 2 >= this.PageSelector.Page
					? locale.first
					: locale.prev;

				return { next, prev };

			},

		},
		methods: {

			getPath(page: number) {

				const QUERY_PARAMS = this.payload.params 
					? String("?").concat(this.payload.params)
					: String();

				return `/${ this.payload.section }/page_${ page }${ QUERY_PARAMS }`;

			},

			fmtSuffix(...[ value ]: Partial<Parameters<typeof russian.getSuffix>>) { 
				switch (this.Lang) {
					case languages.Russian: return russian.getSuffix(Number(value), ["ой", "ух", "и"], RUSSIAN_CUSTOM_NUMERATOR);
				}
			}

		},
	});

</script>
