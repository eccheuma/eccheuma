import { ActionTree, MutationTree } from 'vuex'


// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface VuexModules {
			ScrollBar: CurentState
		}
	}

// STATE
	export const state = () => ({

		DarkUI: false
		
	})

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		ThemeChange(state, prop) {

			state.DarkUI = prop ?? !state.DarkUI

		},
	}

// ACTIONS
	export const actions:ActionTree<CurentState, CurentState> = {
		ChangeUITheme({commit}, prop) {

			localStorage.theme = prop

			commit('ThemeChange', prop)

		}
	}