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

export type IMAGE_URL = {
	avif: string
	webp: string
}

export type FORMATS = 'webp' | 'avif';
