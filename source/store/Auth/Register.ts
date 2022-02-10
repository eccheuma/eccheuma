	import firebase from 'firebase/app'
	import 'firebase/auth'

// API
	import type { MutationTree, ActionTree } from 'vuex'
	import { database } from '~/api/database';
	import { storage } from '~/api/storage';

// VUEX

	import type { VuexMap } from '~/typescript/VuexMap'

	import type { REGISTER_FORM } from '~/store/Auth/Session'
	import type { Message } 			from '~/typescript/Message'

// NAMESPACES
	import { User } from '~/typescript/User'
	import { Purchase } from '~/typescript/Services';

// STATE
	export const state = () => ({
		Modal: false
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
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
	export const actions: ActionTree<CurentState, VuexMap> = {

		async Register({ dispatch, commit }, form: REGISTER_FORM): Promise<Error | Boolean> {

			try {

				// eslint-disable-next-line import/no-named-as-default-member
				const { user } = await firebase.auth().createUserWithEmailAndPassword( form.email, form.password );

				if ( !user ) return new Error('sdf');

				commit('Auth/Session/Change_userState', { _uid: user.uid, _email: user.email }, { root: true })

				await database.set(`Users/${ user.uid }/state`, {
					UserID: 				user.uid,
					UserEmail: 			user.email,
					UserName: 			form.name,
					UserStatus: 		User.status.User,
					UserBalance: 		0,
					UserWorkStatus: Purchase.status.None,
					UserImageID:		storage.reference('UserIcons/default.webp')
				} as User.state)

				await database.set(`Users/${ user.uid  }/preferences`, {
					DarkTheme: true,
					Anotations: true,
				})

				await database.set(`Users/${ user.uid  }/messages/Hash_0`, {
					ID: Math.random().toString(36).slice(-8).toUpperCase(),
					date: Date.now(),
					from: 'Eccheuma',
					userID: 'SUPPORT',
					message: 'Благодарю вас за регистрацию!',
					readed: false,
				} as Message.struct)
	
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
