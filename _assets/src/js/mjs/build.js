var jsdom = require('jsdom').jsdom;
document = jsdom();
window = document.defaultView;
var $ = require('jquery');

console.log("wha'?");

// $.fn.relativizeUrls = function (hm) {
//   return 'test';
// }

console.log($);
console.log($.fn);
