// TYPES
  import { RequestStatus }  from '~/typescript/Services';
  import { UserStatus }     from '~/typescript/User';

// TRANSLATES
  import { russian } from '~/lang';

  const LANG = 'RU';

  function getLocale<T, S extends number>(locale: T, key: S) {
    switch (LANG) {
      case 'RU':
        return Object.values(locale)[key]
      default:
        return Object.values(locale)[key]
    }
  }

// NAMESPACES
export namespace work {

  export function defineStatus(status: RequestStatus): string {
		return getLocale(russian.requestStatus, status)
	}

}

export namespace user {

  export function defineStatus(status: UserStatus): string {
		return getLocale(russian.requestStatus, status)
	}

}
