import { describe, test, expect, beforeAll, afterAll } from 'vitest';

// UTILS
import { utils } from '~/utils';

// API
import { auth } from '~/api/auth';
import { database } from '~/api/database';

// PLUGINS
import Supabase from '~/plugins/Supabase'; Supabase();
import Firebase from '~/plugins/Firebase'; Firebase();

// VUE PREPARATIONS
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex);

// TEST USER
import { userForm } from 'path::root/mocks/defaultUser';

// STORES
import * as NotificationStore from '~/store/Notification';

import * as MessageStore      from '~/store/User/Messages';
import * as UserStateStore    from '~/store/User/State';

import * as AuthSessionStore  from '~/store/Auth/Session';
import * as AuthLoginStore    from '~/store/Auth/Login';
import * as AuthLogoutStore   from '~/store/Auth/Logout';

// TYPES
import { Notification } from '~/types/Notification';
import { Message } from '~/types/Message';
import { Image } from '~/types/Image';

// VIRTUAL STATE
const virtualStore = new Vuex.Store({
	modules: {
		Auth: {
			namespaced: true,
			modules: {
				Login: {
					state       : AuthLoginStore.state,
					actions     : AuthLoginStore.actions,
					mutations   : AuthLoginStore.mutations,
					namespaced  : true,
				},
				Logout: {
					actions     : AuthLogoutStore.actions,
					namespaced  : true,
				},
				Session: {
					state       : AuthSessionStore.state,
					mutations   : AuthSessionStore.mutations,
					namespaced  : true,
				}
			}
		},
		User: {
			namespaced: true,
			modules: {
				State: {
					state       : UserStateStore.state,
					mutations   : UserStateStore.mutations,
					namespaced  : true,
				},
				Messages: {
					state       : MessageStore.state,
					actions     : MessageStore.actions,
					mutations   : MessageStore.mutations,
					namespaced  : true,
				}
			}
		}
	}
});


// TESTS
describe('store::notification', () => {

	const store = new Vuex.Store({
		state     : NotificationStore.state(),
		actions   : NotificationStore.actions,
		mutations : NotificationStore.mutations,
		strict    : true,
	});

	test('notification::set', async () => {

		const struct: Notification.struct = {
			description: 'Gedränge',
			message: 'Busen schmerz  ihr euch und, freundschaft mich euch glück gleich. Die ich wird besitze stillen die wahn ich sich. Um versuch fühlt der euren.'
		};

		await store.dispatch('createNotification', struct);

		expect(store.state.status).toBe(true);
		expect(store.state.content).toEqual(struct);

	});

});

describe('store::auth', () => {

	test('auth::login', async () => {
		
		const response: auth.error | boolean = await virtualStore.dispatch('Auth/Login/SignIn', userForm);

		expect(response).toBe(true);

		// Open UserProfile window
		virtualStore.commit('User/State/toggleProfileArea', true);

		const { State } = virtualStore.state.User.State;
		const { CurentUser } = virtualStore.state.Auth.Session;

		expect(response).toBe(true);

		expect(State.UserEmail).toBe(userForm.email);
		expect(State.UserID).toBe(CurentUser.uid);
		
	});

	test('auth::logout', async () => {

		await virtualStore.dispatch('Auth/Logout/Logout', userForm);

		const { State, UserProfileArea } = virtualStore.state.User.State;
		const { CurentUser, LoginStatus, AuthError }  = virtualStore.state.Auth.Session;

		expect(LoginStatus)
			.toBeFalsy();
		expect(AuthError)
			.toBeNull();
		expect(State)
			.toStrictEqual(new Object());
		expect(UserProfileArea)
			.toBeFalsy();

		Object.values(CurentUser).forEach(value => {
			expect(value.length).toBe(0);
		});

	});

});

describe('store::user', async () => {

	let messageID: string;

	beforeAll(async () => {

		const response: auth.error | boolean = await virtualStore.dispatch('Auth/Login/SignIn', userForm);

		if ( typeof response === 'string' ) throw new Error(response);

		messageID		= utils.randHashGenerator();

	});

	afterAll(async () => {
		await virtualStore.dispatch('Auth/Logout/Logout');
	});

	test('user::message::send', async () => {

		const newMessage: Message.struct = {
			ID: messageID,
			date: Date.now(),
			from: userForm.name,
			message: 'Dreams that forgotten shorn distant perched door floating, i for a whose before the has...',
			readed: false,
			userID: virtualStore.state.User.State.State.UserID
		};

		const response: Error | boolean = await virtualStore.dispatch('User/Messages/sendMessage', newMessage);

		await virtualStore.dispatch('User/Messages/getMessages');

		// EXPECT
		expect(response).toBe(true);

	});

	test('user::message::check', async () => {

		await virtualStore.dispatch('User/Messages/checkUnreaded');

		const { NewMessagesCount, Data } = virtualStore.state.User.Messages;
		const { State } = virtualStore.state.User.State;

		// EXPECT
		expect(NewMessagesCount).toBe(0);

		Data.forEach(mess => {
			expect(mess.userID).toBe(State.UserID);
		});

	});

	test('user::message::mark', async () => {

		await virtualStore.dispatch('User/Messages/markAsReaded', messageID);

		const { Data } = virtualStore.state.User.Messages;

		const [ newMessage, emptyMessage ] = Data.filter(({ ID }) => ID === messageID);

		// EXPECT

		expect(newMessage.readed)
			.toBe(true);

		expect(emptyMessage)
			.toBeUndefined();

	});

	test('user::message::remove', async () => {

		const [ newMessage ] = virtualStore.state.User.Messages.Data;

		const response: database.error | boolean = await virtualStore.dispatch('User/Messages/removeMessage', newMessage);

		typeof response === 'string'
			? expect(response).toBe(database.error.denied)
			: expect(response).toBe(true);

	});

});

