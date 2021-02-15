	


export const state = () => ({

	SelectedService: null,
	Quantity: 1,
	
})

export const mutations = {
	Change_SelectedService(state, prop) {
		state.SelectedService = prop
	},
	Change_Quantity(state, prop) {
		state.Quantity = prop
	}
}
export const actions = {
	Set_ServiceEntity({commit}, prop) {
		commit(`Change_${prop.type}`, prop.entity)
	}
}

