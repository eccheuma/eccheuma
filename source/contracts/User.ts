// ENUMS
import { Purchase } from '~/contracts/Services';

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
		uid: string
		email: string
		name: string
		status: status
		purchase: Purchase.status
		image: string
	}

	export interface state {
		state: struct,
		messages: {[index: string]: Message.struct }
	}

	export const DEFAULT: struct = {
		uid				: String(),
		email			: String(),
		image			: String(),
		name			: String(),
		status		: status.User,
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