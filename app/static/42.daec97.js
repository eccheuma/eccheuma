(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{481:function(t,n,e){},535:function(t,n,e){"use strict";e(481)},571:function(t,n,e){"use strict";e.r(n);e(28);var o=e(5),r=e(178),c=o.default.extend({mixins:[r.a],props:{category:{type:Array,required:!0}},computed:{CurentRoute:function(){return this.$route.path}},created:function(){this.setSounds([{file:"Tap",name:"PortfolionNavHover",settings:{rate:1.25}}])},mounted:function(){var t=this;this.$refs.links.forEach((function(component){component.$el.addEventListener("mouseenter",(function(){return t.playSound(t.Sounds.get("PortfolionNavHover"))}))}))},methods:{GoRouterTo:function(path){this.$route.path!==path&&this.$router.push({path:path})}}}),l=(e(535),e(21)),component=Object(l.a)(c,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("nav",{staticClass:"portfolio_navigation-container",attrs:{id:"Navigation"}},[t._l(t.category,(function(link,n){return[e("nuxt-link",{key:n,ref:"links",refInFor:!0,class:{active:link.route===t.$route.path},attrs:{to:link.route}},[e("transition",{attrs:{name:"opacity-transition"}},[link.route===t.$route.path?e("span"):t._e()]),t._v(" "),e("i",{class:link.icon}),t._v(" "+t._s(link.name)+"\n\n\t\t")],1)]}))],2)}),[],!1,null,null,null);n.default=component.exports}}]);