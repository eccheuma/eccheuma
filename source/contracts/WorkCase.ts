
import { Image } from './Image';
import { Portfolio } from './Portfolio';

export namespace Workcase {

	export type content = {
		name					: string
		time					: string
		theme					: string
		tech_request	: string
		link					: string
		cost					: number
		description		: string
		images				: Array<Image.struct>
	}

	export type struct = {
		ID: number
		content: content
		properties: {
			type: Portfolio.sections
		}
		rating?: number
	}

	export function builder(): struct {
		return {
			ID: Number(),
			content: {
				images: [ Image.builder() ],
				cost: Number(),
				link: String(),
				name: String(),
				time: String(),
				theme: String(),
				description: String(),
				tech_request: String(),
			},
			properties: {
				type: Portfolio.sections.applications
			},
		};

	}

}
