<template>
	<div class="image_wrapper">

		<template v-if="sections ? sections.zoom : false">
			<keep-alive>

				<modal 
					:modalState="Modal" 
					:path="content.path"
					:title="content.title" 
					:description="content.description"
					@toggle-modal="ToggleModal" 
				/>

			</keep-alive>
		</template>

		<div ref="ImageHolder" class="image_container" @mouseenter="ImageFocus = true" @mouseleave="ImageFocus = false">

			<template v-if="sections ? sections.zoom : false">
				<i class="fas fa-search" @mouseenter="EmitSound('On', { rate: .5, volume: .25 })" @click.self="ToggleModal" />
			</template>

			<picture @dblclick="ToggleModal">
				<img :src="Source" :alt="content.description" :class="`image_type-${ property ? property.type : 'default' }`">
			</picture>

			<template v-if="CLIENT_RENDER_CHECK && !$isMobile && sections ? sections.description : false">
				<transition name="DescriptionAnima">
					<section v-if="ImageFocus" :class="{ glassy: CLIENT_RENDER_CHECK && $PIXI.utils.isWebGLSupported() }">
						<span>{{ content.title }}</span>

						<slot /> 

					</section>
				</transition>
			</template>

		</div>

		<client-only>
			<template v-if="sections ? sections.date : false">
				<span class="image_date">
					{{ LocalDate.Day }} в {{ LocalDate.Time }}
				</span>
			</template>
		</client-only>

	</div>

</template>

<style lang="scss" scoped>

.DescriptionAnima {
	&-enter {
		opacity: 0;
		&-active {
			transform: translateY(5vh);
			transition: all .5s ease;
		}
		&-to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	&-leave {
		opacity: 1;
		&-active {
			transform: translateY(0);
			transition: all .5s ease;
		}
		&-to {
			opacity: 0;
			transform: translateY(5vh);
		}
	}
}

.image {
	&_type {
		&-gallery {
			height: 45vh;
			width: 100%;
			object-fit: cover;
		}
		&-promo {
			height: 50vh;
			width: 100%;
			object-fit: cover;
		}
		&-case {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}
	}
	&_date {
		margin: 10px auto; padding: 5px 1vw; 
		background-color: rgb(var(--color-1));
		text-align: center; font-size: var(--font-size-5);
		border-radius: .7rem;
	}
	&_wrapper {
		display: grid;
		grid-template-columns: 1fr;
	}
	&_container {
		position: relative;
		overflow: hidden;
		i { 
			$size: 30px;

			cursor: pointer;

			position: absolute; top: 10px; left: calc(50% - #{ $size / 2 });
			height: $size; width: $size;
			color: #FFFFFF; background-color: rgba(var(--color-1), .75);
			text-align: center; line-height: $size;
			border-radius: .7rem;
			opacity: .25;
			transition: all 100ms ease-in-out;
			&:hover {
				opacity: 1;
			}
		}
		picture {
			img {
				object-position: center;
				min-width: 250px;
				border-radius: .7rem;
			}
		}
		section {
			$pad: 10px;
			position: absolute; bottom: $pad; left: $pad;
			width: calc(100% - #{ $pad * 2 }); padding: 10px 20px;
			background-color: rgba(var(--color-1), .75); border-radius: .7rem;
			font-size: var(--font-size-4);
			span {
				font-size: var(--font-size-3); font-weight: 700;
				display: block; 
			}
		}
	}
}

</style>
 
<script lang="ts">

	import Vue, { PropOptions } from 'vue';

	// VUEX
		import { mapActions } from 'vuex'
	
	// MIXINS
		import EmitSound from '~/assets/mixins/EmitSound'

	// TYPES
		import type { FORMATED_DATE } 	from '~/store'
		import type { IMAGE_PROPERTY } 	from '~/types/Image.ts'

	// VARS
		const PLACEHOLDER = require('~/assets/images/ImagePlaceholder.png?resize&size=600').src

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

				Source: PLACEHOLDER,

				Modal: false,
				ImageFocus: false,

			}
		},
		watch: {
			'content.path': {
				handler() {
					if ( this.CLIENT_RENDER_CHECK ) {
						this.$nextTick(() => requestAnimationFrame(this.getImage))
					}
				}
			},
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
				GetImageURL: 'Images/GetImageURL',
				GetLocalTime: 'GetLocalTime'
			}),

			async getImage(): Promise<void> {

				const URL = await this.GetImageURL({ 
					_path: this.content.path,
					_size: (this.$refs.ImageHolder as HTMLElement)?.getBoundingClientRect().width * window.devicePixelRatio || 720
				})

				this.$AnimeJS({
					targets: this.$refs.ImageHolder,
					opacity: [1, 0],
					duration: 500,
					endDelay: 250,
					direction: 'alternate',
					easing: 'linear',
					update: (anime) => {
						if ( anime.progress === 100 ) {
							this.Source = URL
						}
					}
				})

			},

			ToggleModal() {
				this.Modal = !this.Modal; this.EmitSound('Tap', { rate: 1.25 })
			}

		},
	})

</script>