import crusoris from "@eccheuma/crusoris/lib/crusoris.es";

export default () => {
	if ( process.browser && window.ontouchstart === undefined ) {
		crusoris({ dist: true, styles: true });
	}
};
