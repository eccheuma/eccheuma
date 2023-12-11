<script lang="ts">

	import Vue from "vue";

	export default Vue.extend({
		props: {
			rootMargin: {
				type: Number,
				required: false,
				default: 0
			},
			ignite: {
				type: Boolean,
				default: true,
			},
			ready: {
				type: Boolean,
				default: true,
			},
			wrap: {
				type: Boolean,
				default: false,
			}
		},
		data() {
			return {

				ObserverInstance: undefined as IntersectionObserver | undefined,

				inView: false as boolean,

			};
		},
		watch: {
			inView: {
				handler() {
					this.$emit("isIntersecting", this.inView, this.$slots.default?.[0].elm);
				}
			},
			ready: {
				async handler() {
					this.setObserver(await this.createObserver());
				}
			},
		},
		async mounted() {

			if ( this.ignite ) {
				this.setObserver(await this.createObserver());
			}

		},
		destroyed() {

			this.ObserverInstance?.unobserve(this.$el);

		},
		methods: {

			createObserver(): Promise<IntersectionObserver> {

				const OPTIONS: IntersectionObserverInit = {
					rootMargin: ` ${ process.browser ? ( window.innerHeight / 100) * -( this.rootMargin ) : 0 }px 0px`
				};

				return new Promise((resolve) => {
					resolve(new IntersectionObserver(( entry ) => {
						
						this.defaultCB(entry);

					}, OPTIONS));
				});

			},

			setObserver(observer: IntersectionObserver) {

				observer.observe(this.$el);

				this.ObserverInstance = observer;

			},

			defaultCB([ firstEntry ]: IntersectionObserverEntry[] ) {
				this.inView = firstEntry.isIntersecting;
			} 

		},
		render(h): any {

			if ( this.wrap ) {
				return h("div", { staticClass: "itersection::wrapper" }, this.$slots.default);
			}

			return this.$slots.default;
			
		},
	});
	
</script>
