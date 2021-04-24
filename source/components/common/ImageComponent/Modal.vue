<template>
	<portal v-if="modalState" to="Modal">

		<div 
			class="modal-wrap"
			:class="{ glassy: CLIENT_RENDER_CHECK && (!$isMobile || $PIXI.utils.isWebGLSupported()) }" 
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
						<img :src="URL" :style="Zoom ? zoomStyle : ''">
					</picture>

				</div>

				<div class="modal-footer">
					<eccheuma-button @click.native="Zoom = !Zoom">
						{{ Zoom ? 'Уменьшить' : 'Увеличить' }}
					</eccheuma-button>
					<eccheuma-button @click.native="ToggleModal">
						Закрыть
					</eccheuma-button>
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
		background-color: rgba(var(--color-1), .9);
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
    background-color: rgb(var(--color-2));
    border: 1px solid rgb(var(--color-3));
    border-radius: .7rem;
    margin: auto;

	}
	&-header {
		display: grid;
		width: 100%;
		text-align: center; 
		align-content: center;
		color: rgb(var(--color-6)); 
		background-color: rgb(var(--color-1));
		h6 {
			font: {
				size: var(--font-size-2);
				weight: 700;
			}
		}
		span {
			width: 100ch;
			margin: 0 auto;
			font-size: var(--font-size-4);
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
				background-color: rgb(var(--color-1));
				border: 1px solid rgb(var(--color-3));
			}
			&-thumb {
				border-radius: 2rem;
				background-color: rgb(var(--color-4));
				border: 2px solid rgb(var(--color-1));
				&:hover {
					background-color: rgb(var(--color-6))
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
		background-color: rgb(var(--color-1));
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	// VUEX
	import { mapActions } from 'vuex'

	// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules'

	// TYPES
	type PREVIEW_MODE = 'cover' | 'contain' | 'zoom'

	// VARIABLES
	const PLACEHOLDER = `${ require('~/assets/images/ImagePlaceholder.png?resize&size=1000')}`

	export default Vue.extend({
		components: {
			EccheumaButton: () => import('~/components/common/EcchuemaButton.vue')
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
			this.URL = await this.GetImageURL({ 
				_path: this.path
			})
		},
		methods: {

			...mapActions({
				GetImageURL: 'Images/GetImageURL',
			}),

			changeZoom(event: WheelEvent) {

				const STEP = 20;

				this.ZoomRate += (Math.sign(event.deltaY) > 0 ? STEP : -STEP );

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
