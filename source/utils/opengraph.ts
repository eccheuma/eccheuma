import type { MetaPropertyProperty, MetaPropertyName } from 'vue-meta';
import { utils } from '~/utils';
import { languages } from '~/lang'

export type OpengraphMetaObject = MetaPropertyProperty | MetaPropertyName

export namespace Opengraph {

  const PREFIX: string = 'og'

  export type struct = {
    title       : string
    description : string
    url         : string
    image       : string
  }

  type predefinedMeta = {
    website ?: string
    locale  ?: languages
  }

  interface metaStruct {
    struct: struct
  }

  export class Meta implements Readonly<metaStruct> {

    readonly struct: 
      struct = Object(); 
    static readonly predefined: 
      predefinedMeta = {
        locale  : languages.Russian,
        website : './'
      };

    constructor(meta: struct, opt?: Partial<predefinedMeta>) {

      this.struct.title        = meta.title;
      this.struct.url          = meta.url;
      this.struct.image        = meta.image;
      this.struct.description  = meta.description;

      if ( opt ) {
        Meta.predefined.website ||= opt.website;
        Meta.predefined.locale  ||= opt.locale;
      }

    }

    static setPreffix(type: keyof struct | keyof predefinedMeta): string {
      return `${ PREFIX }:${ type }`
    }

    public buildMeta(): Array<OpengraphMetaObject> {

      const meta: Array<OpengraphMetaObject> = Array();

      utils.object.getTypedKeys(this.struct).forEach(key => {
        meta.push({ property: Meta.setPreffix(key), content: this.struct[key] })
      })

      utils.object.getTypedKeys(Meta.predefined).forEach(key => {

        const value = Meta.predefined[key];

        if ( value ) {
          meta.push({ property: Meta.setPreffix(key), content: value })
        }

      })

      return meta

    }

  }

}