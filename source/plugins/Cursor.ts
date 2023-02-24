import crusoris from '@eccheuma/crusoris';

export default () => {
	if ( process.browser && window.ontouchstart === undefined ) {
		crusoris({ dist: true, styles: true });
	}
};
