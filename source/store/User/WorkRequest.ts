	import { ActionTree, MutationTree } from 'vuex'

	import firebase from 'firebase/app'
	import 'firebase/database'

// INTERFACES AND TYPES 

	import { VuexModules } from '~/types/VuexModules'

	import type { SELECTED_SERVICE, REQUEST_STATUS } from '~/types/Services.ts'
	import type { Message as MESSAGE } from '~/store/User/Messages'

	import type { NOTIFICATION_CONTENT } from '~/types/Notification.ts'

	interface WORK_REQUEST extends SELECTED_SERVICE {
		ID: number
		Status: keyof REQUEST_STATUS
	}
	
// STATE
	export const state = () => ({

		ActiveRequests: [] as WORK_REQUEST[],

		RequestQuantity: 0,
		Requests: [] as WORK_REQUEST[],
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface User {
			WorkRequest: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_WorkQuantity(state, prop) {
			state.RequestQuantity = prop;
		},
		Change_Requests(state, prop) {
			state.Requests = prop
		},
		Change_ActiveRequests(state, prop) {
			state.ActiveRequests = prop
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexModules> = {
		async SendWorkRequest({ dispatch, commit, rootState, state }, _service: SELECTED_SERVICE) {

			const uid 					= rootState.Auth.Auth.CurentUser.uid
			const MessageCount 	= rootState.User.Messages.Messages.length

			const REQUEST: WORK_REQUEST = {
				ID: state.RequestQuantity,
				Status: 1,
				..._service
			}

			const MESSAGE: MESSAGE = {
				ID: MessageCount + 1,
				UserID: 'SUPPORT',
				From: 'Eccheuma Informer',
				Message: 
				`Благодарю за оформление заявки на заказ: "${ _service.Service.Name }".
				
				В скором времени вам напишут, и тогда можно будет обсудить условия заказа, правок, оплаты.
				В среднем ответа можно ждать в диапозоне до 1 дня. Но время может меняться в зависимости от загруженности.
				
				Текущие заказы можно посмотреть в разделе "запросы".`,
				Read: false,
				Date: Date.now(),
			}

			const NOTIFICATION_MESSAGE: NOTIFICATION_CONTENT = {
				message: 'Ваша заявка пошла на рассмотрение',
				description: 'Информацию о стаусе заказа, вы можете посмотреть в личном кабинете, что находиться вверху приложения.',
			}

			try {

				commit('Loader/Loader_ChangeLoadStatus_Counter', 28, { root: true })

				await dispatch('Set_RequestQuantity')

				firebase.database()
					.ref(`Users/${ uid }/work_requests/WorkID-${ state.RequestQuantity }`)
					.set(REQUEST)

				firebase.database()
					.ref(`Users/${ uid }/messages/Hash_${ MessageCount + 1 }`)
					.set(MESSAGE)

				commit('Loader/Loader_ChangeLoadMessage', 'Готово', { root: true })
				commit('Notification/Notification_Status', true, { root: true })

				commit('Notification/Set_Notification', NOTIFICATION_MESSAGE, { root: true })

			} catch (e) {

				console.log(e)

				commit('Loader/Loader_ChangeLoadMessage', 'Отмена', { root: true })

			} finally {

				commit('Loader/Loader_ChangeLoadStatus_Counter', 100, { root: true })

				setTimeout( () => {
					dispatch('Loader/Loader_Reload', null, { root: true })
				}, 1500);
				
			}
		},
		Set_RequestContent({ commit, rootState }) {

			const uid = rootState.Auth.Auth.CurentUser.uid

			firebase.database()
				.ref(`Users/${uid}/work_requests`)
				.on('value', (data) => { 
					commit('Change_Requests', data.val() ) 
				});	
			
		},
		Set_RequestQuantity({ commit, rootState }) {

			const uid = rootState.Auth.Auth.CurentUser.uid

			firebase.database()
				.ref(`Users/${uid}/work_requests`)
				.on('value', (data) => {
					commit('Change_WorkQuantity', data.numChildren())
				});

		},
		Set_ActiveRequest({ commit, state }) {

			if ( state.Requests.length ) {

				const R = state.Requests.filter(( item: WORK_REQUEST ) => item.Status > 1 )
				
				commit('Change_ActiveRequests', R)

			}

		},
	}
