import firebase from 'firebase/app'
import 'firebase/auth'

// API
	import { database } from '~/api/database'

// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

// TYPES
	import type { REGISTER_FORM, CurentState as SessionState } from '~/store/Auth/Session'
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
	export const mutations: MutationTree<CurentState> = {
		setAction(state, value: boolean) {
			state.inAction = value
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexModules> = {
		async SignIn({ commit }, { email, password }: REGISTER_FORM) {

			commit('setAction', true)

			try {

				const { user } = await firebase.auth().signInWithEmailAndPassword(email, password);

				if ( !user ) return;

				const userData: SessionState['CurentUser'] = {
					uid: user.uid!,
					email: user.email || String('email is non defined'),
				}
				
				commit('Auth/Session/Change_userState', userData, { root: true })

				// Загрузка стейта пользователя из Firebase
				database.listen(`Users/${ user.uid }/state`, (data) => {
					commit('User/State/Change_UserState', data, { root: true })
				})

				commit('Auth/Session/ChangeLoginStatus', true, { root: true })

			} catch (e: any) {

				console.log(e)
				
				commit('Auth/Session/ChangeAuthError', e.code, { root: true })
				
			} finally {

				commit('setAction', false)

			}
		}
	}
