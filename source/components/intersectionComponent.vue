<template>
	<eccheuma-wrapper class="intersection-component">
		<slot />
	</eccheuma-wrapper>
</template>

<script lang="ts">

	import Vue from 'vue'

	export default Vue.extend({
		props: {
			// callback: {
			// 	type: Function,
			// 	required: false,
			// 	default: ( entry: any ) => { console.warn(`Intersection observer callback is missed. Entry is: ${ entry }`) }
			// } as PropOptions<(entry: any) => void>,
			rootMargin: {
				type: Number,
				required: false,
				default: 0
			}
		},
		data() {
			return {

				ObserverInstance: undefined as IntersectionObserver | undefined,

				inView: undefined as boolean | undefined,

			}
		},
		watch: {
			inView: {
				handler() {
					this.$emit('isIntersecting', this.inView, this.$slots.default![0].elm)
				}
			}
		},
		created() {

			const OPTIONS: IntersectionObserverInit = {
				rootMargin: ` ${ process.browser ? ( window.innerHeight / 100) * -( this.rootMargin ) : 0 }px 0px`
			};

			if ( process.browser ) {
				this.ObserverInstance = new IntersectionObserver(( entry ) => {

					// this.callback(entry); 
					
					this.innerCallback(entry)

				}, OPTIONS)
			}

		},
		mounted() {

			this.ObserverInstance?.observe(this.$el); this.inView = false;

		},
		beforeDestroy() {

			this.ObserverInstance?.unobserve(this.$el)

		},
		methods: {
			innerCallback( entry: IntersectionObserverEntry[] ) {

				this.inView = entry[0].isIntersecting

			} 
		}
	})
</script>
