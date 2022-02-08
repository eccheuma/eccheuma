import { REQUEST_STATUS, ADDICTION, CATEGORY, SERVICE, } from '~/typescript/Services';

export interface USER_STATUS {
	0: 'Администратор'
	1: 'Модератор'
	2: 'Пользователь'
}

export interface USER_STATE {
	UserID: string
	UserEmail: string
	UserName: string
	UserStatus: keyof USER_STATUS
	UserBalance: number
	UserWorkStatus: keyof REQUEST_STATUS
	UserImageID: string
}

export interface USER_REQUEST {
	Addiction: Array<ADDICTION>,
	Category: CATEGORY,
	ID: number,
	Service: SERVICE,
	Status: number
}
