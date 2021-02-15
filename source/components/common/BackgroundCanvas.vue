<template>
  <span id="CanvasContainer" ref="canvas" style="opacity: 0" />
</template>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapState } from 'vuex'

// VUEX MODULE TYPE MAP
	import type { VuexModules } from '~/types/VuexModules'

// TYPES
	type FILE = {
		[index: string]: {
			source: string
		}
	}

// FILES
	const Files: FILE = {
		Background: {
			source: require('~/assets/images/Background.png?format=webp&size=900').src
		},
		Noise: {
			source: require('~/assets/images/Noise.png?format=webp&size=1140').src
		},
		Stripes: {
			source: require('~/assets/images/SVG/Stripes.svg')
		},
	}

// MODULE
	export default Vue.extend({
		data() {
			return {

				GlobalAnimationDuration: 4e4,

				canvasElement: '' as unknown as HTMLCanvasElement,

				app: new Object() as PIXI.Application,
				container: new Object() as PIXI.Container,

				SpriteMap: new Map(),

				MousePosition: { Y: 0, X: 0 },

				AnimeJSTargets: [] as any[],

			}
		},
		head() {
			return {
				link: [
					{ rel: 'prefetch', href: Files.Background.source, as: 'fetch', crossorigin: true, targetload: 'canvas' },
					{ rel: 'prefetch', href: Files.Noise.source, as: 'fetch', crossorigin: true, targetload: 'canvas' },
					{ rel: 'prefetch', href: Files.Stripes.source, as: 'fetch', crossorigin: true, targetload: 'canvas' },
				]
			}
		},
		computed: {
			...mapState({
				isDesktop: state => (state as VuexModules).isDesktop,
			}),
		},
		mounted() {

			this.canvasElement = this.$refs.canvas as HTMLCanvasElement;

			this.ApplicationInit();

			window.addEventListener('mousemove', this.ChangeMouseCoordinate, { capture: true })

		},
		destroyed() {

			this.AnimeJSTargets.map((item) => {
				this.$AnimeJS.remove(item);
			})

			this.app.destroy(true, { texture: true, baseTexture: true });

			window.removeEventListener('mousemove', this.ChangeMouseCoordinate, { capture: true })

		},
		methods: {
			ChangeMouseCoordinate(event: MouseEvent): void {

				requestAnimationFrame(() => {

					this.MousePosition.Y = event.clientY
					this.MousePosition.X = event.clientX

					this.ShiftBackground()

				})

			},
			ShiftBackground(): void {

				// Берём класс спрайта
				const Background = this.SpriteMap.get('Background')

				// Координаты сентра сцены
				const CenterScene = {
					Y: window.innerHeight / 2,
					X: window.innerWidth / 2
				};

				// Коофициенты смещения
				const Mmax = .5
				const Mmin = .75

				// Соотношение удалённости курсора от центра до края viewport'a
				const D = {
					Y: +(Math.abs(CenterScene.Y - this.MousePosition.Y) / CenterScene.Y).toFixed(1),
					X: +(Math.abs(CenterScene.X - this.MousePosition.X) / CenterScene.X).toFixed(1),
				}

				//
				const R = {
					y: (CenterScene.Y - this.MousePosition.Y) / (100 / (D.Y * Mmax + Mmin)),
					x: (CenterScene.X - this.MousePosition.X) / (100 / (D.X * Mmax + Mmin))
				}

				if (Background) {
					requestAnimationFrame(() => {

						Background.y = CenterScene.Y + R.y
						Background.x = CenterScene.X + R.x

					})
				}

			},
			ApplicationInit(): void {

				this.app = new this.$PIXI.Application({
					height: window.innerHeight,
					width: window.innerWidth,
					resolution: 1,
					backgroundColor: 0x000000,
					// antialias: true,
				})

				this.canvasElement.appendChild(this.app.view)

				this.container = new this.$PIXI.Container()

				this.app.stage.addChild(this.container)

				this.Loader()

			},
			Loader(): void {

				console.time('Loader')

				if (!Object.keys(this.$PIXI.utils.TextureCache).length) {

					const Loader = new this.$PIXI.Loader()

					for (const name in Files) {
						Loader.add(name, Files[name].source)
					}

					Loader.load((loader, resources) => {

						this.Composite(resources)

					})
				} else {
					this.Composite(this.$PIXI.utils.TextureCache)
				}

				console.timeEnd('Loader')

			},
			Composite(resources: any): void {

				console.time('Composite')

				const ViewOrientation = this.isDesktop ? 'width' : 'height'

				const Background = this.$PIXI.Sprite.from(resources.Background.texture ?? resources.Background)
				Background.scale.x = Background.scale.y = this.app.screen[ViewOrientation] / Background[ViewOrientation]
				Background.anchor.x = Background.anchor.y = .5
				Background.y = this.app.screen.height / 2
				Background.x = this.app.screen.width / 2

				this.SpriteMap.set('Background', Background)

				const BackgroundAnimationState = {
					angle: 0,
					scale: 1,
					alpha: 1,
				}

				this.AnimeJSTargets.push(BackgroundAnimationState);

				const BackgroundAnimation = this.$AnimeJS({
					autoplay: false,
					targets: BackgroundAnimationState,
					angle: [0, 15],
					scale: [1, 1.25],
					alpha: [1, 0],
					direction: 'alternate',
					easing: 'easeInOutQuad',
					duration: this.GlobalAnimationDuration,
					loop: true,
					update() {
						requestAnimationFrame(() => {
							Background.angle = BackgroundAnimationState.angle;
							Background.alpha = BackgroundAnimationState.alpha;
						})
					}
				})

				BackgroundAnimation.play();

				this.container.addChild(Background);

				// ------------------------------------------------------------

				// Add Flick layer
				this.FlickLayer()

				// Add Noise layer
				this.NoiseLayer()

				const Stripes = new this.$PIXI.TilingSprite(resources.Stripes.texture ?? resources.Stripes)
				Stripes.tileScale.x = Stripes.tileScale.y = .2
				Stripes.width = this.app.screen.width
				Stripes.height = this.app.screen.height
				Stripes.blendMode = this.$PIXI.BLEND_MODES.MULTIPLY

				this.SpriteMap.set('Stripes', Stripes)

				this.container.addChild(Stripes)

				const Noise = this.$PIXI.Sprite.from(resources.Noise.texture ?? resources.Noise)
				Noise.anchor.x = Noise.anchor.y = .5
				Noise.y = this.app.screen.height / 2
				Noise.x = this.app.screen.width / 2
				Noise.alpha = .1
				Noise.scale.y = Noise.scale.x = this.app.screen[ViewOrientation] / Noise[ViewOrientation]

				this.SpriteMap.set('Noise', Noise)

				this.container.addChild(Noise);

				console.timeEnd('Composite')

				this.$AnimeJS({
					targets: this.canvasElement,
					opacity: [0, 1],
					duration: 8e3,
					ease: 'easeInOutQuad'
				})

			},
			FlickLayer(): void {

				const Layer = new this.$PIXI.Container()

				const Flick = new this.$PIXI.Graphics()
				Flick.beginFill(0x000000);
				Flick.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
				Flick.x = 0;
				Flick.y = 0;

				Layer.addChild(Flick)

				const FLICK_ANIMATION_STATE = {
					alpha: 1,
				}

				this.$AnimeJS({
					targets: FLICK_ANIMATION_STATE,
					alpha: [0, 1],
					direction: 'alternate',
					easing: 'linear',
					duration: 4e4,
					loop: true,
					update: () => {
						requestAnimationFrame(() => {
							Flick.alpha = FLICK_ANIMATION_STATE.alpha * (0.5 + (0.5 * Math.random()));
						})
					}
				})

				this.AnimeJSTargets.push(FLICK_ANIMATION_STATE)

				this.container.addChild(Layer)

			},
			NoiseLayer(): void {

				const Layer = new this.$PIXI.Container()

				const NoiseFilter = new this.$PIXI.filters.NoiseFilter()
				NoiseFilter.resolution = 0.5
				NoiseFilter.noise = 1
				NoiseFilter.seed = Math.random()
				NoiseFilter.blendMode = this.$PIXI.BLEND_MODES.SCREEN

				const GRAPH = new this.$PIXI.Graphics()
				GRAPH.beginFill(0x000000);
				GRAPH.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
				// -----------------------------
				GRAPH.alpha = .5;
				GRAPH.x = 0;
				GRAPH.y = 0;
				// -----------------------------
				GRAPH.filters = [NoiseFilter];

				Layer.addChild(GRAPH)

				this.container.addChild(Layer)

				this.app.ticker.add(() => {
					NoiseFilter.seed = Math.random()
				})

			}
		},
	})

</script>

<style lang="scss">

#CanvasContainer {

	position: absolute;

	z-index: 1;

	top: 0; left: 0;
	height: 100vh; width: 100vw;

	background: {
		color: $color1;
	}

}

</style>
