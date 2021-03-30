import firebase from "firebase/app"
import "firebase/storage"

import { ActionTree, MutationTree} from 'vuex'

// VARIABLES
	const SIZES = [ 360, 720, 900, 1440, 1920 ]

// STATE
	export const state = () => ({
			ImageURLs: new Map() as Map<string, string>
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface VuexModules {
			Images: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		mapURL(state, { _ref, _url }: { _ref: string, _url: string }) {
			state.ImageURLs.set(_ref, _url)
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		async GetImageURL({ commit }, { _path = 'Other/1', _size }: {_path: string, _size: number }) {

			let URL = ''

			if ( process.client ) {

				const LC = window.localStorage

				// MATHC SIZES = 0 / CW = 37 => / 100
				const MATCHED = SIZES.filter( size => Math.trunc(_size) < size )
	
				// DEFINE SIZE
				const SIZE = MATCHED.length ? MATCHED[0] : 'original'
	
				// DEFINE NAME. "Other/1" => "1" => "1@SIZE .webp" => "1@720.webp" or "1@original.webp"
				const NAME = `${ _path.split('/').pop() }@${ SIZE }.webp`

				const REF = `${ _path }/${ NAME }`
	
				// IF LINK HAS IN LOCAL STORAGE, WE GET THEY FROM IT.
				if ( LC.getItem(REF) ) { return LC.getItem(REF) } 
	
				URL = await firebase.storage().ref(REF).getDownloadURL()
	
				// SET IN LOCAL STORAGE
				window.localStorage.setItem(REF, URL)
	
				// SET IN MAP
				commit('mapURL', { _ref: REF, _url: URL })

			}

			return URL

		}
	}
