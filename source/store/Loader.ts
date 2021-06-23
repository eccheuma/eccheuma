
	import $AnimeJS from 'animejs'

// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

// STATE
	export const state = () => ({

		Message: null,

		Status: {
			Load: false,
			Loaded: true,
			Counter: 0
		}

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface VuexModules {
			Loader: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Loader_ChangeLoadStatus_Counter(state, prop) {

			$AnimeJS({
				targets: state.Status,
				Counter: prop,
				easing: 'easeOutCubic',
				duration: 250,
				round: 1
			});

		},
		Loader_ChangeLoadStatus(state, prop) {
			state.Status = prop 
		},
		Loader_ChangeLoadStatus_Load(state) {
			state.Status.Load = !state.Status.Load
		},
		Loader_ChangeLoadStatus_Loaded(state) {
			state.Status.Loaded = !state.Status.Loaded
		},
		Loader_ChangeLoadMessage(state, prop) {
			state.Message = prop
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		Loader_Load({commit, state}, prop) {
			
			commit('Loader_ChangeLoadStatus_Loaded') 
			commit('Loader_ChangeLoadStatus_Load')

		},
		Loader_Reload({commit}) {

			let Status = {
				Load: false,
				Loaded: true,
				Counter: 0
			}

			commit('Loader_ChangeLoadStatus', Status)

		}
	}

