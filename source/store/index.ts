
// VUEX TYPES
	import type { MutationTree } from "vuex";
	
	export const strict = false;

// STATE
	export const state = () => ({

		AppScroll: false,
		isDesktop: true,

	});

// ROOT STATE TYPE
	export type RootState = ReturnType<typeof state>
	
// MUTATIONS
	export const mutations: MutationTree<RootState> = {
		setDeviceType(state, prop) {
			state.isDesktop = prop;
		},
		AppScroll(state, prop) {
			state.AppScroll = prop;
		},
	};
