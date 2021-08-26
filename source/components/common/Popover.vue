<template>
	<div 
		class="popover-container" 
		:style="`top: ${ pop_position.y }px; left: ${ pop_position.x }px`"
		>
		<transition name="PopoverTransition">
			<div v-show="active" ref="popover" class="popover-wrap" :class="[{ 'utils::glassy': !$isMobile }]">
				<slot />
			</div>
		</transition>
	</div>
</template>

<style lang="scss">

.PopoverTransition {
	&-enter {
		transform: translateY(30px);
		opacity: 0;
		&-active {
			transition: all 250ms ease-in-out;			
		}
		&-to {
			opacity: 1;
			transform: translateY(0px);		
		}
	}
	&-leave {
		transform: translateY(0px);
		opacity: 1;		
		&-active {
			transition: all 250ms ease-in-out;
		}
		&-to {
			opacity: 0;
			transform: translateY(30px);		
		}
	}
}

.popover {
	&-container {

		pointer-events: none;

		position: absolute;

		left: 50%;
		height: 1px; width: 1px;

		z-index: 9999;

		color: rgb(var(--mono-900)) !important;
		// background: greenyellow;

		z-index: 9999;

	}
	&-wrap {

		overflow: hidden;

		position: absolute;
		transform: translateX(-50%);

		padding: 2vh 3vw;

		border-radius: .7rem;

		width: 40ch;

		background: {
			color: rgba(var(--mono-200), .75);
		}

		font: {
			size: var(--font-size-16);
			weight: 600;
		}

		text: {
			align: center;
		}

		&:before {

			@include gradient_border(block);

			content: '';
			
			position: absolute;
			top: 0; left: 0;

			width: 100%; height: 100%;

		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	export default Vue.extend({
		props: {
			target: {
				type: String,
				required: true,
			},
			startDelay: {
				type: Number,
				default: 0,
			},
			endDelay: {
				type: Number,
				default: 250,
			},
			position: {
				type: String,
				default: 'bottom'
			} as PropOptions<'top' | 'bottom' | undefined>
		},
		data() {
			return {

				init: false,
				active: false,

				pop_position: {
					x: 0,
					y: 0,
				}

			}
		},
		mounted() {

			const T = document.getElementById(this.target)

			if ( !this.init ) {

				T?.addEventListener('mouseenter', () => this.ChangeState(true), { capture: true, passive: true });
				T?.addEventListener('mouseleave', () => this.ChangeState(false), { capture: true, passive: true });

				this.init = true;

			}

		},
		methods: {
			setPosition(): number {

				const TARGET 				= document.getElementById(this.target)!

				const ParentRect 		= TARGET?.getBoundingClientRect();
				const PopoverRect 	= ( this.$refs.popover as HTMLElement )?.getBoundingClientRect();

				const TargetMargin: number 	= TARGET.parentElement!.getBoundingClientRect().height - ParentRect.height;

				return requestAnimationFrame(() => {

					if ( TARGET && PopoverRect && ParentRect ) {
	
						const ParentCenter = {
							x: TARGET.offsetLeft 	+ (ParentRect.width / 2),
							y: TARGET.offsetTop 	+ (ParentRect.height / 2),
						}
	
						const MARGIN = (mar: number = 20): number => {
	
							const U = (ParentRect.height / 2) + mar
	
							switch (this.position) {
	
								case 'top':
									return -(ParentRect.height - (TargetMargin / 2) + PopoverRect.height + mar);
	
								case 'bottom':
									return ParentRect.height 
	
								default: 
									return ParentRect.top - mar - PopoverRect.height < 0 
										? U 
										: -(U + PopoverRect.height);
	
							}
	
						};
	
						this.pop_position.x = ParentCenter.x;
						this.pop_position.y = ParentCenter.y + MARGIN();
	
					}

				})

			},
			ChangeState(status: boolean) {
				const T = setTimeout(() => {

					this.active = status; clearTimeout(T);

					if ( status ) {
						this.$nextTick(this.setPosition);
					}

				}, status ? this.startDelay : this.endDelay )
			},
		},
	})

</script>
