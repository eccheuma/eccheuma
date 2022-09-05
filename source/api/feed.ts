import type { WallGetResponse } from 'vk-io/lib/api/schemas/responses';
import type { WallWallpostAttachmentType, WallWallpostAttachment } from 'vk-io/lib/api/schemas/objects';

// UTILS
import { LocaleDate, utils } from '~/utils';

// CloudFunctions 
import { externalFetch } from '~/api/cloudFunctions';

export namespace vk {

  const TOKEN = `access_token=${ process.env.VK_API_DEV_TOKEN }`;
  const VERSION = `v=${ process.env.VK_API_VERSION }`;

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
    return `${ process.env.VK_API_URL }/${ method }?${ TOKEN }&${ VERSION }&${ params.join('&') }`;
  }

  export function pickThumbnail(attachments: Array<WallWallpostAttachment> = []): string | undefined {

    if ( attachments.length === 0 ) return;

    const FIRST_ATTACHMENT: WallWallpostAttachment = attachments[0];

    switch (FIRST_ATTACHMENT.type as WallWallpostAttachmentType) {
      case 'photo': 
        return FIRST_ATTACHMENT[ FIRST_ATTACHMENT.type ].sizes[4].url;
      case 'link':
        return FIRST_ATTACHMENT[ FIRST_ATTACHMENT.type ].sizes[4].url;
    }

  }

}

// TODO: #18 Проблема с парсингом вариаций миниатюр поста. Сделать адекватный обработчик, в случае отказа, и подгружать заглушку извне. @Scarlatum
// TODO: #19 Добавить логику на бэк для постоянного обновления токена, в случае его просрочки. Возможно реализоваться всё через WS. @Scarlatum  
export namespace feed {

  const GROUD_ID = String(process.env.VK_API_GROUP_ID);

  export type IFeed = {
    thumb ?: string,
    body: string,
    date: LocaleDate,
    link: string
    social: {
      likes: number,
      comments: number,
      reposts: number
    }
  }

  export async function get(from: string = GROUD_ID): Promise<Array<IFeed>> {

    const params: Array<vk.wall.query> = [
      `${ vk.wall.params.ID }=${ from }`
    ];

    const feed: Array<IFeed> = [];

    const response = await Promise.race([
      // fetch(vk.constructQuery(vk.wall.methods.GET, params)),
      externalFetch(vk.constructQuery(vk.wall.methods.GET, params)),
    ]);

    // todo: Cделать более стоящий обработчик ошибок.
    if ( response.status !== 200 ) return feed;

    const data: { response: WallGetResponse } = await response.json();

    data.response.items.forEach(post => {

      feed.push({
        thumb : vk.pickThumbnail(post.attachments),
        body  : String(post.text),
        date  : utils.getLocalTime(Number(post.date) * 1000),
        link  : `https://vk.com/club${ Math.abs(post.from_id || 0) }?w=wall${ post.from_id }_${ post.id }`,
        social: {
          likes    : Number(post.likes.count || Number()),
          comments : Number(post.comments.count || Number()),
          reposts  : Number(post.reposts.count || Number()),
        }
      });

    });

    return feed;

  }

}