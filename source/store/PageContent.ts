import firebase from 'firebase/app'
import 'firebase/database'

import { ActionTree, MutationTree } from 'vuex'

// INTERFACES & TYPES

	import type { POST } from '~/types/Post.ts'
	import type { IMAGE_PROPERTY } 	from '~/types/Image.ts'

	type REFS = "Posts" | "Gallery";

	export type LOAD_PROPERTY = { 
		LoadRange: number
		LoadPoint: number
	}

export type PAYLOAD = { REF: REFS, LOAD_PROPERTY: LOAD_PROPERTY }

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface VuexModules {
			PageContent: CurentState
		}
	}

// STORE
	export const state = () => ({

		Content: [] as POST[] | IMAGE_PROPERTY[]
		
	})

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		SetContent(state, prop: any[]) {
			state.Content = prop
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		async GetContent({ commit }, _payload: PAYLOAD ) {

			const DATA = await firebase.database().ref(_payload.REF)
				.orderByChild('ID')
				.limitToFirst(_payload.LOAD_PROPERTY.LoadRange || 1)
				.startAt(_payload.LOAD_PROPERTY.LoadPoint || 0)
				.once('value')

			commit('SetContent', Object.values(DATA.val()))

		}
	}
