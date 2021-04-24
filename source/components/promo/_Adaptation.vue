<template>
	<section class="promo_body">

		<vue-image
			:content="{ path: 'Promo/3' }" 
			:sections="{ date: false, description: false, zoom: false }" 
			:property="{ fit: 'cover', type: 'promo', collumn: 12 }"
		/>

		<section>
			<h4>Адаптивная вёрстка</h4>
			<p>
				Основная причина для чего нужна разный подход к вёрстке и функционалу - Это разные методы взаимодействия с приложением \ сайтом с разных типов устройств. 
			</p>
			<p>
				На широкоформатных мониторах достаточно места для отображения боковых панелей, и большого количества контента. Но такого не скажешь о мобильных устройствах. Из-за портретной ориентации экрана и малой ширины, вёрстку приходится "обрезать" и перестраивать, дабы поместить как можно больше контента на экране.  
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
	@media screen and ( max-width: $mobile-breakpoint ) {
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

