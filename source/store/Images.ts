import firebase from "firebase/app"
import "firebase/storage"

import { ActionTree, MutationTree} from 'vuex'

// VARIABLES
	const SIZES = [ 360, 720, 900, 1440, 1920 ]

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface VuexModules {
			Images: CurentState
		}
	}

//STATE
	export const state = () => ({
			ImageURLs: new Map() as Map<string, string>
	})

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		mapURL(state, { _name, _url }: { _name: string, _url: string }) {
			state.ImageURLs.set(_name, _url)
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, CurentState> = {
		async GetImageURL({ state, commit }, { _path = 'Other/1', _size }: {_path: string, _size: number }) {

			// TRUNCED SIZE OF IMAGE CONTAINER
			const CONTAINER_WIDTH = Math.trunc(_size)

			// MATHC SIZES = 0 / CW = 37 => / 100
			const MATCHED = SIZES.filter( item => CONTAINER_WIDTH < item )

			// DEFINE SIZE
			const SIZE = MATCHED.length ? MATCHED[0] : "original" 

			// DEFINE NAME. "Other/1" => "1" => "1@SIZE .webp" => "1@720.webp" or "1@original.webp"
			const NAME = `${ _path.split('/').pop() }@${ SIZE }.webp`

			// ---------------------------------------------
			// console.log(_size, `${_path}/${NAME}`)
			// ---------------------------------------------

			// IF HAS SOMETHING IN CACHE MAP, THEN GET LINK FOR CURENT SIZING
			// if ( state.ImageURLs.has(NAME) ) {
				
			// 	return state.ImageURLs.get(NAME)

			// } else {

				let URL = ''

				// PHASE 2
				if ( process.client ) {
					URL = await firebase.storage().ref(`${ _path }/${ NAME }`).getDownloadURL()
				}
	
				// SET IN MAP
				commit('mapURL', { _name: NAME, _url: URL })
	
				// RETURN URL
				return URL

			// }

		}
	}

