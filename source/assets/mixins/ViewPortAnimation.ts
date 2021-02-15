 import Vue from 'vue'

// INSTANCE
	type INSTANCE = {
		callback: (isVisible: boolean, entry: any) => void
		once: true 
		threshold: number
	}

// DECLARE INSTANCE
	declare module 'vue/types/vue' {
		interface Vue {
			ObserveVisibilityOptions: INSTANCE
		}
	}


// MODULE
export default Vue.extend({
	data() {
		return {
			ObserveVisibilityOptions: {
				callback: (isVisible: boolean, entry: any) => {},
				once: true, 
				threshold: 0.5,
			} as INSTANCE
		}
	},
	created() {
		this.ObserveVisibilityOptions.callback = this.AnimateBlock
	},
	methods: {
		AnimateBlock(isVisible: boolean, entry: any) {

			if ( !this.$isMobile && isVisible ) { 
				this.$AnimeJS({
					targets: `#${entry.target.id}`,
					translateY: [100, 0],
					opacity: [0, 1],
					delay: 500,
					duration: 500,
					round: 10,
					easing: 'linear'
				})
			} 

		}
	}
})