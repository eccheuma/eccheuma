import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

// TYPES
	import type { REGISTER_FORM } from './Session'
	import type { VuexModules } 	from '~/typescript/VuexModules'

// STATE
	export const state = () => ({
		inAction: false as boolean
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface Auth {
			Login: CurentState,
		}
	}

// MUTATIONS
	export const mutations : MutationTree<CurentState> = {
		setAction(state, value: boolean) {
			state.inAction = value
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexModules> = {
		async SignIn({ commit }, { email, password }: REGISTER_FORM) {

			commit('setAction', true)

			try {

				await firebase.auth().signInWithEmailAndPassword(email, password)

				const uid = firebase.auth().currentUser?.uid
				
				commit('Auth/Session/Change_userState', { _uid: uid, email }, { root: true })

				// Загрузка стейта пользователя из Firebase
				firebase.database().ref(`Users/${ uid }/state`).on('value', (data) => {

					commit('User/State/Change_UserState', data.val(), { root: true })

				});

				// setTimeout(() => {
					commit('Auth/Session/ChangeLoginStatus', true, { root: true })
				// }, 1000)

			} catch (e) {

				console.log(e)
				
				commit('Auth/Session/ChangeAuthError', e.code, { root: true })
				
			} finally {

				commit('setAction', false)

			}
		}
	}
