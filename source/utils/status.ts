// TYPES
  import { Purchase } from '~/typescript/Services';
  import { User }     from '~/typescript/User';

// TRANSLATES
  import { languages, getLocale } from '~/lang';

  const applicationLang = languages.Russian;
  
// NAMESPACES
export namespace work {

  export function defineStatus(status: Purchase.status): string {
		return Object.values(getLocale(applicationLang).PurchaseStatus)[status]
	}

}

export namespace user {

  export function defineStatus(status: User.status): string {
		return Object.values(getLocale(applicationLang).userStatus)[status]
	}

}
