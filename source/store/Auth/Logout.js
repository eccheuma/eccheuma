import firebase from 'firebase/app'
import 'firebase/auth'

export const actions = {
    async Logout({commit, dispatch, rootState}) {
        try {

            // Изменение статуса аутинтификации
            commit('Auth/Auth/ChangeLoginStatus', false, { root: true })

            if ( !rootState.Loader.Status.Load  ) {
                dispatch('Loader/Loader_Load', '', { root: true })
            }

            // Сброс стейта пользователя
            commit('User/State/Change_UserState', new Object(), { root: true })

            // Выход из учётной запись в Firebase
            await firebase.auth().signOut()

            // Сброс сообщения ошибки
            commit('Auth/Auth/ChangeAuthError', '', { root: true })

            commit('Loader/Loader_ChangeLoadMessage', 'Выход', { root: true })

            setTimeout(() => {
                dispatch('Loader/Loader_Load', null, { root: true })
            }, 500);

        } catch(e) {}
    }
}