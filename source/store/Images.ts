import { ActionTree, MutationTree } from 'vuex'

// API
	import { storage, references } from '~/api/storage';

// TYPES
	import { Image } from '~/typescript/Image';

// UTILS
	import { cache } from '~/utils/cache';

// STATE
	export const state = () => ({
		AVIF_SUPPORT: false,
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
		interface VuexMap {
			Images: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		setAVIF( state, status: boolean ) {
			state.AVIF_SUPPORT = status;
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {

		getImageURL(_vuex, params: { path: string, size: number }): Image.formatsStruct {

			const imageFormats: Array<keyof typeof Image.allowedFormats> = ['webp', 'avif'];
	
			const matchedSize = Image.matchSize(params.size);
			
			const imageStruct: Image.formatsStruct = {
				avif: String(),
				webp: String()
			};

			imageFormats.forEach(format => {
				imageStruct[format] = storage.reference(`${ references.images }/${ params.path }/${ format }/${ matchedSize }.${ format }`)!
			})

			if ( process.browser ) {

				const cacheKey = `${ params.path }-${ matchedSize }`;

				if ( cache.check(cacheKey) ) {
					return cache.get(cacheKey) as Image.formatsStruct
				}

				cache.set(cacheKey, imageStruct);

			}

			return imageStruct;

		}

	}
