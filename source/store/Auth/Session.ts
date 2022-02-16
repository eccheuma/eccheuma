// VUEX
	import type { MutationTree } from 'vuex'

// AUTH
	import { auth } from '~/api/auth';

// STATE
	export const state = () => ({

		AuthError: null as auth.error | null,

		LoginStatus: false,

		CurentUser: {
			email: String(),
			uid: String(),
		},
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
		interface Auth {
			Session: CurentState
		}
	}

// MUTATIONS	
	export const mutations: MutationTree<CurentState> = {
		ChangeLoginStatus(state, prop: boolean) {
			state.LoginStatus = prop
		},
		ChangeAuthError(state, prop: auth.error) {
			state.AuthError = prop
		},
		Change_userState(state, { email, uid }: CurentState['CurentUser']) {
			state.CurentUser = { email, uid }
		}
	}
