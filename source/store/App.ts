import { MutationTree } from 'vuex'

// TYPES
	import type { APP_THEME } from '~/typescript/App'

// SYSTEM THEME

// STATE
	export const state = () => ({

		UI: 'dark' as APP_THEME,

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

			state.UI = theme; 
			
			window.localStorage.setItem('UI', theme)

		},
	}
