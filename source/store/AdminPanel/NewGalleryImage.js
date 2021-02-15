import firebase from 'firebase/app'
import 'firebase/database'

	export const state = () => ({

		UnusedID: 0,
		
	})

	export const mutations = {
		SetUnusedID(state, prop) {
			state.UnusedID = prop
		}
	}

	export const actions = {
		async FindUnuselessID({ commit }) {

			const GalleryData = await firebase.database().ref('Gallery').orderByChild('ID').once('value')

			const Quantity = GalleryData.numChildren()		

			for (let ID = 0; ID <= Quantity; ID++) {

				const PATH = `ImageID_${ID}`

				if ( !GalleryData.val()?.[PATH] ) { 				
					commit('SetUnusedID', ID); break
				} else {
					commit('SetUnusedID', Quantity);
				}
				
			}

		},
		async GallerySetImage({ dispatch, state }, image) {

			await dispatch('FindUnuselessID', null)

			firebase.database()
				.ref(`Gallery/ImageID_${ state.UnusedID }`).set({...image, ID: state.UnusedID })

		}
	}
