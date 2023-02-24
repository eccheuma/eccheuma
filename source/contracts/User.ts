// ENUMS
import { Purchase } from '~/contracts/Services';
import { currencies, wallet } from '~/utils/currency';

// TYPES
import { Message } from '~/contracts/Message';

export namespace User {

	export enum status {
		Admin,
		Moderator,
		Support,
		User,
	}
	
	// INTERFACES
	export interface struct {
		ID: string
		email: string
		name: string
		status: status
		wallet: wallet.contract
		purchase: Purchase.status
		image: string
	}

	export interface state {
		state: struct,
		messages: {[index: string]: Message.struct }
	}

	export const DEFAULT: struct = {
		ID				: String(),
		email			: String(),
		image			: String(),
		name			: String(),
		status		: status.User,
		wallet		: new wallet.Instance(currencies.DEFAULT).toJSON,
		purchase	: Purchase.status.None
	};

	/**
	 * Возвращает макет обхекта со значениями по умолчанию.
	 * @param struct 
	 */
	export function builder(struct?: Partial<struct>): struct {
		return {
			...DEFAULT,
			...struct,
		};
	}
	
}