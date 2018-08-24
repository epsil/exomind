import $ from 'jquery';
import moment from 'moment';
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

export default util;
