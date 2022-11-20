import { Post } from '~/types/Post';
import { User } from '~/types/User';
import { LocaleDate, utils } from '~/utils';

declare interface IPostSocial {
  likes     : utils.types.asIterableObject<Post.like>,
  comments  : utils.types.asIterableObject<Post.comment>,
  author    : User.struct
}

declare interface IPostModel extends IPostSocial {

  content   : Array<Post.struct>,
  postDate  : LocaleDate
}

declare interface CurrentPostData {
  postID  : Post.struct['ID'],
  userID  : User.struct['UserID']
}

declare interface IComment extends CurrentPostData {
  message   : Post.comment['data'], 
  addressee : Array<User.struct['UserID']>
}

declare interface IAnswer {
  user    : User.struct,
  message : string,
}