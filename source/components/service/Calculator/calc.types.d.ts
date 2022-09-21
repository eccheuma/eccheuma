// Types
import type { Hash } from '~/types/Nominals';
import type { Categories, Purchase, Additions } from '~/types/Services';
import type { Result } from '~/utils';

// Models
declare interface IPurchaseForm {
  category	: Categories 
  service		: Purchase.struct,
  additions	: Array<Additions.struct['type']>
}

declare interface ICost {
  raw		: number
  view	: number
}

declare interface IQuantity {
  service		: number,
  additions	: Record<Hash, number>,
}

declare type FetchResult<Struct> = Promise<Result<Array<Struct>, Error>> 