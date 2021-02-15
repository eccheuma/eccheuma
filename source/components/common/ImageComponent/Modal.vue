<template>
	<portal to="Modal" v-if="modalState">

		<div class="modal-wrap" @click.self="ToggleModal" :class="{ glassy: CLIENT_RENDER_CHECK && $PIXI.utils.isWebGLSupported() }">
			<div class="modal-container">

				<div class="modal-header">
					<slot />
				</div>

				<div class="modal-body" v-dragscroll="true"
					@mousedown="Grab(true)" @mouseup="Grab(false)"
					:style="`overflow: ${ Zoom ? 'scroll' : 'hidden' }`"
					:class="[
						{ 'grab': 		Zoom },
						{ 'grabbing': Grabbing && Zoom },
					]">
				
					<picture>
						<img :src="URL" :style="Zoom ? ZoomPrefs : ''">
					</picture>

				</div>

				<div class="modal-footer">
					<!-- <button>SOMETHING</button> -->
					<button @click.self="Zoom = !Zoom">{{ Zoom ? 'Уменьшить' : 'Увеличить' }}</button>
					<button @click.self="ToggleModal">Закрыть</button>
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

.glassy {
	backdrop-filter: blur(10px)
}

.modal {
	&-wrap {
		position: fixed; top: 0; left: 0; z-index: 9999;
		height: 100vh; width: 100vw;
		background-color: rgba($color1, .9);
	}
	&-container {
		position: relative; top: 5vh; left: 5vw; overflow: hidden;
		width: 	#{ 100vw - 10vw }; 
		height: #{ 100vh - 10vh }; 
		background-color: $color2;
		border: 1px solid $color3;
		border-radius: .7rem;
	}
	&-header {
		width: 100%; 
		line-height: 10vh; text-align: center; color: $color5; font-size: $FontSize2;
		background-color: $color1;
	}
	&-body {
		$mar: 10px;
		margin: $mar;
		height: calc(75% - (#{$mar} * 2));
		width: calc(100% - (#{$mar} * 2));
		picture {
			img {
				width: 100%;
				height: 100%;
				padding: 10px;
				object-fit: contain;
				transition: all 1s ease-in-out;
			}
		}
		&::-webkit-scrollbar {
			width: 10px;
			height: 10px;
			min-width: 5px;
			min-height: 5px;
			&-track {
				border-radius: 2rem;
				background-color: $color1;
				border: 1px solid $color3;
			}
			&-thumb {
				border-radius: 2rem;
				background-color: $color4;
				border: 2px solid $color1;
				&:hover {
					background-color: $color5
				}
			}
			&-button {
				height: 0;
				width: 0;
			}
		}
	}
	&-footer {
		// position: absolute; bottom: 0; left: 0;
		display: grid;
		width: 100%;
		margin: 0 auto; padding: 4vh 25%;
		grid-template-columns: repeat(2, 1fr); 
		grid-column-gap: 20px;
		background-color: $color1;
		button {
			@extend %button_light;
			width: 100%;
		}
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
	const PLACEHOLDER_H = `${ require('~/assets/images/ImagePlaceholder.png?resize&size=1000')}`

	export default Vue.extend({
		props: {
			modalState: { required: true, default: false } as PropOptions< boolean >,
			path: { required: true } as PropOptions< string >
		},
		data() {
			return {

				URL: PLACEHOLDER_H,

				PreviewMode: 'contain' as PREVIEW_MODE,

				Grabbing: false,

				Zoom: false,

				ZoomPrefs: {
					height: '200%',
					width: '200%',
				},

			}
		},
		methods: {

			...mapActions({
				GetImageURL: 'Images/GetImageURL',
			}),

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
		async created() {
			this.URL = await this.GetImageURL({ 
				_path: this.path
			})
		}
	})
</script>