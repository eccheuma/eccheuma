import firebase from 'firebase/app'
import 'firebase/database'

import { ActionTree, MutationTree } from 'vuex'

// INTERFACES & TYPES
	import { POST } from '~/types/Post'

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface VuexModules {
			Posts: CurentState
		}
	}

// STATE
	export const state = () => ({

		Posts: [] as Array< POST >,
		
	})

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		SetPosts(state, prop: Array<POST>) {
			state.Posts = prop
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		LoadPosts({commit}, prop) {

			firebase.database().ref("Posts")
				.orderByChild('ID')
				.limitToFirst(prop.LoadRange)
				.startAt(prop.LoadPoint)
				.on('value', data => {

					commit('SetPosts', data.val())

				})

		}
	}
