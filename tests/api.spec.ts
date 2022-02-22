import { describe, test, expect } from 'vitest';

import '~/plugins/Firebase';
import '~/plugins/Supabase';

// UTILS
import { utils } from '~/utils'

// MODULES
import { database } from '~/api/database';
import { Post } from '~/typescript/Post'

// TESTS
describe('api::database', () => {

  test('get', async () => {

    const POSTS_LIMIT = 1;

    const Posts: Array<Post.struct> = Object.values(await database.get('Posts', { limit: POSTS_LIMIT }));

    expect(Posts).toHaveLength(POSTS_LIMIT);

  })

  test('length', async () => {

    const postLength = await database.getLength('Posts');

    expect(postLength).toBeTypeOf('number');

  })

})

describe.todo('api::storage');

describe.todo('api::auth')

