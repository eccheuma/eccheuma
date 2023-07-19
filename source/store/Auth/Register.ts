import type { MutationTree, ActionTree } from 'vuex';

// API
	import { database } from '~/api/database';
	import { storage } from '~/api/storage';
	import { auth, form } from '~/api/auth';

// UTILS
	import { utils } from '~/utils';
	import { currencies, wallet } from '~/utils/currency';

// TYPES
	import type { VuexMap } from '~/contracts/VuexMap';
	import type { Message } from '~/contracts/Message';

// NAMESPACES
	import { User } 		from '~/contracts/User';
	import { Purchase } from '~/contracts/Services';

// STATE
	export const state = () => ({
		Modal: false
	});

// CURENT STATE
	export type CurentState = ReturnType<typeof state>

// DECALARE MODULE
	declare module '~/contracts/VuexMap' {
		interface Auth {
			Register: CurentState
		}
	}

// MUTATIONS
	export const mutations: MutationTree<CurentState> = {
		toggleRegisterModal(state, prop: boolean = !state.Modal) {
			state.Modal = prop;
		}
	};

// ACTIONS
	export const actions: ActionTree<CurentState, VuexMap> = {

		async Register(vuex, form: form.registration): Promise<auth.error | boolean> {

			const responseResult = await auth.register(form.email, form.password);

			if ( responseResult instanceof Error ) {

				vuex.commit('Auth/Session/setAuthError', responseResult, { root: true });

				return false;

			}

			const { uid, email } = responseResult;

			vuex.commit('Auth/Session/setUserState', { uid, email }, { root: true });
			vuex.commit('Auth/Session/setAuthError', null, { root: true });

			await database.set<User.struct>(`users/${ uid }/state`, {
				uid					:	uid,
				email				:	email,
				name				:	form.name,
				status			:	User.status.User,
				purchase		: Purchase.status.None,
				image				:	String(storage.reference('UserIcons/default.webp'))
			});

			await database.set(`User/${ uid }/info`, {
				registrationDate: Date.now()
			});

			// ? Всё ещё стоит под вопросом. Нужно ли хранить данные касательно клиентских настроек вне браузера...
			await database.set(`users/${ uid  }/preferences`, {
				theme					: 0,
				notifications	: false,
			});

			const Message: Message.struct = {
				uid			: utils.randHashGenerator(),
				date		: Date.now(),
				from		: 'Eccheuma',
				userID	: 'SUPPORT',
				message	: 'Благодарю вас за регистрацию!',
				readed	: false,
			};

			await database.set(`users/${ uid }/messages/Hash_${ Message.uid }`, Message);

			return true;

		}

	};
