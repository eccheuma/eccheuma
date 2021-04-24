<template>
	
	<transition name="LoaderTransition">
		<section v-if="!Loaded" class="loader-container" @mousewheel.prevent>

			<div class="loader-content">
				<i ref="spinner" />
				<span ref="message">{{ Message }}</span>
			</div>

		</section>
	</transition>

</template>

<style lang="scss" scoped>

.LoaderTransition {
	&-enter {
		opacity: 0;
		&-active {
			transition: opacity 500ms ease-in-out;
		}
		&-to {
			opacity: 1
		}
	}
	&-leave {
		opacity: 1;
		&-active {
			transition: opacity 500ms ease-in-out;
		}
		&-to {
			opacity: 0
		}
	}
}

.loader {

	&-container {

		position: fixed; top: 0; left: 0; z-index: 5000;

		display: grid;
		grid-template: {
			columns: 100vw;
			rows: 1fr;
		}

		height: 100vh;

		background: {
			color: rgba(var(--color-1), .95)
		}

		backdrop-filter: blur(10px);
		@media screen and ( max-width: $mobile-breakpoint ) {
			backdrop-filter: unset;
		}

		&:before {
			content: '';
			position: absolute; top: 0; left: 0;  z-index: -1;
			width: 100vw; height: 100vh; opacity: .5;
			background: {
				image: url('~assets/images/SVG/Stripes.svg');
				size: 20px;
			}
			mix-blend-mode: multiply;
			@media screen and ( max-width: $mobile-breakpoint ) {
				mix-blend-mode: unset;
			}
		}

		&:after {
			content: '';
			position: fixed; top: 2vh; left: 1vw;
			width: 97vw; height: 96vh;
			border: 1px solid rgb(var(--color-3));
			border-radius: .7rem;
			z-index: 1;
		}

		align-items: center;
		justify-items: center;
		
	}

	&-content {

		i {
			display: block;
			margin: 0 auto;
			height: 40px;
			width: 40px;
			transform: rotate(0deg);
			border: 0px solid rgb(var(--color-5));
			border-radius: .7rem;
			opacity: 1;
			animation-timing-function: ease-in-out;
			animation: Loader 3s infinite;
			filter: drop-shadow(0px 0px 0px rgb(var(--color-5)));
			@media screen and (max-width: $mobile-breakpoint) {
				filter: unset;
			}
			@keyframes Loader {
				0% {
					transform: rotate(45deg);
					border: 3px solid rgb(var(--color-5));
					border-radius: 25%;
					opacity: 1;
					filter: drop-shadow(0px 0px 10px rgb(var(--color-5)));
					@media screen and (max-width: $mobile-breakpoint) {
						filter: unset;
					}
				}
				25% {
					transform: rotate(90deg) scale(1.25);
					border: 3px solid rgb(var(--color-5));
					border-radius: 100%;
					opacity: 1;
					filter: drop-shadow(0px 0px 2px rgb(var(--color-5)));
					@media screen and (max-width: $mobile-breakpoint) {
						filter: unset;
					}
				}
				50% {
					transform: rotate(135deg);
					border: 0px solid rgb(var(--color-5));
					border-radius: 25%;
					opacity: 0;
					filter: drop-shadow(0px 0px 0px rgb(var(--color-5)));
					@media screen and (max-width: $mobile-breakpoint) {
						filter: unset;
					}
				}
				75% {
					transform: rotate(180deg) scale(1);
					border: 3px solid rgb(var(--color-5));
					border-radius: 100%;
					opacity: 1;
					filter: drop-shadow(0px 0px 2px rgb(var(--color-5)));
					@media screen and (max-width: $mobile-breakpoint) {
						filter: unset;
					}
				}
				100% {
					transform: rotate(225deg);
					border: 3px solid rgb(var(--color-5));
					border-radius: 25%;
					opacity: 1;
					filter: drop-shadow(0px 0px 10px rgb(var(--color-5)));
					@media screen and (max-width: $mobile-breakpoint) {
						filter: unset;
					}
				}
			}
		}

		span {
			display: block;
			width: 100vw;
			color: rgb(var(--color-6));
			font-weight: 700;
			letter-spacing: .25ch;
			text-align: center;
			// opacity: 0;
			&:nth-of-type(1) {
				line-height: 10vh;
				font-size: var(--font-size-5);
			}
		}

	}

}


</style>

<script lang="ts">

	import Vue from 'vue'

	//VUEX
	import { mapState, mapMutations } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

	// MIXINS
	import EmitSound from '~/assets/mixins/EmitSound';

	// TYPES
	type LoadStage = { LoadPoint: number, Message: string }

	// MODULE
	export default Vue.extend({
		mixins: [ EmitSound ],
		data() {
			return {

				Loaded: false,

				Counter: 0,
				CurentStage: 0,

				LoadStages: [
					{ LoadPoint: 0, 	Message: 'Загрузка скриптов и данных' },
					{ LoadPoint: 15, 	Message: 'Загрузка внешних API' },
					{ LoadPoint: 30, 	Message: 'Монтирование элементов' },
					{ LoadPoint: 80, 	Message: 'Остаточная компоновка элементов' },
					{ LoadPoint: 100, Message: 'Готово!' },
				] as LoadStage[]

			} 
		},
		// head(): any {

		// 	return {
		// 		title: this.Message
		// 	}

		// },
		computed: {
			Message(): string {
				return this.LoadStages[this.CurentStage].Message
			}
		},
		created() {
			this.AppScroll(false);
		},
		mounted() {
			requestAnimationFrame(this.changeStage)
		},
		methods: {

			...mapMutations({
				AppScroll: 'AppScroll'
			}),

			animateCounter(stage: number) {

				return new Promise((resolve) => {

					this.$AnimeJS({
						targets: this.$data,
						Counter: [this.Counter, this.LoadStages[stage].LoadPoint],
						round: 1,
						easing: 'linear',
						duration: 250,
						complete: () => resolve(true),
					})
				})

			},

			changeStage() {

				const nextStage = this.CurentStage + 1

				this.animateCounter(nextStage)
					.then(() => {

						this.$AnimeJS({
							targets: this.$refs.message,
							opacity: [1, 0],
							duration: 250,
							delay: 500 - 250 * Math.random(),
							round: 100,
							easing: 'linear',
							direction: 'alternate',
							update: ({ progress }) => {
								if ( progress === 100 ) {
									this.CurentStage = nextStage;
								}
							},
							complete: () => {
								if ( this.LoadStages[this.CurentStage].LoadPoint !== 100 ) {
									this.changeStage();
								} else {
									this.Loaded = true;
								}
							}
						})

					})

			}

			// changeCounter() {

			// 	const FROM 	= this.Counter;
			// 	const TO 		= this.LoadStages[this.CurentStage].LoadPoint;

			// 	// CHANGE COUNTER => ANIMATE TEXT ON BREAKPOINT => UPDATE VALUE OF STAGE

			// 	const A = this.$AnimeJS({
			// 		targets: this.$data,
			// 		Counter: [FROM, TO],
			// 		round: 1,
			// 		easing: 'easeInOutCubic',
			// 		duration: () => { return this.$AnimeJS.random(500, 1500) },
			// 		complete: () => {

			// 			if ( this.CurentStage !== this.LoadStages.length - 1 ) {

			// 				const FADE_TEXT_ANIM = this.$AnimeJS({
			// 					targets: this.$refs.message,
			// 					opacity: [0, 1],
			// 					duration: 100,
			// 					endDelay: 200,
			// 					easing: 'linear',
			// 					direction: 'alternate',
			// 					update: (a) => {
			// 						if ( a.progress === 100 ) {

			// 							this.CurentStage += 1;

			// 						}
			// 					},
			// 					complete: () => {

			// 						this.ChangeCounter();
									
			// 						this.$AnimeJS.remove(FADE_TEXT_ANIM);
			// 						this.$AnimeJS.remove(A); 
									
			// 					}
			// 				})

			// 			} else { this.$AnimeJS.remove(A); this.CurentStage += 1; }

			// 		}
			// 	});

			// },

		}
	})

</script>