import { languages, getLocale } from '~/lang';
import { navigation } from '~/types/Navigation';
import { utils } from '~/utils';


export namespace Meta {

  type PageTitle = {
    page: number | string;
    section: navigation.routeSections
  }

  export function conctructTitle(lang: languages, prop: PageTitle) {

    const pageName = getLocale(lang).Routes[ prop.section ];
    const pageType = getLocale(lang).Pagination.page;

    const pagePrefix = typeof prop.page === 'number'
      ? `${ prop.page } ${ pageType }`
      : `${ prop.page }`;

    return `Eccheuma | ${ pageName } | ${ pagePrefix }`;

  }

}