<template>

	<main
		key="main"
		ref="index"
		class="holl-container"
		style="opacity: 0"
		@mouseover="changeGlobalVolume(1)"
		@mouseleave="changeGlobalVolume(0)"
	>

		<!-- <transition name="opacity-transition">
			<i v-if="!CanvasReady" class="holl-wall" />
		</transition> -->

		<client-only>
			<pixi-canvas v-if="CLIENT_RENDER_CHECK && $PIXI.utils.isWebGLSupported()" key="canvas" @ready.once="Animate" />
		</client-only>

		<section class="holl-mute">
			<span
				:class="{ active: mute }"
				@click="globalMute(!mute)"
			>
				<icon name="Mute" />
			</span>
		</section>

		<section class="holl-info">

			<span class="index_app_version">
				СБОРКА: {{ ApplicationBuild.Version.toUpperCase() }} | {{ ApplicationBuild.BuildTime.toUpperCase() }}
			</span>

		</section>

		<section v-show="CanvasReady || $isMobile" class="holl-logo">
			
			<svg v-if="!$isMobile" ref="LOGO_SVG" fill="none" viewBox="0 0 157 24">
				<path
					ref="LOGO_PATH"
					d="m156 7h-155c1-2 1-3 3-4 1-1 3-2 6-2h138c2 0 4 1 5 2 2 1 3 2 3 4zm-135 2h20c0 1 0 3-1 4s-3 2-7 2h-20c0-2 1-3 2-4 2-1 4-2 6-2zm135 8c0 2-1 3-3 4-1 1-3 2-5 2h-138c-3 0-5-1-6-2-2-1-2-2-3-4h155z"
					stroke="#fff"
				/>
			</svg>

			<span>ECCHEUMA</span>
			<span>GRAPHICAL & WEB APPLICATION DESIGN</span>

		</section>

		<section class="holl-navigation">
			<header-navigation :search="false" :background="false" />
		</section>

		<template v-if="!$isMobile">
			<section class="holl-quote">
				<span ref="quote">
					" {{ Quotes[CurentQuoteIndex] }} "
				</span>
			</section>
		</template>

		<section class="holl-links">

			<a
				v-for="(item, index) in Links"
				:key="index"
				:href="item.link"
			>
			
				<icon :name="item.icon" /> {{ item.title }}

			</a>
		</section>

	</main>
</template>

<style lang="scss" scoped>

	@mixin section_position($area: block) {
		grid: {
			row: $area;
			column: $area;
		}
	}

	.active {
		color: rgb(var(--color-mono-200)) !important;
		background-color: rgb(var(--color-mono-800)) !important;
		animation: Mute 1s infinite alternate;
		@keyframes Mute {
			0% {
				transform: scale(0.85);
			}
			100% {
				transform: scale(1);
			}
		}
	}

	.holl {
		&-wall {

			position: absolute; top: 0; left: 0; z-index: 9999;

			width: 100vw;
			height: 100vh;

			background: {
				color: rgba(var(--color-mono-200), 1);
			}

		}
		&-container {
			display: grid;
			grid-template: {
				columns: 1fr 12fr 1fr;
				rows: 1fr 4fr 2fr 1fr 1fr;
				areas: ". build 	mute" ". logo 	." ". nav 		." ". quote 	." ". links 	.";
			}

			@media screen and ( max-width: $mobile-breakpoint ) {
				grid-template: {
					columns: 100vw;
					rows: 1fr 1fr 4fr 1fr 1fr 60px;
					areas: "build" "logo" "nav" "mute" "links";
				}
			}

			position: relative;
			width: 100vw;
			height: 100vh;

			@media screen and ( max-width: $mobile-breakpoint ) {
				overflow: hidden;
				width: 100vw;
				min-height: 90vh;
			}

			&:before {

				content: "";

				position: absolute;
				top: 0; left: 0;
				z-index: 0;

				width: 100vw; 
				height: 100vh;

				opacity: .25;

				background: {
					image: url('~assets/images/Background.png?placeholder=true&size=600');
					size: cover;
					position: center;
					repeat: no-repeat;
					blend-mode: multiply;
				}

			}

			&:after {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				z-index: 2;
				width: 100vw;
				height: 100vh;
				background: radial-gradient(rgba(#14141D, .66), rgb(var(--color-mono-200)) 75%);
			}

			@media screen and ( max-width: $mobile-breakpoint ) {
				&:after {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					z-index: 2;
					width: 100vw;
					height: 100vh;
					background: radial-gradient(#00000000 0%, #000000ff 85%);
				}
			}

			section {
				position: relative;
				z-index: 1000;
			}

		}
		&-mute {
			@include section_position($area: mute);

			align-self: center;
			justify-self: center;

			span {
				$size: 50px;

				cursor: pointer;
				display: flex;
				width: $size;
				height: $size;
				color: rgb(var(--color-mono-500));
				font-size: #{$size / 3};
				background-color: rgb(var(--color-mono-200));
				border: 3px solid rgb(var(--color-mono-400));
				border-radius: 100%;
				opacity: 1;

				i {
					@include icon-size(24px);
					margin: auto;
				}
			}
		}
		&-info {
			@include section_position($area: build);

			align-self: center;
			justify-self: center;

			span {
				color: rgb(var(--color-mono-500));
				font-size: var(--font-size-6);
				font-weight: 800;
				letter-spacing: 1ch;
				text-align: center;

				@media screen and ( max-width: $mobile-breakpoint ) {
					font-size: 0.45rem;
					letter-spacing: 0.5ch;
				}

			}
		}
		&-logo {
			@include section_position($area: logo);

			align-self: end;

			@media screen and (max-width: $mobile-breakpoint) {
				align-self: center;
			}

			svg {
				background: {
					size: contain;
					position: center;
					repeat: no-repeat;
				}

				height: 1.5rem;
				width: 100%;
				margin: 3vh 0;
			}

			span {
				opacity: 0;

				display: block;
				text-align: center;
				pointer-events: none;

				margin: {
					top: 5px;
				}

				@media screen and (max-width: $mobile-breakpoint) {
					opacity: 1;
				}

				&:nth-of-type(1) {

					color: rgb(var(--color-mono-700));
					
					font: {
						size: var(--font-size-0);
						family: var(--decor-font);
					}

					text-shadow: 0px 0px 2px rgb(var(--color-mono-500));

					letter-spacing: 0.5ch;
					line-height: var(--size-1);

					text-rendering: optimizeSpeed;

				}

				&:nth-of-type(2) {
					margin-top: 6px;
					color: rgb(var(--color-mono-600));
					line-height: 2vh;
					letter-spacing: 0.5ch;
					font: {
						size: 0.45rem;
						weight: 600;
					}
				}
			}
		}
		&-navigation {
			@include section_position($area: nav);

			align-self: center;
			z-index: 1010 !important;

		}
		&-quote {
			@include section_position($area: quote);

			align-self: center;
			justify-self: center;

			width: 70ch;
			text-align: center;

			span {
				font-weight: 600;
				font-style: italic;
				color: rgba(var(--color-mono-700));
				font-size: var(--font-size-4);
			}

			z-index: 0;

		}
		&-links {
			@include section_position($area: links);

			align-self: center;
			justify-self: center;

			display: flex;

			a {

				margin: 0 15px;
				font-weight: 700;
				margin: 0px 10px;
				font-size: var(--font-size-4);
				color: rgb(var(--color-mono-400));
				text-decoration: underline;
				transition-duration: 500ms;
				display: flex;

				i {
					margin: 0 4px;
					background: rgb(var(--color-mono-400));
					transition-duration: 500ms;
				}

				&:hover {
					margin: 0px 25px;
					color: rgb(var(--color-mono-900));
					text-decoration: underline;
					i {
						margin: 0 4px;
						background: rgb(var(--color-mono-900));
					}
				}

			}
		}
	}

</style>

<script lang="ts">

	import Vue from 'vue'

// VUEX
	import { mapState, mapMutations, mapActions } from 'vuex'

// FIREBASE
	import firebase from 'firebase/app'; 
	import 'firebase/database'

// TYPES
	import type { AnimeInstance, AnimeAnimParams } 	from 'animejs'
	import type { VuexModules } 										from '~/typescript/VuexModules'

// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound'

// COMPONENTS
	import HeaderNavigation from '~/components/header/HeaderNavigation.vue'
	import Icon 						from '~/components/Icon.vue'

// VARIABLES
	const PLACEHOLDER = require('~/assets/images/Background.png?placeholder=true&size=300').src

// FUNCTIONS
	const getVersion = async (): Promise<{ Version: string, BuildTime: string }> => {
		return await firebase.database().ref('App')
					.once('value')
					.then( data => data.val() as { Version: string, BuildTime: string })
	}

// MODULE
	export default Vue.extend({
		components: {
			HeaderNavigation,
			Icon,
			PixiCanvas: () => import('~/components/common/PixiCanvas.vue' /* webpackChunkName: "PixiCanvas" */)
		},
		mixins: [ EmitSound ],
		async asyncData() {

			const ApplicationBuild = await getVersion();

			return { ApplicationBuild } 

		},
		data() {
			return {

				CanvasReady: false,

				ApplicationBuild: new Object() as { Version: string, BuildTime: string },

				CurentQuoteIndex: 0,

				Quotes: [
					'Escape from Mordorland - Блог-портфолио ориентируемый на визуальный дизайн сайтов, логотипов, баннеров, и UI интерфейса. Предоставление услуг по работе с веб-дизайном и digital дизайном, фирменным стилем, и прочим графическим услугам',
					'SPA - Что-то странное, но работает лучше.',
					'Tilda это конечно быстро, но есть одна загвоздка...'
				],

				Links: [
					{ link: 'https://vk.com/club158755478', icon: 'VK', 				title: 'ВКонтакте' 	},
					{ link: 'https://facebook.com', 				icon: 'Facebook', 	title: 'FaceBook' 	},
					{ link: 'https://telegramm.com', 				icon: 'Telegramm', 	title: 'Telegramm' 	},
				],
			
				HollVolume: 0,

				AnimeInstance: [] as AnimeInstance[],
				
			}
		},
		async fetch() {

			this.ApplicationBuild = await getVersion();

		},
		head: {
			link: [
				{ rel: 'icon', 			href: 'Icon.svg' },
				{ rel: 'preload', 	href: '/static/sounds/Holl.ogg', as:'xhr', crossorigin: true },
				{ rel: 'prefetch', 	href: PLACEHOLDER },
			]
		},
		computed: {

			...mapState({
				mute: ( state: any ) => (state as VuexModules).Sound.global.mute,
			}),

		},
		watch: {
			CanvasReady: {
				handler() {

					const AMBIENT 				= this.Sounds.get('Ambient')!;
					const INITIAL_VOLUME 	= AMBIENT.volume();

					AMBIENT.volume(0)

					const DUR = 3000;

					this.$AnimeJS({

						targets: this.$refs.index,
						opacity: [0, 1],
						duration: DUR,
						easing: 'easeOutQuad',

						begin: () => {

							AMBIENT.volume(0)

							this.playSound(AMBIENT)

							AMBIENT.fade(0, INITIAL_VOLUME, DUR)

						}

					})

				}
			},
		},
		created() {

			this.setSounds([
				{
					file: 'Holl',
					name: 'Ambient',
					settings: { rate: .45, volume: 1.25, loop: true },
				}
			])
			
		},
		mounted() {

			this.initQuoteChanger(); 
			
			setTimeout(() => { 
				if ( !this.CanvasReady ) {
					this.CanvasReady = true
				}
			}, 5000)

		},
		beforeDestroy() {

			this.AnimeInstance.forEach((anim) => {
				anim.pause();
			})

			const HOWL = this.Sounds.get('Ambient')!;

			HOWL.fade(HOWL.volume(), 0, 5e3);

		},
		methods: {

			...mapMutations({
				SetDeviceType: 'SetDeviceType'
			}),

			...mapActions({
				changeGlobalVolume: 'Sound/changeGlobalVolume',
				globalMute: 				'Sound/globalMute',
			}),

			Animate() {

				this.CanvasReady = true;

				const LOOP: boolean = true;

				const ANIMATIONS: AnimeAnimParams[] = [
					{	
						targets: this.$refs.LOGO_SVG,
						filter: [
							{ value: 'drop-shadow(0px 0px 3px #FFFFFF)', duration: 2000 },
							{ value: 'drop-shadow(0px 0px 0px #FFFFFF)', duration: 5000 },
						],
						endDelay: 2000,
						round: 100,
						loop: LOOP, 
						easing: 'easeInOutSine',
						direction: 'alternate',
					},
					{	
						targets: this.$refs.LOGO_PATH,
						strokeDashoffset: [ this.$AnimeJS.setDashoffset, 0 ],
						fill: [
							{ value: '#FFF', duration: 2500, delay: 1500, endDelay: 5000, }
						],
						delay: 1000,
						duration: 3000,
						round: 100, 
						loop: LOOP,
						easing: 'easeInOutSine',
						direction: 'alternate',
					},
					{
						targets: '.holl-logo span',
						opacity: [0, 1],
						filter: [
							{ value: 'drop-shadow(0px 0px 4px #FFF)' },
							{ value: 'drop-shadow(0px 0px 0px #FFF)' },
						],
						delay: this.$AnimeJS.stagger(1000, { start: 0 }), 
						endDelay: 8000, 
						duration: 1000,
						round: 100,
						loop: LOOP, 
						easing: 'linear',
						direction: 'alternate',
					}
				]

				ANIMATIONS.forEach((item) => {
					this.AnimeInstance.push(this.$AnimeJS(item))
				})

			},

			initQuoteChanger() {

				this.CurentQuoteIndex = Math.trunc( Math.random() * this.Quotes.length )

				this.$AnimeJS({
					targets: this.$refs.quote,
					opacity: [1, 0],
					easing: 'linear',
					direction: 'alternate',
					loop: true,
					duration: 500,
					endDelay: 250,
					delay: 8000,
					update: ({ progress }) => {
						if ( progress === 100 ) {

							switch (this.CurentQuoteIndex) {

								case this.Quotes.length - 1: 
									this.CurentQuoteIndex = 0; 
									break;

								default: 
									this.CurentQuoteIndex += 1; 
									break

							}

						}
					},
				})

			}

		},
	})

</script>
