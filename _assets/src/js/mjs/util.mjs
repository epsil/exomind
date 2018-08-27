import $ from 'jquery';
import moment from 'moment';
import Reference from './reference';
import URI from 'urijs';
var util = {};

util.dateFormat = function(context, block) {
  if (moment) {
    var date = moment(context)
      .format('YYYY-MM-DD')
      .trim();
    if (date === 'Invalid date' || date === '1970-01-01') {
      return context;
    } else {
      return date;
    }
  } else {
    return context;
  }
};

util.isLocalFile = function() {
  return URI(window.location.href).protocol() === 'file';
};

util.isExternalUrl = function(str) {
  return URI(str).host() !== '';
};

util.urlRelative = function(base, href) {
  if (base === undefined || href === undefined || base === '' || href === '') {
    return '';
  }

  if (!href.match(/^\//) || (URI(base).is('relative') && !base.match(/^\//))) {
    return href;
  }

  base = URI(base).pathname();
  var uri = new URI(href);
  var relUri = uri.relativeTo(base);
  var result = relUri.toString();
  return result === '' ? './' : result;
};

util.urlResolve = function(base, href) {
  if (base === undefined || href === undefined || base === '' || href === '') {
    return '';
  }

  return URI(href)
    .absoluteTo(base)
    .toString();
};

util.HTMLtoText = function(html) {
  var text;
  util.withDOM(html, function(body) {
    text = body.innerText || body.textContent;
  });
  return text.trim();
};

util.withDOM = function(html, fn) {
  var body = document.createElement('div');
  body.innerHTML = html;
  fn(body);
  return body.innerHTML;
};

util.dojQuery = function(html, fn) {
  var body = $('<div>');
  body.html(html);
  fn(body);
  return body.html();
};

// https://stackoverflow.com/questions/4901133/json-and-escaping-characters#answer-4901205
util.JSONStringify = function(value, replacer, space, ascii) {
  var json = JSON.stringify(value, replacer, space);
  if (ascii) {
    json = json.replace(/[\u007f-\uffff]/gi, function(c) {
      return '\\u' + ('0000' + c.charCodeAt(0).toString(16)).slice(-4);
    });
  }
  return json;
};

util.prettyJSON = function(json) {
  return util.JSONStringify(json, null, 2, true);
};

// similar to Hakyll's relativizeUrls
util.relativizeUrls = function(path) {
  return this.each(function() {
    $(this)
      .find('a[href]')
      .each(function() {
        var a = $(this);
        var href = a.attr('href');
        if (!a.hasClass('u-url') && !a.hasClass('external')) {
          // redirect external links to local copy
          var ref = Reference.getReference(href);
          if (ref) {
            href = ref.href;
            a.attr('href', href);
            a.attr('title', a.attr('title') || ref.title || '');
          }
        }
        // make URL relative
        href = util.urlRelative(path, href);
        a.attr('href', href);

        // add index.html to end of link
        if (
          util.isLocalFile() &&
          !util.isExternalUrl(href) &&
          util.urlWithoutAnchor(href).match(/\/$/)
        ) {
          href = util.urlPlusIndexHtml(href);
          a.attr('href', href);
        }
      });

    $(this)
      .find('img[src]')
      .each(function() {
        var img = $(this);
        var src = img.attr('src');
        src = util.urlRelative(path, src);
        img.attr('src', src);
      });
  });
};

util.isLocalFile = function() {
  return URI(window.location.href).protocol() === 'file';
};

util.isExternalUrl = function(str) {
  return URI(str).host() !== '';
};

util.urlAnchor = function(url) {
  return URI(url).hash();
};

util.urlWithoutAnchor = function(url) {
  return URI(url)
    .fragment('')
    .toString();
};

util.urlPlusIndexHtml = function(url) {
  return util.urlWithoutAnchor(url) + 'index.html' + util.urlAnchor(url);
};

$.fn.relativizeUrls = util.relativizeUrls;

export default util;
