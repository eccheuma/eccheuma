<template>
	<section class="header-carousel-container">

		<profile v-if="LoginStatus && !$isMobile" />

		<section class="eccheuma_swiper">
			<carousel :options="{ buttons: !$isMobile, indicators: true, auto: true }">

				<template v-if="!$isMobile" #icon-prev="{ onEdge }">
					<button 
						class="eccheuma_swiper-buttons" 
						:class="[
							{ onEdge }, { 'utils::glassy': BROWSER && !$isMobile && $PIXI.utils.isWebGLSupported() && !CarouselFocus }
						]"
						@mouseenter="CarouselFocus = true" 
						@mouseleave="CarouselFocus = false"
						>
						<icon name="Arrow" style="transform: rotate(0deg)" />
					</button>
				</template>

				<template v-if="!$isMobile" #icon-next="{ onEdge }">
					<button 
						class="eccheuma_swiper-buttons" 
						:class="[
							{ onEdge }, { 'utils::glassy': BROWSER && !$isMobile && $PIXI.utils.isWebGLSupported() && !CarouselFocus }
						]"
						@mouseenter="CarouselFocus = true" 
						@mouseleave="CarouselFocus = false"
						>
						<icon name="Arrow" style="transform: rotate(180deg)" />
					</button>
				</template>

				<template #pagination="{ active }">
					<span 
						class="eccheuma_swiper-dots" 
						:class="{ active_dot: active }" 
						@mouseenter="CarouselFocus = true" 
						@mouseleave="CarouselFocus = false"
					/>
				</template>

				<template #default="{ activeIndex }">
					<section 
						v-for="(item, index) in PostContent" 
						:key="item.ID" 
						class="eccheuma_swiper-item"
						@dblclick="GoToPost(item.ID)"
						>

							<client-only>

								<template v-if="BROWSER && $PIXI.utils.isWebGLSupported() && !$isMobile">
									<parallax 
										:options="{ OpacityFade: true, OpacityFadeOffset: 100 }" 
										:forcedScrollPosition="CommonCarouselScrollPosition"
										@scroll-position="setScrollPosition"
										>

										<picture ref="ImageHolder" class="eccheuma_swiper-image" :class="!CarouselFocus ? `focused` : `unfocused`">
											<template v-if="PostImages[item.ID]">
												<source :srcset="PostImages[item.ID].avif" type="image/avif">
												<img :src="PostImages[item.ID].webp">
											</template>
											<template v-else>
												<img :src="ImagePlaceholder">
											</template>
										</picture>

									</parallax>
								</template>

								<template v-else>
									<picture ref="ImageHolder" class="eccheuma_swiper-image" :class="!CarouselFocus ? `focused` : `unfocused`">
										<template v-if="PostImages[item.ID]">
											<source :srcset="PostImages[item.ID].avif" type="image/avif">
											<img :src="PostImages[item.ID].webp">
										</template>
										<template v-else>
											<img :src="ImagePlaceholder">
										</template>
									</picture>
								</template>

							</client-only>

							<div class="eccheuma_swiper-post" :class="{'content-hidden': index > ( activeIndex + 1 ) || index < ( activeIndex - 1 )}">

								<section class="eccheuma_swiper-tags">
									<tag v-for="(tag_content, i) in item.tags" :key="i">
										#{{ tag_content }}
									</tag>
								</section>

								<section class="eccheuma_swiper-caption">
									<h2>{{ item.title }}</h2>
									<h6>{{ item.description }}</h6>
									<span @click="GoToPost(item.ID)">
										Перейти к посту
									</span>
								</section>

								<section class="eccheuma_swiper-info">
									<template v-if="PostReliseTime[index]">
										<tag>{{ PostReliseTime[index].Day }} в {{ PostReliseTime[index].Time }}</tag>
									</template>
								</section>

							</div>

					</section>
				</template>

			</carousel>
		</section>

	</section>
</template>

<style lang="scss">

.header-carousel-container {

	position: relative;
	width: $GLOBAL-BodySize;

}

.eccheuma_swiper {

	position: relative; 

	width: $GLOBAL-BodySize;
	height: 100%; 

	background: rgb(var(--mono-200)); 
	color: rgb(var(--mono-800));

	.content-hidden {
		display: none;
	}

	&-item {

		position: relative;
		display: inline-block; 

		width: $GLOBAL-BodySize; 
		height: 100%;

		&:after {

			content: "";
			position: absolute; 
			z-index: 1;

			top: 0; 
			left: 0; 

			width: 100%; 
			height: 100%;

			background-image: url(~assets/images/Stripes.png?format=webp&size=15);
			opacity: .50;
		}

	}

	.focused {
		opacity: .75;
		filter: brightness(75%) blur(0px);
	}

	.unfocused {
		opacity: .25;
		filter: brightness(50%) blur(3px);
	}

	&-image {
		position: relative;
		height: 100%; width: 100%;
		background: { size: cover; position: center }
		transition: all 500ms ease-in-out;

		img {
			width: 100%;
			height: 100%;
			object-fit: cover;
		}

	}

	.onEdge {
		opacity: .25; pointer-events: none;
	}

	&-buttons {
		
		cursor: pointer;
		color: rgb(var(--color-mono-1000));
		background-color: rgba(var(--color-mono-200), .75);
		border: 0px solid transparent;
		border-radius: var(--border-radius);
		padding: 0 2vh;
		transition-duration: .5s;

		i {
			@include icon-size(2vw);
			fill: var(--color-accent-edges-200);
		}

	}

	$dotSize: calc(max(5vw, 60px));;

	.active_dot {
		&:before {
			content: ''; 
			width: 100%; height: 1px; margin: auto 4px; opacity: 1;
			background-color: rgb(var(--color-mono-1000)); 
			transition: opacity, margin 250ms ease-in-out;
		}
	}

	&-dots {
		position: relative;
		width: $dotSize; height: 100%; 
		&:before {
			content: ''; 
			width: 100%; height: 1px; margin: auto 0; opacity: .5;
			box-shadow: 0px 1px 0px rgb(var(--color-mono-200));
			background-color: rgb(var(--color-mono-1000)); 
			transition: opacity, margin 250ms ease-in-out;
		}
		&:hover {
			&:before {
				margin: auto 8px; opacity: 1;
			}
		}
	}
	
	&-post {

		position: absolute; 
		z-index: 1010;
		top: 0; left: 0; 
		
		width: $GLOBAL-BodySize;
		height: 100%;

		padding: 5vh 10vw;

		display: grid;
		grid-template: {
			rows: 2fr 75% 2fr
		}

		@media screen and ( max-width: $mobile-breakpoint ) {
			text-align: center;
		}

		section {

			display: inline-grid;

			align: {
				self: start; 
				content: center;
			}

			justify: {
				self: center;
				content: center;
			}

			width: 100%; height: 100%;

		}

	}

	&-tags {
		display: inline-flex !important;
		column-gap: calc(min(5px, .5vw));
		align-items: center;
	} 

	// &-info {}

	&-caption {

		$TBL: 	.5px;
		$TBLO: 	.5;
		$TBR: 	.5px;

		justify-content: start !important;

		// eslint-disable-next-line no-mixed-spaces-and-tabs
		text-shadow: 
			#{ $TBR  }  #{ $TBR } $TBL rgba(var(--mono-300), $TBLO ),
			-#{ $TBR } -#{ $TBR } $TBL rgba(var(--mono-300), $TBLO ),
			-#{ $TBR }  #{ $TBR } $TBL rgba(var(--mono-300), $TBLO ),
			#{ $TBR  } -#{ $TBR } $TBL rgba(var(--mono-300), $TBLO ),
			#{  0px  }  #{ 2px  } 0px  rgba(var(--mono-200), $TBLO );

		h2 {
			font-size: var(--font-size-42);
			font-weight: 900;
		}

		h6 {
			white-space: pre-wrap;
			font: {
				size: var(--font-size-24);
				weight: 500;
			}
			margin: 0 0 1vh;
			width: calc(min(100%, 60ch));
		}

		span {

			display: inline-flex;
			gap: 10px;

			align-items: center;

			font: {
				size: var(--font-size-14);
			}

		}

	}

}

</style>

<script lang="ts">

	import Vue from 'vue'

	// FIREBASE
		import firebase from 'firebase/app'
		import 'firebase/database'
	
	// VUEX
		import { mapActions, mapState } from 'vuex'

	// COMPONENTS
		import Parallax 							from '~/components/common/Parallax.vue';
		import Carousel 							from '~/components/common/Carousel.vue';
		import Icon 									from '~/components/common/Icon.vue';
		import Tag 										from '~/components/common/Tag.vue';
	
	// MIXINS
		import EmitSound from '~/assets/mixins/EmitSound'

	// TYPES
		import type { FORMATED_DATE } from '~/store'
		import type { IMAGE_URL } 		from '~/typescript/Image'
		import type { POST } 					from '~/typescript/Post'

		import type { VuexModules } from '~/typescript/VuexModules'

	// VARS
		const PLACEHOLDER_L = `${ require('~/assets/images/ImagePlaceholder.png?resize&size=600')}`
	
	// MODULE
	export default Vue.extend({
		components: { 
			Parallax, 
			Carousel,
			Icon,
			Tag,
			Profile: () => import('~/components/profile/Profile.vue'),
		},
		mixins: [ EmitSound ],
		data() {
			return {

				ready: false,

				ImagePlaceholder: PLACEHOLDER_L,

				Focus: false,
				CarouselFocus: false,

				elementInFocus: undefined,

				PostForRequest: 4,

				CommonCarouselScrollPosition: 0,

				PostContent: 		[] as POST[],
				PostReliseTime: [] as FORMATED_DATE[],
				PostImages: 		[] as IMAGE_URL[],

			}
		},
		async fetch() {

			await this.GetPosts();

		},
		computed: {

			...mapState({
				LoginStatus:	state => (state as VuexModules).Auth.Session.LoginStatus,
			})

		},
		watch: {
			PostContent: {
				handler() {

					this.PostContent.forEach(async (post) => {
						this.PostReliseTime[post.ID] = await this.GetLocalTime(post.date);
					})

					this.getImages(this.PostContent).then((data) => {
						this.PostImages = data.reverse();
					});

				}
			}
		},
		methods: {

			...mapActions({
				GetFirebaseImageURL: 	'Images/GetImageURL',
				getImageURL: 					'Images/getImageURL',
				GetLocalTime:					'GetLocalTime',
			}),

			getImages(posts: POST[]): Promise<IMAGE_URL[]> {

				const PROMISES = posts.map(async (post): Promise<IMAGE_URL> => {
					return await this.getImageURL({ 
						_path: post.image,
						_size: this.$isMobile 
							? ( window.innerWidth * window.devicePixelRatio ) * 1.5
							: ( window.innerWidth * window.devicePixelRatio )
					})
				})

				return Promise.all(PROMISES)

			}, 

			setScrollPosition(scroll: number) {

				this.CommonCarouselScrollPosition = scroll;
				
			},

			async GetPosts() {

				const REF = firebase.database().ref('Posts');

				const QUANTITY = await REF
					.once('value')
					.then(posts => posts.numChildren());
			
				const DATA = await REF
					.orderByChild('ID')
					.startAt( QUANTITY - this.PostForRequest )
					.once('value')
					.then(posts => Object.values(posts.val()) as POST[])

				this.PostContent = DATA.reverse();
				
			},

			GoToPost(ID: string | number) {

				const SCROLL_TO_OBJECT = () => {

					const ELEMENT = document.getElementById(`PostID-${ ID }`)
	
					if ( ELEMENT ) {
	
						const RECT 	= ELEMENT.getBoundingClientRect()
						const POS 	= (RECT.top + pageYOffset) - (RECT.height / 2) 

						window.scrollTo({
							top: Math.trunc(POS),
							left: 0,
							behavior: 'smooth'
						})
	
					}

				}

				if ( this.$route.name === 'home' ) {
					SCROLL_TO_OBJECT(); return;
				}

				this.$router.push({ path: 'home' }, () => this.$nextTick(SCROLL_TO_OBJECT));

			},
		},
	})

</script>
