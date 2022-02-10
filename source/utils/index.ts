export type LocaleDate = {
  Day: string
  Time: string
}

export namespace utils {

  export type asJSONArray<T> = { [index: string]: T };

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
