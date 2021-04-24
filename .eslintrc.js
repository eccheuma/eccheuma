module.exports = {
	root: true,
	env: {
		browser: true,
		node: true
	},
	extends: [
		'@nuxtjs/eslint-config-typescript',
		'plugin:nuxt/recommended'
	],
	plugins: [
		'vue'
	],
	// add your custom rules here
	rules: {
		indent: [0, 'tab'],
		'no-tabs': 0,
		'semi': 0,
		'no-floating-decimal': 0,
		'space-in-parens': 0,
		'no-new-object': 0,
		'array-bracket-spacing': 0,
		'padded-blocks': 0,
		'no-trailing-spaces': 0,
		'no-multi-spaces': 0,
		'space-before-function-paren': 0,
		'key-spacing': 0,
		'comma-dangle': 0,
		'vue/html-indent': [0, 'tab'],
		'vue/multiline-html-element-content-newline': 0,
		'vue/component-tags-order': 0,
		'vue/attribute-hyphenation': 0,
		'vue/prop-name-casing': 0,
		'quote-props': 0,
		'camelcase': 0,
		'template-curly-spacing': 0,
		'no-console': 0,
		'nuxt/no-globals-in-created': 0,
		'no-alert': 1,
		'no-loop-func': 2,
		'no-self-compare': 2,
		'block-scoped-var': 1,
		'no-loss-of-precision': 2,
		'no-unreachable-loop': 1,
		'consistent-return': 2,
		'no-else-return': 1
	}
}
