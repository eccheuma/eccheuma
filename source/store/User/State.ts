// VUEX
	import type { MutationTree } from 'vuex'

// TYPES
	import { User } from '~/types/User'
<<<<<<< HEAD
	import { currencies } from '~/utils/currency'
=======
>>>>>>> master

// STATE
	export const state = () => ({

		UserProfileArea: false,
		Currency: currencies.Country.ru, 

		State: new Object() as User.struct

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexMap' {
		interface User {
			State: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		setUserState(state, newUserState: User.struct) {
			state.State = newUserState
		},
		toggleProfileArea(state) {
			state.UserProfileArea = !state.UserProfileArea
		}
	}
