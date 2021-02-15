import firebase from 'firebase/app'
import 'firebase/auth'

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

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface Auth {
			Auth: CurentState
		}
	}

// STATE
	export const state = () => ({

		AuthError: '' as AUTH_ERRORS,

		LoginStatus: false,

		CurentUser: {
			email: '',
			uid: '',
		},
		
	})

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