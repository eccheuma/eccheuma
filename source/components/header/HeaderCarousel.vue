<template>
	<section class="eccheuma_swiper">
		<eccheuma-swiper :options="{ buttons: true, indicators: true, auto: true }">

			<template #icon-prev="{ onEdge }">
				<button 
					class="eccheuma_swiper-buttons" 
					:class="{ onEdge }"
					@click="EmitSound(`Off`, { volume: .3, rate: .75})" 
					@mouseenter="CarouselFocus = true" 
					@mouseleave="CarouselFocus = false"
					>
					<i class="fas fa-angle-left" />
				</button>
			</template>

			<template #icon-next="{ onEdge }">
				<button 
					class="eccheuma_swiper-buttons" 
					:class="{ onEdge }"
					@click="EmitSound(`Off`, { volume: .3, rate: .75})" 
					@mouseenter="CarouselFocus = true" 
					@mouseleave="CarouselFocus = false"
					>
					<i class="fas fa-angle-right" />
				</button>
			</template>

			<template #pagination="{ active }">
				<span class="eccheuma_swiper-dots" :class="{ active_dot: active }" @mouseenter="EmitSound('Tap', { rate: 1.25 })" />
			</template>

			<template #default="{ activeIndex }">
				<section v-for="(item, index) in PostContent" :key="item.ID" class="eccheuma_swiper-item">

						<client-only>

							<template v-if="CLIENT_RENDER_CHECK && !$isMobile && $PIXI.utils.isWebGLSupported()">
								<eccheuma-parallax :options="{ OpacityFade: true, OpacityFadeOffset: 100 }">

									<div 
										ref="ImageHolder" 
										class="eccheuma_swiper-image" 
										:style="`background-image: url(${ item.image })`"
										:class="!CarouselFocus ? `focused` : `unfocused`" 
									/>

								</eccheuma-parallax>
							</template>

							<template v-else>
								<div 
									ref="ImageHolder" 
									class="eccheuma_swiper-image" 
									:style="`background-image: url(${ item.image })`" 
								/>
							</template>

							<section slot="placeholder">
								<div 
									ref="ImageHolder" 
									class="eccheuma_swiper-image" 
									:class="{'content-hidden': index > ( activeIndex + 1 ) || index < ( activeIndex - 1 )}"
									:style="`background-image: url(${ ImagePlaceholder })`" />
							</section>

						</client-only>

						<div class="eccheuma_swiper-post" :class="{'content-hidden': index > ( activeIndex + 1 ) || index < ( activeIndex - 1 )}">

							<section class="eccheuma_swiper-tags">
								<span>{{ item.tags }}</span>
							</section>

							<section class="eccheuma_swiper-caption" @click="GoToPost(item.ID)">
								<h2>{{ item.title }}</h2>
								<h6>{{ item.description }}</h6>
								<span>
									<i class="fas fa-link" /> Перейти к посту
								</span>
							</section>

							<section class="eccheuma_swiper-info">
								<template v-if="PostReliseTime[index]">
									<span>{{ PostReliseTime[index].Day }} в {{ PostReliseTime[index].Time }}</span>
								</template>
							</section>

						</div>

				</section>
			</template>

		</eccheuma-swiper>
	</section>
</template>

<style lang="scss">

$swiperHeight: 70vh;

.eccheuma_swiper {

	width: 100vw; height: $swiperHeight; position: relative; 
	background-color: rgb(var(--color-1)); color: rgb(var(--color-6));

	.content-hidden {
		display: none;
	}

	&-item {
		display: inline-block; width: 100vw; height: 100%; position: relative;
	}

	.focused {
		opacity: .75;
		filter: brightness(75%);
	}

	.unfocused {
		opacity: .25;
		filter: brightness(75%);
	}

	.glassy {
		filter: brightness(75%) blur(10px);
	}

	&-image {
		position: relative;
		height: 100%; width: 100%;
		background: { size: cover; position: center }
		transition: all 500ms ease-in-out;
		// &:before {
		// 	content: "";
		// 	position: absolute;
		// 	top: 0;
		// 	width: 100%;
		// 	height: 100%;
		// 	background-image: url(~assets/images/SVG/Stripes.svg);
		// 	background-size: 20px;
		// 	opacity: .25;
		// 	z-index: 1;
		// 	mix-blend-mode: darken;
		// 	@media screen and ( max-width: var(--mobile-breakpoint)) { 
		// 		mix-blend-mode: none;
		// 	}
		// }
	}

	.onEdge {
		opacity: .25; pointer-events: none;
	}

	&-buttons {
		cursor: pointer;
		color: rgb(var(--color-6));
		background-color: rgba(var(--color-1), .25);
		border: 1px solid rgba(var(--color-6), .0);
		border-radius: .7rem;
		padding: 0 20px;
		transition-duration: .5s;
		mix-blend-mode: hard-light; 
		@media screen and ( max-width: var(--mobile-breakpoint)) {
			mix-blend-mode: unset;
		}
		&:hover {
			background-color: rgba(var(--color-1),.0);
			&:nth-of-type(1) {
				box-shadow: 1px 0px 0px 0px rgba(var(--color-6),.25)
			}
			&:nth-of-type(2) {
				box-shadow: -1px 0px 0px 0px rgba(var(--color-6),.25)
			}
		}

	}

	$dotSize: calc(max(5vw, 60px));;

	.active_dot {
		&:before {
			content: ''; 
			width: 100%; height: 1px; margin: auto 4px; opacity: 1;
			background-color: rgb(var(--color-6)); 
			transition: opacity, margin 250ms ease-in-out;
		}
	}

	&-dots {
		position: relative;
		width: $dotSize; height: 100%; 
		&:before {
			content: ''; 
			width: 100%; height: 1px; margin: auto 0; opacity: .5;
			box-shadow: 0px 1px 0px rgb(var(--color-1));
			background-color: rgb(var(--color-6)); 
			transition: opacity, margin 250ms ease-in-out;
		}
		&:hover {
			&:before {
				margin: auto 8px; opacity: 1;
			}
		}
	}
	
	&-post {

		position: absolute; top: 0; left: 0; width: 100vw; height: $swiperHeight; z-index: 1010;

		display: grid;
		grid-template: {
			columns: 100vw;
			rows: 2fr 75% 2fr
		}

		@media screen and ( max-width: var(--mobile-breakpoint)) {
			text-align: center;
		}

	}

	&-tags {

		align-self: end; justify-self: center;

		span {
			font-weight: 600;
			font-size: var(--font-size-5);
			word-spacing: 10px;
			padding: 7px 50px;
			border-radius: .7rem;
			color: rgb(var(--color-6));
			background-color: rgb(var(--color-1));
		}
	} 

	&-info {

		align-self: start; justify-self: center;

		span {
			font-weight: 600;
			font-size: var(--font-size-5);
			padding: 7px 50px;
			border-radius: .7rem;
			color: rgb(var(--color-6));
			background-color: rgb(var(--color-1));
		}
	}

	&-caption {

		$TBL: 	.5px;
		$TBLO: 	.5;
		$TBR: 	.5px;

		align-self: center;

		padding: 0 8.5vw;

		text-shadow: 
			 #{ $TBR }  #{ $TBR } $TBL rgba(var(--color-2), $TBLO ),
			-#{ $TBR } -#{ $TBR } $TBL rgba(var(--color-2), $TBLO ),
			-#{ $TBR }  #{ $TBR } $TBL rgba(var(--color-2), $TBLO ),
			 #{ $TBR } -#{ $TBR } $TBL rgba(var(--color-2), $TBLO ),
			 #{  0px }  #{ 2px  } 0px  rgba(var(--color-1), $TBLO );

		h2 {
			font-weight: 600;
		}
		h6 {
			white-space: pre-wrap;
			font: {
				size: .95rem;
				weight: 500;
			}
			margin: 0 0 1vh;
			width: calc(min(100%, 60ch));
		}
	}
		// position: absolute
		// color: rgb(var(--color-6)) 
		// text-shadow: $TextBorder $TextBorder $TextBlur rgba(var(--color-2),$TextBlurOpa),
		// (-+$TextBorder) (-+$TextBorder) $TextBlur rgba(var(--color-2),$TextBlurOpa),
		// (-+$TextBorder) $TextBorder $TextBlur rgba(var(--color-2),$TextBlurOpa),
		// $TextBorder (-+$TextBorder) $TextBlur rgba(var(--color-2),$TextBlurOpa),
		// 0px 2px 3px rgba(var(--color-1),.5) 
		// top: 3px
		// height: $HeaderHeight
		// width: 100%
		// padding: ($HeaderHeight - 35vh) 10vw
		// z-index: 40
		// i 
		// 	margin-right: .5vw
		// a 
		// 	color: rgb(var(--color-6))
		// 	font-size: var(--font-size-4)
		// 	font-weight: 700
		// 	opacity: .5
		// 	transition-duration: .5s
		// 	&:hover
		// 		opacity: 1	
		// @media screen and ( max-width: var(--mobile-breakpoint))
		// 	text-align: center
		// 	color: rgb(var(--color-6))
		// 	padding: 35vh 10vw

}


</style>

<script lang="ts">

	import Vue from 'vue'

	// FIREBASE
		import firebase from 'firebase/app'
		import 'firebase/database'
	
	// VUEX
		import { mapActions } from 'vuex'

	// COMPONENTS
		import EccheumaParallax from '~/components/common/Parallax.vue'
		import EccheumaSwiper 	from '~/components/common/SwiperProto.vue'
	
	// MIXINS
		import EmitSound from '~/assets/mixins/EmitSound'

	// TYPES
		import type { POST } from '~/types/Post'

		import type { FORMATED_DATE } from '~/store'

	// VARS
		const PLACEHOLDER_L = `${ require('~/assets/images/ImagePlaceholder.png?resize&size=600')}`
	
	// MODULE
	export default Vue.extend({
		components: { EccheumaParallax, EccheumaSwiper },
		mixins: [ EmitSound ],
		data() {
			return {

				ImagePlaceholder: PLACEHOLDER_L,

				Focus: false,
				CarouselFocus: null,

				PostForRequest: 4,

				PostContent: [] as POST[],

				PostReliseTime: [] as FORMATED_DATE[],

			}
		},
		async fetch() {

			await this.GetPosts();

		},
		watch: {
			PostContent: {
				handler() {

					this.get_PostImage();

					this.PostContent.forEach(async (item, i) => {
						this.PostReliseTime[i] = await this.GetLocalTime(item.date)
					})

				}
			}
		},
		mounted() {
			if ( this.CLIENT_RENDER_CHECK ) {
				this.get_PostImage();
			}
		},
		methods: {

			...mapActions({
				GetFirebaseImageURL: 	'Images/GetImageURL',
				GetLocalTime:						'GetLocalTime',
			}),

			get_PostImage() {

				this.PostContent.forEach(async (el) => {

					el.image = await this.GetFirebaseImageURL({ 
						_path: el.image,
						_size: window.innerWidth * window.devicePixelRatio
					})

				})

			},
			async GetPosts() {

				const POSTS = await firebase.database().ref('Posts').once('value');
			
				const DATA 	= await firebase.database()
					.ref("Posts")
					.orderByChild("ID")
					.startAt( POSTS.numChildren() - this.PostForRequest )
					.once('value')

				this.PostContent = Object.values(DATA.val())
				
			},
			GoToPost(ID: POST['ID']) {

				this.$router.push({ path: 'home' }, () => {
					console.log('PUSH COMPLETE!')
				});

				// this.$nextTick(() => {

				// 	const ELEMENT = document.getElementById(`PostID-${ ID }`)
	
				// 	if ( ELEMENT ) {
	
				// 		const RECT 	= ELEMENT.getBoundingClientRect()
				// 		const POS 	= (RECT.top + pageYOffset) - (RECT.height / 2) 

				// 		console.log(POS, RECT)
	
				// 		window.scrollTo({
				// 			top: Math.trunc(POS),
				// 			left: 0,
				// 			behavior: 'smooth'
				// 		})
	
				// 	}

				// })

			},
		},
	})

</script>
