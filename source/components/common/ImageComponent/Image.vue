<template>
	<div class="eccheuma-image-wrapper">

		<modal 
			:v-if="Modal"
			:modalState="Modal" 
			:path="content.path"
			:title="content.title" 
			:description="content.description"
			@toggle-modal="ToggleModal" 
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

			<section ref="holder" class="eccheuma-image-picture" :style="`background-image: url(${ Source[ AVIF_SUPPORT ? 'avif' : 'webp' ] })`">
				<picture>
					<source v-if="AVIF_SUPPORT" :srcset="Source.avif" type="image/avif">
					<img class="utils::voided" :src="Source.webp" :alt="content.description">
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

		<tag v-if="sections && sections.date" :transparent="false">
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
	
		border-radius: .7rem;
		overflow: hidden;

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
			border-radius: .7rem;

			cursor: pointer;

			i {
				@include icon-size(24px);
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

	}

	&-description {

		background: rgba(var(--color-mono-200), .75);
		color: rgb(var(--color-mono-800));

		border-radius: .7rem;

    position: relative;
		z-index: 1;

    height: fit-content;
    padding: 2vh 1vw;
		align-self: end;

		span {
			display: block;
			&:nth-of-type(1) {
				font-size: var(--font-size-18);
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

	// COMPONENTS
	import Icon 			from '~/components/Icon.vue';
	import Tag				from '~/components/common/Tag.vue'
	
	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

	// TYPES
	import type { VuexModules } from '~/typescript/VuexModules'

	import type { FORMATED_DATE } 	from '~/store'
	import type { IMAGE_PROPERTY, IMAGE_URL } 			from '~/typescript/Image'
	import type { DirectionOptions, AnimeCallBack } from '~/../node_modules/@types/animejs'

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
			Modal: () => import('~/components/common/ImageComponent/Modal.vue')
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
					if ( this.CLIENT_RENDER_CHECK ) {
						this.$nextTick(() => requestAnimationFrame(this.getImage))
					}
				}
			},
			Modal: {
				handler() {
					this.playSound(this.Sounds.get('ImageToggleModal'))
				}
			}
		},
		created() {

			this.setSounds([
				{
					file: 'On',
					name: 'ImageSearchIcon',
					settings: { rate: .5, volume: .25 }
				},
				{
					file: 'Tap',
					name: 'ImageToggleModal',
					settings: { rate: 1.25 }
				}
			])

		},
		async mounted() {
			if ( this.CLIENT_RENDER_CHECK ) {

				this.LocalDate = await this.GetLocalTime(this.content.date)

				setTimeout(() => {
					this.$nextTick(() => requestAnimationFrame(this.getImage))
				}, 1000)

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

				if ( this.CLIENT_RENDER_CHECK && this.$PIXI.utils.isWebGLSupported() ) {
					this.prepareAnimations(IMAGE_CONTAINER, URL)
				} else {
					this.Source = URL;
				}

			},

			prepareAnimations(el: Element, url: IMAGE_URL) {

				const ANIMATION = (u_direction: DirectionOptions, cb?: AnimeCallBack ) => {
					this.$AnimeJS({

						targets: el,
						opacity: [1, 0],
						duration: 250,
						direction: u_direction,
						easing: 'linear',

						...cb

					})
				}

				ANIMATION('normal', {
					complete: () => { 

						this.Source = url;

						this.decodeImage(url).then(() => ANIMATION('reverse'))

					}
				})

			},

			ToggleModal() {

				this.Modal = !this.Modal;

			}

		},
	})

</script>
