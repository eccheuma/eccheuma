<template>
	<section class="promo_body">

		<vue-image
			:content="{ path: 'Promo/4' }" 
			:sections="{ date: false, description: false, zoom: false }" 
			:property="{ fit: 'cover', type: 'promo', collumn: 7 }">
		</vue-image>

		<section>
			<h4>Наглядный результат.</h4>
			<p>
				А если говорить проще, то можно представить, что у вас есть некая болванка в виде кнопки или блока с "чем-то", и раньше бы приходилось копировать эту болванку, заполнять её нужным "чем-то" в копированном элементе и молиться богам, чтобы это всё пошло не по пизде и адекватно заработало.
			</p> 
			<p>
				И это ещё не самое сладкое, ибо сладкое начнётся, когда ты решишь всё это поменять визуально. Теперь же есть и шаблонизатор, sass c его переменными, вложенностями, ИНТЕРПОЛЯЦИЕЙ и прочим дерьмом.
			</p>
		</section>
		
	</section> 
</template>

<style lang="scss" scoped>

.promo_body {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
	column-gap: 30px; row-gap: 3vh;
	padding: 5vh 5vw;
	align-items: center;
	background-color: rgb(var(--color-2));
	@media screen and ( max-width: var(--mobile-breakpoint)) {
		grid-template-columns: 1fr;
		text-align: center;
	}
	section {
		margin: 0 auto;
		width: 75%;
	}
}

</style>

<script>

	export default {
		components: {
			VueImage: () => import  ( '~/components/common/ImageComponent/Image.vue' ),
		},
	}
</script>

