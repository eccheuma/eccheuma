
// COST CALC TYPES

export type CATEGOTIES = 'WebApplications' | 'GraphicalDesign' | 'HTMLcode'

export type WebApplications		= 'Landing' | 'VueApplication'
export type GraphicalDesign 	= 'MockupBlock' | 'MockupPage' | 'Logo' | 'Vector' | 'BusinessСard'
export type HTMLcode					= 'HTMLMockupPage' | 'HTMLMockupSection' | 'Letter'  

export type PRODUCTS<T> = T

export type SERVICE = {
	Type: PRODUCTS<WebApplications>
			| PRODUCTS<GraphicalDesign>
			| PRODUCTS<HTMLcode>
	Cost: number
	Name: string
	Time: string
	Descriprion?: string
}

export type SELECTED_SERVICE = {
	Quantity: number
	Category: CATEGOTIES
	Service: SERVICE
	Addiction: ADDICTION
}

export type ADDICTION = {
	Cost: number
	Type: string
	Title: string
	Single: boolean
	Descriprion?: string
}

export type SERVICES_CARD = {
	path: CATEGOTIES
	title: string
	subTitle: string
	description: string
}

export type REQUEST_STATUS = {
	0: 'Отправлен на рассмотрение',
	1: 'Поставлен в очередь'
	2: 'Ждёт осмотра'
	3: 'В процессе выполнения'
}
