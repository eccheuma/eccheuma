<template>
	<nav class="page_selector" :key="$route.path">

		<nuxt-link class="page_selector-link" tag="span"
			:class="{ not_active_link: PageSelector.Page == 1 }"   
			:to="`/${ payload.section }/page_${ PageSelector.Page - 1 }${ payload.params ? `?${ payload.params }` : '' }`">
			{{ PrevPageName }}
		</nuxt-link>

		<span class="page_selector-link"
			style="pointer-events: none; color: #FFF">
			Cтраница {{ PageSelector.Page }} 
		</span>

		<nuxt-link class="page_selector-link" tag="span"
			:class="{ not_active_link: PageSelector.Page == PageSelector.PageQuantity }"  
			:to="`/${ payload.section }/page_${ PageSelector.Page + 1 }${ payload.params ? `?${ payload.params }` : '' }`">
			{{ NextPageName }}
		</nuxt-link>

	</nav>
</template>

<style lang="scss">

.page_selector {
	display: grid; z-index: 1000;
	grid-template-columns: repeat(3, 1fr);
	justify-content: center;
	background-color: $color1;
	border-top: 1px solid $color2;
	text-align: center;
	padding: 0 10vw;
	@media screen and ( max-width: $MobileBreakPoint ) {
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
		color: $color4;
		font-size: 10px;
		font-weight: 700;
		border-radius: 12px;
		margin-bottom: 6px;
		transition-duration: .25s;
		&:before {
			content: '';
			display: block;
			position: absolute;
			top: -1px;
			width: 100%;
			height: 1px;
			opacity: 0;
			background: linear-gradient(90deg, rgba($color5,.0) 0%, rgba($color5,1) 50%, rgba($color5,.0) 100%) !important;
			transition-duration: .5s;
		}
		&:hover {
			text-decoration: none;
			color: $color5;
			&:before {
				opacity: 1;
			}
		}
	}
}

</style>
 
<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	import { mapState, mapMutations } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

	type PageSelectorProperty = {
		scrollTarget: number
		section: string
		collumns: number
		params?: string
	}

	export default Vue.extend({
		props: {
			payload: {
				type: Object,
				required: true
			} as PropOptions<PageSelectorProperty>
		},
		data() {
			return {

				PrevPageName: "Предыдущая",
				NextPageName: "Следующая",

				DownPageStatus: true,
				UpPageStatus: false

			}
		},
		computed: {
			...mapState({
				PageSelector: (state: any) => ( state as VuexModules).PageSelector
			}),
		},
		methods: {

			ChangePage(direction: any) {
				window.scrollTo({
					top: this.payload.scrollTarget,
					left: 0,
					behavior: 'smooth'
				})
			},

		},
		updated() {

			this.NextPageName = ( this.PageSelector.Page >= ( this.PageSelector.PageQuantity - 1 ) ? "Последняя" : "Следующая" )
			this.PrevPageName = ( this.PageSelector.Page <= 2 ) ? "Начальная" : "Предыдущая"
			
		}
	})

</script>