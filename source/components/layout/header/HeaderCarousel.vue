<template>
	<section class="header-carousel-container">

		<profile v-if="LoginStatus && !$isMobile" />

		<section class="eccheuma_swiper">
			<carousel :options="{ buttons: !$isMobile, indicators: true, auto: true }">

				<template v-if="!$isMobile" #icon-prev="{ onEdge }">
					<button 
						class="eccheuma_swiper-buttons" 
						:class="[
							{ onEdge }, { 'utils::glassy': application.context.browser && !$isMobile && application.gpu.available() && !CarouselFocus }
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
							{ onEdge }, { 'utils::glassy': application.context.browser && !$isMobile && application.gpu.available() && !CarouselFocus }
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
						v-for="(item, index) in Slides" 
						:key="item.content.ID" 
						class="eccheuma_swiper-item"
						@dblclick="GoToPost(item.content.ID)"
						>

							<parallax 
								:options="{ OpacityFade: true, OpacityFadeOffset: 100 }" 
								:forcedScrollPosition="CommonCarouselScrollPosition"
								@scroll-position="setScrollPosition"
								>

								<picture ref="ImageHolder" class="eccheuma_swiper-image" :class="!CarouselFocus ? `focused` : `unfocused`">
									<source :srcset="item.formatsStruct.avif" type="image/avif">
									<img :src="item.formatsStruct.webp">
								</picture>

							</parallax>

							<div class="eccheuma_swiper-post" :class="{'content-hidden': index > ( activeIndex + 1 ) || index < ( activeIndex - 1 )}">

								<section class="eccheuma_swiper-tags">
									<tag v-for="(tag_content, i) in item.content.tags" :key="i">
										#{{ tag_content }}
									</tag>
								</section>

								<section class="eccheuma_swiper-caption">
									<h2>{{ item.content.title }}</h2>
									<h6>{{ item.content.description }}</h6>
									<span @click="GoToPost(item.content.ID)">
										Перейти к посту
									</span>
								</section>

								<section class="eccheuma_swiper-info">
										<tag>{{ item.date.Day }} в {{ item.date.Time }}</tag>
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
	// width: 100%;

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
		// width: 100vw;

		&:after {

			content: "";
			position: absolute; 
			z-index: 1;

			top: 0; 
			left: 0; 

			width: 100%; 
			height: 100%;

			background-image: url(~assets/images/Stripes.png?size=15);
			opacity: .75;
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
			width: 100%; height: 1px; margin: auto 0px; opacity: .5;
			box-shadow: 0px 1px 0px rgb(var(--color-mono-200));
			background-color: rgb(var(--color-mono-1000)); 
			transition-duration: 250ms;
		}
		&:hover {
			&:before {
				margin: auto 4px; opacity: 1;
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

	// API
		import { mapActions, mapState } from 'vuex'
		import { database } from '~/api/database'

	// VUEX
	
	// UTILS
		import { utils, LocaleDate } from '~/utils';

	// COMPONENTS
		import Parallax from '~/components/common/Parallax.vue';
		import Carousel from '~/components/common/Carousel.vue';
		import Icon 		from '~/components/common/Icon.vue';
		import Tag 			from '~/components/common/Tag.vue';
	
	// MIXINS
		import EmitSound from '~/assets/mixins/EmitSound'

	// LOAD POLITIC
		import { load_ranges } from '~/config/LoadPolitic'

	// TYPES
		import type { Image } from '~/typescript/Image';
		import type { Post } 	from '~/typescript/Post';

		import type { VuexMap } from '~/typescript/VuexMap';

		type HeaderSlide = {
			content: Pick<Post.struct, 'title' | 'description' | 'ID' | 'tags'>
			date: LocaleDate
			formatsStruct: Image.formatsStruct
		}

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

				Slides: Array<HeaderSlide>(0),

			}
		},
		async fetch() {

			await this.GetPosts();

		},
		computed: {

			...mapState({
				LoginStatus:	state => (state as VuexMap).Auth.Session.LoginStatus,
			})

		},
		methods: {

			...mapActions({
				getImageURL: 'Images/getImageURL',
			}),

			setScrollPosition(scroll: number) {
				this.CommonCarouselScrollPosition = scroll;
			},

			async GetPosts() {

				const POSTS: utils.asIterableObject<Post.struct> = await database.get('Posts', { limit: load_ranges.posts })

				const formatedSlides = Object
					.values(POSTS)
					.map(async ({ title, description, ID, tags, image, date }) => {

						return {
							content: { title, description, ID, tags },
							date: utils.getLocalTime(date),
							formatsStruct: await this.getImageURL({ 
								path: image,
								size: 1440,
							})
						} as HeaderSlide

					})

				this.Slides = await Promise.all(formatedSlides)
				
			},

			GoToPost(ID: string | number) {

				const targetElement = document.getElementById(`PostID-${ ID }`);

				if ( !targetElement ) return;

				const { top, height } = targetElement.getBoundingClientRect();

				const targetPosition = ( top + scrollY ) - ( height / 2 );

				function scrollToTarget() {
					window.scrollTo({
						top: targetPosition,
						behavior: 'smooth'
					})
				}

				switch (this.$route.name) {

					case 'home': scrollToTarget(); break;
				
					default: this.$router.push({ path: 'home' }).then(scrollToTarget); break;

				}

			},
		},
	})

</script>
