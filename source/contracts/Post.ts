// UTILS
import { utils } from "~/utils";
import { User } from "./User";

export namespace Post {

	export interface date {
		origin: number,
		modified: number
	}

	export type content = { 
		tag		: string, 
		value	: any
	}
	
	export type like = {
		hash:	string
	}
	
	export type comment = {
		ID			 : string
		date		 : number
		userID	 : string
		data		 : string
		mention ?: Array<User.struct["uid"]>
	}
	
	export type struct = {
		ID					: number
		authorID		: string
		description	: string
		likes				: utils.types.asIterableObject<like>
		comments		: utils.types.asIterableObject<comment>
		content			: Array<content>
		image				: string
		tags				: Array<string>
		date				: date
		title				: string
	}

	export function builder(): struct {
		return {
			ID: Number(),
			content: [{ 
				tag: "h1", 
				value: "test" 
			}],
			authorID: String(),
			comments: Object(),
			likes: Object(),
			date: {
				modified: Number(),
				origin: Number()
			},
			description: String(),
			image: String(),
			tags: [],
			title: String(),
		};
	}

}
