
import type { IMAGE_PROPERTY } from './Image'
import type { PORTFOLIO_SECTION } from './Portfolio'

export type WORKCASE = {
	ID: number
	content: CONTENT
	properties: {
		type: PORTFOLIO_SECTION
	}
}

export type CONTENT = {
	name: string
	time: string
	theme: string
	tech_request: string
	link: string
	cost: number
	description: string
	images: IMAGE_PROPERTY[]
}