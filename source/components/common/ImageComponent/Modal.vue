<template>
	<portal v-if="modalState" to="Modal">

		<div 
			class="modal-wrap"
			:class="{ 'utils::glassy': CLIENT_RENDER_CHECK && (!$isMobile || $PIXI.utils.isWebGLSupported()) }" 
			@mousewheel.prevent="changeZoom"
			@click.self="ToggleModal" 
		>
			<div class="modal-container">

				<section class="modal-header">
					<h6>{{ title || '' }}</h6>
					<span>{{ description || '' }}</span>
				</section>

				<div 
					ref="image"
					v-dragscroll="true"
					class="modal-body" 
					:style="`overflow: ${ Zoom ? 'scroll' : 'hidden' }`"
					:class="[
						{ 'grab': Zoom },
						{ 'grabbing': Grabbing && Zoom },
					]"
					@mousedown="Grab(true)" 
					@mouseup="Grab(false)"
					>
				
					<picture>
						<source :srcset="URL.avif" type="image/avif">
						<img :src="URL.webp" :style="Zoom ? zoomStyle : ''">
					</picture>

				</div>

				<div class="modal-footer">
					<common-button @click.native="Zoom = !Zoom">
						{{ Zoom ? 'Уменьшить' : 'Увеличить' }}
					</common-button>
					<common-button @click.native="ToggleModal">
						Закрыть
					</common-button>
				</div>

			</div>
		</div>

	</portal>
</template>

<style lang="scss" scoped>

.grab {
	cursor: grab;
}

.grabbing {
	cursor: grabbing;
}

.modal {
	&-wrap {
		position: fixed; top: 0; left: 0; z-index: 9999;
		height: 100vh; width: 100vw;
		background-color: rgba(var(--color-mono-200), .9);
		display: flex;
	}
	&-container {

		display: grid;
		
    grid-template: {
			columns: 1fr;
			rows: 2fr 8fr auto;
		}

    overflow: hidden;
    width: 75vw;
    height: 85vh;
    background-color: rgb(var(--color-mono-300));
    border: 1px solid rgb(var(--color-mono-400));
    border-radius: .7rem;
    margin: auto;

	}
	&-header {
		display: grid;
		width: 100%;
		text-align: center; 
		align-content: center;
		color: rgb(var(--color-mono-900)); 
		background-color: rgb(var(--color-mono-200));
		h6 {
			font: {
				size: var(--font-size-18);
				weight: 700;
			}
		}
		span {
			width: 100ch;
			margin: 0 auto;
			font-size: var(--font-size-14);
		}
	}
	&-body {
		$mar: 10px;
		margin: $mar;
		height: calc(100% - (#{$mar} * 2));
		width: calc(100% - (#{$mar} * 2));
		picture {
			img {
				width: 100%;
				height: 100%;
				padding: 10px;
				object-fit: contain;
				transition: all 250ms ease-in-out;
			}
		}
		&::-webkit-scrollbar {
			width: 10px;
			height: 10px;
			min-width: 5px;
			min-height: 5px;
			&-track {
				border-radius: 2rem;
				background-color: rgb(var(--color-mono-200));
				border: 1px solid rgb(var(--color-mono-400));
			}
			&-thumb {
				border-radius: 2rem;
				background-color: rgb(var(--color-mono-500));
				border: 2px solid rgb(var(--color-mono-200));
				&:hover {
					background-color: rgb(var(--color-mono-900))
				}
			}
			&-button {
				height: 0;
				width: 0;
			}
		}
	}
	&-footer {
		display: grid;
		width: 100%;
		margin: 0 auto; 
		padding: 4vh 25%;
		grid-template-columns: repeat(2, 1fr); 
		grid-column-gap: 20px;
		background-color: rgb(var(--color-mono-200));
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapActions } from 'vuex'
	import { IMAGE_URL } from '~/typescript/Image'

	// VUEX MODULE TYPE MAP
	// import type { VuexModules } from '~/typescript/VuexModules'

	// TYPES
	type PREVIEW_MODE = 'cover' | 'contain' | 'zoom'

	// VARIABLES
	const PLACEHOLDER: IMAGE_URL = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=1000&format=avif').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=1000&format=webp').src,
	}

	export default Vue.extend({
		components: {
			CommonButton: () => import('~/components/buttons/CommonButton.vue')
		},
		props: {
			modalState: { 
				type: Boolean,
				required: true, 
				default: false 
			} as PropOptions< boolean >,
			path: { 
				type: String,
				required: true 
			} as PropOptions< string >,
			title: {
				type: String,
				default: '',
				required: false,
			} as PropOptions< string >,
			description: {
				type: String,
				default: '',
				required: false,
			} as PropOptions< string >,
		},
		data() {
			return {

				URL: PLACEHOLDER,

				PreviewMode: 'contain' as PREVIEW_MODE,

				Grabbing: false,

				Zoom: false,
				ZoomRate: 150,

			}
		},
		computed: {
			zoomStyle(): { height: string, width: string } {

				return {
					height: `${ this.ZoomRate }%`,
					width: 	`${ this.ZoomRate }%`,
				}

			}
		},
		async created() {
			if ( this.CLIENT_RENDER_CHECK ) {
				this.URL = await this.getImageURL({ 
					_path: this.path,
					_size: 1440,
				}) as IMAGE_URL
			}
		},
		methods: {

			...mapActions({
				getImageURL: 'Images/getImageURL',
			}),

			changeZoom(event: WheelEvent) {

				const STEP = 20;

				if ( this.ZoomRate > 100 ) {
					this.ZoomRate += (Math.sign(event.deltaY) > 0 ? STEP : -STEP );
				}

			},

			ToggleModal() {
				this.$emit('toggle-modal', !this.modalState)
			},

			ChangePreviewMode(mode: PREVIEW_MODE): void {
				this.PreviewMode = mode
			},

			Grab(value: boolean) {

				if ( this.Zoom ) {
					this.Grabbing = value
				}

			}

		},
	})
</script>
