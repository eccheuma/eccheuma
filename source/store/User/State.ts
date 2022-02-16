// VUEX
	import type { MutationTree } from 'vuex'

// TYPES
	import { User } from '~/typescript/User'

// STATE
	export const state = () => ({

		UserProfileArea: false,

		State: new Object() as User.state

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
		interface User {
			State: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_UserState(state, newUserState: User.state) {
			state.State = newUserState
		},
		Toggle_UserProfileArea(state) {
			state.UserProfileArea = !state.UserProfileArea
		}
	}
