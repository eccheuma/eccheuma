<template>
	<div class="popover-container" :style="`top: ${ pop_position.y }px; left: ${ pop_position.x }px`">
		<transition name="PopoverTransition">
			<div
				v-show="active" 
				key="popover-content" 
				ref="popover" 
				class="popover-wrap"
				:style="`--w: ${ width / 2 }px`"
				:class="[{ 'utils::glassy': !$isMobile }]" 
				:data-pos="position"
				>
				<slot />
			</div>
		</transition>
	</div>
</template>

<style lang="scss">

.PopoverTransition {
	&-enter {
		opacity: 0;
		&-active {
			transition: opacity 250ms ease-in-out;			
		}
		&-to {
			opacity: 1;
		}
	}
	&-leave {
		opacity: 1;		
		&-active {
			transition: opacity 250ms ease-in-out;
		}
		&-to {
			opacity: 0;
		}
	}
}

.popover {
	&-container {

		pointer-events: none;

		position: absolute;
		height: 1px; 
		width: 1px;

		color: rgb(var(--mono-900)) !important;
		// background: greenyellow;

		z-index: 9999;

	}
	&-wrap {

		position: absolute;

		left: calc(var(--w, 0) * -1);

		padding: 2vh 1vw;

		border-radius: var(--border-radius);

		width: 35ch;

		background: {
			color: rgba(var(--mono-200), .75);
		}

		font: {
			size: var(--font-size-14);
			weight: 500;
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

		&[data-pos="top"] {
			&:after {
				--x: calc(50% - 5px);
				--y: 100%;
				--r: 180deg;
			}
		}

		&[data-pos="left"] {
			&:after {
				--x: -10px;
				--y: calc(50% - 5px);
				--r: -90deg;
			}
		}

		&:after {

			content: '';
			position: absolute;

			top: var(--y, 0px);
			left: var(--x, 0px);
			transform: rotate(var(--r, 0deg));

			height: 10px;
			width: 10px;
			background: var(--color-accent-edges-200);
			clip-path: polygon(0% 100%, 50% 50%, 100% 100%);

		}

	}
}

</style>

<script lang="ts">

	import Vue, { PropOptions } from 'vue'

	const MARGIN = 20;

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
				default: 'top'
			} as PropOptions<'top' | 'bottom' | 'left' | undefined>
		},
		data() {
			return {

				init: false,
				active: false,

				pop_position: {
					x: 0,
					y: 0,
				},

				width: 0,

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
			setPosition() {

				const PopoverTarget = document.getElementById(this.target)!
				const ParentRect 		= PopoverTarget?.getBoundingClientRect();
				const PopoverRect 	= ( this.$refs.popover as HTMLElement )?.getBoundingClientRect();

				requestAnimationFrame(() => {
					
					if ( PopoverTarget && PopoverRect && ParentRect ) {

						this.width = PopoverRect.width;
	
						const ParentCenter = {
							x: PopoverTarget.offsetLeft + (ParentRect.width / 2),
							y: PopoverTarget.offsetTop  + (ParentRect.height / 2),
						}

						switch (this.position) {
							case 'left': {

								this.pop_position.x = (ParentRect.width + MARGIN) + ( PopoverRect.width / 2 );
								this.pop_position.y = ParentCenter.y - ( PopoverRect.height / 2 );

							} break;

							case 'top': {

								this.pop_position.x = ParentCenter.x
								this.pop_position.y = (MARGIN + PopoverRect.height) * -1;

							} break;
						
							default: {
								this.pop_position.x = ParentCenter.x;
								this.pop_position.y = ParentCenter.y;
							}

						}
	
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
