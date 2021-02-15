<template>
	<div id="vk_community_messages"></div>
</template>

<script>

	export default {
		async mounted() {

			if ( process.client ) {
				
				const INIT = () => import('~/assets/js/openapi.min.js'); 
				
				await INIT();

				setTimeout(() => {
					VK.Widgets.CommunityMessages("vk_community_messages", 158755478, {
						expanded: "0",
						disableExpandChatSound: "1",
						disableButtonTooltip: "1",
						tooltipButtonText: "Если есть вопросы - Напишите."
					});
				}, 5000)

			}

		}
	}

</script>