	import { ActionTree, MutationTree } from 'vuex'

// API
	import { database } from '~/api/database'

// INTERFACES AND TYPES 

	import { VuexMap } from '~/typescript/VuexMap'

	import { Purchase } 	from '~/typescript/Services'
	import { Message } from '~/typescript/Message'

	import type { NOTIFICATION_CONTENT } from '~/typescript/Notification'
	
// STATE
	export const state = () => ({

		ActiveOrders: new Array<Purchase.order<any>>(0),

		RequestQuantity: 0,
		Orders: new Array<Purchase.order<any>>(0),
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
		interface User {
			WorkRequest: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		Change_WorkQuantity(state, prop) {
			state.RequestQuantity = prop;
		},
		setOrders(state, prop) {
			state.Orders = prop
		},
		Change_ActiveRequests(state, prop) {
			state.ActiveOrders = prop
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap> = {

		async SendWorkRequest(vuex, order: Purchase.order<any>) {

			const { uid } 			= vuex.rootState.Auth.Session.CurentUser
			const MessageCount 	= vuex.rootState.User.Messages.Messages.length

			const Message: Message.struct = {
				ID: Math.random().toString(36).slice(-8).toUpperCase(),
				userID: 'SUPPORT',
				from: 'Eccheuma Informer',
				message: 
				`Благодарю за оформление заявки на заказ: "${ order.Name }".
				
				В скором времени вам напишут, и тогда можно будет обсудить условия заказа, правок, оплаты.
				В среднем ответа можно ждать в диапозоне до 1 дня. Но время может меняться в зависимости от загруженности.
				
				Текущие заказы можно посмотреть в разделе "запросы".`,
				readed: false,
				date: Date.now(),
			}

			const NOTIFICATION_Message: NOTIFICATION_CONTENT = {
				message: 'Ваша заявка пошла на рассмотрение',
				description: 'Информацию о стаусе заказа, вы можете посмотреть в личном кабинете, что находиться вверху приложения.',
			}

			try {

				await vuex.dispatch('setRequestQuantity')

				await database.set(`Users/${ uid }/work_requests/WorkID-${ vuex.state.RequestQuantity }`, order);
				await database.set(`Users/${ uid }/messages/Hash_${ MessageCount + 1 }`, Message);

				vuex.commit('Notification/Notification_Status', true, { root: true })
				vuex.commit('Notification/setNotification', NOTIFICATION_Message, { root: true })

			} catch (e) {
				console.log(e) 
			}

		},
		
		async setRequestContent(vuex, uid: string) {
			vuex.commit('Change_Requests', await database.get(`Users/${ uid }/work_requests`)) 
		},

		async setRequestQuantity(vuex, uid: string) {
			vuex.commit('Change_WorkQuantity', await database.getLength(`Users/${uid}/work_requests`)) 
		},

		setActiveRequest(vuex) {

			if ( !vuex.state.Orders.length ) return;

			vuex.commit('Change_ActiveRequests', vuex.state.Orders.filter((order) => {
				return order.Status === Purchase.status.Process
			}))

		},

	}
