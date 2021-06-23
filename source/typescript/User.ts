import { REQUEST_STATUS } from './Services'

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
