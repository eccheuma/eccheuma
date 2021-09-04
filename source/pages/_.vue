<template>
	<section class="void">
		<div class="void-container">
			<h1>Ой-ой! Что-то пошло не так!</h1>
			<p>Возможно ссылка на материал была удалена, или такого раздела и вовсе нет.</p>
			<nuxt-link to="/">
				• На главную •
			</nuxt-link>
		</div>
	</section>
</template>

<script lang="ts">

	import Vue from 'vue'

	export default Vue.extend({
		transition: 'opacity-transition'
	})

</script>

<style lang="scss">

.void {

	position: relative;
	display: flex;
	background-color: rgb(var(--color-mono-200));
	height: 100vh;
	width: 100vw;

	&:before {
		content: '';
		display: block;
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-image: url('~assets/images/404.png?resize&format=webp&size=500');
		background-size: cover;
		background-position: center;
		filter: saturate(0);
		opacity: .01;
		z-index: 1;
	}

	&-container {
		
		color: rgb(var(--color-mono-900));
		text-align: center;
		position: relative;
		margin: auto;
		z-index: 2;

		h1 {
			font-weight: 700;
			font-family: var(--decor-font);
			font-size: 10vh;
		}
		p {
			font-weight: 500;
			font-size: var(--font-size-21);
		}
		a {
			cursor: pointer;
			font-weight: 500;
			font-size: var(--font-size-21);
			color: var(--color-accent-edges-300);
			text-decoration: line;
		}

	}
}


</style>
