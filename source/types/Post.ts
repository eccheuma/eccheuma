<<<<<<< HEAD
// UTILS
import { utils } from '~/utils'
=======
>>>>>>> master

export namespace Post {

	export type content = { 
		tag		: string, 
		value	: any
	}
	
	export type like = {
		hash:	string
	}
	
	export type comment = {
		ID			: string
		date		: number
		userID	: string
		data		: string
	}
	
	export type struct = {
		ID					: number
		authorID		: string
		description	: string
<<<<<<< HEAD
		likes				: utils.types.asIterableObject<like>
		comments		: utils.types.asIterableObject<comment>
		content			: Array<content>
=======
		comments		: Array<comment>
		content			: Array<content>
		likes				: Array<like>
>>>>>>> master
		image				: string
		tags				: Array<string>
		date				: number
		title				: string
	}

<<<<<<< HEAD
	export function builder(): struct {
		return {
			ID: Number(),
			content: [{ 
				tag: 'h1', 
				value: 'test' 
			}],
			authorID: String(),
			comments: Object(),
			likes: Object(),
			date: Number(),
			description: String(),
			image: String(),
			tags: Array(),
			title: String(),
		}
	}

=======
>>>>>>> master
}
