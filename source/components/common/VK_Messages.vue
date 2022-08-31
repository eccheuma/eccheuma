<template>
	<div id="vk-messages" />
</template>

<script>

	export default {
		head: {
			script: [
				{ src: 'https://vk.com/js/api/openapi.js?169', type: 'text/javascript' }
			]
		},
		mounted() {
				
			setTimeout(() => {

				this.$AnimeJS({
					targets: this.$el,
					opacity: [0, 1],
					delay: 5000,
					duration: 3000,
					easing: 'easeInOutQuad',
					begin() {
						/* global VK */
						VK.Widgets.CommunityMessages('vk-messages', 158755478, {
							expanded: '0',
							disableExpandChatSound: '1',
							disableButtonTooltip: '1',
							tooltipButtonText: 'Если есть вопросы - Напишите.'
						});
					}
				});

			}, 5000);
	
		}
	};

</script>
