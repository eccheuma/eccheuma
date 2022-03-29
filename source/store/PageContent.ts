import { ActionTree, MutationTree } from 'vuex'

// API
	import { database } from '~/api/database'

// UTILS
	import { cache } from '~/utils/cache';

// INTERFACES & TYPES

	import type { Post } 	from '~/types/Post'
	import type { Image } from '~/types/Image'

	type REFS = 'Posts' | 'Gallery';

	export type LOAD_PROPERTY = { 
		LoadRange: number
		LoadPoint: number
	}

	type CONTENT = {
		Posts: Array<Post.struct>
		Gallery: Image.struct[]
	}

	export type PAYLOAD = { REF: REFS, LOAD_PROPERTY: LOAD_PROPERTY }

// STORE
	export const state = () => ({
		Content: {
			Gallery: [],
			Posts: []
		} as CONTENT
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexMap' {
		interface VuexMap {
			PageContent: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setContent(state, { data, to }: { data: any[], from: string, to: REFS }) {
			state.Content[to] = Object.values(data); 
		},

	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		
		async checkCachedData({ commit }, payload: PAYLOAD) {

			const HASH_KEY 					= `${ payload.REF.toUpperCase() }_DATA_HASH`
			const LOAD_PROPERTY_KEY = `${ payload.LOAD_PROPERTY.LoadPoint }_${ payload.LOAD_PROPERTY.LoadRange }`

			const Hashes = {
				server: await database.get(`App/Cache/${ payload.REF }`),
				cashed: cache.get(HASH_KEY)
			}

			const CACHE_KEY = `${ Hashes.server }_${ payload.REF.toUpperCase() }_${ LOAD_PROPERTY_KEY }`

			// --------------------------------

			const CACHED_DATA = cache.get(CACHE_KEY);

			if ( CACHED_DATA && Hashes.cashed && Hashes.cashed === Hashes.server ) {

				commit('setContent', { data: JSON.parse(CACHED_DATA), from: 'cache', to: payload.REF  })

			} else {

				const DATA = await database.get(payload.REF, { limit: payload.LOAD_PROPERTY.LoadRange })

				commit('setContent', { data: DATA, from: 'firebase', to: payload.REF });

				cache.set(CACHE_KEY, DATA);
				cache.set(HASH_KEY, Hashes.server);

			}

		},

		async GetContent({ commit, dispatch }, payload: PAYLOAD) {

			if ( process.browser ) {

				await dispatch('checkCachedData', payload);	
				
			} else {

				const DATA = await database.get(payload.REF, { limit: payload.LOAD_PROPERTY.LoadRange })

				commit('setContent', { data: Object.values(DATA), from: 'server', to: payload.REF });			

			} 

		},
	}
