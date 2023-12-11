import Vue from "vue";

// DECLARE FUNC

	declare module "vue/types/vue" {
		interface Vue {
			initCooler: (el: Element, cb: (cooled: boolean) => void ) => void
		}
	}

// OPTIONS
	const OPTIONS = {
		threshold: 0
	};

// MODULE
	export default Vue.extend({
		methods: {
			initCooler(el: Element, cb: (cooled: boolean) => void ): void {

				let cooled = false;

				new IntersectionObserver((entry) => {

					cooled = !entry[0].isIntersecting; cb(cooled);

				}, OPTIONS).observe(el);

			},

		}
	});
