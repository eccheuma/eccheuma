	
	import { MutationTree, ActionTree } from 'vuex'

	// TYPES
	import type { APP_THEME } from '~/typescript/App'
	import type { RootState } from '~/store'

	// STATE
	export const state = () => ({

		UI: 'dark' as APP_THEME,

		mobileBrakepoint: 768,

		windowSize: {
			innerHeight: 0,
			innerWidth: 0,
		} as Pick<Window, 'innerHeight' | 'innerWidth'>

	})

	// CURENT STATE
	export type CurentState = ReturnType<typeof state>

	// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface VuexModules {
			App: CurentState
		}
	}

	// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setUI(state, theme: APP_THEME) {
			state.UI = theme; window.localStorage.setItem('UI', theme)
		},

		updateSizes(state, sizes) {
			state.windowSize = sizes;
		},

		setMobileBrakepoint(state, value) {
			state.mobileBrakepoint = value;
		},

	}

	// ACTIONS
	export const actions: ActionTree<CurentState, RootState> = {

		onViewBrakepoint({ state }, value) {
			return value <= state.mobileBrakepoint
		}

	}
