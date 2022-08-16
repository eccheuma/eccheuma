import { describe, test, expect } from 'vitest';

// PLUGINS
import Firebase from '~/plugins/Firebase'; Firebase();

// UTILS
import { utils } from '~/utils';

// MODULES
import { database } from '~/api/database';

// TYPES
import { Workcase } from '~/types/WorkCase';
import { Message } from '~/types/Message';
import { Image } from '~/types/Image';
import { Post } from '~/types/Post';
import { User } from '~/types/User';

// PATHS
const dbPaths = {
  post  : 'Posts/PostID-0',
  image : 'Gallery/0',
  case  : 'Cases/Logo/CaseID_0',
  user  : `Users/${ process.env.TEST_USER_ID }`
}

// TESTS
describe("contract::cases", async () => {

  const workcase = await database.get<Workcase.struct>(dbPaths.case);

  test("cases::struct", () => {

    if ( !workcase ) expect.fail();

    const mock = Workcase.builder();

    expect(utils.comparer(workcase, mock)).true
    expect(utils.comparer(workcase.content, mock.content)).true

  })

});

describe("contract::image", async () => {

  const image = await database.get<Image.struct>(dbPaths.image);

  test("image::struct", () => {

    if ( !image ) expect.fail();

    const mock = Image.builder();

    expect(utils.comparer(image, mock)).true
    expect(utils.comparer(image.content, mock.content)).true

  })

});

describe("contract::post", async () => {

  const post = await database.get<Post.struct>(dbPaths.post);
  const mock = Post.builder();

  test("post::struct", () => {

    expect(utils.comparer(post, mock)).true
    expect(post.tags).length

  });

  test("post::content", () => {

    const [ content ] = mock.content;

    post.content
      .filter((content) => content.tag !== 'hr')
      .forEach((struct) => {
        expect(utils.comparer(struct, content))
      })

  })

  test("post::comments", () => {

    const comments = Object.values(post.comments);

    if ( !comments.length ) return;

    const mock = { 
      data: String(), 
      date: Number(), 
      ID: String(), 
      userID: String(),
    };

    comments.forEach(comment => {
      expect(utils.comparer(comment, mock))
    })

  })

});

describe("contract::user", async () => {

  const { state, messages } = await database.get<User.state>(dbPaths.user);

  test("user::state", () => {

    const mock = User.builder();

    expect(utils.comparer(state, mock)).true

  });

  test("user::messages", () => {

    const mock = Message.builder();

    Object.values(messages).forEach(struct => {
      expect(utils.comparer(struct, mock)).true
    })

  });

});