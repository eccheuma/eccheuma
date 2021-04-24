<template>
	<nav :key="$route.path" class="pagination">

		<nuxt-link
			tag="span" 
			class="pagination-link"
			:class="{ disabled: PageSelector.Page == 1 }"  
			:to="getPath(PageSelector.Page - 1)"  
			>
			{{ PageSelector.Page - 1 === 1 ? 'Начальная' : 'Предыдущая' }}
		</nuxt-link>

		<span 
			class="pagination-link"
			style="pointer-events: none; color: #FFF"
			>
			Cтраница {{ PageSelector.Page }} 
		</span>

		<nuxt-link 
			tag="span"
			class="pagination-link"
			:class="{ disabled: PageSelector.Page == PageSelector.PageQuantity }"  
			:to="getPath(PageSelector.Page + 1)" 
			>
			{{ PageSelector.Page + 1 === PageSelector.PageQuantity ? 'Последняя' : 'Следующая' }}
		</nuxt-link>

	</nav>
</template>

<style lang="scss">

.pagination {
	display: grid; z-index: 1000;
	grid-template-columns: repeat(3, 1fr);
	justify-content: center;
	background-color: rgb(var(--color-1));
	border-top: 1px solid rgb(var(--color-2));
	text-align: center;
	padding: 0 10vw;

	width: calc(max(60vw, 360px));
	margin: 0 auto;

	@media screen and ( max-width: $mobile-breakpoint ) {
		padding: unset;
	}

	input {
		text-align: center;
		margin: 18px 0px;
		padding: 2px 10%;
		font-size: 12px;
		font-weight: 700;
		border-radius: .7rem;
		border: 1px solid grey;
	}
	i {
		margin-top: 25px;
		display: block;
		border-radius: .7rem;
		width: 4px;
		height: 12px;
		background-color: #505050;
	}
	&-link {
		position: relative;
		cursor: pointer;
		padding: 20px 0px;
		display: block;
		color: rgb(var(--color-4));
		font-size: var(--font-size-5);
		font-weight: 700;
		border-radius: 12px;
		margin-bottom: 6px;
		transition-duration: 500ms;
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: -1px;
			width: 100%;
			height: 1px;
			opacity: 0;
			background: linear-gradient(90deg, rgba(var(--color-6),.0) 0%, rgba(var(--color-6),1) 50%, rgba(var(--color-6),.0) 100%) !important;
			transition-duration: .5s;
		}
		&:hover {
			text-decoration: none;
			color: rgb(var(--color-6));
			&:before {
				opacity: 1;
			}
		}
	}
}

</style>
 
<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	import { mapState } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

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
