import Vue from 'vue'

import firebase from 'firebase/app'
import 'firebase/database'

import { ActionTree, MutationTree } from 'vuex'

// INTERFACES & TYPES

	import type { POST } from '~/types/Post.ts'
	import type { IMAGE_PROPERTY } 	from '~/types/Image.ts'

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
	declare module '~/types/VuexModules' {
		interface VuexModules {
			PageContent: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setContent(state, { data, from, to }: { data: any[], from: string, to: REFS }) {

			state.Content[to] = data; console.log(`recive ${ from } data:`, data);

		},

	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		
		async checkCachedData({ commit }, _payload: PAYLOAD) {

			const STORAGE	= window.localStorage

			const HASH_KEY 					= `${ _payload.REF.toUpperCase() }_DATA_HASH`
			const LOAD_PROPERTY_KEY = `${ _payload.LOAD_PROPERTY.LoadPoint }_${ _payload.LOAD_PROPERTY.LoadRange }`

			const SERVER_HASH: number = await firebase.database().ref(`App/Cache/${ _payload.REF }`).once('value').then(data => data.val() as number)
			const LOCAL_HASH: number	= Number(window.localStorage.getItem(HASH_KEY)) 

			const CACHE_KEY = `${ SERVER_HASH }_${ _payload.REF.toUpperCase() }_${ LOAD_PROPERTY_KEY }`

			// --------------------------------

			const CACHED_DATA = STORAGE.getItem(CACHE_KEY)

			if ( CACHED_DATA && LOCAL_HASH === SERVER_HASH ) {

				commit('setContent', { data: JSON.parse(CACHED_DATA), from: 'cache', to: _payload.REF  })

			} else {

				const DATA = await firebase.database()
					.ref(_payload.REF)
					.orderByChild('ID')
					.limitToFirst(_payload.LOAD_PROPERTY.LoadRange || 1)
					.startAt(_payload.LOAD_PROPERTY.LoadPoint || 0)
					.once('value')
					.then( data => Object.values(data.val()) )

				commit('setContent', { data: DATA, from: 'firebase', to: _payload.REF });

				STORAGE.setItem(CACHE_KEY, JSON.stringify(DATA))
				STORAGE.setItem(HASH_KEY,  SERVER_HASH.toString())

			}

		},

		async GetContent({ commit, dispatch }, _payload: PAYLOAD) {

			console.log("SOMETHING!")

			if ( process.client ) {

				await dispatch('checkCachedData', _payload);	
				
			} else {

				console.log(_payload)

				const DATA = await firebase.database()
					.ref(_payload.REF)
					.orderByChild('ID')
					.limitToFirst(_payload.LOAD_PROPERTY.LoadRange || 1)
					.startAt(_payload.LOAD_PROPERTY.LoadPoint || 0)
					.once('value')
					.then( data => Object.values(data.val()) )

				console.log(DATA, 'data');

				commit('setContent', { data: DATA, from: 'server', to: _payload.REF });			

			} 

		},
	}
