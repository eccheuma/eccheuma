import { ActionTree, MutationTree } from 'vuex'

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface VuexModules {
			PageSelector: CurentState
		}
	}

// STATE
	export const state = () => ({

		Page: 1,
		PageQuantity: 1,

	})

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		ChangePage(state, page: number ) {
			state.Page = page
		},
		ChangePageQuantity(state, quantity: number) {
			state.PageQuantity = quantity
		}
	}