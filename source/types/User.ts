// ENUMS
import { Purchase } from '~/types/Services';
<<<<<<< HEAD
import { currencies, wallet } from '~/utils/currency';

// TYPES
import { Message } from '~/types/Message';
=======
>>>>>>> master

export namespace User {

	export enum status {
		Admin,
		Moderator,
		Support,
		User,
	}
	
	// INTERFACES
<<<<<<< HEAD
	export interface struct {
=======
	export interface state {
>>>>>>> master
		UserID: string
		UserEmail: string
		UserName: string
		UserStatus: status
<<<<<<< HEAD
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
=======
		UserBalance: number
		UserWorkStatus: Purchase.status
		UserImageID: string
	}
>>>>>>> master
	
}
