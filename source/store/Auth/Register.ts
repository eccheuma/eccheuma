	import firebase from 'firebase/app'

	import 'firebase/storage'
	import 'firebase/database'
	import 'firebase/auth'

// VUEX
	import type { MutationTree, ActionTree } from 'vuex'

	import type { VuexModules } from '~/typescript/VuexModules'

	import type { REGISTER_FORM } from '~/store/Auth/Session'
	import type { MESSAGE } 			from '~/typescript/Message'
	import type { USER_STATE }		from '~/typescript/User'

	// STATE
	export const state = () => ({

		Modal: false

	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface Auth {
			Register: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		ToggleRegisterModal(state, prop?: boolean) {
			state.Modal = prop ?? !state.Modal
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexModules> = {

		async Register({ dispatch, commit }, _form: REGISTER_FORM): Promise<Error | Boolean> {
			try {

				await firebase.auth().createUserWithEmailAndPassword( _form.email, _form.password )

				const CU = firebase.auth().currentUser

				if ( !CU ) { const e = new Error(); e.message = 'OPS!'; return e }

				commit('Auth/Session/Change_userState', { _uid: CU.uid, _email: CU.email }, { root: true })

				const DEFAULT_ICON = await firebase.storage().ref('UserIcons/default.webp').getDownloadURL()

				const USER_STATE: USER_STATE = {
					UserID: 				`${ CU.uid 		 }`,
					UserEmail: 			`${ CU.email 	 }`,
					UserName: 			`${ _form.name }`,
					UserStatus: 		1,
					UserBalance: 		0,
					UserWorkStatus: 0,
					UserImageID:		DEFAULT_ICON
				}

				const MESSAGE: MESSAGE = {
					ID: Math.random().toString(36).substr(2).toUpperCase(),
					Date: Date.now(),
					From: 'Eccheuma',
					UserID: 'SUPPORT',
					Message: 'Благодарю вас за регистрацию!',
					Read: false,
				}

				const PREFERENCES = {
					DarkTheme: false,
					Anotations: true,
				}

				firebase.database()
					.ref(`Users/${ CU.uid }/state`)
					.set(USER_STATE)
	
				firebase.database()
					.ref(`Users/${ CU.uid  }/preferences`)
					.set(PREFERENCES)
	
				firebase.database()
					.ref(`Users/${ CU.uid  }/messages/Hash_0`)
					.set(MESSAGE)

				dispatch('Auth/Login/SignIn', _form, { root: true });
				
				return true;

			} catch (e: any) {

				commit('Auth/Session/ChangeAuthError', e.code, { root: true }); return false;

			}

		},

		Init_LocalLoader({ dispatch, commit }) {

			dispatch('Loader/Loader_Load', null, { root: true })
				
			commit('Loader/Loader_ChangeLoadStatus_Counter', 35, { root: true })	
			commit('Loader/Loader_ChangeLoadMessage', 'Регистрация учётной записи', { root: true })

		},

		Set_RegisterNotification({ commit }) {

			const NotificationMessage = {
				Message: 'Благодарю за регистрацию!',
				Description: 'Для перехода в личный кабинет перейдите вверх сайта, а нажмите на "Личный Кабинет"',
			}

			commit('Notification/Notification_Message', NotificationMessage, { root: true })
			commit('Notification/Notification_Status', true, { root: true })

		},

	}
