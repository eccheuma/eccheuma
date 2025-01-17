
export namespace Product {

	export enum Application {
		Landing,
		Multipage,
	}

	export enum Graphic {
		MockupBlock,
		MockupPage,
		Logo,
		Vector,
		BusinessСard,
	}

	export enum FrontEnd {
		Page,
		Section,
		Letter,
	}

}

export type Categories 	= keyof typeof Product;
export type Products 		= Product.Application | Product.FrontEnd | Product.Graphic;

export namespace Purchase {

	interface Timing {
		delivery : number
	}

	export interface Description {
		about				: string
		description	: string
		name				: string
		time				: string
	}

	// That TS mess on Type field, should return keys of Product enums. 
	// As is TS namespaces can't be used as types, "We have what we have". I gonna to leave it as it is, until I found a better approach...
	export interface struct<C extends Categories | 'Application'> extends Timing, Partial<Description> {
		category		: typeof Product[Categories]
		type				: typeof Product[C][keyof typeof Product[C]]
		single			: boolean
		cost				: number
		quantity		: number
	}
	
	export const enum status {
		None,
		Review,
		Queue,
		Process,
		Ready,
		Done,
		Denied,
	}
	
	export interface order<C extends Categories> extends Purchase.struct<C> {
		ID				: string,
		status		: status
		delivery	: number
		accepted	: number
		recived		: number
		declined	: boolean
	}

}
