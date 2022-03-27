import { describe, test, expect, beforeAll, afterAll  } from 'vitest';

// TEST USER
import { userForm } from 'path::root/utils/defaultUser';

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
describe('api::auth', () => {

  describe('auth::register', () => {

    const email = {
      valid : 'someone@yandex.ru',
      wrong : 'someone@yandex',
      taked : userForm.email
    }

    test('register::invalid', async () => {

      const PASS = utils.hashGenerator();

      const responseEmail     = await auth.register(email.wrong as form.email, PASS);
      const responsePassword  = await auth.register(email.valid as form.email, '  ');
      const takedEmail        = await auth.register(email.taked as form.email, PASS);  

      if ( responseEmail === auth.error.network ) throw new Error('Network connection error');

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

describe('api::database', () => {

  let userName = `TESTING 00${ Math.trunc(10 * Math.random()) }`;
  let userAccount: form.loginPass; 

  beforeAll(async () => {
    
    const response = await auth.login(userForm.email, userForm.password);

    if ( typeof response === 'string' ) throw Error(response);

    userAccount = response;

  })

  afterAll(() => auth.logout());

  test.concurrent('database::get', async () => {

    const POSTS_LIMIT: number = 1;

    const response: utils.types.asIterableObject<Post.struct> = await database.get('Posts', { limit: POSTS_LIMIT });

    const Posts: Array<Post.struct> = Object.values(response);

    expect(Posts).toHaveLength(POSTS_LIMIT);

  })

  test.concurrent('database::length', async () => {

    const postLength = await database.getLength('Posts');

    expect(postLength).toBeTypeOf('number');

  })

  test.concurrent('database::remove', async () => {

    const response = await database.remove('App/__SELF_KEY__');

    typeof response === 'string'
      ? expect(response).toBe(database.error.denied)
      : expect.fail('write permissions in a mess')

  })

  test.concurrent('database::update', async () => {

    const { uid } = userAccount;
    
    // Check restricted writes
      const invalidWrite = await database.update('App', { __SELF_KEY__: userName });
      
      typeof invalidWrite === 'string'
        ? expect(invalidWrite).toBe(database.error.denied)
        : expect.fail('write permissions in a mess')

    // Check valid writes  
      const validWrite = await database.update(`Users/${ uid }/state`, { UserName: userName } as Partial<User.state>);

      typeof validWrite === 'boolean'
        ? expect(validWrite).toBe(true)
        : expect.fail('write permissions in a mess')

    // Check writes
      expect(await database.get(`Users/${ uid }/state/UserName`))
        .toBe(userName);
      expect(await database.get(`App/__SELF_KEY__`))
        .not
        .toBe(userName);

  })

})

describe.todo('api::storage', () => {

  test.concurrent.todo('storage::set');
  
  test.concurrent.todo('storage::get');

  test.concurrent.todo('storage::update');

  test.concurrent.todo('storage::remove');

});