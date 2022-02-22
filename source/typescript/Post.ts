
export namespace Post {

	export type content = { 
		type	: string, 
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
		comments		: Array<comment>
		content			: Array<content>
		likes				: Array<like>
		image				: string
		tags				: Array<string>
		date				: number
		title				: string
	}

}
