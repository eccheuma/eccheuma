// ENUMS
import { Purchase } from '~/types/Services';
import { currencies, wallet } from '~/utils/currency';

export namespace User {

	export enum status {
		Admin,
		Moderator,
		Support,
		User,
	}
	
	// INTERFACES
	export interface state {
		UserID: string
		UserEmail: string
		UserName: string
		UserStatus: status
		UserWallet: wallet.contract
		UserWorkStatus: Purchase.status
		UserImageID: string
	}
	
}
