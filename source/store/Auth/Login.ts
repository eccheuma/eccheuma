import type { ActionTree, MutationTree } from 'vuex'

// API
	import { database } 	from '~/api/database'
	import { auth, form } from '~/api/auth'

// TYPES
	import type { CurentState as SessionState } from '~/store/Auth/Session'
	import type { VuexMap } 	from '~/typescript/VuexMap'
	import type { User } from '~/typescript/User'

// STATE
	export const state = () => ({
		inAction: false as boolean
	})

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/typescript/VuexMap' {
		interface Auth {
			Login: CurentState,
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		setAction(state, value: boolean) {
			state.inAction = value
		}
	}

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap> = {
		async SignIn(vuex, form: form.registration): Promise<auth.error | boolean> {

				vuex.commit('setAction', true);

				const response = await auth.login(form.email, form.password);

				if ( typeof response === 'string' ) {

					vuex.commit('Auth/Session/setAuthError', response, { root: true });

					return false

				}

				const { uid, email } = response;

				const userData: SessionState['CurentUser'] = { uid, email: email || String() }
				
				vuex.commit('Auth/Session/setUserState', userData, { root: true })

				// Загрузка стейта пользователя из Firebase
				const userState: User.state = await database.get(`Users/${ uid }/state`)

				vuex.commit('User/State/setUserState', userState, { root: true });

				vuex.commit('Auth/Session/setLoginStatus', true, { root: true });
			
				vuex.commit('setAction', false);

				database.listen(`Users/${ uid }/state`, value => {
					vuex.commit('User/State/setUserState', value, { root: true });
				}, { change: true })

				return true;

		}
	}
