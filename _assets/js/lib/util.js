/* global moment:true */
/* exported moment */
import S from 'string';
import URI from 'urijs';
import moment from 'moment';
import Reference from './reference';

var util = {};

util.equalsElement = function(x, y) {
  function html(x) {
    return x
      .prop('outerHTML')
      .replace(/\s+/gi, ' ')
      .replace('> </', '></')
      .trim();
  }
  return html(x) === html(y);
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

util.unique = function(fn) {
  var results = [];
  return function(arg) {
    var result = fn(arg);
    if (results.indexOf(result.valueOf()) >= 0) {
      var i = 1;
      var newresult = '';
      do {
        i++;
        newresult = result + '-' + i;
      } while (results.indexOf(newresult.valueOf()) >= 0);
      result = newresult;
    }
    results.push(result.valueOf());
    return result;
  };
};

util.generateId = function(el, prefix) {
  prefix = prefix || '';
  var id = prefix + util.slugify(el.text());
  if (!id.match(/^[a-z]/i)) {
    id = 'n' + id;
  }
  return id;
};

util.slugify = function(str) {
  return S(str.replace(/\//g, '-').trim()).slugify();
};

util.generateUniqueId = util.unique(util.generateId);

util.getId = function(el) {
  var id = el.attr('id');
  if (id) {
    if (!id.match(/^[a-z]/i)) {
      id = 'n' + id;
      el.attr('id', id);
    }
    return id;
  } else {
    id = util.generateUniqueId(el);
    el.attr('id', id);
    return id;
  }
};

util.getCachedUrl = function(url) {
  var ref = Reference.getReference(url);
  if (!ref) {
    var newUrl = util.urlWithoutAnchor(url);
    if (newUrl !== url) {
      url = newUrl;
      ref = Reference.getReference(url);
    }
  }
  if (!ref) {
    if (url.match(/^http:/i)) {
      ref = Reference.getReference(url.replace(/^http/i, 'https'));
    } else if (url.match(/^https:/i)) {
      ref = Reference.getReference(url.replace(/^https/i, 'http'));
    }
  }
  return ref;
};

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

util.isTextNode = function(node) {
  return node && node.nodeType === 3;
};

util.isCodeName = function(name) {
  name = name || '';
  name = name.toUpperCase().trim();
  return (
    name === 'CODE' ||
    name === 'PRE' ||
    name === 'SCRIPT' ||
    name === 'TEXTAREA' ||
    name === 'STYLE'
  );
};

util.isCodeNode = function(node) {
  while (node) {
    if (util.isCodeName(node.nodeName)) {
      return true;
    }
    if (node.parentNode !== node) {
      node = node.parentNode;
    } else {
      node = null;
    }
  }
  return false;
};

util.replaceInHTML = function(html, fn) {
  var reSkipTags = /<(\/)?(style|pre|code|kbd|script|math|title)[^>]*>/i;
  //            (    $1   )(     $2       )(   $3    )
  var reIntraTag = /(<[^<]*>)?([^<]*)(<\/[^<]*>)?/g;
  if (!html && typeof html !== 'string') {
    return html;
  }
  return html.replace(reIntraTag, function(str, prefix, html, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    if (prefix.match(reSkipTags)) {
      return prefix + html + suffix;
    } else {
      return prefix + fn(html) + suffix;
    }
  });
};

// util.markupPunctuation = function () {
//   return this.each(function () {
//     $(this).traverseTextNodesHTML(function (html) {
//       return html.replace(/:/g, '<span class="colon">:</span>')
//       // return html.replace(/:/g, ';')
//     })
//   })
// }

// util.markupPunctuation = function () {
//   return this.each(function () {
//     var html = $(this).html()
//     html = util.replaceInHTML(html, function (html) {
//       return html.replace(/:/g, '<span class="colon">:</span>')
//     })
//     if (html) {
//       $(this).html(html)
//     }
//   })
// }

util.markupPunctuation = function(html) {
  return util.replaceInHTML(html, function(html) {
    return (
      html
        .replace(/:/g, '<span class="colon">:</span>')
        // .replace(/;/g, '<span class="semicolon">;</span>')
        .replace(/\?/g, '<span class="questionmark">?</span>')
        .replace(/!/g, '<span class="exclamationmark">!</span>')
        .replace(/\(/g, '<span class="openparen">(</span>')
        .replace(/\)/g, '<span class="closeparen">)</span>')
        .replace(/\[/g, '<span class="openbracket">[</span>')
        .replace(/]/g, '<span class="closebracket">]</span>')
        .replace(/\u2014/g, '<span class="emdash">&mdash;</span>')
    );
  });
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

/**
 * Wraps ampersands in HTML with ``<span class="amp">`` so they can be
 * styled with CSS. Ampersands are also normalized to ``&amp;``. Requires
 * ampersands to have whitespace or an ``&nbsp;`` on both sides.
 *
 */
util.amp = function(text) {
  var reSkipTags = /<(\/)?(style|pre|code|kbd|script|math|title)[^>]*>/i;
  //            (    $1   )(     $2       )(   $3    )
  var reAmp = /(\s|&nbsp;)(&|&amp;|&#38;)(\s|&nbsp;)/g;
  //                  ( prefix) ( txt )(  suffix )
  var reIntraTag = /(<[^<]*>)?([^<]*)(<\/[^<]*>)?/g;
  if (!text && typeof text !== 'string') {
    return;
  }
  return text.replace(reIntraTag, function(str, prefix, text, suffix) {
    prefix = prefix || '';
    suffix = suffix || '';
    if (prefix.match(reSkipTags)) {
      return prefix + text + suffix;
    } else {
      text = text.replace(reAmp, '$1<span class="amp">&amp;</span>$3');
      return prefix + text + suffix;
    }
  });
};

export default util;
