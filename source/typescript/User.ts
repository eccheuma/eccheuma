
// TYPES
import type { ADDICTION, CATEGORY, SERVICE, } from '~/typescript/Services';

// ENUMS
import { RequestStatus } from '~/typescript/Services';

export enum UserStatus {
	Admin,
	Moderator,
	Support,
	User,
}

// INTERFACES
export interface USER_STATE {
	UserID: string
	UserEmail: string
	UserName: string
	UserStatus: UserStatus
	UserBalance: number
	UserWorkStatus: RequestStatus
	UserImageID: string
}

export interface USER_REQUEST {
	Addiction: Array<ADDICTION>,
	Category: CATEGORY,
	ID: number,
	Service: SERVICE,
	Status: number
}
