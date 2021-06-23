	import firebase from 'firebase/app'
	import 'firebase/database'

	// VUEX
		import type { ActionTree, MutationTree} from 'vuex'

	// TYPES
		import type { PORTFOLIO_SECTION } from '~/typescript/Portfolio.ts'

	// CURENT STATE
		export type CurentState = ReturnType<typeof state>

	// DECALARE MODULE
		declare module '~/typescript/VuexModules' {
			interface AdminPanel {
				NewCase: CurentState
			}
		}
	
	// MODULE
	export const state = () => ({

		ChilderCount: {
			Logo: 0,
			Landings: 0,
			Banners: 0,
		} as {[Key in PORTFOLIO_SECTION]: number}

	})

	export const mutations: MutationTree<CurentState> = {
		CaseSetLogoCount(state, payload: { type: PORTFOLIO_SECTION, value: number }) {
			state.ChilderCount[payload.type] = payload.value
		},
	}
	
	export const actions: ActionTree<CurentState, CurentState> = {
		DBCaseCount({commit}, type: PORTFOLIO_SECTION) {

			firebase.database()
				.ref(`Cases/${type}`)
				.on('value', data => {

					commit('CaseSetLogoCount', {
						type:	type, 
						value: data.numChildren(),
					})

				});
		},
	}