
import { utils } from '~/utils';
import { currency } from '~/api/currency';

// Decorators
import { debug } from '~/decorators/logger.decorator';

export namespace currencies {

	const GLOBAL_COF: number = 1;

	export enum Country {
		ru = 'RUB',
		en = 'USD',
		ch = 'CHY',
	}

	export const DEFAULT = [currencies.Country.ru];

	export const signDict: Readonly<Record<Country, string>> = {
		[Country.ru]: '₽',
		[Country.en]: '$',
		[Country.ch]: '¥'
	};

	export interface ICurrency {
		coefficient: number
	}

	export function fmt_balance(wallet: wallet.contract, country: Country): string {
		return `${ wallet[country] || 0  } ${ signDict[ country ] }`;
	}

	export abstract class Currency<C extends Country = Country> {

		public value = Number() as utils.types.nominal<number, C>;

		readonly coefficient = GLOBAL_COF;

		constructor(val: utils.types.nominal<number, C>, coefficient: number) {
			this.value = val;
			this.coefficient = coefficient;
		}

		@debug.derive(false, process.browser)
		public convert<C extends Country, Cur extends ICurrency>(currency_type: Cur) {

			return this.value * (currency_type.coefficient / this.coefficient) as utils.types.nominal<number, C>;

		}

		public add(value: number) {
		  this.value = this.value + value as utils.types.nominal<number, C>; return value;
		}

		public grab(value: number) {
			this.value = this.value - value as utils.types.nominal<number, C>; return value;
		}

		public dry() {
			this.value = 0 as utils.types.nominal<number, C>;
		}

	}

	export function Fabric<C extends Country>(country: C, cof: number) {
		return class extends Currency<C> implements ICurrency {

			static coefficient: number = cof;
			static country: Country = country;

			constructor(value = 0) {
				super(value as utils.types.nominal<number, C>, cof);
			}

		};
	}

}

export namespace wallet {

	// Limit in rubles as target currency
	const WALLET_LIMIT = 50_000;

	const DEFAULT_JSON: contract = {
		CHY: Number(0),
		USD: Number(0),
		RUB: Number(0),
	};

	const enum errors {
		WALLET_OUT = 'Not enough on balance',
		WALLET_LIMIT = 'Wallet size limit',
	}

	interface IWallet {
		currencies: Record<currencies.Country, currencies.Currency>
	}

	export type contract = Record<currencies.Country, number>

	export class Instance implements IWallet {

		public currencies: Record<currencies.Country, currencies.Currency> = Object();
		private countries: Array<currencies.Country> = Array();

		constructor(contries: Array<currencies.Country> = currencies.DEFAULT) {
			this.setCurrencies(contries);
		}

		get wallets(): Array<currencies.Country> {
			return Object.keys(this.currencies).map(key => {
				return currencies.Country[key as keyof typeof currencies.Country];
			});
		}

		get toJSON(): contract {

			const result: contract = DEFAULT_JSON;

			this.wallets.forEach(key => {
				result[key] = this.currencies[key].value;
			});

			return result;

		}

		public async setCurrencies(cur: Array<currencies.Country>) {

			for await (const country of cur) {

				const instance = currencies.Fabric(country, await currency.getCoefficient(country));

				this.currencies[country] = new instance();

			}

		}

		@debug.derive(false, process.browser)
		public async send<Cur extends currencies.Currency>(cur: Cur, wallet_type: currencies.Country): Promise<number | Error> {

			const wallet = this.currencies[wallet_type];
			const value = cur.convert(wallet);

			if (wallet.value + value > WALLET_LIMIT) return Error(errors.WALLET_LIMIT);

			return await currency.validateOperation()
				? wallet.add(value)
				: Error(currency.errors.REJECT);

		}

		@debug.derive(false, process.browser)
		public async take<Cur extends currencies.Currency>(cur: Cur, wallet_type: currencies.Country): Promise<number | Error> {

			const wallet = this.currencies[wallet_type];
			const value = cur.convert(wallet);

			if (wallet.value < value) return Error(errors.WALLET_OUT);

			return await currency.validateOperation()
				? wallet.grab(value)
				: Error(currency.errors.REJECT);

		}

		public dry(wallet_type: currencies.Country) {
			this.currencies[wallet_type].dry();
		}

	}

}
