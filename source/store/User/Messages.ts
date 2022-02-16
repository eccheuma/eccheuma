// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

// UTILS
	import { utils } from '~/utils';

// API
	import { database } from '~/api/database';

// TYPES
	import type { VuexMap } from '~/typescript/VuexMap'
	import type { Message } from '~/typescript/Message'

// STATE
	export const state = () => ({

		Data: new Array<Message.struct>(0),     

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
			state.Data = messages.sort((a, b) => b.date - a.date);
		},
		
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap>  = {

		getMessages({ dispatch, commit, rootState }) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			database.listen<utils.asJSONArray<Message.struct>>(`Users/${uid}/messages`, messages => {
				
				commit('setMessages', Object.values(messages)); 

				dispatch('checkUnreaded');

			})

		},

		sendMessage({ rootState }, prop: Message.struct) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			database.set(`Users/${ uid }/messages/Hash_${prop.ID}`, prop) 

		},

		markAsReaded({ rootState }, ID: Message.struct['ID']) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			console.log('markAsReaded VUEX')

			database.update(`Users/${ uid }/messages/Hash_${ ID }`, { readed: true } as Partial<Message.struct>)

		},

		checkUnreaded({ rootState, commit, state }) {

			const { length } = state.Data.filter(({ readed, userID }) => {
				return userID !== rootState.User.State.State.UserID && readed === false
			})
			
			commit('setUnreadedQuanity', length)

		},
		
	}
