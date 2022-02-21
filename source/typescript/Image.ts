export namespace Image {

	export const enum sizes {
		placehoder 	= 100,
		small				= 360,
		medium 			= 720,
		large				= 1280,
		full				= 1440,
	}

	export enum allowedFormats {
		avif,
		webp,
	}

	export function matchSize(size: number): sizes {

		const Sizes = [ 
			Image.sizes.placehoder,
			Image.sizes.small,
			Image.sizes.medium,
			Image.sizes.large,
			Image.sizes.full 
		];

		return Sizes.find(x => Math.max(x, size) === x) || sizes.medium

	}
	
	export interface struct {
		ID: number,
		content: {
			path: string
			date?: number
			title?: string
			description?: string
		}
		property?: {
			type: 'promo' | 'gallery'
		}
		sections?: {
			date: boolean
			description: boolean
			zoom: boolean
		}
	}
	
	export type formatsStruct = {
		[F in Partial<keyof typeof allowedFormats>]: string
	}

}
