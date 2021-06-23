import { ActionTree, MutationTree } from 'vuex'

// TYPES AND INTERFACES
	import type { NOTIFICATION_CONTENT } from '~/typescript/Notification.ts'

// STATE
	export const state = () => ({

		status: false,

		content: new Object() as NOTIFICATION_CONTENT,

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface VuexModules {
			Notification: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_Status: (state, status?: boolean ) => {
			state.status = status ?? !state.status
		},
		Change_Content(state, _content: NOTIFICATION_CONTENT ) {
			state.content = _content
		},
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState>  = {
		Set_Notification({ commit }, payload: NOTIFICATION_CONTENT) {

			commit('Change_Content', payload)

			commit('Change_Status', true)

		}
	}