// Types
import { database } from '~/api/database';
import { Post } from '~/types/Post';
import { User } from '~/types/User';

// Utils
import { LocaleDate, Result, utils } from '~/utils';

// Inner Types
import { IPostModel, IComment, CurrentPostData } from './post.types';

// Constants
const PUBLIC_FIELDS: Readonly<Array<keyof IPostModel>> = ['author', 'comments', 'content', 'likes', 'postDate'];

namespace DBPaths {
  export const postRoot = 'Posts';
  export const postComments = 'comments';
  export const postLikes = 'likes';
}

export class PostModel implements IPostModel {

  public likes    : utils.types.asIterableObject<Post.like>;
  public comments : utils.types.asIterableObject<Post.comment>;
  public content  : Post.struct[];

  public author   : User.struct = User.DEFAULT;
  public postDate : LocaleDate = utils.getLocalTime(0);

  constructor() {
    this.likes    = Object();
    this.comments = Object();
    this.content  = Array();
  }

  objectRepresentation() {

    const model = Object();

    PUBLIC_FIELDS.forEach((key) => {
      model[key] = this[key];
    });

    return model as PostModel;

  }

  static async sendComment({ postID, userID, message, addressee }: IComment): Promise<Result<boolean>> {

    const COMMENT_HASH = utils.randHashGenerator();

    const postPath = `${ DBPaths.postRoot }/PostID-${ postID }/${ DBPaths.postComments }/Hash-${ COMMENT_HASH }`;

    return database.set<Post.comment>(postPath, {
      ID      : COMMENT_HASH,
      date		: Date.now(),
      data		: message,
      userID	: userID,
      mention : addressee,
    });

  }

  static async sendLike({ postID, userID }: CurrentPostData, likeStatus: boolean): Promise<Result<boolean>> {

    const postPath = `${ DBPaths.postRoot }/PostID-${ postID }/${ DBPaths.postLikes }/${ userID }`;

    return likeStatus 
      ? database.remove(postPath) 
      : database.set(postPath, { hash: utils.randHashGenerator() });

  }

  static async getAuthor(authorID: User.struct['UserID']): Promise<Result<User.struct>> {

    const response: User.struct = await database.get(`Users/${ authorID }/state`);

    if ( !response ) return Error('User is undefined');

    return response;

  }

}