// FIREBASE
import firebase from 'firebase/app'
	import 'firebase/database'

// VUEX
import { ActionTree, MutationTree } from 'vuex'

// INTERFACES & TYPES
	export type LoadProperty = {
		LoadRange: number
		LoadPoint: number
	}

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface VuexModules {
			Gallery: CurentState
		}
	}

	// STATE
	export const state = () => ({

		GalleryHolder: [],
		
	})

	// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Set_Gallery(state, prop) {

			state.GalleryHolder = prop

		} 
	}
	
	// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		LoadGallery({commit, state}, prop: LoadProperty) {

			firebase.database()
				.ref("Gallery")
				.orderByChild("ID")
				.limitToFirst(prop.LoadRange)
				.startAt(prop.LoadPoint)
				.on('value', data => {
					commit('Set_Gallery', data.val() )
				});

		}
	}