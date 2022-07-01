import { utils } from '~/utils'

export namespace currencies {

	const GLOBAL_COF: number = 1;

	export enum Country {
		ru = 'ru',
		en = 'en', 
		ch = 'ch',
	};

	export const DEFAULT = [ currencies.Country.ru ]

	export const sign: Readonly<Record<Country, string>> = {
		[ Country.ru ]: "₽",
		[ Country.en ]: "$",
		[ Country.ch ]: "¥"
	};

	export interface ICurrency {
		coefficient: number
	}

	export abstract class Currency<C extends Country = Country> {

		public value = Number() as utils.types.nominal<number, C>;

		readonly coefficient = GLOBAL_COF;

		constructor(val: utils.types.nominal<number, C>, coefficient: number) {
			this.value = val; 
			this.coefficient = coefficient;
		} 

		public convert<C extends Country, Cur extends ICurrency>(currency_type: Cur) {

			return this.value * (currency_type.coefficient / this.coefficient) as utils.types.nominal<number, C>;

		}

		public add(value: number) {
			this.value = this.value + value as utils.types.nominal<number, C>; return value;
		}

		public grab(value: number) {
			this.value = this.value - value as utils.types.nominal<number, C>; return value
		}

	}

	export function Fabric<C extends Country>(country: C, cof: number = db?.getCoefficient(country) || 0) {
		return class extends Currency<C> implements ICurrency {

			static coefficient: number = cof;
			static country: Country = country;

			constructor(value: number = 0) { 
				super(value as utils.types.nominal<number, C>, cof);
			}

		}
	}

}

export namespace db {

	export const enum ModuleError {
		REJECT = "Transaction reject"
	}

	// !todo Get external valid coefficients...
	export function getCoefficient(country: currencies.Country) {

		// relative per USD 
		switch (country) { 
			case currencies.Country.ru: return 50; 
			case currencies.Country.ch: return 5;
			case currencies.Country.en: return 1;
			default: return 0
		}

	}

	// !todo Mock of bank procedure validation
	export async function validateOperation(): Promise<boolean> {
		return Promise.resolve(true);
	}

}

export namespace wallet {

	// Limit in rubles as target currency
	const WALLET_LIMIT: number = 50_000;
	const DEFAULT_JSON: contract = {
		ch: Number(0),
		en: Number(0),
		ru: Number(0),
	}

	const enum ModuleError {
		WALLET_OUT = "Not enough on balance",
		WALLET_LIMIT = "Wallet size limit",
	}

	interface IWallet {
		currencies: Record<currencies.Country, currencies.Currency>
	}

	export type contract = {
		[ K in currencies.Country ]: number
	}

	export class Instance implements IWallet {

		public currencies: Record<currencies.Country, currencies.Currency> = Object();

		constructor(cur: Array<currencies.Country>) {
			cur.forEach(country => {

				const currency = currencies.Fabric(country, db.getCoefficient(country));

				this.currencies[country] = new currency();

			})
		}

		get wallets(): Array<currencies.Country> {
			return Object.keys(this.currencies).map(key => {
				return currencies.Country[key as keyof typeof currencies.Country]
			});
		}

		get toJSON(): contract {

			const result: contract = DEFAULT_JSON;

			this.wallets.forEach(key => {
				result[key] = this.currencies[key].value
			})

			return result;

		}

		public async send<Cur extends currencies.Currency>(cur: Cur, wallet_type: currencies.Country): Promise<number | Error> {

			const wallet = this.currencies[wallet_type];
			const value = cur.convert(wallet);

			if ( wallet.value + value > WALLET_LIMIT ) return Error(ModuleError.WALLET_LIMIT);
		
			return await db.validateOperation() 
				? wallet.add(value)
				: Error(db.ModuleError.REJECT)

		}
		public async take<Cur extends currencies.Currency>(cur: Cur, wallet_type: currencies.Country): Promise<number | Error> {

			const wallet = this.currencies[wallet_type];
			const value = cur.convert(wallet);

			if ( wallet.value < value ) return Error(ModuleError.WALLET_OUT);

			return await db.validateOperation() 
				? wallet.grab(value)
				: Error(db.ModuleError.REJECT)

		}

	}
}
