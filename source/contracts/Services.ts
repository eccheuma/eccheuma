import { utils } from '~/utils';
import { Hash } from './Nominals';

export namespace Product {

	export enum Application {
		Landing,
		Multipage,
		Applications
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

export type Products = typeof Product;
export type Categories 	= keyof Products;

export interface SharedField<T> {
	ID					: Hash
	type				: T
	single			: boolean
	cost				: number
	delivery		: number
}

export namespace Additions {

	export interface struct extends SharedField<string> {
		name: string,
	}

	export const DEFAULT: struct = {
		ID				: utils.randHashGenerator(),
		type			: 'Default',
		cost			: Number(),
		name			: String(),
		delivery	: Number(),
		single		: true,
	}; 

}

export namespace Purchase {


	export interface Description {
		about				: string
		description	: string
		name				: string
	}

	export interface struct<
		C extends Categories = 'Application'
	> extends Partial<Description>, SharedField<string> {
		category		: typeof Product[C]
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
		ID				: Hash,
		status		: status
		delivery	: number
		accepted	: number
		recived		: number
		declined	: boolean
	}

	export const DEFAULT: Purchase.order<'Application'> = {
		ID					: utils.randHashGenerator(),
		status			: Purchase.status.Process,
		accepted		: 1_645_096_000_000,
		recived			: 1_644_664_000_000,
		delivery		: 432_000_000,
		declined		: false,
		cost				: 21_000,
		category		: Product.Application,
		type				: Product.Application.Multipage.toString(),
		name				: 'Приложение на vue.js',
		about				: 'Тестовое приложение',
		single			: true,
		quantity		: 1,
	}; 

}