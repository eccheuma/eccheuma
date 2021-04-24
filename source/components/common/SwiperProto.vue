<template>
	
	<section 
		ref="swiperContainer" 
		class="swiper-container" 
		@mousedown.prevent="MouseDown" 
		@mouseup.prevent="MouseUp"
		@mouseleave="mouseData.isHover = false" 
		@mouseenter="mouseData.isHover = true">

		<div v-if="Configuration.buttons" ref="swiperButtons" class="swiper-buttons">
			<slot name="icon-prev" :onEdge="ActiveIndex == 0" />
			<slot name="icon-next" :onEdge="ActiveIndex == Quantity - 1" />
		</div>

		<div v-if="Configuration.indicators" ref="swiperIndicators" class="swiper-pagination">
			<template v-for="item in Quantity">
				<slot name="pagination" :active="ActiveIndex == item - 1" />
			</template>
		</div>

		<div ref="swiperContent" class="swiper-content" :style="`width: ${ ContainerWidth * Quantity }vw`">
			<slot :activeIndex="ActiveIndex" />
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
	interval: 8000,
}

export default Vue.extend({
	props: {
		options: {
			type: Object,
			required: false,
			default() { return DefaultConfiguration }
		} as PropOptions<Options>
	},
	data() {
		return {

			slotChecks: 0,

			wasInit: false,

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
	created() {

		this.Configuration 	= { ...this.Configuration, ...this.options };

	},
	mounted() { 

		if ( !this.wasInit ) {
			this.slotChecker();
		}

	},
	methods: {
		getRelativeWindowSize(px: number): number {

			return 100 / ( window.innerWidth / px )

		},
		slotChecker(): void {

			if ( this.slotChecks === 10 ) {
				console.log("Swiper content may be empty, and it can't be mounted."); return
			}
			setTimeout(() => {
				( this.$refs.swiperContent as Element ).childElementCount 
					? this.$nextTick().then(this.Init)
					: this.$nextTick().then(this.slotChecker);
			}, 250)

			this.slotChecks += 1;

		},
		UpdateStyles() {

			const contentNode = this.$refs.swiperContent as HTMLElement;

			const MD 				= this.mouseData;
			const SHIFT 		= this.getRelativeWindowSize( MD.isDown ? ( MD.clickPosition - MD.hoverPosition ) : 0 );
			const DURATION 	= this.Configuration.animationDuration;

			// CSS HOUDINI SUPPORT 
			if ( window.CSS && CSS.number ) {

				const Y = (this.ContainerWidth * this.ActiveIndex) + SHIFT

				const TRANSFORM = new CSSTransformValue([
					new CSSTranslate(CSS.vw(-Y), CSS.px(0), CSS.px(0))
				])

				requestAnimationFrame(() => {

					contentNode.attributeStyleMap.set('width', CSS.vw( this.ContainerWidth * this.Quantity ))
					contentNode.attributeStyleMap.set('transform', TRANSFORM)
					contentNode.attributeStyleMap.set('transition-duration', CSS.ms( MD.isDown ? 0 : DURATION ))

				})

			} else {

				// const styles = contentNode.style.cssText

				requestAnimationFrame( () => {
					contentNode.setAttribute('style', `
						width: ${ contentNode.style.width };
						transition-duration: ${ MD.isDown ? 0 : DURATION };
						transform: translate3D( -${ (this.ContainerWidth * this.ActiveIndex) + SHIFT }vw, 0px, 0px );
					`)
				})

			}

		},
		setContainerWidth(el: HTMLElement): Promise<number> {
			return new Promise((resolve) => {

				const F = () => el.getBoundingClientRect().width;

				F() === 0 ? this.$nextTick(F) : resolve(F());

			})

		},
		async Init() {

			const containerNode = this.$refs.swiperContainer 	as HTMLElement;
			const contentNode 	= this.$refs.swiperContent 		as HTMLElement;

			this.Quantity 			= contentNode.children.length;
			this.ContainerWidth = this.getRelativeWindowSize(await this.setContainerWidth(containerNode))

			Object.values( contentNode.children ).map((el, i) => {

				const DefaultClasses = el.getAttribute('class')
				
				el.setAttribute('class', `${ DefaultClasses || '' } swiper-item`.trim() )
				el.setAttribute('style', `width: ${ this.ContainerWidth }vw`)

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

			this.wasInit = true;

		},
		AutoChange(kill: boolean = false) {

			const CALLBACK = () => {
				if ( !this.mouseData.isHover ) {
					this.ChangeSlide('NEXT');
				}
			}

			// Custom interval function
			const TICKER = () => { setTimeout(() => { CALLBACK(); TICKER() }, 8000) }; TICKER();

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

			const LISTENERS_OPTIONS = { passive: true, capture: false }

			el.addEventListener('touchmove', 	(e: TouchEvent) => {
				
				requestAnimationFrame( () => {
					this.mouseData.hoverPosition = e.changedTouches[0].clientX 
				})

			}, LISTENERS_OPTIONS);

			el.addEventListener('touchstart', (e: TouchEvent) => {

				this.mouseData.hoverPosition 	= this.mouseData.clickPosition 	= e.changedTouches[0].clientX;
				this.mouseData.isDown 				= true;

			}, LISTENERS_OPTIONS);

			el.addEventListener('touchend', 	(e: TouchEvent) => {

				const POS 			= e.changedTouches[0].clientX;
				const MD				=	this.mouseData;

				const DIFFERNCE = MD.clickPosition - POS;

				MD.isDown	= false;

				if ( Math.abs( MD.clickPosition - POS) > MD.offset ) {
					this.ChangeSlide( DIFFERNCE > 0 ? 'NEXT' : 'PREV' )
				}

			}, LISTENERS_OPTIONS)

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
})

</script>