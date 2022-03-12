export type LocaleDate = {
  Day: string
  Time: string
}

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

  export type asIterableObject<Struct extends object> = {[ index: string ]: Struct };

  export function getExtension(filename: string): string | Error {

    const result = new RegExp('.*(avif|png|jpe?g|webp)').exec(filename); 

    if ( !result ) return new Error('requested format is not allowed')

    return result[1];

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

  export function hashGenerator(): string 
  {
    return Math.random().toString(36).slice(-9).toUpperCase()
  }

}