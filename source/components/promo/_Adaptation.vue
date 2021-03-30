<template>
	<section class="promo_body">

		<vue-image
			:content="{ path: 'Promo/3' }" 
			:sections="{ date: false, description: false, zoom: false }" 
			:property="{ fit: 'cover', type: 'promo', collumn: 12 }">
		</vue-image>

		<section>
			<h4>Для чего же это нужно?</h4>
			<p>
				Основная причина для чего нужна разная вёрстка, а порой и функционал, это - Разные методы взаимодействия с приложением \ сайтом. Поэтому, выдать сайт ориентированный под широкоформатные устройства, на тот же смартфон, у которого экран является портретно-ориентированным - Крайне провальная затея.
			</p> 
			<p>
				Поэтому на выручку идут такие вещи как динамический layout, всевозможные CSS фреймворки, и прочие технические ухищирения...
			</p>
		</section>

	</section> 
</template>

<style lang="scss" scoped>

.promo_body {
	display: grid;
	grid-template-columns: minmax(40vw, 2fr) 1fr; 
	column-gap: 30px; row-gap: 3vh;
	padding: 2vh 2vw;
	align-items: center;
	background-color: rgb(var(--color-2));
	@media screen and ( max-width: var(--mobile-breakpoint)) {
		grid-template-columns: 1fr;
		text-align: center;
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

