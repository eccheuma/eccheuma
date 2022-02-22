import type { ActionTree, MutationTree } from 'vuex'

// API
import { auth } from '~/api/auth'

// ACTIONS
export const actions: ActionTree<any,any> = {
	async Logout(vuex): Promise<void> {
		
		// Изменение статуса аутинтификации
		vuex.commit('Auth/Session/setLoginStatus', false, { root: true })
		vuex.commit('Auth/Session/resetUser', null, { root: true })

		// Сброс стейта пользователя
		vuex.commit('User/State/setUserState', new Object(), { root: true })

		// Сброс сообщения ошибки
		vuex.commit('Auth/Session/setAuthError', null, { root: true })

		return await auth.logout();

	}
}