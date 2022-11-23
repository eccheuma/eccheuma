import { fetchExternal } from '~/api/cloudFunctions';

import { currencies } from '~/utils/currency';
import { Result } from '~/utils';
// import fetchOpaque from 'fetch-jsonp';

declare global {
	var __VUE_SSR_CONTEXT__: any;
}

export let currencyData: currency.CurrencyResponse;

export namespace currency {

	export const enum errors {
		REJECT = 'Transaction reject',
		REST_UNDEFINED = 'Rest API  URL is undefined',
		UNREACHABLE = 'Rest enter point is unreacheable'
	}

	const enum CurrencyPairs {
		RUB = 'USDRUB',
		CNY = 'CNYRUB'
	}

	const REST_URL = String(process.env.CURRENCY_API_URL);
	const API_POINT = `${REST_URL}/?get=rates&pairs=${CurrencyPairs.RUB},${CurrencyPairs.CNY}&key=${process.env.CURRENCY_API_KEY}`;

	export interface CurrencyResponse {
		status: number,
		message: string,
		data: Record<CurrencyPairs, string>
	}

	const CurrencyResponseMock: CurrencyResponse = {
		data: {
			CNYRUB: String(0),
			USDRUB: String(0),
		},
		message: 'CurrencyResponseMock',
		status: 0,
	};

	async function getData(): Promise<CurrencyResponse | Error> {

		if (globalThis.location?.origin.match('localhost')?.length) return CurrencyResponseMock;

		const anyResponse = await Promise.any([
			fetch(API_POINT, { mode: 'cors' }),
			fetchExternal(API_POINT),
		]);

		return anyResponse && anyResponse.type !== 'error'
			? await anyResponse.json() as CurrencyResponse
			: CurrencyResponseMock;

	}

	export async function getCoefficient(country: currencies.Country): Promise<number> {

		if (!currencyData) {

			const data: Result<CurrencyResponse, Error> = await getData();

			if (data instanceof Error) return 0;

			currencyData = data;

		}

		switch (country) {
			case currencies.Country.ru:
				return parseFloat(currencyData.data.USDRUB || String());
			case currencies.Country.ch:
				return parseFloat(currencyData.data.CNYRUB || String());
			default:
				return 1;
		}

	}

	export async function validateOperation(): Promise<boolean> {
		return Promise.resolve(true);
	}

}