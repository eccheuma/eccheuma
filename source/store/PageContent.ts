import { ActionTree, MutationTree, ActionContext } from 'vuex';

// API
	import { database, QueryParams } from '~/api/database';

// UTILS
	import { cache } from '~/utils/cache';
	import { utils } from '~/utils';

// INTERFACES & TYPES
	import type { Post } 	from '~/types/Post';
	import type { Image } from '~/types/Image';

	
	type Reference = 'Posts' | 'Gallery';

	export type LoadQuery = { 
		LoadRange: number
		LoadPoint: number
	}

	type CONTENT = {
		Posts: Array<Post.struct>
		Gallery: Image.struct[]
	}

	export type PayloadQuery = { ref: Reference, loadQuery: LoadQuery }

// HELPERS
	namespace helpers {

		export function getOrderQuery(ref: Reference) {

			const query: database.QueryOrder<database.order> = Object();

			switch (ref) {
				case 'Posts': { 
					query.order 	= database.order.child;
					query.orderBy = 'ID';
				} break;
				case 'Gallery': {
					query.order 	= database.order.key;
				} break;
			}

			return query;

		}

		export async function getContentSlice(payload: PayloadQuery): Promise<Object> {

			const LP = payload.loadQuery.LoadPoint;

			return await database.get(payload.ref, { 
				limit: payload.loadQuery.LoadRange,
				start: payload.ref === 'Posts' 
					? Number(LP)
					: String(LP),
				...helpers.getOrderQuery(payload.ref), 
			});

		}		

	}

// STORE
	export const state = () => ({
		Content: {
			Gallery	: [],
			Posts		: []
		} as CONTENT
	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexMap' {
		interface VuexMap { PageContent: CurentState }
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setContent(state, { data, to }: { data: any[], from: string, to: Reference }) {
			state.Content[to] = Object.values(data || Object()); 
		},

	};

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		
		async checkCachedData({ commit }, payload: PayloadQuery) {

			const HASH_KEY 					= `${ payload.ref.toUpperCase() }_DATA_HASH`;
			const LOAD_PROPERTY_KEY 	= `${ payload.loadQuery.LoadPoint }_${ payload.loadQuery.LoadRange }`;

			const Hashes = {
				server: await database.get(`App/Cache/${ payload.ref }`),
				cashed: cache.get(HASH_KEY)
			};

			const CACHE_KEY = `${ Hashes.server }_${ payload.ref.toUpperCase() }_${ LOAD_PROPERTY_KEY }`;

			// --------------------------------

			const CACHED_DATA = cache.get(CACHE_KEY);

			if ( CACHED_DATA && Hashes.cashed && Hashes.cashed === Hashes.server ) {

				commit('setContent', { data: JSON.parse(CACHED_DATA), from: 'cache', to: payload.ref  });

			} else {

				const data = await helpers.getContentSlice(payload);

				commit('setContent', { 
					data, 
					from: 'server', 
					to: payload.ref 
				});	

				cache.set(CACHE_KEY, data);
				cache.set(HASH_KEY, Hashes.server);

			}

		},

		async GetContent(vuex, payload: PayloadQuery) {

			if ( process.browser ) {

				await vuex.dispatch('checkCachedData', payload);	
				
			} else {

				vuex.commit('setContent', { 
					data: await helpers.getContentSlice(payload), 
					from: 'server', 
					to: payload.ref 
				});			

			} 

		},

	};

	
