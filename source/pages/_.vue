<template>
	<div class="container d-flex">
		<div class="row my-auto w-100 justify-content-center">
			<div class="col-auto text-center">
				<h2>Ой-ой! Что-то пошло не так!</h2>
				<p>Возможно ссылка на материал была удалена, или такого раздела и вовсе нет</p>
				<nuxt-link to="/">• На главную •</nuxt-link>
			</div>
		</div>
	</div>
</template>

<script lang="ts">

	import Vue from 'vue'

	export default Vue.extend({
		transition: 'OpacityTransition'
	})

</script>

<style lang="sass" scoped>

.container
	background-color: $color1
	height: 100vh
	color: $color5
	&::before
		content: ''
		display: block
		position: absolute
		top: 0
		left: 0
		width: 100vw
		height: 100vh
		background-image: url('~assets/images/404.png?resize&format=webp&size=900')
		background-size: cover
		background-position: center
		filter: saturate(0)
		opacity: .025

	h2
		font-weight: 700
	p
		font-weight: 500
		font-size: $FontSize2
	a
		font-weight: 500
		font-size: $FontSize2
		text-decoration: line

</style>