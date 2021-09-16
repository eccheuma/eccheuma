// VUEX
	import type { MutationTree } from 'vuex'

// TYPES AND INTERFACES
	export type REGISTER_FORM = {
		email: string
		password: string
		name?: string
	}

	export type AUTH_ERRORS = 'auth/network-request-failed'
			| 'auth/user-not-found'
			| 'auth/invalid-email'
			| 'auth/wrong-password'
			| 'auth/email-already-in-use'

// STATE
	export const state = () => ({

		AuthError: null as AUTH_ERRORS | null,

		LoginStatus: false,

		CurentUser: {
			email: '',
			uid: '',
		},
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface Auth {
			Session: CurentState
		}
	}

// MUTATIONS	
	export const mutations: MutationTree<CurentState> = {
		ChangeLoginStatus(state, prop) {
			state.LoginStatus = prop
		},
		ChangeAuthError(state, prop) {
			state.AuthError = prop
		},
		Change_userState(state, { _email, _uid }) {

			state.CurentUser = { email: _email, uid: _uid }

		}
	}
