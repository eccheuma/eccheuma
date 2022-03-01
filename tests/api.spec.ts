import { describe, test, expect } from 'vitest';

// ENV
require('dotenv').config();

// TEST USER FORM
const userForm: form.registration = { email: 'testing@mail.tech', password: 'TESTING001', name: 'TESTING' };

// PLUGINS
import Supabase from '~/plugins/Supabase'; Supabase();
import Firebase from '~/plugins/Firebase'; Firebase();

// UTILS
import { utils } from '~/utils'

// MODULES
import { database } from '~/api/database';
import { auth, form } from '~/api/auth';

import { Post } from '~/typescript/Post';
import { User } from '~/typescript/User';

// TESTS
describe('api::database', () => {

  test.concurrent('database::get', async () => {

    const POSTS_LIMIT = 1;

    const Posts: Array<Post.struct> = Object.values(await database.get('Posts', { limit: POSTS_LIMIT }));

    expect(Posts).toHaveLength(POSTS_LIMIT);

  })

  test.concurrent('database::length', async () => {

    const postLength = await database.getLength('Posts');

    expect(postLength).toBeTypeOf('number');

  })

  test.concurrent('database::remove', async () => {

    const response = await database.remove('App/__SELF_KEY__')

    typeof response === 'string'
      ? expect(response).toBe(database.error.denied)
      : expect.fail('write permissions in a mess')

  })

  test.concurrent('database::update', async () => {

    const NAME = `TESTING 00${ Math.trunc(10 * Math.random()) }`;
    const USER = await auth.login(userForm.email, userForm.password)

    if ( typeof USER === 'string' ) throw Error('wrong login data');

    // Check restricted writes
      const invalidWrite = await database.update('App', { __SELF_KEY__: NAME });
      
      typeof invalidWrite === 'string'
        ? expect(invalidWrite).toBe(database.error.denied)
        : expect.fail('write permissions in a mess')

    // Check valid writes  
      const validWrite = await database.update(`Users/${ USER.uid }/state`, { UserName: NAME } as Partial<User.state>);

      typeof validWrite === 'boolean'
        ? expect(validWrite).toBe(true)
        : expect.fail('write permissions in a mess')

    // Check writes
      expect(await database.get(`Users/${ USER.uid }/state/UserName`))
        .toBe(NAME);
      expect(await database.get(`App/__SELF_KEY__`))
        .not
        .toBe(NAME);

  })

})

describe.todo('api::storage', () => {

  test.concurrent.todo('storage::get');

  test.concurrent.todo('storage::set');

  test.concurrent.todo('storage::remove');

  test.concurrent.todo('storage::update');

});

describe('api::auth', () => {

  describe('auth::register', () => {

    const email = {
      valid : 'someone@yandex.ru',
      wrong : 'someone@yandex',
      taked : 'testing@mail.tech'
    }

    test('register::invalid', async () => {

      const PASS = utils.hashGenerator();

      const responseEmail     = await auth.register(email.wrong as form.email, PASS);
      const responsePassword  = await auth.register(email.valid as form.email, '  ');
      const takedEmail        = await auth.register(email.taked as form.email, PASS);  

      typeof responseEmail === 'string'
        ? expect(responseEmail).toBe(auth.error.email)
        : expect.fail('email validation work incorect!')

      typeof responsePassword === 'string'
        ? expect(responsePassword).toBe(auth.error.weekPass)
        : expect.fail('password validation work incorect!')

      typeof takedEmail === 'string'
        ? expect(takedEmail).toBe(auth.error.takedEmail)
        : expect.fail('Used email is free...')

    })

  })

  test.todo('auth::login');

  test.todo('auth::logout');

})

