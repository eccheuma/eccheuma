import { ActionTree, MutationTree } from 'vuex'

// API
	import { storage, references } from '~/api/storage';

// TYPES
	import { Image } from '~/types/Image';

// UTILS
	import { cache } from '~/utils/cache';

// STATE
	export const state = () => ({
		AVIF_SUPPORT: false,
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexMap' {
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

		getImageURL(_vuex, params: { path: string, size: number }): Pick<Image.formatsStruct, 'avif' | 'webp'> {

			const imageFormats: Array<'webp' | 'avif'> = ['webp', 'avif'];
	
			const matchedSize = Image.matchSize(params.size);
			
			const imageStruct: Pick<Image.formatsStruct, 'avif' | 'webp'> = {
				avif: String(),
				webp: String(),
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
