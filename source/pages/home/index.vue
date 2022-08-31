<template>
	<page />
</template>

<script lang="ts">

	import Vue from 'vue';

	// PAGE
	import Page from './_page.vue';

	// MODULE
	export default Vue.extend({
		components: {
			Page,
		},
	});
	
</script>
