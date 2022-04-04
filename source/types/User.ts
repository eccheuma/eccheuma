// ENUMS
import { Purchase } from '~/types/Services';

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
		UserBalance: number
		UserWorkStatus: Purchase.status
		UserImageID: string
	}
	
}
