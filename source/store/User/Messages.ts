import firebase from 'firebase/app'
import 'firebase/database'

// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

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
		setMessages(state, messages: MESSAGE) {
			state.Messages = Object.values(new Object(messages)).map((item: MESSAGE) => item).sort((a, b) => a.Date - b.Date)
		},
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexModules>  = {

		getMessages({ dispatch, commit, rootState }) {
			try {

				// Получение ID пользователя
				const uid = rootState.Auth.Session.CurentUser.uid

				// Загрузка стейта пользователя из Firebase
				firebase.database()
					.ref(`Users/${uid}/messages`)
					.on('value', (data) => {

						commit('setMessages', data.val()); 
						
						dispatch('checkUnreaded')

					});

			} catch (e) { console.log(e) }
		},

		sendMessage({ rootState }, prop: MESSAGE) {
			try {
				
				// Получение ID пользователя
				const uid = rootState.Auth.Session.CurentUser.uid

				firebase.database().ref(`Users/${ uid }/messages/Hash_${prop.ID}`).set(prop)

			} catch (e) { console.log(e) }
		},

		markAsReaded({ rootState }, ID: MESSAGE['ID']) {

			const uid = rootState.Auth.Session.CurentUser.uid 

			firebase.database()
				.ref(`Users/${ uid }/messages/Hash_${ ID }`)
				.update({ Read: true } as MESSAGE)

		},

		checkUnreaded({ rootState, commit, state }) {

			const Unreaded = state.Messages.filter(( item: MESSAGE ) => {
				return !item.Read && item.UserID !== rootState.User.State.UserState.UserID
			})
			
			commit('setUnreadedQuanity', Unreaded.length )

		},
		
	}
