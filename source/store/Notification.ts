import { ActionTree, MutationTree } from 'vuex'

// TYPES AND INTERFACES
	export type I_CONTENT = {
		message: string
		description: string
		link?: string,
	}

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface VuexModules {
			Notification: CurentState
		}
	}

// STATE
	export const state = () => ({

		status: false,

		content: {
			message: `Приветствие`,
			description: `Some description text`,
			link: '',
		},

	})

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_Status: (state, status: boolean ) => {
			state.status = status ?? !state.status
		},
		Change_Content(state, _content: I_CONTENT ) {
			state.content = { ...state.content, ..._content }
		},
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState>  = {
		Set_Notification({ commit }, { message, description, link }: I_CONTENT) {

			const C: I_CONTENT = {
				message,
				description,
				link,
			}

			commit('Change_Content', C)

			commit('Change_Status', true)

		}
	}