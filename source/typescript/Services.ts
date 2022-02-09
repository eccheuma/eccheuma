
// COST CALC TYPES
export type CATEGORY = 'WebApplications' | 'GraphicalDesign' | 'HTMLcode'

export type WebApplications		= 'Landing' | 'VueApplication'
export type GraphicalDesign 	= 'MockupBlock' | 'MockupPage' | 'Logo' | 'Vector' | 'BusinessСard'
export type HTMLcode					= 'HTMLMockupPage' | 'HTMLMockupSection' | 'Letter'  

export type PRODUCTS = WebApplications | GraphicalDesign | HTMLcode

interface ServiceTiming {
	Delivery: number
};

export interface SERVICE extends ServiceTiming {
	Type: PRODUCTS
	Cost: number
	Name: string
	Delivery: number
	Description?: string
}

export interface ADDICTION extends ServiceTiming {
	Cost: number
	Type: string
	Title: string
	Quantity: number
	Descriprion?: string
}

export type SELECTED_SERVICE = {
	Quantity: number
	Category: CATEGORY
	Service: SERVICE
	Addiction: ADDICTION
}

export type SERVICES_CARD = {
	path: CATEGORY
	title: string
	subTitle: string
	description: string
}

export const enum RequestStatus {
	None,
	Review,
	Queue,
	Process,
	Ready,
	Done,
	Denied,
}

export interface ORDER extends SERVICE, ServiceTiming {
	ID: string,
	Status: RequestStatus
	Accepted: number
	Recived: number
	Declined: boolean
}
