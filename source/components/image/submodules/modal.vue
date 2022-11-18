<template>
	<portal v-if="modalState" to="Modal">

		<div
			v-if="modalState" 
			class="modal-wrap"
			:class="{ 'utils::glassy': application.context.browser && (!$isMobile || application.gpu.available()) }" 
			@mousewheel.prevent="changeZoom"
			@click.self="toggleModal" 
		>
			<div class="modal-container">

				<section class="modal-header">
					<span>{{ title || '' }}</span>
					<span>{{ description || '' }}</span>
				</section>

				<div 
					ref="image"
					v-dragscroll="true"
					class="modal-body" 
					:style="`overflow: ${ zoomState ? 'scroll' : 'hidden' }`"
					:class="[
						{ 'grab': zoomState },
						{ 'grabbing': Grabbing && zoomState },
					]"
					@mousedown="grab(true)" 
					@mouseup="grab(false)"
					
					>
				
					<picture>
						<source :srcset="URL.avif" type="image/avif">
						<img :src="URL.webp" :style="zoomState ? zoomStyle : null" @dblclick="zoomState = !zoomState">
					</picture>

				</div>

				<div class="modal-footer">
					<common-button @click.native="zoomState = !zoomState">
						{{ zoomState ? 'Уменьшить' : 'Увеличить' }}
					</common-button>
					<common-button @click.native="toggleModal">
						Закрыть
					</common-button>
				</div>

			</div>

			<notion>
				Подсказка: Используйте двойной левый клик для приблежения.
			</notion>

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
		height: 100vh; width: $GLOBAL-BodySize;
		background:
			radial-gradient(farthest-side, rgb(var(--color-mono-200), .5) 0%, rgb(var(--color-mono-200), .9) 85%), 
			url(~assets/images/Stripes.png?size=15);

		display: grid;
		grid-template-rows: 95vh 1fr;

	}
	&-container {

		$headerH: 5vh;

		display: grid;
		margin: $headerH auto 0;

    grid-template: {
			columns: 1fr;
			rows: minmax(10vh, min-content) 8fr auto;
		}

    overflow: hidden;
    height: calc(100% - #{ $headerH });
		aspect-ratio: 16/9;
    background-color: rgb(var(--color-mono-300));
    border: 1px solid rgb(var(--color-mono-400));
    border-radius: var(--border-radius);

	}
	&-header {

		display: grid;
		width: 100%;
		text-align: center; 
		align-content: center;
		color: rgb(var(--color-mono-1000)); 
		background-color: rgb(var(--color-mono-200));
		padding: 2vh 0;

		span {

			display: block;
			text-align: center;

			&:first-child {

				font: {
					family: var(--decor-font);
					size: var(--font-size-42);
					weight: 500;
				}

				letter-spacing: .15ch;

			}

			&:last-child {
				color: rgb(var(--color-mono-600));
				font-size: var(--font-size-16)
			}

		}
	}
	&-body {
		$mar: 10px;
		margin: $mar;
		height: calc(100% - (#{$mar} * 2));
		width: calc(100% - (#{$mar} * 2));

		picture {

			display: flex;
			width: 100%;
			height: 100%;

			img {
				width: 100%;
				height: 100%;
				padding: 10px;
				object-fit: contain;
				transition: all 120ms linear;
				margin: auto;
			}

		}

		&::-webkit-scrollbar {
			width: 10px;
			height: 10px;
			min-width: 5px;
			min-height: 5px;
			&-corner {
				background: transparent;
			}
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
					background-color: rgb(var(--color-mono-1000))
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
		padding: 2vh 25%;
		grid-template-columns: repeat(auto-fit, minmax(min-content, 250px)); 
		grid-column-gap: 20px;
		background-color: rgb(var(--color-mono-200));
		place-content: center;
	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue';

	// NAMESPACES
	import { Image } from '~/types/Image';

	// TYPES
	// type PREVIEW_MODE = 'cover' | 'contain' | 'zoom'

	// Helpers
	import { DEFAULT_IMAGE_STRUCT, getImageURL } from '~/components/image/image.helpers';

	// VARIABLES
	const PLACEHOLDER: Pick<Image.formatsStruct, 'avif' | 'webp'> = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=1000&format=avif').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=1000&format=webp').src,
	};

	const zoomStep = 20;

	// MODULE
	export default Vue.extend({
		components: {
			CommonButton	: () => import('~/components/buttons/CommonButton.vue'),
			Notion				: () => import('~/components/common/Notion.vue')
		},
		props: {
			modalState: { 
				type: Boolean,
				required: true, 
				default: false 
			} as PropOptions<boolean>,
			path: { 
				type: String,
				required: true 
			} as PropOptions<string>,
			title: {
				type: String,
				default: '',
				required: false,
			} as PropOptions<string>,
			description: {
				type: String,
				default: '',
				required: false,
			} as PropOptions<string>,
		},
		data() {
			return {

				URL: PLACEHOLDER,
				Grabbing: false,

				zoomState: false,
				zoomRate: 150,

			};
		},
		computed: {
			zoomStyle(): { height: string, width: string } {

				const perc = `${ this.zoomRate }%`;

				return {
					height	: perc,
					width		: perc,
				};

			}
		},
		async mounted() {

			if ( this.application.context.browser ) this.URL = await this.constructImage();

		},
		methods: {

			async constructImage() {

				const urlResult = await getImageURL({
					path: this.path,
					size: 1440,
				});

				return urlResult instanceof Error 
					? DEFAULT_IMAGE_STRUCT 
					: urlResult;

			},

			changeZoom({ deltaY }: WheelEvent) {

				const sign = Math.sign(deltaY);
				const zoom = this.zoomRate + (zoomStep * sign);

				this.zoomRate = sign > 0
					? zoom > 300
						? Math.min(300, zoom)
						: zoom
					: zoom < 50
						? Math.max(50, zoom)
						: zoom;

			},

			toggleModal() {
				this.$emit('toggle-modal', !this.modalState);
			},

			grab(value: boolean) {
				if ( this.zoomState ) this.Grabbing = value;
			}

		},
	});
</script>
