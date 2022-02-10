import { ActionTree, MutationTree } from 'vuex'

// API
	import { storage } from '~/api/storage';

// TYPES
	import { Image } from '~/typescript/Image';

// UTILS
	import { cache } from '~/utils/cache';

// VARIABLES
	const Sizes = [ 
		Image.sizes.placehoder,
		Image.sizes.small,
		Image.sizes.medium,
		Image.sizes.large,
		Image.sizes.full 
	];

// STATE
	export const state = () => ({

		AVIF_SUPPORT: false,

		ImageURLs: new Map<string, Image.formats>(),

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

		mapURL(state, { _ref, _urls }: { _ref: string, _urls: Image.formats }) {
			state.ImageURLs.set(_ref, _urls)
		},

		setAVIF( state, status: boolean ) {
			state.AVIF_SUPPORT = status;
		}

	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {

		getImageURL(_vuex, params: { path: string, size: number }): Partial<Image.formats> | null {

			const AllowedFormats: Array<Image.allowedFormats> = ['avif', 'webp'];
	
			const ROOT_REF 	 = 'images';
			const MATCH_SIZE = Sizes.find(value => value >= params.size) || Sizes.pop();
			const LOCAL_KEY  = `${ params.path }-${ MATCH_SIZE }`;

			const IMAGE_STRUCT = AllowedFormats.map((format) => {
				return {
					[format]: storage.reference(`${ ROOT_REF }/${ params.path }/${ format }/${ MATCH_SIZE }.${ format }`)
				} as Partial<Image.formats>
			})

			const Image = IMAGE_STRUCT.reduce((a, b) => Object.assign(a, b));

			if ( process.browser ) {

				if ( cache.check(LOCAL_KEY) ) {
					return cache.get(LOCAL_KEY) as Image.formats
				}

				cache.set(LOCAL_KEY, Image);

			}

			return Image;

		}

	}
