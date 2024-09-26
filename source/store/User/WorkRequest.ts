	import { ActionTree, MutationTree } from "vuex";

// API
	import { database } from "~/api/database";

// UTILS
	import { utils } from "~/utils";

// INTERFACES AND TYPES 

	import { VuexMap } from "~/contracts/VuexMap";

	import { Purchase } 	from "~/contracts/Services";
	import { Message } from "~/contracts/Message";

	import type { Notification } from "~/contracts/Notification";
	
// STATE
	export const state = () => ({

		Orders				: new Array<Purchase.order>(0),
		ActiveOrders	: new Array<Purchase.order>(0),

		RequestQuantity: 0,
		
	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module "~/contracts/VuexMap" {
		interface User {
			WorkRequest: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		setQuantity(state, prop) {
			state.RequestQuantity = prop;
		},
		setOrders(state, prop: Array<Purchase.order>) {

			if ( prop.length ) {
				state.Orders = prop;
			}

		},
		setActiveOrder(state, prop) {
			state.ActiveOrders = prop;
		}
	};

	// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap> = {

		// TODO: #16 Перенести сообщения в отдельный модуль, чтобы не болтались по среди метода. @Scarlatum
		async sendWorkRequest(vuex, order: Purchase.order) {

			const { uid: ID } = vuex.rootState.User.State.State;

			const Message: Message.struct = {
				uid: utils.randHashGenerator(),
				userID: "SUPPORT",
				from: "Eccheuma Informer",
				message: 
				`Благодарю за оформление заявки на заказ: "${ order.name }".
				
				В скором времени вам напишут, и тогда можно будет обсудить условия заказа, правок, оплаты.
				В среднем ответа можно ждать в диапозоне до 1 дня. Но время может меняться в зависимости от загруженности.
				
				Текущие заказы можно посмотреть в разделе "запросы".`,
				readed: false,
				date: Date.now(),
			};

			const newNotification: Notification.struct = {
				message			: "Ваша заявка пошла на рассмотрение",
				description	: "Информацию о стаусе заказа, вы можете посмотреть в личном кабинете, что находиться вверху приложения.",
			};

			try {

				await vuex.dispatch("setRequestQuantity");

				const requestHash = utils.randHashGenerator();

				await database.set(`users/${ ID }/work_requests/WorkID-${ requestHash }`, order);
				await database.set(`users/${ ID }/messages/Hash_${ requestHash }`, Message);

				vuex.commit("Notification/Notification_Status", true, { root: true });
				vuex.commit("Notification/createNotification", newNotification, { root: true });

			} catch (e) {
				console.log(e); 
			}

		},
		
		async setRequestContent(vuex) {

			const { uid: ID } = vuex.rootState.User.State.State;

			vuex.commit("setOrders", await database.get<Array<Purchase.order>>(`users/${ ID }/work_requests`));


		},

		async setRequestQuantity(vuex) {

			const { uid: ID } = vuex.rootState.User.State.State;

			vuex.commit("setQuantity", await database.getLength(`users/${ ID }/work_requests`)); 
		},

		setActiveRequest(vuex) {

			if ( !vuex.state.Orders.length ) return;

			vuex.commit("setActiveOrder", vuex.state.Orders.filter((order) => {
				return order.status === Purchase.status.Process;
			}));

		},

	};
