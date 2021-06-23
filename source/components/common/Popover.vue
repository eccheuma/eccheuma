<template>
	<div class="popover-container" :style="`top: ${ position.y }px; left: ${ position.x }px`">
		<transition name="PopoverTransition">
			<div v-show="active" ref="popover" class="popover-wrap">
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

		color: rgb(var(--color-def-6)) !important;

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
			color: rgb(var(--color-def-1));
		}

		font: {
			size: var(--font-size-5);
		}

		text: {
			align: center;
		}

		&:before {

			@include gradient_border(both);

			content: '';
			
			position: absolute;
			top: 0; left: 0;

			width: 100%; height: 100%;

		}

	}
}

</style>

<script lang="ts">

	import Vue from 'vue'

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
			}
		},
		data() {
			return {

				init: false,
				active: false,

				position: {
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
			setPosition() {

				const TARGET = document.getElementById(this.target)

				const ParentRect 	= TARGET?.getBoundingClientRect();
				const PopoverRect = ( this.$refs.popover as HTMLElement )?.getBoundingClientRect();

				if ( TARGET && ParentRect && PopoverRect ) {

					const ParentCenter = {
						x: TARGET.offsetLeft 	+ ( ParentRect.width 	/ 2 ),
						y: TARGET.offsetTop 	+ ( ParentRect.height / 2 ),
					}

					const MARGIN = (mar: number = 40): number => {

						const U = (ParentRect.height / 2) + mar

						return ParentRect.top - mar - PopoverRect.height < 0 
							? U
							: -(U + PopoverRect.height)

					};

					this.position.x = ParentCenter.x;
					this.position.y = ParentCenter.y + MARGIN();

				}

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
