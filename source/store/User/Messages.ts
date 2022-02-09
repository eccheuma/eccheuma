// API
	import type { ActionTree, MutationTree } from 'vuex'
	import { database } from '~/api/database';

// VUEX

	import type { VuexModules } from '~/typescript/VuexModules'
	import type { MESSAGE } 		from '~/typescript/Message'

// STATE
	export const state = () => ({

		Messages: [] as MESSAGE[],     

		NewMessagesCount: 0
		
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexModules' {
		interface User {
			Messages: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {

		setUnreadedQuanity(state, q: number) {
			state.NewMessagesCount = q
		},

		setMessages(state, messages: MESSAGE[]) {
			state.Messages = messages.sort((a, b) => a.Date - b.Date);
		},
		
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexModules>  = {

		async getMessages({ dispatch, commit, rootState }) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			await database.get(`Users/${uid}/messages`).then(messages => {
				commit('setMessages', Object.values(messages)); 
			})

			dispatch('checkUnreaded');

		},

		sendMessage({ rootState }, prop: MESSAGE) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			database.set(`Users/${ uid }/messages/Hash_${prop.ID}`, prop) 

		},

		markAsReaded({ rootState }, ID: MESSAGE['ID']) {

			// Получение ID пользователя
			const { uid } = rootState.Auth.Session.CurentUser;

			database.update(`Users/${ uid }/messages/Hash_${ ID }`, { Read: true } as MESSAGE)

		},

		checkUnreaded({ rootState, commit, state }) {

			const { length } = state.Messages.filter(({ Read, UserID }) => {
				return !Read && UserID !== rootState.User.State.UserState.UserID
			})
			
			commit('setUnreadedQuanity', length)

		},
		
	}
