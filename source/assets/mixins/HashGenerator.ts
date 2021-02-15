// DECLARE INSTANCE
declare module 'vue/types/vue' {
	interface Vue {
	  HashGenerator: (hash_lenght?: number) => string
	}
}

export default {
	methods: {
		HashGenerator( hash_lenght: number = 10 ): string {

			const ALPHA = "ZXCVBNMLKJHGFDSAQWERTYUIOP"

			let HASH = ''

			for( let i = 0; i < hash_lenght; i++ ) {

				if( Math.random() > .5 ) {
					HASH += ALPHA[ Math.trunc(Math.random() * ALPHA.length) ]; continue
				}

				HASH +=`${ Math.trunc( Math.random() * 10 ) }`

			}

			return HASH		

		}
	}
}