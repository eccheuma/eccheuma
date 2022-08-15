import type { WallGetResponse } from 'vk-io/lib/api/schemas/responses';
import { LocaleDate, utils } from '~/utils'

export namespace vk {

  const TOKEN: string = `access_token=${ process.env.VK_API_TOKEN }`;
  const VERSION: string = `v=${ process.env.VK_API_VERSION }`;

  export namespace wall {

    export const enum methods {
      GET = 'wall.get'
    }
  
    export const enum params {
      ID = 'owner_id'
    }

    export type query = `${ wall.params }=${ string }`;

  }

  export function constructQuery(method: wall.methods, params: Array<wall.query>): string {
    return `${ process.env.VK_API_URL }/${ method }?${ TOKEN }?${ VERSION }?${ params.join("?") }`
  }

}

export namespace feed {

  const GROUD_ID: string = String(process.env.VK_API_GROUP_ID);

  export type IFeed = {
    thumb: string,
    body: string,
    date: LocaleDate,
    link: string
    social: {
      likes: number,
      comments: number,
      reposts: number
    }
  }

  export async function get(): Promise<Array<IFeed>> {

    const params: Array<vk.wall.query> = [
      `${ vk.wall.params.ID }=${ GROUD_ID }`
    ]

    const data: Array<IFeed> = Array();
    const response = await fetch(vk.constructQuery(vk.wall.methods.GET, params));

    // todo: Cделать более стоящий обработчик ошибок.
    if ( response.status !== 200 ) throw Error();

    const { items }: WallGetResponse = await response.json();

    items.forEach(post => {
      data.push({
        thumb: post.attachments![0].photo.sizes[4].url,
        body: String(post.text),
        date: utils.getLocalTime(Number(post.date) * 1000),
        link: `https://vk.com/club${ Math.abs(post.from_id || 0) }?w=wall${ post.from_id }_${ post.id }`,
        social: {
          likes     : Number(post.likes.count || Number()),
          comments  : Number(post.comments.count || Number()),
          reposts   : Number(post.reposts.count || Number()),
        }
      })
    })

    return data;

  }

}