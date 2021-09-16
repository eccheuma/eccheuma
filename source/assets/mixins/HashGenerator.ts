// DECLARE INSTANCE
declare module 'vue/types/vue' {
	interface Vue {
		HashGenerator: (hash_lenght?: number) => string
	}
}

export default {
	methods: {
		HashGenerator(): string {
			return Math.random().toString(36).substr(2).toUpperCase()
		}
	}
}
