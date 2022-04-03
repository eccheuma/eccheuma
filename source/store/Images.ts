import { ActionTree, MutationTree } from 'vuex'

// API
	import { storage, references } from '~/api/storage';

// TYPES
	import { Image } from '~/types/Image';

// UTILS
	import { cache } from '~/utils/cache';

// CONST
	const FORMATS: Array<keyof typeof Image.formats.output> = ['webp', 'avif'];

	const PLACEHOLDER: Image.formatsStruct = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src
	}

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

		getImageURL(_vuex, params: { path: string, size: number }): Image.formatsStruct {

			const matchedSize = Image.matchSize(params.size);
			
			const imageStruct: Image.formatsStruct = {
				avif: PLACEHOLDER.avif,
				webp: PLACEHOLDER.webp,
			};

			FORMATS.forEach(format => {

				const REF = storage.reference(`${ references.images }/${ params.path }/${ format }/${ matchedSize }.${ format }`);

				if ( REF ) imageStruct[format] = REF;

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
