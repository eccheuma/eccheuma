
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

interface Timing { Delivery: number };

// That TS mess on Type field, should return keys of Product enums. 
// As is TS namespaces can't be used as types, "We have what we have". I gonna to leave it as it is, until I found a better approach...
export interface Service<C extends Categories> extends Timing {
	Category		: typeof Product[C]
	Type				: typeof Product[C][keyof typeof Product[C]]
	Cost				: number
	Name				: string
	Delivery		: number
	Description	: string
}

export namespace Purchase {

	export interface Addition extends Timing {
		Cost: number
		Type: string
		Title: string
		Quantity: number
		Descriprion?: string
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
	
	export interface order<C extends Categories> extends Timing, Service<C> {
		ID				: string,
		Status		: status
		Accepted	: number
		Recived		: number
		Declined	: boolean
	}

	export interface struct {
		cost				: number
		type				: string
		title				: string
		description : string
		single			: boolean
	}

}
