import { describe, test, expect, beforeAll, afterAll  } from 'vitest';

// TEST USER
import { userForm } from 'path::root/mocks/defaultUser';

// PLUGINS
import Supabase from '~/plugins/Supabase'; Supabase();
import Firebase from '~/plugins/Firebase'; Firebase();

// UTILS
import { utils } from '~/utils';

// MODULES
import { database } from '~/api/database';
import { auth, form } from '~/api/auth';
import { feed } from '~/api/feed';

import { Post } from '~/contracts/Post';
import { User } from '~/contracts/User';

// TESTS
describe('api::auth', () => {

  describe('auth::register', () => {

    const email = {
      valid : 'someone@yandex.ru',
      wrong : 'someone@yandex',
      taked : userForm.email
    };

    test('register::invalid', async () => {

      const PASS = utils.randHashGenerator();

      const responseEmail     = await auth.register(email.wrong as form.email, PASS);
      const responsePassword  = await auth.register(email.valid as form.email, '  ');
      const takedEmail        = await auth.register(email.taked as form.email, PASS);  

      if ( responseEmail instanceof Error ) {
        if ( responseEmail.message === 'networking' ) throw responseEmail;
      }

      responseEmail instanceof Error
        ? expect(responseEmail.message).toBe(auth.error.email)
        : expect.fail('email validation work incorect!');

      responsePassword instanceof Error
        ? expect(responsePassword.message).toBe(auth.error.weekPass)
        : expect.fail('password validation work incorect!');

      takedEmail instanceof Error
        ? expect(takedEmail.message).toBe(auth.error.takedEmail)
        : expect.fail('Used email is free...');

    });

  });

  test.todo('auth::login');

  test.todo('auth::logout');

});

describe('api::database', () => {

  const userName = `TESTING 00${ Math.trunc(10 * Math.random()) }`;
  let userSession: form.session; 

  beforeAll(async () => {
    
    const responseResult = await auth.login(userForm.email, userForm.password);

    if ( responseResult instanceof Error ) throw responseResult;

    userSession = responseResult;

  });

  afterAll(() => auth.logout());

  test.concurrent('database::get', async () => {

    const POSTS_LIMIT: number = 1;

    const response: utils.types.asIterableObject<Post.struct> = await database.get('posts', { limit: POSTS_LIMIT });

    const Posts: Array<Post.struct> = Object.values(response);

    expect(Posts).toHaveLength(POSTS_LIMIT);

  });

  test.concurrent('database::query', async () => {

    const Q_TARGET: number = 2;

    const PATHS = {
      struct : '~/test/structs',
      array  : '~/test/array',
    };

    const QUANTITY = {
      objects : await database.getLength(PATHS.struct),
      array   : await database.getLength(PATHS.array),
    };

    const numbers: Array<number> = await database.get(PATHS.array, {
      start: String(QUANTITY.array - Q_TARGET),
      order: database.order.key   
    });

    const structs: Array<{ ID: number }> = await database.get(PATHS.struct, {
      start: QUANTITY.objects - Q_TARGET,
      order: database.order.child,
      orderBy: 'ID',  
    });

    // console.log(numbers, structs);

    expect(numbers.filter(x => x)).toHaveLength(Q_TARGET);
    expect(Object.values(structs)).toHaveLength(Q_TARGET);

  });

  test.concurrent('database::remove', async () => {

    const responseResult = await database.remove('App/__SELF_KEY__');

    responseResult instanceof Error
      ? expect(responseResult.message).toBe(database.error.denied)
      : expect.fail('write permissions in a mess');

  });

  test.concurrent('database::update', async () => {

    const { uid } = userSession;

    const newData: Partial<User.struct> = {
      name: userName,
    };

    // Check restricted writes
      const writeResult = await database.update('app', { __SELF_KEY__: userName });
      
      expect(writeResult).instanceOf(Error);

    // Check valid writes  
      const validWrite = await database.update(`users/${ uid }/state`, newData);

      typeof validWrite === 'boolean'
        ? expect(validWrite).toBe(true)
        : expect.fail('write permissions in a mess');

    // Check writes
      expect(await database.get(`users/${ uid }/state/name`))
        .toBe(userName);

      // expect(await database.get('app/__SELF_KEY__'))
      //   .not
      //   .toBe(userName);

  });

});

describe('api::storage', () => {

  test.todo('storage::set');
  
  test.todo('storage::get');

  test.todo('storage::update');

  test.todo('storage::remove');

});

describe('api::feed', () => {

  test.todo('feed::get', async () => {

    // const SELF = String(42590087);

    const posts = await feed.get();

    posts.forEach(post => {
      expect(post.body).exist;
    });

  });

});