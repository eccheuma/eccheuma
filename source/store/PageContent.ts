import firebase from 'firebase/app'
import 'firebase/database'

import { ActionTree, MutationTree } from 'vuex'

// INTERFACES & TYPES

	import type { POST } 						from '~/typescript/Post'
	import type { IMAGE_PROPERTY } 	from '~/typescript/Image'

	type REFS = 'Posts' | 'Gallery';

	export type LOAD_PROPERTY = { 
		LoadRange: number
		LoadPoint: number
	}

	type CONTENT = {
		Posts: POST[]
		Gallery: IMAGE_PROPERTY[]
	}

	export type PAYLOAD = { REF: REFS, LOAD_PROPERTY: LOAD_PROPERTY }

// STORE
	export const state = () => ({

		Content: {
			Gallery: [],
			Posts: []
		} as {[K in REFS]: CONTENT[K] }
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface VuexModules {
			PageContent: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setContent(state, { data, from, to }: { data: any[], from: string, to: REFS }) {

			state.Content[to] = data; 
			
			if ( process.server ) {
				console.log(`recive ${ from } data:`, data);
			}

		},

	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		
		async checkCachedData({ commit }, _payload: PAYLOAD) {

			const STORAGE	= window.localStorage

			const HASH_KEY 					= `${ _payload.REF.toUpperCase() }_DATA_HASH`
			const LOAD_PROPERTY_KEY = `${ _payload.LOAD_PROPERTY.LoadPoint }_${ _payload.LOAD_PROPERTY.LoadRange }`

			const SERVER_HASH = await firebase.database().ref(`App/Cache/${ _payload.REF }`).once('value').then(data => data.val())
			const LOCAL_HASH 	= window.localStorage.getItem(HASH_KEY) 

			const CACHE_KEY = `${ SERVER_HASH }_${ _payload.REF.toUpperCase() }_${ LOAD_PROPERTY_KEY }`

			// --------------------------------

			const CACHED_DATA = STORAGE.getItem(CACHE_KEY);

			if ( CACHED_DATA && LOCAL_HASH && LOCAL_HASH === SERVER_HASH  ) {

				commit('setContent', { data: JSON.parse(CACHED_DATA), from: 'cache', to: _payload.REF  })

			} else {

				const DATA = await firebase.database()
					.ref(_payload.REF)
					.orderByChild('ID')
					.limitToFirst(_payload.LOAD_PROPERTY.LoadRange || 1)
					.startAt(_payload.LOAD_PROPERTY.LoadPoint || 0)
					.once('value')
					.then( data => Object.values(data.val() || {}) )

				commit('setContent', { data: DATA, from: 'firebase', to: _payload.REF });

				STORAGE.setItem(CACHE_KEY, JSON.stringify(DATA))
				STORAGE.setItem(HASH_KEY,  SERVER_HASH.toString())

			}

		},

		async GetContent({ commit, dispatch }, _payload: PAYLOAD) {

			if ( process.browser )  {

				await dispatch('checkCachedData', _payload);	
				
			} else {

				const DATA = await firebase.database()
					.ref(_payload.REF)
					.orderByChild('ID')
					.limitToFirst(_payload.LOAD_PROPERTY.LoadRange || 1)
					.startAt(_payload.LOAD_PROPERTY.LoadPoint || 0)
					.once('value')

				commit('setContent', { data: Object.values(DATA.val()), from: 'server', to: _payload.REF });			

			} 

		},
	}
