import type { ActionTree, MutationTree } from "vuex";

// UTILS
	import { wallet } from "~/utils/currency";

// API
	import { database } 	from "~/api/database";
	import { auth, form } from "~/api/auth";

// TYPES
	import type { CurentState as SessionState } from "~/store/Auth/Session";
	import type { VuexMap } 	from "~/contracts/VuexMap";
	import type { User } from "~/contracts/User";

// STATE
	export const state = () => ({
		inAction: false as boolean
	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module "~/contracts/VuexMap" {
		interface Auth {
			Login: CurentState,
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		setAction(state, value: boolean) {
			state.inAction = value;
		}
	};

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap> = {
		async SignIn(vuex, form: form.registration): Promise<auth.error | boolean> {

				vuex.commit("setAction", true);

				const responseResult = await auth.login(form.email, form.password);

				if ( responseResult instanceof Error ) {

					vuex.commit("Auth/Session/setAuthError", responseResult, { root: true });

					return false;

				}

				const { uid, email } = responseResult;

				const userData: SessionState["CurentUser"] = { uid, email };
				
				vuex.commit("Auth/Session/setUserState", userData, { root: true });

				// Загрузка стейта пользователя из Firebase
				const userState: User.struct = await database.get(`users/${ uid }/state`);

				await vuex.dispatch("Wallet/getWallet", uid, { root: true });

				vuex.commit("User/State/setUserState", userState, { root: true });
				vuex.commit("Auth/Session/setLoginStatus", true, { root: true });
				vuex.commit("setAction", false);

				database.listen(`users/${ uid }/state`, value => {
					vuex.commit("User/State/setUserState", value, { root: true });
				}, { mode: database.mode.whole });

				return true;

		}
	};
