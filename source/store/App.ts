	
import { MutationTree } from "vuex";

// UTILS
	import { cache } from "~/utils/cache";
	import { languages } from "~/lang";

// TYPES
	import type { APP_THEME } from "~/contracts/App";

// STATE
	export const state = () => ({
		UI: "dark" as APP_THEME,
		Lang: languages.Russian,
	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module "~/contracts/VuexMap" {
		interface VuexMap {
			App: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setUI(state, theme: APP_THEME) {
			state.UI = theme; cache.set("UI", theme);
		},

	};
