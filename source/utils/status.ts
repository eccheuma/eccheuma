// TYPES
  import { Purchase } from "~/contracts/Services";
  import { User }     from "~/contracts/User";

// TRANSLATES
  import { languages, getLocale } from "~/lang";
  
// NAMESPACES
export namespace work {

  export function defineStatus(status: Purchase.status, lang: languages): string {
		return Object.values(getLocale(lang).PurchaseStatus)[status];
	}

}

export namespace user {

  export function defineStatus(status: User.status, lang: languages): string {
		return Object.values(getLocale(lang).userStatus)[status];
	}

}
