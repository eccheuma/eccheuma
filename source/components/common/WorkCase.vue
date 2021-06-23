<template>
	<section ref="case" class="work_case-wrap">
		<div class="work_case-container">
			<div class="work_case-about" :class="`interface-${ UI }`">

				<div class="work_case-about-header">
					<h5>{{ content.name }}</h5>
					<span>Срок выполнения: {{ content.time }}</span>
				</div>

				<div class="work_case-about-body">

					<section>
						<h6>Тематика:</h6>
						<span>{{ content.theme }}</span>
					</section> 

					<section>
						<h6>Техническое задание:</h6>
						<span>{{ content.tech_request }}</span>
					</section> 

					<section>
						<h6>Адрес на готовый продукт:</h6>
						<a :href="`https://${ content.link }`">{{ content.link }}</a>
					</section> 

					<section>
						<h6>Стоимость заказа:</h6>
						<span>{{ content.cost }} ₽</span>
					</section>

				</div>

			</div>
			<div class="work_case-content">

				<vue-image 
					v-for="(item, index) in content.images" 
					:key="`IMAGE-${ index }`"
					:class="$isMobile ? '' 
						: !index ? 'main' : 'other'
					"
					:style="$isMobile ? '' 
						: !index ? `grid-column: main / ${ content.images.length }` : ''
					"
					:content="item.content" 
					:sections="{ date: false, description: false, zoom: true }" 
					:property="{ fit: 'cover', type: 'case' }"
				>
					{{ content.name }}
				</vue-image>

			</div>
		</div>
	</section>
</template>

<style lang="scss">

.work_case {
	&-container {

		height: 60vh;

		margin: 5vh 1vw;

		column-gap: 15px;
		row-gap: 15px;

		display: grid;
		grid-template: {
			columns: 1fr 3fr;
			rows: 100%;
		}

		opacity: 0;

		@media screen and ( max-width: $mobile-breakpoint ) {

			max-height: unset;

			grid-template: {
				columns: 1fr;
				rows: min-content auto;
			}
		}

	}
	&-about {

		row-gap: 15px;

		display: grid;
		grid-template: {
			rows: min-content auto;
		}

		&-header {
			background-color: rgb(var(--color-6));
			padding: 20px 0px ;
			border-radius: .7rem;
			text-align: center;
			h5 {
				color: rgb(var(--color-2));
				font-weight: 700;
			}
			span {
				margin: 0;
				font-size: 10px;
				font-weight: 700;
				color: rgb(var(--color-3));
			}
		}
		&-body {

			@media screen and ( max-width: $mobile-breakpoint ) {
				padding-bottom: 100px;
			}

			position: relative;
			background-color: rgb(var(--color-6));
			padding: 10px 30px;
			border-radius: .7rem;
			section {
				display: block;
				h6 {
					margin-top: 10px;
					font-size: 14px;
					font-weight: 700;
					color: rgb(var(--color-3));
				}
				a {
					display: block;
					font-size: 12px; 
					font-weight: 700;
					color: rgb(var(--color-3));
					padding: 6px 15px;
					&:hover {
						color: rgb(var(--color-4))
					}
					&:empty {
						margin-top: 10px;
						padding: 0;
						height: 25px;
						pointer-events: none;
						&:before {
							padding: 10px 15px;
							content: "Не имеет.";
							font-size: 12px;
							font-weight: 700;
							color: rgb(var(--color-4));
						}
					}
				}
				span {
					font-size: 12px;
					font-weight: 700;
					color: rgb(var(--color-2));
					padding: 2px 15px;
				}
			}
		}
	}
	&-content {

		background-color: rgb(var(--color-2));

		border-radius: .7rem;

		padding: 2vh 10vw;

		row-gap: 1vh;
		column-gap: 1vw;

		display: grid;
		grid-template: {
			rows: 50% 50%;
			areas: 	"main"
							"other"
		}

		@media screen and ( max-width: $mobile-breakpoint ) {

			max-height: unset;

			grid-template: {
				columns: 1fr;
				rows: unset;
			}
		}

		.main {
			grid-row: main;
		}

		.other {
			grid-row: other;
		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapState } from 'vuex';

	// TYPES
	import type { AnimeAnimParams } 	from 'animejs'
	import type { WORKCASE, CONTENT } from '~/typescript/WorkCase.ts'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/typescript/VuexModules'

	// MIXINS
	import IntersectionObserver from '~/assets/mixins/IntersectionObserver.ts'

	// MODULE
	export default Vue.extend({
		components: {
			VueImage: () => import('~/components/common/ImageComponent/Image.vue')
		},
		mixins: [ IntersectionObserver ],
		props: {
			content: 		{ type: Object, required: true  } as PropOptions< CONTENT >,
			properties: { type: Object, required: true  } as PropOptions< WORKCASE['properties'] >,
		},
		computed: {
			...mapState({
				UI: state => (state as VuexModules).App.UI,
			})
		},
		mounted() {
			
			if ( !this.$isMobile || this.$PIXI.utils.isWebGLSupported() ) {

				this.setObserver(this.$refs.case as Element) 

			}

		},
		methods: {

			setObserver(elements: Vue | Vue[] | Element | Element[]) {

				const ANIMATION: {[key in 'in' | 'out']: AnimeAnimParams} = {
					in: {
						opacity: [0, 1],
						translateY: [100, 0],
						delay: 750,
					},
					out: {
						opacity: [1, 0],
						translateY: [0, 100]
					}
				}

				const SET = (el: Element) => this.initIntersectionObserver({ el, animation: ANIMATION, _options: { animation_target: el.firstElementChild! } })

				Array.isArray(elements) 
					? elements.forEach((node: Element | Vue) => SET((node as Vue).$el  || node)) 
					: SET((elements as Vue).$el || elements )

			},

		}
	})

</script>
