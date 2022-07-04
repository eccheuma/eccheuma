export type LocaleDate = {
  Day: string
  Time: string
}

export type Hash = utils.types.nominal<string,'__HASH__'>;

export namespace utils {

  export namespace object {

    export function getTypedKeys<GenObject extends object>(object: GenObject): Array<keyof GenObject> {
      return Object.keys(object) as Array<keyof GenObject>;
    }

  }

  export namespace enums {

    // Так как обычный реверсивный маппинг енамов не даёт типов, приходится пользоваться жуткими обёртками.
    // Для примера enum[enum] вернёт строку, хотя, по идее, он должен вернуть тип по ключю этого enum'а.
    export function toString<E, K extends number>(enumLike: E, key: K) {
      return (enumLike as unknown as {[ index: number ]: keyof E })[key];
    }

  }

  export namespace types {

    export type nominal<Type, Key> = Type & {[ Symbol.species ]: Key }

    export type asIterableObject<Struct extends object> = {[ index: string ]: Struct };

  }

  export namespace extension {

    // const regular = new RegExp('.+.(avif|png|jpe?g|webp)')

    export const enum error {
      extension = 'requested format is not allowed',
      name      = 'bad file naming',
      dot       = 'dot'
    }

    export function define(filename: string, extensions: Array<string>): string | Error {

      const splited = filename.split('.');

      switch (splited.length) {
        case 0: 
          return new Error(error.name);
        case 1: 
          return new Error(error.name);
        case 2: 
          break;
        default: 
          if ( splited.length > 2 ) return Error(error.dot);
      }

      const [ _name, ext ] = splited.filter(x => x.length);

      if ( !ext ) return Error(error.name);

      return extensions.some(x => x === ext )
        ? ext
        : new Error(error.extension);

    }

  }

  export function getLocalTime(n: number = 0): LocaleDate 
  {

    const Properties: {[T in keyof LocaleDate]: Intl.DateTimeFormatOptions } = {
      Day: { year: 'numeric', month: 'long', day: 'numeric' },
      Time: { hour: '2-digit', minute: '2-digit' }
    }
    
    const DATA = {
      Day: 	Intl.DateTimeFormat('ru-RU', Properties.Day).format(n),
      Time: Intl.DateTimeFormat('ru-RU', Properties.Time).format(n)
    }

    return DATA;

  }

  export function hashGenerator(length: number = 12): Hash 
  {

    const randomChar = () => Math.floor(36 * Math.random()).toString(36);

    return Array<string>(length)
      .fill(String()) 
      .map(randomChar)
      .reduce((acc, cur) => {
        return acc + cur.toUpperCase()
      }, '') as Hash;

  }

  export function cutText(text: string, words: number = 45): string {

    return text
      .split(' ')
      .slice(0, words)
      .reduce((acc, cur) => `${ acc } ${ cur }`, String())

<<<<<<< HEAD
  }

  export function comparer<T extends Object>(struct: T, mock: T): boolean {

    const mockKeys = Object.keys(mock)
      .map(key => struct[key as keyof T])
      .every(x => x !== undefined)
  
    const structKeys = Object.keys(struct)
      .map(key => mock[key as keyof T])
      .every(x => x !== undefined)
  
    return [ mockKeys, structKeys ].every(x => Boolean(x));
  
=======
>>>>>>> master
  }

}