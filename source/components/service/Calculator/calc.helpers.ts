import { russian } from '~/lang';
import { Categories } from '~/types/Services';
import { DAY, CATEGORIES_LANG } from './calc.constants';

export namespace FormatHelpres {

  function getRussianSuffix(val: number, word: string, suffixs: Array<string>) {
    return word.concat(russian.getSuffix(val, suffixs));
  }
  
  export function formatToDays(hours: number): string {

    const [ FullDays, Rem ] = [ Math.floor(hours / 24), hours % 24 ];

    const H = `${ Rem 		 } ${ getRussianSuffix(Rem, 'час', ['','а','ов']) }`;
    const D = `${ FullDays } ${ getRussianSuffix(FullDays, 'д', ['ень','ня','ней']) }`;

    return hours > DAY
      ? `${ D } и ${ H }`
      : H;

  }

  export function formatCost(cost: number) {
    return cost.toLocaleString('DE-de');
  }

  export function getCategoryName(category: Categories) {
    return CATEGORIES_LANG[category];
  }

}