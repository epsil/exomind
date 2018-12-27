import $ from 'jquery';
import URI from 'urijs';

var page = {};

page.jsPath = '/_assets/js/wiki.js';
page.cssPath = '/_assets/css/wiki.css';

page.root = function() {
  var href = window.location.href;
  var script = $('script[src*="wiki"]');
  var src = script.attr('src');
  href = href.replace(/[^/]*.html?$/i, '');
  src = src.replace(page.jsPath.replace(/^\//, ''), '');
  src = URI(src)
    .absoluteTo(href)
    .toString();
  return src;
};

// address of current page
page.path = function() {
  var base = page.root();
  var href = window.location.href;
  href = href.replace(/#[^#]*$/, '');
  href = href.replace(/[^/]*.html?$/i, '');
  return '/' + href.replace(base, '');
};

// !-separated arguments in the hash (#) part of the URL
page.hashArgs = function(idx) {
  var args = [];
  var href = window.location.href;
  var hash = URI(href).hash();
  if (hash) {
    args = hash.split('!');
  }
  if (Number.isInteger(idx)) {
    return args[idx];
  } else {
    return args;
  }
};

page.hashArgsCount = function() {
  return page.hashArgs().length;
};

export default page;
