<template>
  <section class="post-container" v-if="Post">

    <div class="post-header">
      <h1>{{ Post.title }}</h1>
      <h3>{{ Post.description }}</h3>
    </div>

    <picture class="post-image">
      <source :srcset="previewImage.avif" type="image/avif">
      <img ref="image" :src="previewImage.webp" :alt="Post.description">
    </picture>

    <post-content :source="Post.content" />
  </section>
</template>

<style lang="scss">

.post-container {
  width: 80vw;
  margin: 2vw auto;
  background: rgb(var(--color-mono-300));
  padding: 2vh 2vw;
  border-radius: var(--border-radius);

  display: grid;
  gap: 2vh;

  grid-template-rows: min-content 1fr;

}

.post-header {

  h1 {
    text-align: center;
    font-family: var(--decor-font);
  }

  h3 {
    text-align: center;
    color: rgb(var(--color-mono-600));
    font-size: var(--font-size-24);
  }

}

.post-image {
  img {
    width: 100%;
    border-radius: var(--border-radius);
  }
}

</style>

<script lang="ts">

  import Vue from 'vue';

  // COMPONENTS
  import PostContent from '~/components/post/submodules/Content.vue';

  // API
  import { database } from '~/api/database';

  // NAMESPACES
	import { Post }   from '~/contracts/Post';
  import { Image }  from '~/contracts/Image';

  // HELPERS
  import { getImageURL } from '~/components/image/image.helpers';

  // PAGE DESCRIPTION
	import { opengraph } from '~/utils/opengraph';

  // IMAGE PLACEHOLDER
	const PLACEHOLDER: Pick<Image.formatsStruct, 'avif' | 'webp'> = {
		avif: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=avif').src,
		webp: require('~/assets/images/ImagePlaceholder.png?resize&size=600&format=webp').src
	};

  // MODULE
  export default Vue.extend({

    components: {
      PostContent
    },

    async asyncData({ params, redirect }) {

      const Post: Post.struct = await database.get(`posts/post::${ params.id }`);

      if ( !Post ) redirect('/error'); 

      const imageResult = await getImageURL({
        path: Post.image,
        size: 1440,
      });

      const PageDescription = {
        title				: `Eccheuma | ${ Post.title }`,
        description	: Post.description,
        image				: imageResult instanceof Error 
          ? PLACEHOLDER.webp 
          : imageResult.webp,
      };

      return { Post, previewImage: imageResult, PageDescription };

    },

    data() {
      return {

        Post: undefined as Post.struct | undefined,
        previewImage: PLACEHOLDER,

        PageDescription: Object() as opengraph.struct,

      };
    },

    head () {
			return {
				meta: [
					...new opengraph.Meta(this.$data.PageDescription).buildMeta()
				],
			};
		},

  });

</script>