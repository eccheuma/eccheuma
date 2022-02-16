import { ActionTree, MutationTree } from 'vuex'

// TYPES AND INTERFACES
	import type { Notification } from '~/typescript/Notification'

// STATE
	export const state = () => ({

		status: false,

		content: new Object() as Notification.struct,

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
		interface VuexMap {
			Notification: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		changeNotificationState: (state, status?: boolean ) => {
			state.status = status ?? !state.status
		},
		Change_Content(state, _content: Notification.struct ) {
			state.content = _content
		},
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState>  = {
		setNotification({ commit }, payload: Notification.struct) {

			commit('Change_Content', payload)

			commit('changeNotificationState', true)

		}
	}
