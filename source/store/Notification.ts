import { ActionTree, MutationTree } from 'vuex'

// TYPES AND INTERFACES
	import type { Notification } from '~/types/Notification'

// STATE
	export const state = () => ({

		status: false,

		content: new Object() as Notification.struct,

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexMap' {
		interface VuexMap {
			Notification: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		changeStatus: (state, status?: boolean ) => {
			state.status = status ?? !state.status
		},
		setContent(state, _content: Notification.struct ) {
			state.content = _content
		},
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState>  = {
		createNotification(vuex, payload: Notification.struct) {

			vuex.commit('setContent', payload)
			vuex.commit('changeStatus', true)

		}
	}
