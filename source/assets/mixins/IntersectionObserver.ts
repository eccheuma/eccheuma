	import Vue from 'vue'

// TYPES

	import type { AnimeAnimParams } from 'animejs';

	type ANIMATION_MODE = 'in' | 'out';

	export type ANIMATION_PAYLOAD = {
		in: AnimeAnimParams
		out: AnimeAnimParams
	}

	type OPTIONS = {
		animation_target: Element | HTMLElement 
	}

	type PAYLOAD = {
		el: Element, 
		animation: ANIMATION_PAYLOAD, 
		_threshold?: number, 
		_options?: OPTIONS,
		_cb?: (entry: IntersectionObserverEntry[]) => any
	}

// DECLARE FUNC

	declare module 'vue/types/vue' {
		interface Vue {
			initIntersectionObserver: (payload: PAYLOAD) => void
		}
	}

// MODULE

export default Vue.extend({
	data() {
		return {
			ObserversMap: 	new Map() as Map<Element, IntersectionObserver>,
			AnimationState: new Map() as Map<Element, boolean>,
		}
	},
	methods: {

		initIntersectionObserver(payload: PAYLOAD) {

			const DEF_CB = (isIntersecting: boolean) => {
				this.animateElement(

				isIntersecting 
					? 'in' 
					: 'out', 
				payload._options?.animation_target || payload.el, 
				payload.animation)
			}
	
			const OPTIONS = {
				threshold: payload._threshold ?? this.$isMobile ? 0 : .25
			};
	
			const OBSERVER = new IntersectionObserver((entry) => {
				payload._cb ? payload._cb(entry) : DEF_CB(entry.pop()!.isIntersecting)
			}, OPTIONS);

			this.ObserversMap.set(payload.el, OBSERVER);
			this.AnimationState.set(payload.el, false)

			OBSERVER.observe(payload.el)

		},

		animateElement(mode: ANIMATION_MODE, el: Element, animation: ANIMATION_PAYLOAD) {

			const AS = this.AnimationState

			const DUR = 500;

			const ANIMATION = this.$AnimeJS({
				targets: el,
				duration: DUR,
				easing: 'linear',

				...animation[mode],

				begin: () => {
					AS.set(el, true)
				},
				complete: () => {
					setTimeout(() => {
						AS.set(el, false)
					}, 250);
				}

			})

			if ( AS.get(el) === false ) {
				ANIMATION.play() 
			}

		}

	}
})
