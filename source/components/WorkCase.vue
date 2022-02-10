<template>
	<section class="workcase-container">
		<div class="workcase-description">
			<div class="workcase-description-header">
				<span>{{ content.name }}</span>
				<span>Срок выполнения: {{ content.time }}</span>
			</div>
			<div class="workcase-description-body">
				<div class="workcase-description-body-item">
					<h6>Тематика</h6>
					<span>{{ content.theme }}</span>
				</div>
				<div class="workcase-description-body-item">
					<h6>Тех. задание</h6>
					<span>{{ content.tech_request }}</span>
				</div>
				<div class="workcase-description-body-item">

					<h6>Ссылка на продукт</h6>

					<template v-if="content.link.length">
						<a :href="content.link">{{ content.link }}</a>
					</template>

					<template v-else>
						<span>Не имеет</span>
					</template>

				</div>
				<div class="workcase-description-body-item">
					<h6>Стоимость</h6>
					<span>{{ content.cost }} ₽</span>
				</div>
			</div>
		</div>
		<div class="workcase-content">
			<eccheuma-swiper 
				class="workcase-content-swiper" 
				:options="{ buttons: true }" 
				:forcedIndex="CarouselIndex"
				@active-index="setCurentIndex"
				>

				<template #icon-prev="{ onEdge }">
					<!-- @click="playSound(Sounds.get('CarouselButton'))"  -->
					<button 
						class="workcase-content-swiper-buttons" 
						:class="[
							{ onEdge }, { 'utils::glassy': BROWSER && !$isMobile && $PIXI.utils.isWebGLSupported() }
						]"
						>
						<icon name="Arrow" style="transform: rotate(0deg)" />
					</button>
				</template>

				<template #icon-next="{ onEdge }">
					<!-- @click="playSound(Sounds.get('CarouselButton'))"  -->
					<button 
						class="workcase-content-swiper-buttons" 
						:class="[
							{ onEdge }, { 'utils::glassy': BROWSER && !$isMobile && $PIXI.utils.isWebGLSupported() }
						]"
						>
						<icon name="Arrow" style="transform: rotate(180deg)" />
					</button>
				</template>

				<template #default>
					<section v-for="(item, index) in content.images" :key="index" class="workcase-content-swiper-item">
						<vue-image
							style="height: 100%; width: 75%; margin: auto"
							:content="{ path: item.content.path }"
							:sections="{ date: false, description: false, zoom: true }"
							:property="{ fit: 'cover', type: 'default', collumn: 7 }"
						>
							{{ content.name }}
						</vue-image>
					</section>
				</template>

			</eccheuma-swiper>
			<div class="workcase-content-preview">

				<!-- <noise-filter :key="`filter-${index}`" :name="`WPF-${ index }`" :status="CarouselIndex !== index" /> -->
				<!-- :style="`filter: url(#filter::WPF-${ index })`" -->

				<template v-for="(item, index) in content.images">
					<vue-image
						:key="index"
						:class="{ faded: CarouselIndex !== index }"
						:content="{ path: item.content.path }"
						:sections="{ date: false, description: false, zoom: false }"
						:property="{ fit: 'cover', type: 'default', collumn: 7 }"
						@click.native="forceCarouselIndex(index)"
					>
						<!---->
					</vue-image>
				</template>

			</div>
		</div>
		<div class="workcase-rate">
			<div class="workcase-rate-voice">
				<span>{{ rating }}</span>
				<span>Оценка</span>
			</div>
			<div class="workcase-rate-thoughs">
				<h6>Отзыв</h6>
				<hr v-once>
				<p>{{ content.description }}</p>
			</div>
		</div>
	</section>
</template>

<style lang="scss">

	.workcase {
		&-container {

			@include component-shadow;
			@include gradient-border;

			display: grid;
			grid-template: {
				columns: 3fr 9fr;
				areas:  "desc body"
								"rate rate"
			};

			width: 100%;

			padding: 2vh 1vw;
			gap: 2vh;

			background-color: rgb(var(--color-mono-300));
			border-radius: var(--border-radius);

			@extend %pattern-lines;

		}
		&-description {

			display: flex;
			flex-direction: column;
			gap: 2vh;

			&-header {

				display: grid;
				background-color: rgb(var(--color-mono-200));
				border-radius: var(--border-radius);

				padding-block: 2vh;

				place-content: center;

				span {

					display: block;
					text-align: center;

					&:first-child {

						font: {
							family: var(--decor-font);
							size: var(--font-size-24);
							weight: 500;
						}

						letter-spacing: .15ch;

					}

					&:last-child {
						font: {
							size: var(--font-size-16)
						}
					}

				}
			}

			&-body {
				display: flex;
				flex-direction: column;
				gap: 2vh;

				height: 100%;
				width: 100%;

				min-height: 30vh;

				border-radius: var(--border-radius);

				padding: 4vh 2vw;

				background-color: rgb(var(--color-mono-200));

				&-item {
					
					h6 {
						font: {
							size: var(--font-size-20);
							weight: 900;
						}
					}

					span {
						padding-left: 1vw;
						font: {
							size: var(--font-size-16);
							weight: 500;
						}
					}

				}
			}

		}
		&-content {

			position: relative;
			overflow: hidden;

			display: flex;
			flex-direction: column;

			gap: 2vh;

			&-swiper {

				width: 100%;
				height: 100%;
				min-height: 30vh;
				margin-inline: auto;
				padding-inline: 0 15%;
				border-radius: var(--border-radius);
				overflow: hidden;

				&-item {
					display: inline-grid;
				}

				&-buttons {
			
					cursor: pointer;
					color: rgb(var(--color-mono-1000));
					background-color: rgba(var(--color-mono-200), .75);
					border: 1px solid rgba(var(--color-mono-1000), .0);
					border-radius: var(--border-radius);
					padding: 0 3vh;
					transition-duration: .5s;

					height: 100% !important;
					top: 0 !important;

					&:nth-of-type(1) {
						left: 0 !important;
					}
					&:nth-of-type(2) {
						right: 0 !important;
					}

					i {
						fill: var(--color-accent-edges-200);
					}

					&:hover {
						background-color: rgba(var(--color-mono-200),.0);
						&:nth-of-type(1) {
							box-shadow: 1px 0px 0px 0px rgba(var(--color-mono-1000),.25)
						}
						&:nth-of-type(2) {
							box-shadow: -1px 0px 0px 0px rgba(var(--color-mono-1000),.25)
						}
					}

				}

			}

			&-preview {

				height: 25vh;
				width: 100%;
				background-color: rgb(var(--color-mono-200));
				border-radius: var(--border-radius);
				padding: 2vh 1vw;

				display: grid;
				gap: 10px;
				place-content: center;

				// overflow-x: scroll;
				grid-template-columns: repeat(auto-fit, 160px);
				grid-template-rows: 10vh;

				> * {
					cursor: pointer;
					transition-duration: 500ms;
				}

				.faded {
					opacity: .1;
					transform: translateY(1vh)
				}

			}

		}
		&-rate {

			grid-area: rate;

			display: grid;
			grid-template: {
				columns: auto 1fr;
			};

			padding: 2vh 1vw;
			column-gap: 2vw;

			background-color: rgb(var(--color-mono-200));
			border-radius: var(--border-radius);

			&-voice {

				@include gradient-border;

				aspect-ratio: 1/1;
				height: 20vh;
				background-color: rgb(var(--color-mono-300));
				border-radius: var(--border-radius);

				display: flex;
				flex-direction: column;
				place-content: center;
				place-self: center;

				@extend %pattern-lines;

				span {

					display: block;
					text-align: center;

					&:first-child {

						font: {
							family: var(--decor-font);
							size: 5vh;
							weight: 500;
						}
						
						letter-spacing: .15ch;
						margin-left: .25ch;
						line-height: 5vh;

					}

					&:last-child {
						font: {
							size: var(--font-size-20);
							weight: 800;
						}
					}

				}

			}

			&-thoughs {

				h6 {

					font: {
						family: var(--decor-font);
						size: var(--font-size-36);
						weight: 500;
					}

					letter-spacing: .15ch;

				}

				hr {
					margin: 1vh 0;
					background: rgb(var(--color-mono-400));
				}

				p {
					color: rgb(var(--color-mono-900));
					width: 65ch;
					font: {
						family: var(--read-font);
						size: var(--font-size-18);
						weight: 500;
					}
				}
			}
		}
	}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapState } from 'vuex';

	// TYPES
	import type { WORKCASE, CONTENT } from '~/typescript/WorkCase';

	// VUEX MODULE TYPE MAP
	import type { VuexMap } from '~/typescript/VuexMap';

	// COMPONENTS
	import EccheumaSwiper from '~/components/common/Carousel.vue';
	import Icon 					from '~/components/common/Icon.vue';

	// MIXINS
	import IntersectionObserver from '~/assets/mixins/IntersectionObserver';

	// MODULE
	export default Vue.extend({
		components: {
			EccheumaSwiper,
			Icon,
			VueImage: () => import('~/components/image/Image.vue')
		},
		mixins: [ IntersectionObserver ],
		props: {
			content: 		{ type: Object, required: true  } as PropOptions<CONTENT >,
			properties: { type: Object, required: true  } as PropOptions<WORKCASE['properties'] >,
			rating: 		{ type: Number, default: 8.5    } as PropOptions<WORKCASE['rating'] >
		},
		data() {
			return {
				CarouselIndex: 0,
			}
		},
		computed: {
			...mapState({
				UI: state => (state as VuexMap).App.UI,
			}),

		},
		methods: {

			setCurentIndex(index: number) {
				this.CarouselIndex = index;
			},

			forceCarouselIndex(index: number) {
				this.CarouselIndex = index; console.log(index)
			}

		}
	})

</script>
