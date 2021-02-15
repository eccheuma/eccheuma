export type POST_IMAGE = {
	path: string,
	title: string,
	description: string,
}

export type POST_CONTENT = { 
	type: string, value: any
}

export type LIKE = {
	hash: string
}

export type COMMENT = {
	ID: string
	Date: number
	UserID: string
	Comment: string
}

export type POST = {
	ID: number,
	authorID: string
	description: string,
	comment: COMMENT[],
	content: POST_CONTENT[],
	likes?: Array< LIKE >
	image: string,
	tags: string | string[],
	date: number,
	title: string
}