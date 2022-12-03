import crusoris from '@eccheuma/crusoris';

export default () => {
	if (process.browser) {
		crusoris({ dist: true, styles: true });
	}
};
