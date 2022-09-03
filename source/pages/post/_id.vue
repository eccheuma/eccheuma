<template>
  <section class="post-container" v-if="Post">

    <div class="post-header">
      <h1>{{ Post.title }}</h1>
      <h3>{{ Post.description }}</h3>
    </div>

    <picture class="post-image">
      <source :srcset="ImageURL.avif" type="image/avif">
      <img ref="image" :src="ImageURL.webp" :alt="Post.description">
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
	import { Post }   from '~/types/Post';
  import { Image }  from '~/types/Image';

  // PAGE DESCRIPTION
	import { Opengraph } from '~/utils/opengraph';

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

    async asyncData({ params, redirect, store }) {

      const Post: Post.struct = await database.get(`Posts/PostID-${ params.id }`);

      if ( !Post ) redirect('/error'); 

      const ImageURL = await store.dispatch('Images/getImageURL', { 
        path: Post.image,
        size: 1440,
      });

      const PageDescription = {
        title				: `Eccheuma | ${ Post.title }`,
        description	: Post.description,
        image				: ImageURL.webp,
      };

      return { Post, ImageURL, PageDescription };

    },

    data() {
      return {

        Post: undefined as Post.struct | undefined,
        ImageURL: PLACEHOLDER,

        PageDescription: Object() as Opengraph.struct,

      };
    },

    head () {
			return {
				meta: [
					...new Opengraph.Meta(this.$data.PageDescription).buildMeta()
				],
			};
		},

  });

</script>