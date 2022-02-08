// VUEX
	import type { MutationTree } from 'vuex'

// TYPES
	import { USER_STATE } from '~/typescript/User'

// STATE
	export const state = () => ({

		UserProfileArea: false,

		UserState: new Object() as USER_STATE

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface User {
			State: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_UserState(state, newUserState: USER_STATE) {
			state.UserState = newUserState
		},
		Toggle_UserProfileArea(state) {
			state.UserProfileArea = !state.UserProfileArea
		}
	}
