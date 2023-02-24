// VUEX
	import type { MutationTree } from 'vuex';

// TYPES
	import { User } from '~/contracts/User';
	import { currencies } from '~/utils/currency';

// STATE
	export const state = () => ({

		UserProfileArea: false,
		Currency: currencies.Country.ru, 

		State: new Object() as User.struct

	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/contracts/VuexMap' {
		interface User {
			State: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		setUserState(state, newUserState: User.struct) {
			state.State = newUserState;
		},
		toggleProfileArea(state) {
			state.UserProfileArea = !state.UserProfileArea;
		}
	};
