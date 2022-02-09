import { ActionTree, MutationTree } from 'vuex'

// API
	import { storage } from '~/api/storage';

// TYPES
	import { AllowedFormats, ImageStruct, Sizes } from '~/typescript/Image';

// UTILS
	import { cache } from '~/utils/cache';

// VARIABLES
	const SIZES = [ 
		Sizes.placehoder,
		Sizes.small,
		Sizes.medium,
		Sizes.large,
		Sizes.full 
	];

// STATE
	export const state = () => ({

		AVIF_SUPPORT: false,

		ImageURLs: new Map<string, ImageStruct>(),

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

		mapURL(state, { _ref, _urls }: { _ref: string, _urls: ImageStruct }) {
			state.ImageURLs.set(_ref, _urls)
		},

		setAVIF( state, status: boolean ) {
			state.AVIF_SUPPORT = status;
		}

	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {

		getImageURL(_vuex, params: { path: string, size: number }): Partial<ImageStruct> | null {

			const AllowedFormats: Array<AllowedFormats> = ['avif', 'webp'];
	
			const ROOT_REF 	 = 'images';
			const MATCH_SIZE = SIZES.find(value => value >= params.size) || SIZES.pop();
			const LOCAL_KEY  = `${ params.path }-${ MATCH_SIZE }`;

			const IMAGE_STRUCT = AllowedFormats.map((format) => {
				return {
					[format]: storage.reference(`${ ROOT_REF }/${ params.path }/${ format }/${ MATCH_SIZE }.${ format }`)
				} as Partial<ImageStruct>
			})

			const ImageStruct = IMAGE_STRUCT.reduce((a, b) => Object.assign(a, b));

			if ( process.browser ) {

				if ( cache.check(LOCAL_KEY) ) {
					return cache.get(LOCAL_KEY) as ImageStruct
				}

				cache.set(LOCAL_KEY, ImageStruct);

			}

			return ImageStruct;

		}

	}
