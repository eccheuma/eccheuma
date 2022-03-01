import { describe, test, expect } from 'vitest';

// ENV
require('dotenv').config();

// UTILS
import { utils } from '~/utils';

// API
import { auth, form } from '~/api/auth';
import { database } from '~/api/database';

import '~/plugins/Supabase';
import '~/plugins/Firebase';

// VUE PREPARATIONS
import Vuex from 'vuex';
import Vue from 'vue';

Vue.use(Vuex as any);

// STORES
import * as NotificationStore from '~/store/Notification';
import * as ImageStore        from '~/store/Images';

import * as MessageStore      from '~/store/User/Messages';
import * as UserStateStore    from '~/store/User/State';

import * as AuthSessionStore  from '~/store/Auth/Session';
import * as AuthLoginStore    from '~/store/Auth/Login';
import * as AuthLogoutStore   from '~/store/Auth/Logout'

// TYPES
import { Notification } from '~/typescript/Notification';
import { Message } from '~/typescript/Message';
import { Image } from '~/typescript/Image';

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
})

// TEST USER
const userForm: form.registration = { email: 'testing@mail.tech', password: 'TESTING001', name: 'TESTING' };

// TESTS
describe('store::notification', () => {

  const store = new Vuex.Store({
    state     : NotificationStore.state(),
    actions   : NotificationStore.actions,
    mutations : NotificationStore.mutations,
    strict    : true,
  })

  test('notification::set', async () => {

    const struct: Notification.struct = {
      description: 'Gedränge',
      message: 'Busen schmerz  ihr euch und, freundschaft mich euch glück gleich. Die ich wird besitze stillen die wahn ich sich. Um versuch fühlt der euren.'
    }

    await store.dispatch('createNotification', struct);

    expect(store.state.status).toBe(true);
    expect(store.state.content).toEqual(struct);

  })

})

describe('store::image', () => {

  const store = new Vuex.Store({
    state     : ImageStore.state(),
    actions   : ImageStore.actions,
    mutations : ImageStore.mutations,
    strict    : true,
  })

  test('image::getImageURL', async () => {

    const subabaseDomen = 'unfruhyobjypfbvnncoc.supabase.co';
    const imagePath     = 'Other/YumAjBcQMUM.jpg';
    const targetSize    = Image.sizes.large;
    
    const virtualSize   = Image.sizes.medium + 60;

    const actualURLS: Image.formatsStruct = {
      webp: `https://${ subabaseDomen }/storage/v1/object/public/main/images/${ imagePath }/webp/${ targetSize }.webp`,
      avif: `https://${ subabaseDomen }/storage/v1/object/public/main/images/${ imagePath }/avif/${ targetSize }.avif`,
    }

    const struct: Image.formatsStruct = await store.dispatch('getImageURL', { path: imagePath, size: virtualSize });

    expect(struct.avif).toBeTypeOf('string');
    expect(struct.webp).toBeTypeOf('string');

    expect(struct).toStrictEqual(actualURLS);

  })

})

describe('store::user', async () => {

  const loginStatus: auth.error | boolean = await virtualStore.dispatch('Auth/Login/SignIn', userForm);

  if ( typeof loginStatus === 'string' ) throw new Error(loginStatus);

  const messageID = utils.hashGenerator();

  test('user::message::send', async () => {

    const newMessage: Message.struct = {
      ID: messageID,
      date: Date.now(),
      from: 'Vitest',
      message: 'Dreams that forgotten shorn distant perched door floating, i for a whose before the has...',
      readed: false,
      userID: 'xOfKdd6uBASwgGJvQNhomyeI7TI3'
    }

    const response: Error | boolean = await virtualStore.dispatch('User/Messages/sendMessage', newMessage);

    await virtualStore.dispatch('User/Messages/getMessages');

    // EXPECT
    expect(response).toBe(true);

  })

  test('user::message::check', async () => {

    await virtualStore.dispatch('User/Messages/checkUnreaded');

    const { NewMessagesCount, Data } = virtualStore.state.User.Messages;
    const { State } = virtualStore.state.User.State

    // EXPECT
    expect(NewMessagesCount).toBe(0);

    Data.forEach(mess => {
      expect(mess.userID).toBe(State.UserID);
    })

  })

  test('user::message::mark', async () => {

    await virtualStore.dispatch('User/Messages/markAsReaded', messageID);

    const { Data } = virtualStore.state.User.Messages;

    const [ newMessage, emptyMessage ] = Data.filter(({ ID }) => ID === messageID)

    // EXPECT

    expect(newMessage.readed)
      .toBe(true);

    expect(emptyMessage)
      .toBeUndefined();

  })

  test('user::message::remove', async () => {

    const [ newMessage ] = virtualStore.state.User.Messages.Data;

    const response: database.error | boolean = await virtualStore.dispatch('User/Messages/removeMessage', newMessage);

    typeof response === 'string'
      ? expect(response).toBe(database.error.denied)
      : expect(response).toBe(true)

  })

})

describe('store::auth', () => {

  test('auth::login', async () => {
    
    const response: auth.error | boolean = await virtualStore.dispatch('Auth/Login/SignIn', userForm);

    await new Promise((res) => setTimeout(res, 2000));

    // Open UserProfile window
    virtualStore.commit('User/State/toggleProfileArea', true);

    const { State } = virtualStore.state.User.State;
    const { CurentUser } = virtualStore.state.Auth.Session;

    expect(response).toBe(true);

    expect(State.UserEmail).toBe(userForm.email);
    expect(State.UserID).toBe(CurentUser.uid)
    
  })

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
      expect(value.length).toBe(0)
    })

  })

})