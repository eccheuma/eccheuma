export default {
	methods: {
		MIXIN_Transition(name) {
			return {
				functional: true,
				render(h, context) {
					return h('transition', { props: { name } }, context.children)
				}
			}
		},
	}
}