import $ from 'jquery';
import URI from 'urijs';

var page = {};

page.jsPath = '/_assets/build/static/js/main.js';
page.jsBundlePath = '/static/js/bundle.js';
page.cssPath = '/_assets/build/static/css/main.css';

page.root = function() {
  var jsPath = page.jsPath;
  var href = window.location.href;
  var script = $('script[src*="main"]');
  if (!script.length) {
    script = $('script[src*="bundle"]');
    jsPath = page.jsBundlePath;
  }
  var src = script.attr('src');
  href = href.replace(/[^/]*.html?$/i, '');
  var relativeJsPath = jsPath.replace(/^\//, '');
  src = src.replace(relativeJsPath, '');
  src = URI(src)
    .absoluteTo(href)
    .toString();
  return src;
};

// address of current page
page.path = function() {
  var base = page.root();
  var href = window.location.href;
  href = href.replace(/[^/]*.html?$/i, '');
  return '/' + href.replace(base, '');
};

export default page;
