// ENUMS
import { Purchase } from '~/types/Services';
import { currencies, wallet } from '~/utils/currency';

// TYPES
import { Message } from '~/types/Message';

export namespace User {

	export enum status {
		Admin,
		Moderator,
		Support,
		User,
	}
	
	// INTERFACES
	export interface struct {
		UserID: string
		UserEmail: string
		UserName: string
		UserStatus: status
		UserWallet: wallet.contract
		UserWorkStatus: Purchase.status
		UserImageID: string
	}

	export interface state {
		state: struct,
		messages: {[index: string]: Message.struct }
	}

	export const DEFAULT: struct = {
		UserEmail: String(),
		UserID: String(),
		UserImageID: String(),
		UserName: String(),
		UserStatus: status.User,
		UserWallet: new wallet.Instance(currencies.DEFAULT).toJSON,
		UserWorkStatus: Purchase.status.None
	}

	/**
	 * Возвращает макет обхекта со значениями по умолчанию.
	 * @param struct 
	 */
	export function builder(struct?: Partial<struct>): struct {
		return {
			...DEFAULT,
			...struct,
		}
	}
	
}
