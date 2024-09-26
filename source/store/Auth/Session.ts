// VUEX
	import type { MutationTree } from "vuex";

// AUTH
	import { auth, form } from "~/api/auth";

// STATE
	export const state = () => ({

		AuthError: null as auth.error | null,

		LoginStatus: false,

		CurentUser: {
			email: String(),
			uid: String(),
		} as form.session,
		
	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module "~/contracts/VuexMap" {
		interface Auth {
			Session: CurentState
		}
	}

// MUTATIONS	
	export const mutations: MutationTree<CurentState> = {
		setLoginStatus(state, prop: boolean) {
			state.LoginStatus = prop;
		},
		setAuthError(state, prop: auth.error) {
			state.AuthError = prop;
		},
		setUserState(state, { email, uid }: CurentState["CurentUser"]) {
			state.CurentUser = { email, uid };
		},

		resetUser(state) {
			state.CurentUser = {
				email	: String(),
				uid		: String(),
			} as form.session;
		}

	};
