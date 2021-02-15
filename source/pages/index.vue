<template>
	<main
		class="holl-container"
		@mouseover="ChangeGlobalVolume(1)"
		@mouseleave="ChangeGlobalVolume(0)"
	>
		<client-only>
			<background-canvas v-if="CLIENT_RENDER_CHECK && $PIXI.utils.isWebGLSupported()" />
		</client-only>

		<section class="holl-mute">
			<span
				:class="{ active: Muted }"
				@click="ChangeVolume({ _volume: Number(Muted), _duration: 1000 })"
			>
				<i class="fas" :class="Muted ? `fa-volume-mute` : `fa-volume-up`" />
			</span>
		</section>

		<section class="holl-info">

			<span class="index_app_version">
				СБОРКА: {{ ApplicationBuild.Version.toUpperCase() }} | {{ ApplicationBuild.BuildTime.toUpperCase() }}
			</span>

		</section>

		<section class="holl-logo">
			
			<svg v-if="!$isMobile" ref="logotype" fill="none" viewBox="0 0 157 24">
				<path 
					ref="logotype_path"
					d="m156 7h-155c1-2 1-3 3-4 1-1 3-2 6-2h138c2 0 4 1 5 2 2 1 3 2 3 4zm-135 2h20c0 1 0 3-1 4s-3 2-7 2h-20c0-2 1-3 2-4 2-1 4-2 6-2zm135 8c0 2-1 3-3 4-1 1-3 2-5 2h-138c-3 0-5-1-6-2-2-1-2-2-3-4h155z"
					stroke="#fff"
				/>
			</svg>

			<span ref="LogoSVG" />
			<span ref="LogoTYPE">GRAPHICAL & WEB APPLICATION DESIGN</span>

		</section>

		<section class="holl-navigation">
			<header-navigation :search="false" :background="false" />
		</section>

		<section v-if="!$isMobile" class="holl-quote">
			<span>{{ Messages[RandomMessageIndex] }}</span>
		</section>

		<section class="holl-links">
			<a
				v-for="(item, index) in Links"
				:key="index"
				:href="item.link"
				@mouseenter="EmitSound(`On`)"
				@click="EmitSound(`Tap`, { rate: 0.5 })"
			>
			
				<i :class="item.icon" />{{ item.title }}

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
		color: $color1 !important;
		background-color: $color6 !important;
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
		&-container {
			display: grid;
			grid-template: {
				columns: 1fr 12fr 1fr;
				rows: 1fr 4fr 2fr 2fr 1fr;
				areas: ". build 	mute" ". logo 	." ". nav 		." ". quote 	." ". links 	.";
			}

			@media screen and (max-width: $MobileBreakPoint) {
				grid-template: {
					columns: 100vw;
					rows: 1fr 2fr auto 2fr 1fr 60px;
					areas: "build" "logo" "nav" "mute" "links";
				}
			}

			position: relative;
			width: 100vw;
			height: 100vh;

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
				background: radial-gradient(#00000000 0%, #000000ff 85%);
			}

			@media screen and (max-width: $MobileBreakPoint) {
				&:after {
					content: "";
					position: absolute;
					top: 0;
					left: 0;
					z-index: 2;
					width: 100vw;
					height: 100vh;
					opacity: 0.5;
					background: {
						image: url("~assets/images/SVG/Stripes.svg");
						size: 20px;
					}
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
				color: $color4;
				font-size: #{$size / 3};
				background-color: $color1;
				border: 1px solid $color3;
				border-radius: 100%;
				opacity: 1;

				i {
					margin: auto;
				}
			}
		}
		&-info {
			@include section_position($area: build);

			align-self: center;
			justify-self: center;

			span {
				color: $color4;
				font-size: $FontSize5;
				font-weight: 800;
				letter-spacing: 1ch;
				text-align: center;

				@media screen and (max-width: $MobileBreakPoint) {
					font-size: 0.45rem;
					letter-spacing: 0.5ch;
				}
			}
		}
		&-logo {
			@include section_position($area: logo);

			align-self: end;

			@media screen and (max-width: $MobileBreakPoint) {
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

				@media screen and (max-width: $MobileBreakPoint) {
					opacity: 1;
				}

				&:nth-of-type(1) {
					height: 1vw;
					background: {
						image: url('~assets/images/SVG/Eccheuma.svg');
						size: contain;
						position: center;
						repeat: no-repeat;
					}

					@media screen and (max-width: $MobileBreakPoint) {
						height: 3.6vh;
					}
				}

				&:nth-of-type(2) {
					margin-top: 6px;
					color: $color5;
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
		}
		&-quote {
			@include section_position($area: quote);

			align-self: center;
			justify-self: center;

			width: 70ch;
			text-align: center;

			span {
				font-weight: 700;
				font-style: italic;
				color: $color4;
			}
		}
		&-links {
			@include section_position($area: links);

			align-self: center;
			justify-self: center;

			display: inline-block;

			a {
				margin: 0 15px;
				font-weight: 700;
				margin: 0px 10px;
				font-size: $FontSize4;
				color: $color3;
				transition-duration: 0.5s;
				&:hover {
					margin: 0px 25px;
					color: $color5;
					text-decoration: none;
				}
				i {
					margin: 0 4px;
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
	import type { VuexModules } from '~/types/VuexModules'

// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound.ts'

// COMPONENTS
	import HeaderNavigation from  '~/components/header/HeaderNavigation.vue'

// VARIABLES
	const PLACEHOLDER = require('~/assets/images/Background.png?placeholder=true&size=300').src

// MODULE
	export default Vue.extend({
		components: {
			HeaderNavigation,
			BackgroundCanvas: () => import('~/components/common/BackgroundCanvas.vue' /* webpackChunkName: "PixiCanvas" */)
		},
		mixins: [ EmitSound ],
		async asyncData() {

			const ApplicationBuild = await firebase.database().ref('App')
					.once('value')
					.then( data => data.val() as { Version: string, BuildTime: string })

			return { ApplicationBuild } 

		},
		data() {
			return {

				ApplicationBuild: {} as { Version: string, BuildTime: string },

				Messages: [
					'Escape from Mordorland - Блог-портфолио ориентируемый на визуальный дизайн сайтов, логотипов, баннеров, и UI интерфейса. Предоставление услуг по работе с веб-дизайном и digital дизайном, фирменным стилем, и прочим графическим услугам',
					'SPA - Что-то странное, но работает лучше.',
				],

				Links: [
					{ link: 'https://vk.com/club158755478', icon: 'fab fa-vk', 					title: 'ВКонтакте' 	},
					{ link: 'https://facebook.com', 				icon: 'fab fa-facebook-f', 	title: 'FaceBook' 	},
					{ link: 'https://telegramm.com', 				icon: 'fab fa-telegram', 		title: 'Telegramm' 	},
				],
			
				HollVolume: 0,

				HollAmbient: {
					path: 'Holl',
					volume: .5,
					loop: true,
					rate: .5,
				}
				
			}
		},
		head() {
			return {
				link: [
					{ rel: 'preload', 	href: '/static/sounds/Holl.ogg', 	as: 'fetch', crossorigin: true },
					{ rel: 'preload', 	href: PLACEHOLDER, 								as: 'fetch', crossorigin: true },
				]
			}
		},
		computed: {

			...mapState({
				Muted: ( state: any ) => (state as VuexModules).Sound.Global.Mute,
			}),

			RandomMessageIndex(): number {
				return Math.trunc( Math.random() * this.Messages.length )
			}

		},
		mounted() {

			if ( this.CLIENT_RENDER_CHECK ) {

				if ( !this.$isMobile ) { this.Animate() }

				const H = this.HollAmbient

				this.EmitSound( H.path, { rate: H.rate, loop: H.loop })
	
				this.ChangeVolume({ _volume: 1, _duration: 10000 })

			}

		},
		beforeDestroy() {

			this.ChangeSoundVolume({ path: this.HollAmbient.path, volume: 0 })

		},
		methods: {

			...mapMutations({
				SetDeviceType: 'SetDeviceType'
			}),

			...mapActions({
				ChangeVolume: 			'Sound/Set_GlobalSoundProperty', 
				ChangeSoundVolume: 	'Sound/ChangeSoundVolume',
			}),

			Animate() {

				this.$AnimeJS({
					targets: this.$refs.logotype,
					filter: [
						{ value: 'drop-shadow(0px 0px 3px #FFFFFF)', duration: 2000 },
						{ value: 'drop-shadow(0px 0px 0px #FFFFFF)', duration: 5000 },
					],
					endDelay: 2000,
					round: 100, 
					easing: 'easeInOutSine',
					direction: 'alternate',
					loop: true
				});

				this.$AnimeJS({
					targets: this.$refs.logotype_path,
					strokeDashoffset: [this.$AnimeJS.setDashoffset, 0],
					fill: [
						{ value: '#FFF', duration: 2500, delay: 1500, endDelay: 5000, }
					],
					delay: 1000,
					duration: 3000,
					round: 100, 
					easing: 'easeInOutSine',
					direction: 'alternate',
					loop: true
				});

				this.$AnimeJS({
					targets: [this.$refs.LogoSVG, this.$refs.LogoTYPE],
					opacity: [0, 1],
					filter: [
						{ value: 'drop-shadow(0px 0px 4px #FFF)' },
						{ value: 'drop-shadow(0px 0px 0px #FFF)' },
					],
					delay: this.$AnimeJS.stagger(1000, { start: 0 }), 
					endDelay: 8000, 
					duration: 1000,
					round: 100, 
					easing: 'linear',
					direction: 'alternate',
					loop: true,
				});

			},
			ChangeGlobalVolume(value: number) {

				if ( !this.Muted) {

					const V = this.HollVolume

					this.$AnimeJS({
						targets: this.$data,
						HollVolume: [V, value],
						duration: 1000,
						easing: 'easeInOutSine',
						update: () => {
							this.Howler.volume(this.HollVolume)
						}
					})

				}

			}
		},
	})

</script>
