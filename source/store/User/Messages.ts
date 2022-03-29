// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

// UTILS
	import { utils } from '~/utils';

// API
	import { database } from '~/api/database';

// TYPES
	import type { VuexMap } from '~/types/VuexMap'
	import type { Message } from '~/types/Message'

// STATE
	export const state = () => ({

		Data: new Array<Message.struct>(0),     

		NewMessagesCount: 0
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexMap' {
		interface User {
			Messages: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setUnreadedQuanity(state, q: number) {
			state.NewMessagesCount = q
		},

		setMessages(state, messages: Array<Message.struct>) {
			state.Data = messages.sort((a, b) => a.date - b.date);
		},
		
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap>  = {

		async getMessages({ dispatch, commit, rootState }): Promise<boolean> {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			return new Promise((resolve) => {

				database.listen<utils.types.asIterableObject<Message.struct>>(`Users/${uid}/messages`, messages => {
				
					commit('setMessages', Object.values(messages || new Object())); 
	
					dispatch('checkUnreaded');

					resolve(true)
	
				})

			})

			

		},

		sendMessage(vuex, prop: Message.struct) {

			// Получение ID пользователя
			const { State } = vuex.rootState.User.State;

			return database.set(`Users/${ State.UserID }/messages/Hash_${prop.ID}`, prop) 

		},

		removeMessage(vuex, { ID }: Message.struct) {

			const { State } = vuex.rootState.User.State;

			return database.remove(`Users/${ State.UserID }/messages/Hash_${ ID }`)

		},

		markAsReaded(vuex, ID: Message.struct['ID']): Promise<database.error | boolean> {

			// Получение ID пользователя
			const { State } = vuex.rootState.User.State;

			return database.update(`Users/${ State.UserID }/messages/Hash_${ ID }`, { readed: true } as Partial<Message.struct>)

		},

		checkUnreaded(vuex) {

			const { State } = vuex.rootState.User.State;

			const { length } = vuex.state.Data.filter(message => {
				return message.readed === false && message.userID !== State.UserID
			})
			
			vuex.commit('setUnreadedQuanity', length);

		},
		
	}
