<template>
	<div class="eccheuma-image-wrapper">

		<modal 
			:v-if="Modal"
			:modalState="Modal" 
			:path="content.path"
			:title="content.title" 
			:description="content.description"
			@toggle-modal="() => Modal = !Modal" 
		/>

		<div 
			class="eccheuma-image-container"
			:class="`type::${ property ? property.type : 'default' }`" 
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
					<source :srcset="imageStruct.avif" type="image/avif">
					<img ref="image" :src="imageStruct.webp" :alt="content.description">
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

		<tag v-if="sections && sections.date" :transparent="false" theme="grey">
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
				// height: 50vh !important;
				aspect-ratio: 3/2;
				--fit-type: cover;
			}

			.type\:\:promo {
				// width: clamp(340px, 100%, 40vw) !important;
				width: 100%;
				margin: auto;
				aspect-ratio: 16/9;
			}

			.type\:\:case {
				height: 100% !important;
				--fit-type: contain;
			}

			.type\:\:default {
				width: 100%;
				aspect-ratio: 16/9;
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

			border: 1px solid var(--color-accent-edges-100);		
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
				object-fit: var(--fit-type, cover);
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

	// UTILS
	import { utils } from '~/utils';

	// TYPES
	import { Image } from '~/contracts/Image';

	// COMPONENTS
	import Icon from '~/components/common/Icon.vue';
	import Tag from '~/components/common/Tag.vue';
	
	// Helpers
	import { getOptimalImage } from './image.helpers';

	// Animations
	import { animations } from '~/animations';

	const { keyframes, options } = animations.common.opacityResolve(animations.common.AnimationMode.Short, true);

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound';

	// VARS
	const PLACEHOLDER: Image.formatsStruct = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src
	};

	const defaultSections: Image.struct['sections'] = {
		date: false,
		description: false,
		zoom: true,
	};

	const defaultProperty: Image.struct['property'] = {
		type: 'gallery',
	};

	// MODULE
	export default Vue.extend({
		components: {
			Icon,
			Tag,
			Modal: () => import('./submodules/modal.vue')
		},
		mixins: [ EmitSound ],
		props: {
			content: 	{ type: Object, required: true  } as PropOptions<Image.struct['content']>,
			property: { type: Object, required: false, default() { return defaultProperty; } } as PropOptions<Image.struct['property']>,
			sections: { type: Object, required: false, default() { return defaultSections; } } as PropOptions<Image.struct['sections']>,
		},
		data() {
			return {

				LocalDate: utils.getLocalTime(this.content.date),

				imageStruct: PLACEHOLDER as Image.formatsStruct,

				Modal: false,
				ImageFocus: false,

			};
		},

		watch: {
			'content.path': {
				async handler() {
					this.imageStruct = await this.getOptimalImage();
				}
			},
		},

		mounted() {

			if ( process.browser ) {

				const observerInstance = new IntersectionObserver(([ firstEntry ]) => {

					if ( firstEntry.isIntersecting ) {
						this.$nextTick( async () => {

							this.imageStruct = await this.getOptimalImage(); 
							observerInstance.unobserve(this.$el);

						});
					}

				});

				observerInstance.observe(this.$el);

			}

		},

		methods: {

			async getOptimalImage(): Promise<Image.formatsStruct> {

				const imageContainer = this.$refs.holder as HTMLElement;

				const image = await getOptimalImage(imageContainer, this.content.path);

				return this.application.context.browser && this.application.gpu.available()
					? await this.runAnimation(imageContainer, image)
					: image;

			},

			runAnimation(container: Element, struct: Image.formatsStruct): Promise<Image.formatsStruct> {

				return new Promise((res) => {

					const animation = container.animate(keyframes, options);

					animation.onfinish = () => { animation.onfinish = null;

						res(struct);

						(this.$refs.image as HTMLImageElement).onload = () => animation.reverse();

					};

				});

			},

		},

	});

</script>
