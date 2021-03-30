
// VUEX TYPES
	import type { ActionTree, MutationTree } from 'vuex'
	
	export const strict = false

// TYPES
	export type FORMATED_DATE = {
		Day: string
		Time: string
	}

// STATE
	export const state = () => ({

		AppScroll: false,
		isDesktop: true,

		HeaderHeight: 100,
		LocalTime: {} as FORMATED_DATE

	})

// ROOT STATE TYPE
	export type RootState = ReturnType<typeof state>
	
// MUTATIONS
	export const mutations: MutationTree<RootState> = {
		SetDeviceType(state, prop) {
			state.isDesktop = prop
		},
		AppScroll(state, prop) {
			state.AppScroll = prop ?? !state.AppScroll
		},
		Change_HeaderHeight(state, prop) {
			state.HeaderHeight = prop
		},
		Change_LocalTime(state, prop) {
			state.LocalTime = prop
		} 
	}

// ACTIONS
	export const actions: ActionTree<RootState, RootState> = {
		GetLocalTime({ commit }, n = null) {

			const Properties = {
				D: { year: 'numeric', month: 'long', day: 'numeric' },
				T: { hour: '2-digit', minute: '2-digit' }
			}
			
			const DATA = {
				Day: Intl.DateTimeFormat('ru-RU', Properties.D).format(n),
				Time: Intl.DateTimeFormat('ru-RU', Properties.T).format(n)
			}

			commit('Change_LocalTime', DATA)

			return DATA

		},
	}
