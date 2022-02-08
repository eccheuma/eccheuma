	import firebase from 'firebase/app'

	// import 'firebase/storage'
	// import 'firebase/database'
	import 'firebase/auth'

// API
	import { setDatabaseData } from '~/api/database';
	import { getStorageLink } from '~/api/storage';

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

		async Register({ dispatch, commit }, form: REGISTER_FORM): Promise<Error | Boolean> {

			try {

				const { user } = await firebase.auth().createUserWithEmailAndPassword( form.email, form.password );

				if ( !user ) return new Error();

				commit('Auth/Session/Change_userState', { _uid: user.uid, _email: user.email }, { root: true })

				await setDatabaseData(`Users/${ user.uid }/state`, {
					UserID: 				user.uid,
					UserEmail: 			user.email,
					UserName: 			form.name,
					UserStatus: 		2,
					UserBalance: 		0,
					UserWorkStatus: 0,
					UserImageID:		getStorageLink('UserIcons/default.webp')
				} as USER_STATE)

				await setDatabaseData(`Users/${ user.uid  }/preferences`, {
					DarkTheme: true,
					Anotations: true,
				})

				await setDatabaseData(`Users/${ user.uid  }/messages/Hash_0`, {
					ID: Math.random().toString(36).slice(-8).toUpperCase(),
					Date: Date.now(),
					From: 'Eccheuma',
					UserID: 'SUPPORT',
					Message: 'Благодарю вас за регистрацию!',
					Read: false,
				} as MESSAGE)
	
				dispatch('Auth/Login/SignIn', form, { root: true });
				
				return true;

			} catch (e: any) {

				commit('Auth/Session/ChangeAuthError', e.code, { root: true }); return false;

			}

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
