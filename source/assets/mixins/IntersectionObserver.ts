	import Vue from 'vue'

// TYPES

	import type { AnimeAnimParams } from 'animejs';

	type ANIMATION_MODE = 'in' | 'out';

	export type ANIMATION_PAYLOAD = {
		in: AnimeAnimParams
		out: AnimeAnimParams
	}

// DECLARE FUNC

	declare module 'vue/types/vue' {
		interface Vue {
			initIntersectionObserver: (
				el: Element, 
				animation: ANIMATION_PAYLOAD, 
				_threshold?: number, 
				_cb?: (entry: IntersectionObserverEntry[]) => any ) => void
		}
	}

// MODULE

	export default Vue.extend({
		data() {
			return {
				IntersectionObserverInstances: new Map() as Map<Element, { animated: boolean }>
			}
		},
		methods: {

			initIntersectionObserver(
				el: Element, 
				animation: ANIMATION_PAYLOAD, 
				_threshold?: number, 
				_cb?: (entry: IntersectionObserverEntry[]) => any ) {

				const DEF_CB = (isIntersecting: boolean) => {
					this.animateElement(isIntersecting ? 'in' : 'out', el, animation)
				}
		
				const OPTIONS = {
					threshold: _threshold ?? this.$isMobile ? 0 : .25
				};
		
				new IntersectionObserver((entry) => {
					_cb ? _cb(entry) : DEF_CB(entry.pop()!.isIntersecting)
				}, OPTIONS).observe(el)

			},

			animateElement(mode: ANIMATION_MODE, el: Element, animation: ANIMATION_PAYLOAD) {

				const IO_Inst = this.IntersectionObserverInstances

				if ( IO_Inst.get(el)?.animated === false || undefined ) {

					this.$AnimeJS({
						targets: el,
						duration: 500,
						easing: 'linear',
	
						...animation[mode],

						begin: () => {
							IO_Inst.set(el, { animated: true })
						},
						complete: () => {
							IO_Inst.set(el, { animated: false })
						}
	
					})

				}

			}

		}
	})
