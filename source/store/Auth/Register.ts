// API
	import type { MutationTree, ActionTree } from 'vuex'
	import { database } from '~/api/database';
	import { storage } from '~/api/storage';
	import { auth, form } from '~/api/auth'

// UTILS
	import { utils } from '~/utils';

// VUEX

	import type { VuexMap } from '~/typescript/VuexMap'

	import type { Message } from '~/typescript/Message'

// NAMESPACES
	import { User } 		from '~/typescript/User'
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

		async Register(vuex, form: form.registration): Promise<auth.error | Boolean> {

			// ! Должен возвращать не только тип формы но и ошибку, чтобы можно было её передать дальше.
			// ! Ну а пока имеем то, что имеем.

			const response = await auth.register(form.email, form.password);

			if ( typeof response === 'string' ) {

				vuex.commit('Auth/Session/setAuthError', response, { root: true });

				return false

			};

			const { uid, email } = response;
			
			vuex.commit('Auth/Session/Change_userState', { uid, email }, { root: true })
			vuex.commit('Auth/Session/setAuthError', null, { root: true });

			await database.set(`Users/${ uid }/state`, {
				UserID					:	uid,
				UserEmail				:	email,
				UserName				:	form.name,
				UserStatus			:	User.status.User,
				UserBalance			:	0,
				UserWorkStatus	: Purchase.status.None,
				UserImageID			:	storage.reference('UserIcons/default.webp')
			} as User.state)

			// ? Всё ещё стоит под вопросом. Нужно ли хранить данные касательно клиентских настроек вне браузера...
			//	await database.set(`Users/${ uid  }/preferences`, {
			// 		DarkTheme		: true,
			// 		Anotations	: true,
			// 	})

			const Message: Message.struct = {
				ID			: utils.hashGenerator(),
				date		: Date.now(),
				from		: 'Eccheuma',
				userID	: 'SUPPORT',
				message	: 'Благодарю вас за регистрацию!',
				readed	: false,
			}

			await database.set(`Users/${ uid }/messages/Hash_${ Message.ID }`, Message);

			return true;

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
