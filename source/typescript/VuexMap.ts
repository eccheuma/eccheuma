import type { RootState } from '~/store'

// FOLDERS
	export interface User {}
	export interface Auth {}
	export interface Service {}
	export interface AdminPanel {}

	interface Folders {
		User: User
		Auth: Auth
		Service: Service
		AdminPanel: AdminPanel
	}

// MODULES
export interface VuexMap extends RootState, Folders {

}
