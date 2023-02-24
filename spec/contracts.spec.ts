import { describe, test, expect } from 'vitest';

// PLUGINS
import Firebase from '~/plugins/Firebase'; Firebase();

// UTILS
import { utils } from '~/utils';

// MODULES
import { database } from '~/api/database';

// TYPES
import { Workcase } from '~/contracts/WorkCase';
import { Message } from '~/contracts/Message';
import { Image } from '~/contracts/Image';
import { Post } from '~/contracts/Post';
import { User } from '~/contracts/User';

// PATHS
const dbPaths = {
	post  : 'posts/post::0',
	image : 'gallery/0',
	case  : 'cases/Logo/case::0',
	user  : `users/${ process.env.TEST_USER_ID }`
};

// TESTS
describe('contract::cases', async () => {

	const workcase = await database.get<Workcase.struct>(dbPaths.case);

	test('cases::struct', () => {

		if ( !workcase ) expect.fail();

		const mock = Workcase.builder();

		expect(utils.recursiveCompare(workcase, mock)).true;
		expect(utils.recursiveCompare(workcase.content, mock.content)).true;

	});

});

describe('contract::image', async () => {

	const image = await database.get<Image.struct>(dbPaths.image);

	test('image::struct', () => {

		if ( !image ) expect.fail();

		const mock = Image.builder();

		expect(utils.recursiveCompare(image, mock)).true;
		expect(utils.recursiveCompare(image.content, mock.content)).true;

	});

});

describe('contract::post', async () => {

	const post = await database.get<Post.struct>(dbPaths.post);
	const mock = Post.builder();

	test('post::struct', () => {

		expect(utils.recursiveCompare(post, mock)).true;
		expect(post.tags).length;

	});

	test('post::content', () => {

		const [ content ] = mock.content;

		post.content
			.filter((content) => content.tag !== 'hr')
			.forEach((struct) => {
				expect(utils.recursiveCompare(struct, content));
			});

	});

	test('post::comments', () => {

		const comments = Object.values(post.comments);

		if ( !comments.length ) return;

		const mock = { 
			data: String(), 
			date: Number(), 
			ID: String(), 
			userID: String(),
		};

		comments.forEach(comment => {
			expect(utils.recursiveCompare(comment, mock));
		});

	});

});

describe('contract::user', async () => {

	const { state, messages } = await database.get<User.state>(dbPaths.user);

	test('user::state', () => {

		const mock = User.builder();

		console.log(mock, state);

		expect(utils.recursiveCompare(state, mock)).true;

	});

	test('user::messages', () => {

		const mock = Message.builder();

		Object.values(messages).forEach(struct => {
			expect(utils.recursiveCompare(struct, mock)).true;
		});

	});

});