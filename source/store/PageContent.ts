import { ActionTree, MutationTree } from 'vuex';

// API
import { database } from '~/api/database';

// UTILS
import { cache } from '~/utils/cache';

// INTERFACES & TYPES
import type { Post } from '~/contracts/Post';
import type { Image } from '~/contracts/Image';

export const enum Reference {
	Posts,
	Gallery
}

const PATHS = {
	[Reference.Posts]: 'Posts',
	[Reference.Gallery]: 'Gallery'
} as const;

export type LoadQuery = {
	LoadRange: number
	LoadPoint: number
}

interface IMutInformer<D, F, T> {
	data: D,
	from: F,
	to: T,
}

type RecordValues<R> = R extends Record<string, infer V> ? V : never;

export type PayloadQuery = { ref: Reference, loadQuery: LoadQuery }

// HELPERS
namespace helpers {

	export function getOrderQuery(ref: Reference) {

		const query: database.QueryOrder<database.order> = Object();

		switch (ref) {
			case Reference.Posts: {
				query.order = database.order.child;
				query.orderBy = 'ID';
			} break;
			case Reference.Gallery: {
				query.order = database.order.key;
			} break;
		}

		return query;

	}

	export async function getContentSlice(payload: PayloadQuery): Promise<RecordValues<CurentState['Content']>> {

		const LP = payload.loadQuery.LoadPoint;

		return await database.get(PATHS[payload.ref], {
			limit: payload.loadQuery.LoadRange,
			start: payload.ref === Reference.Posts
				? Number(LP)
				: String(LP),
			...helpers.getOrderQuery(payload.ref),
		});

	}

}

// STORE
export const state = () => ({
	Content: {
		Gallery: Array<Image.struct>(),
		Posts: Array<Post.struct>(),
	}
});

// CURENT STATE
export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
declare module '~/contracts/VuexMap' {
	interface VuexMap { PageContent: CurentState }
}

// MUTATIONS
export const mutations: MutationTree<CurentState> = {

	setContent(state, { data, to }: IMutInformer<RecordValues<CurentState['Content']>, string, Reference>) {
		state.Content[PATHS[to]] = Object.values(data || Object());
	},

};

// ACTIONS
export const actions: ActionTree<CurentState, CurentState> = {

	async checkCachedData({ commit }, payload: PayloadQuery) {

		const HASH_KEY = `${PATHS[payload.ref].toUpperCase()}_DATA_HASH`;
		const LOAD_PROPERTY_KEY = `${payload.loadQuery.LoadPoint}_${payload.loadQuery.LoadRange}`;

		const hashes = {
			server: await database.get(`App/Cache/${payload.ref}`),
			cache: cache.get(HASH_KEY)
		};

		const CACHE_KEY = `${hashes.server}_${PATHS[payload.ref].toUpperCase()}_${LOAD_PROPERTY_KEY}`;
		const CACHED_DATA = cache.get<RecordValues<CurentState['Content']>>(CACHE_KEY);

		if (!(CACHED_DATA instanceof Error) && hashes.cache && hashes.cache === hashes.server) {

			commit('setContent', { data: CACHED_DATA.data, from: 'cache', to: payload.ref });

		} else {

			const data = await helpers.getContentSlice(payload);

			commit('setContent', {
				data,
				from: 'server',
				to: payload.ref
			});

			cache.set(CACHE_KEY, data);
			cache.set(HASH_KEY, hashes.server);

		}

	},

	async GetContent(vuex, payload: PayloadQuery) {

		if (process.browser) {

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


