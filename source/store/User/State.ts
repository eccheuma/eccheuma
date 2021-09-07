import firebase from 'firebase/app'
import 'firebase/database'

// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

	import type { VuexModules } from '~/typescript/VuexModules'

// TYPES
	import { USER_STATE } from '~/typescript/User'

// STATE
	export const state = () => ({

		UserProfileArea: false,

		UserState: new Object() as USER_STATE

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface User {
			State: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_UserState(state, newUserState: USER_STATE) {
			state.UserState = newUserState
		},
		Toggle_UserProfileArea(state) {
			state.UserProfileArea = !state.UserProfileArea
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexModules> = {
		async FireBaseChange({ rootState }, { prop, entity }: {prop: any, entity: keyof USER_STATE}) {
			try {

				const uid = rootState.Auth.Auth.CurentUser.uid

				await firebase.database().ref(`Users/${ uid }/state`).update({
					[entity]: prop
				})

			} catch (e) { 

				console.log(e) 

			}
			
		}
	}
