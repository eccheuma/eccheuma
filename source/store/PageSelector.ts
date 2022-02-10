import { MutationTree } from 'vuex'

// STATE
	export const state = () => ({

		Page: 1,
		PageQuantity: 1,

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
		interface VuexMap {
			PageSelector: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		ChangePage(state, page: number ) {
			state.Page = page
		},
		ChangePageQuantity(state, quantity: number) {
			state.PageQuantity = quantity
		}
	}
