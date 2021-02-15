import firebase from 'firebase/app'
import 'firebase/database'

// VUEX
	import type { ActionTree, MutationTree } from 'vuex'

	import type { VuexModules } from '~/types/VuexModules'

// TYPES
	export type Message = {
		ID: number
		UserID: VuexModules['User']['State']['UserState']['UserID']
		From: VuexModules['User']['State']['UserState']['UserName'],
		Date: number
		Message: string
		Read: boolean
	}

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/types/VuexModules' {
		interface User {
			Messages: CurentState
		}
	}

// STATE
	export const state = () => ({

		Messages: [] as Message[],     

		NewMessagesCount: 0
		
	})

	export const mutations: MutationTree<CurentState> = {
		Change_NewMessagesCount(state, n: number) {

			state.NewMessagesCount = n

		},
		Change_Messages(state, messages: Message) {

			state.Messages = Object.values(new Object(messages)).map((item: Message) => item)

		},
	}

	export const actions: ActionTree<CurentState, VuexModules>  = {
		FireBaseGetMessages({dispatch, commit, rootState}) {
			try {

				// Получение ID пользователя
				const uid = rootState.Auth.Auth.CurentUser.uid

				// Загрузка стейта пользователя из Firebase
				firebase.database()
					.ref(`Users/${uid}/messages`)
					.on('value', data => {

						commit('Change_Messages', data.val()); 
						
						dispatch('CheckMessages')

					});

			} catch (e) { console.log(e) }
		},
		FireBaseSendMessage({ rootState }, prop: Message) {
			try {
				
				// Получение ID пользователя
				const uid = rootState.Auth.Auth.CurentUser.uid

				firebase.database()
					.ref(`Users/${ uid }/messages/Hash_${prop.ID}`).set(prop)

			} catch (e) { console.log(e) }
		},
		MarkAsReaded({ rootState }, ID: Message['ID']) {

			console.log("MarkAsReaded", ID)

			const uid = rootState.Auth.Auth.CurentUser.uid 

			firebase.database()
				.ref(`Users/${ uid }/messages/Hash_${ ID }`)
				.update( { Read: true } as Message )

		},
		CheckMessages({ rootState, commit, state }) {

			const Unreaded = state.Messages.filter(( item: Message ) => {
				return !item.Read && item.UserID != rootState.User.State.UserState.UserID
			})
			
			commit('Change_NewMessagesCount', Unreaded.length )

		},
	}

