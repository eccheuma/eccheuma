/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */

const enum expressions {
  CharAndNumber = '[a-z][0-9]|[0-9][a-z]', // ! Need to find better RegExp...
  Email         = '.+@.+\\.[a-zа-я]{2,}',
}

namespace Sentence {

  export const params = {
    minLength: 0
  };

  export function applyPattern(value: string): string {
    return `\\S*${ value.toLowerCase() }.?[а-яa-z]`;
  }

}

export namespace validate {

  export function email(email: string): boolean {

    if ( !email.length ) return false;

    return new RegExp(expressions.Email).test(email.toLowerCase());
  }

  export function pass(pass: string, length: number, charSet: string = expressions.CharAndNumber): boolean {

    if ( length && pass.length < length ) return false;
  
    return new RegExp(`${ charSet }`).test(pass.toLowerCase());
  
  }

  export function sentence(sentence: string, list: Array<string>, params = Sentence.params): boolean {

    if ( list.length ) {

      return !sentence.split(' ').some(word => {
        return list.some(banned => {

          return new RegExp(Sentence.applyPattern(banned)).test(word);

        });
      });

    }
  
    if ( params.minLength > sentence.length ) return false;
  
    return Boolean(sentence.length);
  
  }

}
