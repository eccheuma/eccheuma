// API
	import type { ActionTree, MutationTree } from 'vuex'
	import { database } from '~/api/database';

// VUEX

	import type { VuexMap } from '~/typescript/VuexMap'
	import type { Message } from '~/typescript/Message'

// STATE
	export const state = () => ({

		Messages: new Array<Message.struct>(0),     

		NewMessagesCount: 0
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
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
			state.Messages = messages.sort((a, b) => a.date - b.date);
		},
		
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap>  = {

		async getMessages({ dispatch, commit, rootState }) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			await database.get(`Users/${uid}/messages`).then(messages => {
				commit('setMessages', Object.values(messages)); 
			})

			dispatch('checkUnreaded');

		},

		sendMessage({ rootState }, prop: Message.struct) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			database.set(`Users/${ uid }/messages/Hash_${prop.ID}`, prop) 

		},

		markAsReaded({ rootState }, ID: Message.struct['ID']) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			database.update(`Users/${ uid }/messages/Hash_${ ID }`, { readed: true } as Partial<Message.struct>)

		},

		checkUnreaded({ rootState, commit, state }) {

			const { length } = state.Messages.filter(({ readed, userID }) => {
				return userID !== rootState.User.State.UserState.UserID && readed === false
			})
			
			commit('setUnreadedQuanity', length)

		},
		
	}
