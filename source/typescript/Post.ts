
export namespace Post {

	export type content = { 
		type	: string, 
		value	: any
	}
	
	export type like = {
		hash:	string
	}
	
	export type comment = {
		id			: string
		date		: number
		userID	: string
		data		: string
	}
	
	export type struct = {
		ID					: number
		authorID		: string
		description	: string
		comment			: Array<comment>
		content			: Array<content>
		likes				: Array<like>
		image				: string
		tags				: Array<string>
		date				: number
		title				: string
	}

}
