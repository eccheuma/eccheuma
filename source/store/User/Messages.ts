// VUEX
	import type { ActionTree, MutationTree } from 'vuex';

// UTILS
	import { utils } from '~/utils';

// API
	import { database } from '~/api/database';

// TYPES
	import type { VuexMap } from '~/contracts/VuexMap';
	import type { Message } from '~/contracts/Message';

// STATE
	export const state = () => ({

		Data: new Array<Message.struct>(0),     

		NewMessagesCount: 0
		
	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/contracts/VuexMap' {
		interface User {
			Messages: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setUnreadedQuanity(state, q: number) {
			state.NewMessagesCount = q;
		},

		setMessages(state, messages: Array<Message.struct>) {
			state.Data = messages.sort((a, b) => a.date - b.date);
		},
		
	};

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap>  = {

		async getMessages({ dispatch, commit, rootState }): Promise<void> {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			const applyMessages = (messages: utils.types.asIterableObject<Message.struct>) => {
				commit('setMessages', Object.values(messages || new Object()));
				dispatch('checkUnreaded');
			};

			database.listen<utils.types.asIterableObject<Message.struct>>(`chats/${uid}/main`, applyMessages);

		},

		// TODO #17 : Переработать мутации объеденив их в одну. DRY никто не отменял. @Scarlatum 
		sendMessage(vuex, prop: Message.struct) {

			// Получение ID пользователя
			const { State } = vuex.rootState.User.State;

			return database.set(`chats/${ State.uid }/main/hash::${prop.uid}`, prop); 

		},

		removeMessage(vuex, { uid: ID }: Message.struct) {

			const { State } = vuex.rootState.User.State;

			return database.remove(`chats/${ State.uid }/main/hash::${ ID }`);

		},

		markAsReaded(vuex, ID: Message.struct['uid']): Promise<Error | boolean> {

			// Получение ID пользователя
			const { State } = vuex.rootState.User.State;

			return database.update(`chats/${ State.uid }/main/hash::${ ID }`, { readed: true } as Partial<Message.struct>);

		},

		checkUnreaded(vuex) {

			const { State } = vuex.rootState.User.State;

			const { length } = vuex.state.Data.filter(message => {
				return message.readed === false && message.userID !== State.uid;
			});
			
			vuex.commit('setUnreadedQuanity', length);

		},
		
	};
