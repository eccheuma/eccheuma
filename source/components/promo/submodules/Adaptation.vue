<template>
	<section class="promo_body">

		<eccheuma-image
			style="height: 100%"
			:content="{ path: 'Promo/3.png' }" 
			:sections="{ date: false, description: false, zoom: false }" 
			:property="{ type: 'promo' }"
		/>

		<section>
			<h4>Для чего это?</h4>
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
	justify-content: center;

	grid-template: {
		columns: minmax(0, 40vw) 45ch;
		rows: 100%;
	}

	column-gap: 30px; 
	row-gap: 3vh;
	
	padding: 0vh 2vw;

	align-items: center;
	background-color: rgb(var(--color-mono-300));

	@media screen and ( max-width: $mobile-breakpoint ) {
		padding: 2vh 2vw;
		grid-template-columns: 1fr;
		grid-template-rows: auto auto;
		text-align: center;
	}

	width: 100%;

	h4 {
		font-weight: 700;
		font-size: var(--font-size-36);
	}

	p {
		font-size: var(--font-size-18);
    font-family: var(--read-font);
    font-weight: 300;
    color: rgb(var(--color-mono-600));
	}

}

</style>

<script>

	export default {
		components: {
			EccheumaImage: () => import( "~/components/image/Image.vue" ),
		},
	};
</script>
