import firebase from 'firebase/app'
import 'firebase/database'

    export const state = () => ({

        UsersState: []

    })

    export const mutations = {
        CMS_ChangeUserState(state, prop) {
            state.UsersState = prop
        }
    }
    
    export const actions = {
        CMS_SetUsersState({commit}) {
            firebase.database().ref(`Users`)
                .on('value', data => {

                    commit( 'CMS_ChangeUserState', data.val() )

                })
        }
    }