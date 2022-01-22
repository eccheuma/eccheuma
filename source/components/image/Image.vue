<template>
	<div class="eccheuma-image-wrapper">

		<modal 
			:v-if="Modal"
			:modalState="Modal" 
			:path="content.path"
			:title="content.title" 
			:description="content.description"
			@toggle-modal="() => this.Modal = !this.Modal" 
		/>

		<div 
			class="eccheuma-image-container"
			:class="`type::${ property && property.type || 'default' }`" 
			@mouseenter="ImageFocus = true" 
			@mouseleave="ImageFocus = false"
			>

			<section v-if="sections && sections.zoom" class="eccheuma-image-search">
				<transition name="eccheuma-image-transitions-search" mode="out-in">
					<span v-show="ImageFocus" @click="Modal = true">
						<icon name="Search" />
					</span>
				</transition>
			</section>

			<section ref="holder" class="eccheuma-image-picture">
				<picture>
					<source v-if="AVIF_SUPPORT" :srcset="Source.avif" type="image/avif">
					<img :src="Source.webp" :alt="content.description" ref="image">
				</picture>
			</section>

			<transition name="eccheuma-image-transitions-description" mode="out-in">
				<section v-if="sections && sections.description" v-show="ImageFocus" class="eccheuma-image-description utils::glassy">
					<span>
						<slot />
					</span>
					<span>
						{{ content.description }}
					</span>
				</section>
			</transition>

		</div>

		<tag v-if="sections && sections.date" :transparent="false" :light="true">
			{{ LocalDate.Day }} в {{ LocalDate.Time }}
		</tag>

	</div>
</template>

<style lang="scss">

	.eccheuma-image {

		&-wrapper {
		
			display: flex;
			flex-direction: column;
			align-items: center;

			gap: 2vh;

			.type\:\:gallery {
				height: 50vh !important;
			}

			.type\:\:promo {
				width: clamp(340px, 100%, 40vw) !important;
				margin: auto !important;
				aspect-ratio: 16/9;
			}

			.type\:\:case {
				height: 100% !important;
			}

			.type\:\:default {
				height: 100%;
			}

		}

		&-container {

			position: relative;
			display: grid;
		
			grid-template: {
				columns: 100%;
				rows: 2fr 8fr;
			};
		
			width: 100%;
			
			padding: 10px;

			border: 2px solid var(--color-accent-edges-100);		
			border-radius: var(--border-radius);
			overflow: hidden;

			background: rgb(var(--color-mono-300));

		}

		&-transitions {

			$dur: 500ms;
			$offset: 10px;

			&-search {	

				&-enter {

					opacity: 0;
					transform: translateY(-#{ $offset });

					&-active {
						transition: all $dur;
					}

					&-to {
						opacity: 1;
						transform: translateY(0vh);
					}

				}

				&-leave {

					opacity: 1;
					transform: translateY(0vh);

					&-active {
						transition: all $dur ease-in-out;
					}

					&-to {
						opacity: 0;
						transform: translateY(-#{ $offset });
					}

				}

			}

			&-description {

				&-enter {
					opacity: 0;
					transform: translateY($offset);

					&-active {
						transition: all $dur;
					}

					&-to {
						opacity: 1;
						transform: translateY(0vh);
					}
				}

				&-leave {
					opacity: 1;
					transform: translateY(0vh);

					&-active {
						transition: all $dur;
					}

					&-to {
						opacity: 0;
						transform: translateY($offset);
					}
				}

			}

		}

		&-search {
			position: relative;
			z-index: 1;
			span {
				background: rgba(var(--color-mono-200), .75);
				backdrop-filter: blur(10px);
				width: fit-content;
				height: fit-content;
				padding: 5px;
				display: block;
				margin: auto;
				border-radius: var(--border-radius);

				cursor: pointer;

				i {
					@include icon-size(24px);
					fill: transparent;
					stroke: rgb(var(--color-mono-900));
				}


				transition-duration: 250ms;
				&:hover {
					padding: 5px 25px;					
				}

			}
		}

		&-picture {

			position: absolute;

			top: 0;
			left: 0;

			height: 100%;
			width: 100%;

			background: {
				size: cover;
				repeat: no-repeat;
				position: center;
			}

			img {
				width: 100%;
				height: 100%;
				object-fit: cover;
			}

		}

		&-description {

			background: rgba(var(--color-mono-200), .75);
			color: rgb(var(--color-mono-900));

			border-radius: var(--border-radius);

	    position: relative;
			z-index: 1;

	    height: fit-content;
	    padding: 2vh 1vw;
			align-self: end;

			span {
				display: block;
				&:nth-of-type(1) {
					font-size: var(--font-size-20);
					font-weight: 800;
				}
				&:nth-of-type(2) {
					font-size: var(--font-size-14)
				}
			}

		}

	}

</style>
 
<script lang="ts">

	import Vue, { PropOptions } from 'vue';

	// VUEX
	import { mapActions, mapState } from 'vuex'

	// TYPES
	import type { DirectionOptions, AnimeCallBack } from 'animejs'
	import type { FORMATED_DATE } 									from '~/store'
	import type { IMAGE_PROPERTY, IMAGE_URL } 			from '~/typescript/Image'

	// VUEX MAP
	import type { VuexModules } from '~/typescript/VuexModules'

	// COMPONENTS
	import Icon 			from '~/components/common/Icon.vue';
	import Tag				from '~/components/common/Tag.vue'
	
	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

	// VARS
	const PLACEHOLDER: IMAGE_URL = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src
	}

	const defaultSections: IMAGE_PROPERTY['sections'] = {
		date: false,
		description: false,
		zoom: true,
	}

	const defaultProperty: IMAGE_PROPERTY['property'] = {
		fit: 'cover',
		type: 'gallery',
		collumn: 'auto',
	}

	// MODULE
	export default Vue.extend({
		components: {
			Icon,
			Tag,
			Modal: () => import('~/components/image/Modal.vue')
		},
		mixins: [ EmitSound ],
		props: {
			content: 	{ type: Object, required: true  } as PropOptions<IMAGE_PROPERTY['content']>,
			property: { type: Object, required: false, default() { return defaultProperty } } as PropOptions<IMAGE_PROPERTY['property']>,
			sections: { type: Object, required: false, default() { return defaultSections } } as PropOptions<IMAGE_PROPERTY['sections']>,
		},
		data() {
			return {

				LocalDate: new Object() as FORMATED_DATE,

				Source: PLACEHOLDER as IMAGE_URL,

				Modal: false,
				ImageFocus: false,

			}
		},
		computed: {
			...mapState({
				AVIF_SUPPORT: state => (state as VuexModules).Images.AVIF_SUPPORT
			})
		},
		watch: {
			'content.path': {
				handler() {
					if ( this.BROWSER ) {
						this.$nextTick(() => requestAnimationFrame(this.getImage))
					}
				}
			},
		},
		created() {

			// this.setSounds([
			// 	{
			// 		file: 'On',
			// 		name: 'ImageSearchIcon',
			// 		settings: { rate: .5, volume: .25 }
			// 	},
			// 	{
			// 		file: 'Tap',
			// 		name: 'ImageToggleModal',
			// 		settings: { rate: 1.25 }
			// 	}
			// ])

		},
		async mounted() {
			if ( process.client ) {

				this.LocalDate = await this.GetLocalTime(this.content.date);

				const interesection = new IntersectionObserver((entry) => {
					if ( entry[0].isIntersecting )  {
						this.$nextTick(() => this.getImage()); interesection.unobserve(this.$el as HTMLElement);
					}
				}, { rootMargin: `${ window.innerHeight / 2 }px` })

				interesection.observe(this.$el as HTMLElement);

			}
		},
		methods: {
			
			...mapActions({
				getImageURL: 	'Images/getImageURL',
				decodeImage:  'Images/decodeImage',
				GetLocalTime: 'GetLocalTime'
			}),

			async getImage(): Promise<void> {

				const IMAGE_CONTAINER = this.$refs.holder as Element

				const URL: IMAGE_URL = await this.getImageURL({ 
					_path: this.content.path,
					_size: IMAGE_CONTAINER?.getBoundingClientRect().width * window.devicePixelRatio || 720
				})

				if ( this.BROWSER && this.$PIXI.utils.isWebGLSupported() ) {
					this.prepareAnimations(IMAGE_CONTAINER, URL)
				} else {
					this.Source = URL;
				}

			},

			prepareAnimations(el: Element, url: IMAGE_URL) {

				const animation = el.animate([
					{ opacity: 1 },
					{ opacity: 0 }
				], {
					duration: 250,
					fill: 'both',
				})

				animation.onfinish = () => {

					animation.onfinish = null;

					this.Source = url;

					(this.$refs.image as HTMLImageElement).onload = () => animation.reverse();

				}

			},

		},
	})

</script>
