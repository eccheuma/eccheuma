<template>
	
	<section class="swiper-container" ref="swiperContainer" 
		@mousedown.prevent	="MouseDown" 
		@mouseup.prevent		="MouseUp"
		@mouseleave	="mouseData.isHover = false" 
		@mouseenter	="mouseData.isHover = true">

		<div class="swiper-buttons" ref="swiperButtons" v-if="Configuration.buttons">
			<slot name="icon-prev" :onEdge="ActiveIndex == 0"></slot>
			<slot name="icon-next" :onEdge="ActiveIndex == Quantity - 1"></slot>
		</div>

		<div class="swiper-pagination" v-if="Configuration.indicators" ref="swiperIndicators">
			<template v-for="item in Quantity">
				<slot name="pagination" :active="ActiveIndex == item - 1"></slot>
			</template>
		</div>

		<div class="swiper-content" ref="swiperContent" :style="`width: ${ this.ContainerWidth * this.Quantity }px`">
			<slot :activeIndex="ActiveIndex"/>
		</div>

	</section>

</template>

<style lang="scss">

.swiper {
	&-container {
		cursor: pointer; position: relative;
		display: block; height: 100%; width: 100%;
		overflow: hidden;
	}
	&-pagination {
		position: absolute; top: 0; left: 0; z-index: 1;
		width: 100%; height: 10%; display: flex; justify-content: center;
		span {
			display: flex;
		}
	}
	&-content {
		height: 100%; will-change: transform;
		transition: {
			timing-function: ease-in-out;
			property: transform;
		}
	}
	&-buttons {
		button {

			position: absolute; z-index: 2;
			height: 75%; top: 12.5%;	

			&:nth-of-type(1) {
				left: 2vw;
			}
			&:nth-of-type(2) {
				right: 2vw;
			}

		}
	}
	&-item {
		display: inline-block; height: 100%;
	}
}

</style>

<script lang="ts">

import Vue, { PropOptions } from 'vue'

type Options = {
	animationDuration: number
	buttons: boolean
	indicators: boolean
	auto: boolean
	interval: number
}

const DefaultConfiguration: Options = {
	animationDuration: 500,
	buttons: false,
	indicators: false,
	auto: false,
	interval: 1000,
}

export default Vue.extend({
	props: {
		options: {
			required: false,
			default() { return DefaultConfiguration }
		} as PropOptions<Options>
	},
	data() {
		return {

			Configuration: DefaultConfiguration,

			mouseData: {
				offset: 50,
				hoverPosition: 0,
				clickPosition: 0,
				isDown: false,
				isHover: false,
			},

			ActiveIndex: 0,
			ContainerWidth: 0,
			Quantity: 0,

		}
	},
	watch: {
		'mouseData.hoverPosition': {
			handler() { this.UpdateStyles() }
		},
		'ActiveIndex': {
			handler() { this.UpdateStyles() }
		}
	},
	methods: {
		SlotChecker() {

			const I = setInterval(() => {

				if (( this.$refs.swiperContent as HTMLElement )?.children.length ) {
					this.$nextTick().then(() => { clearInterval(I); this.Init() })
				}

			}, 250)

			const T = setTimeout(() => {

				if ( ( this.$refs.swiperContent as HTMLElement )?.children.length ) {
					clearInterval(I); clearTimeout(T); console.warn("You probably not fill slot of content...")
				}

			}, 10e3 );

		},
		UpdateStyles() {

			const contentNode = this.$refs.swiperContent as HTMLElement;

			const MD 				= this.mouseData
			const SHIFT 		= MD.isDown ? ( MD.clickPosition - MD.hoverPosition ) : 0;
			const DURATION 	= this.Configuration.animationDuration

			// CSS HOUDINI SUPPORT 
			if ( window.CSS && CSS.number ) {

				const Y = (this.ContainerWidth * this.ActiveIndex) + SHIFT 

				const TRANSFORM = new CSSTransformValue([
					new CSSTranslate(CSS.px(-Y), CSS.px(0), CSS.px(0))
				])

				requestAnimationFrame(() => {

					contentNode.attributeStyleMap.set('width', CSS.px( this.ContainerWidth * this.Quantity ))
					contentNode.attributeStyleMap.set('transform', TRANSFORM)
					contentNode.attributeStyleMap.set('transition-duration', CSS.ms( MD.isDown ? 0 : DURATION ))

				})

			} else {

				const styles = contentNode.style.cssText

				requestAnimationFrame( () => {
					contentNode.setAttribute('style', `
						width: ${ contentNode.style.width };
						transition-duration: ${ MD.isDown ? 0 : DURATION };
						transform: translate3D( -${ (this.ContainerWidth * this.ActiveIndex) + SHIFT }px, 0px, 0px );
					`)
				})

			}

		},
		Init() {

			const containerNode = this.$refs.swiperContainer 	as HTMLElement;
			const contentNode 	= this.$refs.swiperContent 		as HTMLElement;

			this.Quantity 			= contentNode.children.length;
			this.ContainerWidth = containerNode.getBoundingClientRect().width

			Object.values( contentNode.children ).map((el, i) => {

				const DefaultClasses = el.getAttribute('class')
				
				el.setAttribute("class", `${ DefaultClasses || '' } swiper-item`.trim() )
				el.setAttribute("style", `width: ${ this.ContainerWidth }px`)

			})

			this.TouchEvents(containerNode);

			if ( this.Configuration.buttons ) {
				this.ButtonEvents()
			};

			if ( this.Configuration.indicators ) {
				this.DotsEvents();
			};

			if ( this.Configuration.auto ) {
				this.AutoChange()
			}

		},
		AutoChange(kill: boolean = false) {

			const I = setInterval(() => { 

				if ( !this.mouseData.isHover ) {
					this.ChangeSlide('NEXT') 
				}

			}, this.options.interval)

			if ( kill ) { clearInterval(I) }

		},
		DotsEvents() {

			const IndicatorsElement = this.$refs.swiperIndicators as HTMLElement;

			this.$nextTick().then(() => {

				Object.values( IndicatorsElement.children ).map((el, i) => {
					el.addEventListener('click', () => { this.ActiveIndex = i })
				})

			})

		},
		ButtonEvents() {

			const buttonContainer = this.$refs.swiperButtons as HTMLElement;

			const prevButton = buttonContainer.children[0];
			const nextButton = buttonContainer.children[1];

			prevButton.addEventListener('click', () => this.ChangeSlide('PREV'))
			nextButton.addEventListener('click', () => this.ChangeSlide('NEXT'))

		},
		TouchEvents(el: HTMLElement) {

			el.addEventListener('touchmove', 	(e: TouchEvent) => {
				
				requestAnimationFrame( () => this.mouseData.hoverPosition = e.changedTouches[0].clientX )

			}, { passive: true, capture: false });

			el.addEventListener('touchstart', (e: TouchEvent) => {

				this.mouseData.hoverPosition 	= this.mouseData.clickPosition 	= e.changedTouches[0].clientX;
				this.mouseData.isDown 				= true;

			}, { passive: true, capture: false });

			el.addEventListener('touchend', 	(e: TouchEvent) => {

				const POS 			= e.changedTouches[0].clientX;
				const MD				=	this.mouseData;

				const DIFFERNCE = MD.clickPosition - POS;

				MD.isDown	= false;

				if ( Math.abs( MD.clickPosition - POS) > MD.offset ) {
					this.ChangeSlide( DIFFERNCE > 0 ? 'NEXT' : 'PREV' )
				}

			}, { passive: true, capture: false })

		},
		MouseHover( e: Event ) {

			requestAnimationFrame( () => {
				this.mouseData.hoverPosition = (e as MouseEvent).x;
			})

		},
		MouseDown( e: MouseEvent ) {

			( this.$refs.swiperContainer as Element ).addEventListener('mousemove', this.MouseHover );

			this.mouseData.hoverPosition 	= this.mouseData.clickPosition 	= e.x;
			this.mouseData.isDown 				= true;

		},
		MouseUp( e: MouseEvent ) {

			( this.$refs.swiperContainer as Element ).removeEventListener('mousemove', this.MouseHover );

			this.mouseData.isDown 				= false;

			const DIFFERNCE = this.mouseData.clickPosition - e.x
			const OFFSET 		= this.mouseData.offset

			if ( Math.abs(this.mouseData.clickPosition - e.x) > OFFSET ) {
				this.ChangeSlide( DIFFERNCE > 0 ? 'NEXT' : 'PREV' )
			}

		},
		ChangeSlide(direction: 'NEXT' | 'PREV') {

			const lastIndex = this.Quantity - 1

			switch (direction) {

				case 'NEXT': if ( this.ActiveIndex === lastIndex ) { 
					this.ActiveIndex = 0 
				} else { this.ActiveIndex += 1 }break;

				case 'PREV': if ( !this.ActiveIndex ) { 
					this.ActiveIndex = lastIndex 
				} else { this.ActiveIndex -= 1 } break;
			}

		},
	},
	created() {

		this.Configuration 	= { ...this.Configuration, ...this.options };

	},
	mounted() { 

		// Из-за того, что VUE порой "ПО ОСОБЕННОМУ" обрабатывает виртуальный ДОМ, 
		// и не всегда присылает содержимое слотов - Приходится изощряться, и делать 
		// некое подобие EventLoop'а на минималках. Криво? - Да. Но по другому никак.

		// Подробнее тут: https://vuejs.org/v2/api/#vm-scopedSlots

		this.SlotChecker(); 

	}
})

</script>