import $ from 'jquery';
import URI from 'urijs';

const page = {};

page.jsPath = '/_assets/js/wiki.js';
page.cssPath = '/_assets/css/wiki.css';

page.root = function() {
  let href = window.location.href;
  const script = $('script[src*="wiki"]');
  let src = script.attr('src');
  href = href.replace(/[^/]*.html?$/i, '');
  src = src.replace(page.jsPath.replace(/^\//, ''), '');
  src = URI(src)
    .absoluteTo(href)
    .toString();
  return src;
};

// address of current page
page.path = function() {
  const base = page.root();
  let href = window.location.href;
  href = href.replace(/#[^#]*$/, '');
  href = href.replace(/[^/]*.html?$/i, '');
  return '/' + href.replace(base, '');
};

// !-separated arguments in the hash (#) part of the URL
page.hashArgs = function(idx) {
  let args = [];
  const href = window.location.href;
  const hash = URI(href).hash();
  if (hash) {
    args = hash.split('!');
  }
  return Number.isInteger(idx) ? args[idx] : args;
};

page.hashArgsCount = function() {
  return page.hashArgs().length;
};

export default page;
