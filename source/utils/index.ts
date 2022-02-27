export type LocaleDate = {
  Day: string
  Time: string
}

export namespace utils {

  export type asJSONArray<T> = { [index: string]: T };

  export function getExtension(filename: string ): string | Error {

    const result = new RegExp('.*(avif|png|jpe?g|webp)').exec(filename); 

    if ( !result ) return new Error('requested format is not allowed')

    const [_, ext] = result;

    return ext;

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
