	import { ActionTree, MutationTree } from 'vuex'

// API
	import { database } from '~/api/database'

// INTERFACES AND TYPES 

	import { VuexModules } from '~/typescript/VuexModules'

	import type { SELECTED_SERVICE, REQUEST_STATUS } 	from '~/typescript/Services'
	import type { MESSAGE } from '~/typescript/Message'

	import type { NOTIFICATION_CONTENT } from '~/typescript/Notification'

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
	declare module '~/typescript/VuexModules' {
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
		async SendWorkRequest({ dispatch, commit, rootState, state }, service: SELECTED_SERVICE) {

			const { uid } 			= rootState.Auth.Session.CurentUser
			const MessageCount 	= rootState.User.Messages.Messages.length

			const REQUEST: WORK_REQUEST = {
				ID: state.RequestQuantity,
				Status: 1,
				...service
			}

			const MESSAGE: MESSAGE = {
				ID: Math.random().toString(36).slice(-8).toUpperCase(),
				UserID: 'SUPPORT',
				From: 'Eccheuma Informer',
				Message: 
				`Благодарю за оформление заявки на заказ: "${ service.Service.Name }".
				
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

				await database.set(`Users/${ uid }/work_requests/WorkID-${ state.RequestQuantity }`, REQUEST);
				await database.set(`Users/${ uid }/messages/Hash_${ MessageCount + 1 }`, MESSAGE);

				commit('Notification/Notification_Status', true, { root: true })
				commit('Notification/setNotification', NOTIFICATION_MESSAGE, { root: true })

			} catch (e) { console.log(e) }

		},
		async Set_RequestContent({ commit, rootState }) {

			const { uid } = rootState.Auth.Session.CurentUser;

			commit('Change_Requests', await database.get(`Users/${ uid }/work_requests`)) 

		},
		async Set_RequestQuantity({ commit, rootState }) {

			const { uid } = rootState.Auth.Session.CurentUser

			commit('Change_WorkQuantity', await database.getLength(`Users/${uid}/work_requests`)) 

		},
		Set_ActiveRequest({ commit, state }) {

			if ( !state.Requests.length ) return;

			const R = state.Requests.filter(( item: WORK_REQUEST ) => item.Status > 1 )
			
			commit('Change_ActiveRequests', R)

		},
	}
