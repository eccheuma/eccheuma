import type { MetaPropertyProperty, MetaPropertyName } from 'vue-meta';

export type OpengraphMetaObject = MetaPropertyProperty | MetaPropertyName

export namespace Opengraph {

  export type struct = {
    title       : string
    description : string
    url         : string
    image       : string
  }

  export const fieds: Array<keyof struct> = ['description', 'image', 'title', 'url'];

  export class meta implements struct {

    description : string;
    title       : string;
    image       : string;
    url         : string;

    constructor({ description, image, title, url }: struct) {
      this.title        = title;
      this.url          = url;
      this.image        = image;
      this.description  = description;
    }

    public buildMeta(): Array<OpengraphMetaObject> {

      const meta: Array<OpengraphMetaObject> = Array();

      fieds.forEach(field => {
        meta.push({ property: `og:${ field }`, content: this[field] })
      })

      return meta

    }

  }

}