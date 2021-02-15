<template>
	<section class="eccheuma_swiper">
		<eccheuma-swiper :options="{ buttons: true, indicators: true }">

			<template v-slot:icon-prev="{ onEdge }">
				<button class="eccheuma_swiper-buttons" :class="{ onEdge }"
					@click="EmitSound(`Off`, { volume: .3, rate: .75})" 
					@mouseenter="CarouselFocus = true" 
					@mouseleave="CarouselFocus = false">
					<i class="fas fa-angle-left"></i>
				</button>
			</template>

			<template v-slot:icon-next="{ onEdge }">
				<button class="eccheuma_swiper-buttons" :class="{ onEdge }"
					@click="EmitSound(`Off`, { volume: .3, rate: .75})" 
					@mouseenter="CarouselFocus = true" 
					@mouseleave="CarouselFocus = false">
					<i class="fas fa-angle-right"></i>
				</button>
			</template>

			<template v-slot:pagination="{ active }">
				<span class="eccheuma_swiper-dots" :class="{ active_dot: active }" @mouseenter="EmitSound('Tap', { rate: 1.25 })"></span>
			</template>

			<template v-slot:default="{ activeIndex }">
				<section v-for="(item, index) in PostContent" :key="item.ID" class="eccheuma_swiper-item">

						<client-only>

							<eccheuma-parallax v-if="!$isMobile" :options="{ OpacityFade: true, OpacityFadeOffset: 100 }">

								<div ref="ImageHolder" class="eccheuma_swiper-image" 
									:style="`background-image: url(${ item.image })`"
									:class="!CarouselFocus ? `focused` : `unfocused`">
								</div>

							</eccheuma-parallax>

							<template v-else>
								<div ref="ImageHolder" class="eccheuma_swiper-image" 
									:class="{'content-hidden': index > ( activeIndex + 1 ) || index < ( activeIndex - 1 )}"
									:style="`background-image: url(${ item.image })`"></div>
							</template>

							<section slot="placeholder">
								<div ref="ImageHolder" class="eccheuma_swiper-image" 
									:class="{'content-hidden': index > ( activeIndex + 1 ) || index < ( activeIndex - 1 )}"
									:style="`background-image: url(${ ImagePlaceholder })`"></div>
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
									<i class="fas fa-link"></i> Перейти к посту
								</span>
							</section>

							<section class="eccheuma_swiper-info">
								<span>{{ item.time }}</span>
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
	background-color: $color1; color: $color5;

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
		// 	@media screen and ( max-width: $MobileBreakPoint ) { 
		// 		mix-blend-mode: none;
		// 	}
		// }
	}

	.onEdge {
		opacity: .25; pointer-events: none;
	}

	&-buttons {
		cursor: pointer;
		color: $color5;
		background-color: rgba($color1, .25);
		border: 1px solid rgba($color5, .0);
		border-radius: .7rem;
		padding: 0 20px;
		transition-duration: .5s;
		mix-blend-mode: hard-light; 
		@media screen and ( max-width: $MobileBreakPoint ) {
			mix-blend-mode: unset;
		}
		&:hover {
			background-color: rgba($color1,.0);
			&:nth-of-type(1) {
				box-shadow: 1px 0px 0px 0px rgba($color5,.25)
			}
			&:nth-of-type(2) {
				box-shadow: -1px 0px 0px 0px rgba($color5,.25)
			}
		}

	}

	$dotSize: calc(max(5vw, 60px));;

	.active_dot {
		&:before {
			content: ''; 
			width: 100%; height: 1px; margin: auto 4px; opacity: 1;
			background-color: $color5; 
			transition: opacity, margin 250ms ease-in-out;
		}
	}

	&-dots {
		position: relative;
		width: $dotSize; height: 100%; 
		&:before {
			content: ''; 
			width: 100%; height: 1px; margin: auto 0; opacity: .5;
			box-shadow: 0px 1px 0px $color1;
			background-color: $color5; 
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

		@media screen and ( max-width: $MobileBreakPoint ) {
			text-align: center;
		}

	}

	&-tags {

		align-self: end; justify-self: center;

		span {
			font-weight: 600;
			font-size: $FontSize5;
			word-spacing: 10px;
			padding: 7px 50px;
			border-radius: .7rem;
			color: $color5;
			background-color: $color1;
		}
	} 

	&-info {

		align-self: start; justify-self: center;

		span {
			font-weight: 600;
			font-size: $FontSize5;
			padding: 7px 50px;
			border-radius: .7rem;
			color: $color5;
			background-color: $color1;
		}
	}

	&-caption {

		$TBL: 	.5px;
		$TBLO: 	.5;
		$TBR: 	.5px;

		align-self: center;

		padding: 0 8.5vw;

		text-shadow: 
			 #{ $TBR }  #{ $TBR } $TBL rgba( $color2, $TBLO ),
			-#{ $TBR } -#{ $TBR } $TBL rgba( $color2, $TBLO ),
			-#{ $TBR }  #{ $TBR } $TBL rgba( $color2, $TBLO ),
			 #{ $TBR } -#{ $TBR } $TBL rgba( $color2, $TBLO ),
			 #{  0px }  #{ 2px  } 0px  rgba( $color1, $TBLO );

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
		// color: $color5 
		// text-shadow: $TextBorder $TextBorder $TextBlur rgba($color2,$TextBlurOpa),
		// (-+$TextBorder) (-+$TextBorder) $TextBlur rgba($color2,$TextBlurOpa),
		// (-+$TextBorder) $TextBorder $TextBlur rgba($color2,$TextBlurOpa),
		// $TextBorder (-+$TextBorder) $TextBlur rgba($color2,$TextBlurOpa),
		// 0px 2px 3px rgba($color1,.5) 
		// top: 3px
		// height: $HeaderHeight
		// width: 100%
		// padding: ($HeaderHeight - 35vh) 10vw
		// z-index: 40
		// i 
		// 	margin-right: .5vw
		// a 
		// 	color: $color5
		// 	font-size: $FontSize4
		// 	font-weight: 700
		// 	opacity: .5
		// 	transition-duration: .5s
		// 	&:hover
		// 		opacity: 1	
		// @media screen and ( max-width: $MobileBreakPoint )
		// 	text-align: center
		// 	color: $color5
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

			}
		},
		async fetch() {

			await this.GetPosts();

		},
		watch: {
			PostContent: {
				handler() {
					if ( process.client ) {
						this.GetPostImage()
					}
				}
			}
		},
		methods: {

			...mapActions({
				GetFirebaseImageURL: 'Images/GetImageURL'
			}),

			async GetPostImage() {

				for (const key in this.PostContent) {

					const IMAGE = this.PostContent[key].image

					this.PostContent[key].image = await this.GetFirebaseImageURL({ 
						_path: IMAGE,
						_size: window.innerWidth * window.devicePixelRatio
					})
					
				}

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

				// const ELEMENT = document.getElementById(`PostID-${ ID }`)

				// 	const RECT 	= ELEMENT.getBoundingClientRect()
				// 	const POS 	= (RECT.top + pageYOffset) - ( RECT.height / 2 ) 

				// window.scrollTo({
				// 	top: Math.trunc(POS),
				// 	left: 0,
				// 	behavior: 'smooth'
				// });

			},
		},
	})

</script>
