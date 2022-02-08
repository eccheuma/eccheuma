import { ActionTree, MutationTree } from 'vuex'

import { storage } from '~/api/storage';

// TYPES
	import type { FORMATS, IMAGE_URL } from '~/typescript/Image'

// VARIABLES
	const SIZES = [ 100, 360, 720, 1280, 1440 ]

	type STATUS = {
		[K in FORMATS]: boolean
	}

// STATE
	export const state = () => ({

		AVIF_SUPPORT: false,

		ImageURLs: new Map() as Map<string, IMAGE_URL>
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface VuexModules {
			Images: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		mapURL(state, { _ref, _urls }: { _ref: string, _urls: IMAGE_URL }) {
			state.ImageURLs.set(_ref, _urls)
		},

		setAVIF( state, status: boolean ) {
			state.AVIF_SUPPORT = status;
		}

	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {

		setCache(_store, payload: { id: string, urls: IMAGE_URL }) {
			window.localStorage.setItem(payload.id, JSON.stringify(payload.urls))
		},

		getCache(_store, id: string): IMAGE_URL {
			return JSON.parse(window.localStorage.getItem(id)!) as IMAGE_URL
		},

		checkCache(_store, id: string): boolean {
			return Boolean(window.localStorage.getItem(id))
		},

		// name format: image.jpg
		async getImageURL(store, { _path, _size }: { _path: string, _size: number }): Promise<IMAGE_URL | null> {

			const FORMATS_LIST: FORMATS[] = ['avif', 'webp'];
	
			const ROOT_REF 	= 'images';
			const SIZE			= SIZES.find(value => value >= _size) || SIZES.pop();

			const LOCAL_ID 	= `${ _path }-${ SIZE }`;

			const REQUESTS = await Promise.all(FORMATS_LIST.map((format) => {
				return new Promise<Partial<IMAGE_URL>>((resolve) => {
					resolve({[format]: storage.getStorageLink(`${ ROOT_REF }/${ _path }/${ format }/${ SIZE }.${ format }`) });
				})
			}))

			const URLS = REQUESTS.reduce((a, b) => Object.assign(a, b)) as IMAGE_URL

			if ( process.browser ) {

				if ( await store.dispatch('checkCache', LOCAL_ID) ) {
					return store.dispatch('getCache', LOCAL_ID) as Promise<IMAGE_URL>;
				} 

				store.dispatch('setCache', { id: LOCAL_ID, urls: URLS })

			}

			return URLS

		}

	}
