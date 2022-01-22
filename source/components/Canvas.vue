<template>
  <span id="CanvasContainer" ref="canvas" style="opacity: 0"/>
</template>

<style lang="scss">

#CanvasContainer {

	position: absolute;

	z-index: 1;

	top: 0; 
	left: 0;

	height: 100vh; 
	width: 100vw;

	overflow: hidden;

	background: {
		color: rgb(var(--color-mono-200));
	}

	canvas {
		height: 100vh !important; 
		width: 100vw !important;
	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapState } from 'vuex'

// VUEX MODULE TYPE MAP
	import type { Application, Container, Sprite, Texture, Graphics, TilingSprite } from 'pixi.js'
	import type { AnimeInstance } 																									from 'animejs'
	import type { VuexModules } 																										from '~/typescript/VuexModules'

// FILES
	const ASSETS = [
		{
			name: 'Background',
			path: require('~/assets/images/Background.png?format=webp&size=1440').src
		},
		{
			name: 'Pattern',
			path: require('~/assets/images/__PATTERN__.png?format=webp&size=480').src
		},
		{
			name: 'Stripes',
			path: require('~/assets/images/Stripes.png?format=webp').src
		}
	]

	const HEAD_LINKS = ASSETS.map((asset) => { 

		// PRELOAD IMAGE FOR CANVAS
		if ( process.client ) {
			const i 		= new Image();
						i.src = asset.path;
		}

		return { rel: 'prefetch', href: asset.path, as: 'fetch', crossorigin: true, }
	})

// MODULE
	export default Vue.extend({
		middleware() {
			console.time('middleware')
		},
		data() {
			return {

				resources: null as any,
				GlobalAnimationDuration: 4e4,

				app: 				new Object() as Application,
				container: 	new Object() as Container,

				SpriteMap: new Map() as Map<string, Sprite | TilingSprite>,

				MousePosition: { Y: 0, X: 0 },

				AnimeJSInstances: [] as AnimeInstance[],

			}
		},
		head: {
			link: HEAD_LINKS
		},
		computed: {
			...mapState({
				isDesktop: state => (state as VuexModules).isDesktop,
			}),

			ViewOrientation(): 'width' | 'height' {
				return this.$isMobile ? 'height' : 'width'
			}

		},
		watch: {
			app: {
				handler() {
					this.$el.appendChild(this.app.view);
				},
			},
			resources: {
				handler() { 
					this.Composite(this.resources) 
				}, 
			},
		},
		created() {

			console.time('Canvas execution')

			this.Loader();
			this.ApplicationInit();

		},
		mounted() {
			window.addEventListener('mousemove', this.ChangeMouseCoordinate, { capture: true })
		},
		destroyed() {

			this.$AnimeJS.running.forEach(( instance ) => {
				instance.pause(); this.$AnimeJS.remove(instance)	
			})

			if ( this.app ) {
				setTimeout(() => {
					this.app.destroy();
				}, 1000)
			}

			window.removeEventListener('mousemove', this.ChangeMouseCoordinate, { capture: true })

		},
		methods: {

			ApplicationInit() {

				console.time('Initialise')

				this.container 	= new this.$PIXI.Container();
				this.app 				= new this.$PIXI.Application({
					height: window.innerHeight,
					width: 	window.innerWidth,
					resolution: 1,
					backgroundColor: 0x000000,
				})

				this.app.stage.addChild(this.container);
				this.app.ticker.autoStart = false;

				console.timeEnd('Initialise')

			},

			Loader() {

				console.time('Loader')

				const Loader = new this.$PIXI.Loader();

				ASSETS.forEach(asset => Loader.add(asset.name, asset.path))

				Loader.load(({ resources }) => { this.resources = resources })

				console.timeEnd('Loader')

			},

			Composite(resources: any) {

				console.time('Composite')

				const Layers = [
					this.backgroundLayer(resources.Background),
					this.noiseLayer(),
					this.linesLayer(resources.Pattern),
					this.stripeLayer(resources.Stripes),
					this.flickLayer(),
				]

				Promise.all(Layers).then(( layers ) => {

					layers.forEach( layer => this.container.addChild(layer) )

				}).then(() => {

					console.timeEnd('Composite')
					console.timeEnd('Canvas execution')

					this.$AnimeJS({
						targets: this.$refs.canvas,
						opacity: [0, 1],
						duration: 5000,
						easing: 'easeInOutQuad',
						begin: () => {

							this.$emit('ready');

							requestAnimationFrame(this.app.ticker.start);

						},
					})

					this.AnimeJSInstances.forEach(instance => instance.play())

				})

			},

			ChangeMouseCoordinate(event: MouseEvent) {

				// requestAnimationFrame(() => {

					this.MousePosition.Y = event.clientY
					this.MousePosition.X = event.clientX

					this.ShiftBackground()

				// })

			},

			ShiftBackground() {

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
					Y: Number((Math.abs(CenterScene.Y - this.MousePosition.Y) / CenterScene.Y).toFixed(1)),
					X: Number((Math.abs(CenterScene.X - this.MousePosition.X) / CenterScene.X).toFixed(1)),
				}

				//
				const R = {
					y: (CenterScene.Y - this.MousePosition.Y) / (100 / (D.Y * Mmax + Mmin)),
					x: (CenterScene.X - this.MousePosition.X) / (100 / (D.X * Mmax + Mmin))
				}

				if (Background) {

					Background.y = CenterScene.Y + R.y
					Background.x = CenterScene.X + R.x

				}

			},

			// ANIMATIONS
				backgroundAnimation(s: Sprite) {

					const BackgroundAnimationState = {
						angle: 0,
						scale: 1,
						alpha: 1,
					}

					const BackgroundScale = {
						x: s.scale.x,
						y: s.scale.y
					}

					const BA = this.$AnimeJS({
						autoplay: false,
						targets: BackgroundAnimationState,
						angle: [0, 25],
						scale: [1, 1.5],
						alpha: [1, .25],
						direction: 'alternate',
						easing: 'easeInOutQuad',
						duration: this.GlobalAnimationDuration,
						loop: true,
						update() {
							s.angle 		= BackgroundAnimationState.angle;
							s.alpha 		= BackgroundAnimationState.alpha;
							s.scale.y 	= BackgroundScale.y * BackgroundAnimationState.scale;
							s.scale.x 	= BackgroundScale.x * BackgroundAnimationState.scale;
						}
					})

					this.AnimeJSInstances.push(BA);

				},
				flickAnimation(g: Graphics) {

					const FA = this.$AnimeJS({
						autoplay: false,
						targets: g,
						alpha: [0, 1],
						direction: 'alternate',
						easing: 'linear',
						duration: 4e4,
						loop: true,
						update: () => { g.alpha *= (0.5 + (0.25 * Math.random())) }
					})

					this.AnimeJSInstances.push(FA);

				},

			// LAYERS
				backgroundLayer({ texture }: { texture: Texture }): Promise<Sprite> {

					return new Promise((resolve) => {

						const Background = this.$PIXI.Sprite.from(texture)
								Background.scale.x 	= Background.scale.y = this.app.screen[this.ViewOrientation] / Background[this.ViewOrientation]
								Background.anchor.x = Background.anchor.y = .5
								Background.y 				= this.app.screen.height / 2
								Background.x 				= this.app.screen.width / 2

						resolve(Background);

						this.SpriteMap.set('Background', Background);

						this.backgroundAnimation(Background);

					})

				},
				flickLayer(): Promise<Container> {

					return new Promise(( resolve ) => {

						const Layer = new this.$PIXI.Container();

						const Flick = new this.$PIXI.Graphics();
									Flick.beginFill(0x000000);
									Flick.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
									Flick.x = 0;
									Flick.y = 0;

						Layer.addChild(Flick); 
						
						resolve(Layer);

						this.flickAnimation(Flick)

					})

				},
				noiseLayer(): Promise<Container> {

					return new Promise(( resolve ) => {

						const Layer = new this.$PIXI.Container();

						const NoiseFilter = new this.$PIXI.filters.NoiseFilter();
									NoiseFilter.resolution 	= 0.5;
									NoiseFilter.noise 			= 1;
									NoiseFilter.seed 				= 1;
									NoiseFilter.blendMode 	= this.$PIXI.BLEND_MODES.SCREEN;

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

						resolve(Layer)

						this.app.ticker.add(() => {
							NoiseFilter.seed = Math.random()
						})

					})

				},
				stripeLayer({ texture }: { texture: Texture }): Promise<TilingSprite> {

					return new Promise(( resolve ) => {

						const Stripes = new this.$PIXI.TilingSprite(texture);
									Stripes.tileScale.x = Stripes.tileScale.y = .15
									Stripes.width 			= this.app.screen.width
									Stripes.height 			= this.app.screen.height
									Stripes.blendMode 	= this.$PIXI.BLEND_MODES.MULTIPLY

						resolve(Stripes);

						this.SpriteMap.set('Stripes', Stripes)

					})

				},
				linesLayer({ texture }: { texture: Texture }): Promise<Sprite> {

					return new Promise(( resolve ) => {

						const Lines = new this.$PIXI.TilingSprite(texture);
									Lines.tileScale.x = Lines.tileScale.y = 1;
									Lines.width 			= this.app.screen.width;
									Lines.height 			= this.app.screen.height;
									Lines.alpha				= .1;

						resolve(Lines);

						this.SpriteMap.set('Lines', Lines)

					})

				}

		},
	})

</script>
