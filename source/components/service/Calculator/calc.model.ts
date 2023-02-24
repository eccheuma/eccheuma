// API
import { database } from '~/api/database';

// Types
import type { Hash, Second } from '~/contracts/Nominals';
import type { Categories, Purchase, Additions } from '~/contracts/Services';
import type { ICost, IPurchaseForm, IQuantity, FetchResult } from './calc.types';

// Utils
import { currencies } from '~/utils/currency';
import { cache } from '~/utils/cache';

// Errors
import { ERRORS } from './calc.errors';
import { utils } from '~/utils';

// Cache
namespace CacheContainer {

  export interface IService {
    category	: Categories,
    services	: Array<Purchase.struct>,
  }

  export interface IAddition {
    serviceID	: Purchase.struct['ID'],
    additions	: Array<Additions.struct>,
  }

}

namespace defaults {

    export const form: IPurchaseForm = {
      category	: 'Application',
      service		: Object(),
      additions	: Array(),
    };
    
    export const quantity: IQuantity = {
      service		: 1,
      additions	: Object(),
    };
    
    export const cost: ICost = {
      raw		: Number(),
      view	: Number(),
    };

}

interface IForm {
  form      : IPurchaseForm,
  quantity  : IQuantity,
  cost      : ICost
}

export class CalculatorModel {

  // Currency
	private static RUB = currencies.Fabric(currencies.Country.ru, 60);
	private static USD = currencies.Fabric(currencies.Country.en, 1);

	// TODO #20 : Подключить API ЦБРФ для сбора индексов для конечных поборов. @Scarlatum
  public static GLOBAL_TAX_INDEX = 1.20; 
  public static SERVICE_TYPES: Array<Categories> = ['Application', 'Graphic', 'FrontEnd'];
  public static BASIC_COF = 25; // h\c

  public static toHours(secs: Second) {
		return parseFloat(Number((secs / 60) / 60).toPrecision(3));
	}

	public static hourPayment(val: number) {

		const Rouble = new CalculatorModel.RUB(val);

		return Math.floor(((Rouble.convert(CalculatorModel.USD) / CalculatorModel.BASIC_COF) * 60) * 60) as Second;

	}

  private static async fetchSerives(category: Categories): FetchResult<Purchase.struct> {
    
    const response: Array<IPurchaseForm['service']> = await database.get(`Service/${ category }`);

    console.debug(response);

    cache.set<CacheContainer.IService>(`services::${ category }`, {
      category,
      services: response,
    });

    return response.length
      ? response
      : Error(ERRORS.SERVICES_EMPTY);

  }

  private static async fetchAdditions(type: string, ID: Hash): FetchResult<Additions.struct> {
    
    const response: Array<Additions.struct> = await database.get(`Service/Addictions/${ type }`);

    console.debug(response, type, ID);

    cache.set<CacheContainer.IAddition>(`additions::${ type }`, {
      serviceID: ID,
      additions: response
    });

    return response?.length
      ? response
      : Error(ERRORS.ADDITIONS_EMPTY);

  }
  

  public static async setServices(category: Categories) {

    const cachedData = cache.get<CacheContainer.IService>(`services::${ category }`);
 
    if ( cachedData instanceof Error ) {

      const responseResult = await CalculatorModel.fetchSerives(category);

      // console.debug('setServices::responseResult:', responseResult);

      return responseResult instanceof Error
        ? []
        : responseResult;

    } else {

      // console.debug('setServices::cachedData:', cachedData);

      return cachedData.data.services;	

    }

  }

  public static async setAdditions({ type, ID }: Purchase.struct) {

    const cachedData = cache.get<CacheContainer.IAddition>(`additions::${ type }`);

    if ( cachedData instanceof Error ) {

      const responseResult = await CalculatorModel.fetchAdditions(type, ID);

      // console.debug('setAdditions::responseResult:', responseResult);

      return responseResult instanceof Error
        ? []
        : responseResult;

    } else {

      // console.debug('setAdditions::cachedData:', cachedData);

      return ID === cachedData.data.serviceID
        ? cachedData.data.additions
        : await CalculatorModel.fetchAdditions(type, ID).then(data => {
            return data instanceof Error
              ? []
              : data;
          });

    }

  }

  public static createForm(): IForm {
    return { ...defaults };
  }

}