/* global moment:true */
/* exported moment */
import S from 'string';
import URI from 'urijs';
import moment from 'moment';
import Reference from './reference';

const util = {};

util.equalsElement = function(x, y) {
  function html(el) {
    return el
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

  const baseName = URI(base).pathname();
  const uri = new URI(href);
  const relUri = uri.relativeTo(baseName);
  const result = relUri.toString();
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
  const results = [];
  return function(arg) {
    let result = fn(arg);
    if (results.indexOf(result.valueOf()) >= 0) {
      let i = 1;
      let newresult = '';
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
  let id = (prefix || '') + util.slugify(el.text());
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
  let id = el.attr('id');
  if (id) {
    if (!id.match(/^[a-z]/i)) {
      id = 'n' + id;
      el.attr('id', id);
    }
    return id;
  }
  id = util.generateUniqueId(el);
  el.attr('id', id);
  return id;
};

util.getCachedUrl = function(url) {
  let urlStr = url;
  let ref = Reference.getReference(urlStr);
  if (!ref) {
    const newUrl = util.urlWithoutAnchor(urlStr);
    if (newUrl !== urlStr) {
      urlStr = newUrl;
      ref = Reference.getReference(urlStr);
    }
  }
  if (!ref) {
    if (urlStr.match(/^http:/i)) {
      ref = Reference.getReference(urlStr.replace(/^http/i, 'https'));
    } else if (urlStr.match(/^https:/i)) {
      ref = Reference.getReference(urlStr.replace(/^https/i, 'http'));
    }
  }
  return ref;
};

util.dateFormat = function(context, block) {
  if (moment) {
    const date = moment(context)
      .format('YYYY-MM-DD')
      .trim();
    if (date === 'Invalid date' || date === '1970-01-01') {
      return context;
    }
    return date;
  }
  return context;
};

util.isTextNode = function(node) {
  return node && node.nodeType === 3;
};

util.isCodeName = function(name) {
  let nodeName = name || '';
  nodeName = nodeName.toUpperCase().trim();
  return (
    nodeName === 'CODE' ||
    nodeName === 'PRE' ||
    nodeName === 'SCRIPT' ||
    nodeName === 'TEXTAREA' ||
    nodeName === 'STYLE'
  );
};

util.isCodeNode = function(node) {
  let n = node;
  while (n) {
    if (util.isCodeName(n.nodeName)) {
      return true;
    }
    if (n.parentNode !== n) {
      n = n.parentNode;
    } else {
      n = null;
    }
  }
  return false;
};

util.replaceInHTML = function(html, fn) {
  const reSkipTags = /<(\/)?(style|pre|code|kbd|script|math|title)[^>]*>/i;
  //                  (  $1   ) ( $2  )(   $3    )
  const reIntraTag = /(<[^<]*>)?([^<]*)(<\/[^<]*>)?/g;
  if (!html && typeof html !== 'string') {
    return html;
  }
  return html.replace(reIntraTag, function(str, prefix, htmlStr, suffix) {
    const prefixStr = prefix || '';
    const suffixStr = suffix || '';
    if (prefixStr.match(reSkipTags)) {
      return prefixStr + htmlStr + suffixStr;
    }
    return prefixStr + fn(htmlStr) + suffixStr;
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
//     let html = $(this).html()
//     html = util.replaceInHTML(html, function (html) {
//       return html.replace(/:/g, '<span class="colon">:</span>')
//     })
//     if (html) {
//       $(this).html(html)
//     }
//   })
// }

util.markupPunctuation = function(html) {
  return util.replaceInHTML(html, function(htmlStr) {
    return (
      htmlStr
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
  let json = JSON.stringify(value, replacer, space);
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
  const reSkipTags = /<(\/)?(style|pre|code|kbd|script|math|title)[^>]*>/i;
  //             (    $1   )(     $       )(   $3    )
  const reAmp = /(\s|&nbsp;)(&|&amp;|&#38;)(\s|&nbsp;)/g;
  //                  ( prefix) ( txt )(  suffix )
  const reIntraTag = /(<[^<]*>)?([^<]*)(<\/[^<]*>)?/g;
  if (!text && typeof text !== 'string') {
    return '';
  }
  return text.replace(reIntraTag, function(str, prefix, txt, suffix) {
    const prefixStr = prefix || '';
    const suffixStr = suffix || '';
    let txtStr = txt;
    if (prefixStr.match(reSkipTags)) {
      return prefixStr + txt + suffixStr;
    }
    txtStr = txtStr.replace(reAmp, '$1<span class="amp">&amp;</span>$3');
    return prefixStr + txtStr + suffixStr;
  });
};

export default util;
