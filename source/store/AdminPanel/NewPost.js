    export const state = () => ({

        ImageProperty: {
            path: null,
            size: true
        },

    })
    
    export const mutations = {
        CMS_ChangeImageProp(state, prop) {
            state.ImageProperty = prop
        }
    }