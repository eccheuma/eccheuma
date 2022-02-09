export const enum Sizes {
	placehoder 	= 100,
	small				= 360,
	medium 			= 720,
	large				= 1280,
	full				= 1440,
}

export type IMAGE_PROPERTY = {
	ID: number,
	content: {
		path: string
		date?: number
		title?: string
		description?: string
	}
	property?: {
		fit: 'contain' | 'cover'
		type: 'promo' | 'gallery'
		collumn: number | 'auto'
	}
	sections?: {
		date: boolean
		description: boolean
		zoom: boolean
	}
}

export type ImageStruct = {
	avif: string
	webp: string
}

export type AllowedFormats = 'webp' | 'avif';
