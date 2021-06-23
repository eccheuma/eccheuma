import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

	import type { VuexModules } from '~/typescript/VuexModules'

// TYPES
	import type { REGISTER_FORM } from './Auth'

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface Auth {
			Login: CurentState
		}
	}
// STATE
	export const state = () => ({

	})

// ACTIONS
	export const actions: ActionTree<CurentState, VuexModules> = {
		async SignIn({ dispatch, commit, rootState }, { email, password }: REGISTER_FORM) {
			try {

				// console.log( _email, _password)

				if ( rootState.Loader.Status.Loaded ) {

					dispatch('Loader/Loader_Load', null, { root: true })
					commit('Loader/Loader_ChangeLoadStatus_Counter', 35, { root: true })

				}
				
				await firebase.auth().signInWithEmailAndPassword(email, password)

				const uid = firebase.auth().currentUser?.uid
				
				commit('Auth/Auth/Change_userState', { _uid: uid, email }, { root: true })

				// Загрузка стейта пользователя из Firebase
				firebase.database().ref(`Users/${ uid }/state`)
					.on('value', data => {

						commit('User/State/Change_UserState', data.val(), { root: true })

					});

				commit('Auth/Auth/ChangeLoginStatus', true, { root: true })

				commit('Loader/Loader_ChangeLoadMessage', 'Вход в учётную запись', { root: true })

			} catch (e) {

				console.log(e)
				
				commit('Auth/Auth/ChangeAuthError', e.code, { root: true })

				commit('Loader/Loader_ChangeLoadMessage', 'Отмена', { root: true })

				setTimeout(() => {
					dispatch('Loader/Loader_Reload', null, { root: true })
				}, 500);
				
			} finally {
				
				await commit('Loader/Loader_ChangeLoadStatus_Counter', 100, { root: true })

				if ( !rootState.Loader.Status.Loaded ) {
					setTimeout(() => {
						dispatch('Loader/Loader_Reload', null, { root: true })
					}, 500);
				}

			}
		}
	}

