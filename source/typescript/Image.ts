export namespace Image {

	export const enum sizes {
		placehoder 	= 100,
		small				= 360,
		medium 			= 720,
		large				= 1280,
		full				= 1440,
	}
	
	export type struct = {
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
		}
		sections?: {
			date: boolean
			description: boolean
			zoom: boolean
		}
	}

	export type allowedFormats = 'webp' | 'avif';
	
	export type formats = {
		[Format in allowedFormats]: string
	}

}
