declare module '@vue/runtime-core' {

	import type { DefineComponent } from 'vue/types/v3-define-component';
	import type { ClientOnlyProps } from 'vue-client-only';

	export interface GlobalComponents {
		ClientOnly: DefineComponent<ClientOnlyProps>;
		NuxtLink: DefineComponent<{
			to: string | object;
			tag?: string;
			activeClass?: string;
      class?: Record<string, boolean>,
		}>;

	}

}
