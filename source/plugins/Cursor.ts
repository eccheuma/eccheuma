import crusoris from '@eccheuma/crusoris';
import { Context } from '@nuxt/types';

export default (nuxt: Context) => {
	if ( process.browser ) {
		crusoris({ dist: true, styles: true });
	}
};
