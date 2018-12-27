/* global Clipboard:true, clipboard:true */
/* exported Clipboard */
/* exported clipboard */
import $ from 'jquery';
import Clipboard from 'clipboard';
var clipboard = null;
import Reference from './reference';
import util from './util';
var utilJq = {};

utilJq.dojQuery = function(html, fn) {
  var body = $('<div>');
  body.html(html);
  fn(body);
  return body.html();
};

utilJq.unhideElement = function(el) {
  utilJq.unhideSection(el);
  el.parents().each(function(index, value) {
    utilJq.unhideSection($(this));
  });
};

utilJq.unhideSection = function(section) {
  if (section.prop('tagName') === 'SECTION') {
    var button = section.find('.collapse-button').first();
    var div = section.find('div').first();
    if (div.hasClass('collapse') && !div.hasClass('in')) {
      button.attr('aria-expanded', 'true');
      div.addClass('in');
      div.css({ height: '' });
      div.attr('aria-expanded', 'true');
    }
  }
};

// FIXME: this function is incredibly slow
// FIXME: the below implementation cannot be run in parallel
var htmlToTextDiv = null;
utilJq.htmlToText = function(html) {
  htmlToTextDiv = htmlToTextDiv || $('<div>');
  htmlToTextDiv.html(html);
  var txt = htmlToTextDiv.text().trim();
  htmlToTextDiv.html('');
  return txt;
};

// utilJq.htmlToText = function (html) {
//   return $('<div>').html(html).text().trim()
// }

utilJq.process = function(html) {
  // html = util.markupPunctuation(html)
  return utilJq.dojQuery(html, utilJq.processBody);
};

utilJq.processDOM = function() {
  return utilJq.processBody($('body'));
};

utilJq.processBody = function(body) {
  var content = body.find('.e-content');
  if (content.length <= 0) {
    return;
  }
  body.fixWidont();
  body.addAcronyms();
  body.addSmallCaps();
  body.addClipboardButtons();
  body.addPullQuotes();
  body.fixCenteredText();
  body.fixFigures();
  body.fixMarks();
  body.addPunctuation();
  body.addHotkeys();
  body.addTeXLogos();
  body.addFormulas();
  content.addAnchors();
  body.fixBlockquotes();
  body.addBootstrapDivs();
  content.addCollapsibleElements();
  content.collapseDoneItems();
  body.fixFootnotes();
  body.addSidenotes();
  body.fixTables();
  body.fixLinks();
  content.addSections();
};

utilJq.processSimple = function(html) {
  return utilJq.dojQuery(html, function(body) {
    var content = body.find('.e-content');
    if (content.length <= 0) {
      return;
    }
    body.fixWidont();
    body.fixCenteredText();
    body.fixFigures();
    body.fixMarks();
    body.addPunctuation();
    body.addHotkeys();
    body.addTeXLogos();
    body.fixBlockquotes();
    body.addBootstrapDivs();
    body.fixFootnotes();
    body.addSidenotes();
    body.fixTables();
    body.fixLinks();
  });
};

utilJq.traverse = function(fn) {
  return this.each(function() {
    var root = this;
    var node = root.childNodes[0];
    while (node) {
      fn(node);
      if (node.firstChild) {
        node = node.firstChild;
      } else {
        while (!node.nextSibling && node !== root) {
          node = node.parentNode;
        }
        node = node.nextSibling;
      }
    }
  });
};

utilJq.traverseNodes = function(fn, filter) {
  filter =
    filter ||
    function(node) {
      return true;
    };
  return this.each(function() {
    $(this).traverse(function(node) {
      if (filter(node)) {
        fn(node);
      }
    });
  });
};

utilJq.traverseTextNodes = function(fn, filter) {
  filter =
    filter ||
    function(node) {
      return !util.isCodeNode(node);
    };
  return this.each(function() {
    $(this).traverseNodes(fn, function(node) {
      return util.isTextNode(node) && filter(node);
    });
  });
};

utilJq.traverseTextNodesHTML = function(fn, test) {
  return this.each(function() {
    $(this).traverseTextNodes(function(node) {
      if (node) {
        var txt = node.nodeValue;
        var newTxt = fn(txt);
        if (newTxt !== txt) {
          var span = $('<span>').text(txt);
          var html = span.html();
          var newHtml = fn(html);
          if (newHtml !== html) {
            span.html(newHtml);
            var jNode = $(node);
            // var parent = jNode.parent()
            if (node && jNode) {
              if (node && jNode && span) {
                // node.replaceWith(span)
                jNode.before(span);
                // node.remove()
                node.nodeValue = '';
              }
            }
          }
        }
      }
    });
  });
};

utilJq.addClipboardButtons = function() {
  return this.map(function() {
    var body = $(this);
    body.find('pre, code').each(function() {
      var pre = $(this);
      var parents = pre.parents('pre');
      if (parents.length === 0) {
        var id = util.getId(pre);
        var button = $(
          '<button class="btn clippy" data-clipboard-target="#' +
            id +
            '" title="Copy to clipboard"><i class="fa fa-clipboard"></i></button>'
        );
        if (pre.is('code')) {
          var span = pre.wrap('<span class="code"></span>').parent();
          span.append(button);
        } else {
          var div = pre.wrap('<div class="pre"></span>').parent();
          div.prepend(button);
        }
      }
    });
    try {
      clipboard = new Clipboard('.btn', {
        text: function(trigger) {
          return this.target(trigger).innerText.trim();
        }
      });
      clipboard.on('success', function(e) {
        e.text = e.text.trim();
        e.clearSelection();
      });
    } catch (err) {
      body.find('.btn').remove();
    }
  });
};

utilJq.addAcronyms = function() {
  return this.map(function() {
    $(this)
      .find('abbr')
      .filter(function() {
        var text = $(this)
          .text()
          .trim();
        return text.toUpperCase() === text;
      })
      .addClass('acronym');
  });
};

utilJq.addFormulas = function() {
  return this.each(function() {
    $(this)
      .find('p')
      .filter(function() {
        var text = $(this).text() || '';
        return (
          (text.match(/^\$\$/) && text.match(/\$\$$/)) ||
          (text.match(/^\\\[/) && text.match(/\\]$/))
        );
      })
      .each(function() {
        $(this).addClass('formula');
      });
  });
};

utilJq.addHotkeys = function() {
  return this.map(function() {
    var body = $(this);
    body
      .find('kbd:contains("Ctrl")')
      .replaceWith('<kbd title="Control">Ctrl</kbd>');
    body.find('kbd:contains("Alt")').replaceWith('<kbd title="Alt">Alt</kbd>');
    body
      .find('kbd:contains("Esc")')
      .replaceWith('<kbd title="Escape">Esc</kbd>');
    body
      .find('kbd:contains("Enter")')
      .replaceWith('<kbd title="Enter">\u21b5</kbd>');
    body
      .find('kbd:contains("Tab")')
      .replaceWith('<kbd title="Tab">\u21b9</kbd>');
    body
      .find('kbd:contains("Windows")')
      .replaceWith('<kbd title="Windows"><i class="fa fa-windows"></i></kbd>');
    body
      .find('kbd:contains("Shift"), kbd:contains("\u21e7")')
      .replaceWith('<kbd title="Shift">\u21e7</kbd>');
    body
      .find(
        'kbd:contains("Cmd"), kbd:contains("Command"), kbd:contains("\u2318")'
      )
      .replaceWith('<kbd title="Command">\u2318</kbd>');
    body
      .find(
        'kbd:contains("Opt"), kbd:contains("Option"), kbd:contains("\u2325")'
      )
      .replaceWith('<kbd title="Option">\u2325</kbd>');
    body
      .find('kbd:contains("Fn"), kbd:contains("Function")')
      .replaceWith('<kbd title="Function">Fn</kbd>');
    body
      .find('kbd:contains("PgUp"), kbd:contains("Page Up")')
      .replaceWith('<kbd title="Page Up">PgUp</kbd>');
    body
      .find('kbd:contains("PgDn"), kbd:contains("Page Down")')
      .replaceWith('<kbd title="Page Down">PgDn</kbd>');
    body
      .find('kbd:contains("Eject")')
      .replaceWith('<kbd title="Eject">\u23cf</kbd>');
    body
      .find('kbd:contains("Power")')
      .replaceWith('<kbd title="Power"><i class="fa fa-power-off"></i></kbd>');
    body
      .find('kbd:contains("Left")')
      .replaceWith('<kbd title="Left">\u2190</kbd>'); // \u2b05
    body
      .find('kbd:contains("Right")')
      .replaceWith('<kbd title="Right">\u2192</kbd>'); // \u27a1
    body
      .find('kbd')
      .filter(function() {
        return (
          $(this)
            .text()
            .trim() === 'Up'
        );
      })
      .replaceWith('<kbd title="Up">\u2191</kbd>'); // \u2b06
    body
      .find('kbd')
      .filter(function() {
        return (
          $(this)
            .text()
            .trim() === 'Down'
        );
      })
      .replaceWith('<kbd title="Down">\u2193</kbd>'); // \u2b07
  });
};

utilJq.addPullQuotes = function() {
  return this.map(function() {
    $(this)
      .find('p.pull-quote, blockquote p.left, blockquote p.right')
      .each(function() {
        var p = $(this);
        var blockquote = p.parent();
        if (blockquote.prop('tagName') !== 'BLOCKQUOTE') {
          blockquote = p.wrap('<blockquote>').parent();
        }
        var aside = blockquote.wrap('<aside>').parent();
        aside.addClass(p.attr('class'));
        p.removeAttr('class');
      });
  });
};

utilJq.addSmallCaps = function() {
  return this.map(function() {
    $(this)
      .find('sc')
      .replaceWith(function() {
        var span = $('<span class="caps"></span>');
        span.html($(this).html());
        return span;
      });
  });
};

utilJq.addTeXLogos = function() {
  return this.map(function() {
    var body = $(this);
    // cf. http://edward.oconnor.cx/2007/08/tex-poshlet
    // and http://nitens.org/taraborelli/texlogo
    var a = '<span class="latex-a">a</span>';
    var la = 'L' + a;
    var e = '<span class="tex-e">e</span>';
    var tex = 'T' + e + 'X';
    var eps = '<span class="latex-epsilon">&#949;</span>';
    var sp = '<span class="latex-space">&nbsp;</span>';
    var twoe = '2' + eps;
    var ee = '<span class="xetex-e">&#398;</span>';
    var xe = 'X' + ee;
    body.find('abbr[title=XeTeX]').html(xe + tex);
    body.find('abbr[title=XeLaTeX]').html(xe + la + tex);
    body.find('abbr[title="LaTeX 2e"]').html(la + tex + sp + twoe);
    body.find('abbr[title=LaTeX]').html(la + tex);
    body.find('abbr[title=LuaTeX]').html('Lua' + tex);
    body.find('abbr[title=ConTeXt]').html('Con' + tex + 't');
    body.find('abbr[title=AUCTeX]').html('AUC' + tex);
    body.find('abbr[title=MusiXTeX]').html('MusiX' + tex);
    body.find('abbr[title=MiKTeX]').html('MiK' + tex);
    body.find('abbr[title=PCTeX]').html('PC' + tex);
    body.find('abbr[title=KaTeX]').html('K' + a + tex);
    body.find('abbr[title=MacTeX]').html('Mac' + tex);
    body.find('abbr[title=lhs2TeX]').html('lhs2' + tex);
    body.find('abbr[title=TeX]').html(tex);
  });
};

// similar to Hakyll's relativizeUrls
utilJq.relativizeUrls = function(path) {
  return this.each(function() {
    $(this)
      .find('a[href]')
      .each(function() {
        var a = $(this);
        var href = a.attr('href');
        if (!a.hasClass('u-url') && !a.hasClass('external')) {
          // redirect external links to local copy
          var ref = util.getCachedUrl(href);
          if (ref) {
            var hash = util.urlAnchor(href);
            var refHasAnchor = util.urlAnchor(ref.href) !== '';
            href = ref.href + (refHasAnchor ? '' : hash);
            a.attr('href', href);
            a.attr('title', a.attr('title') || ref.title || '');
          }
        }
        // make URL relative
        href = util.urlRelative(path, href);
        a.attr('href', href);
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

utilJq.addBootstrapDivs = function(path) {
  return this.each(function() {
    $(this)
      .find('blockquote[class]')
      .filter(function() {
        return $(this).hasClass('bs-callout');
      })
      .each(function() {
        var blockquote = $(this);
        var strong = blockquote.find('>:first-child > strong');
        if (strong.length) {
          var p = strong.parent();
          if (strong.length && p.text() === strong.text()) {
            var header = $('<h4>');
            header.html(strong.html());
            p.replaceWith(header);
          }
        }
        var div = blockquote
          .prop('outerHTML')
          .trim()
          .replace(/^<blockquote/i, '<div')
          .replace(/blockquote>$/i, 'div>');
        blockquote.replaceWith(div);
      });
  });
};

utilJq.fixBlockquotes = function() {
  return this.each(function() {
    $(this)
      .find('blockquote > p:last-child')
      .each(function() {
        var p = $(this);
        if (
          p
            .text()
            .trim()
            .match(/^[\u2013\u2014]/)
        ) {
          p.find('em, i').replaceWith(function() {
            return $('<cite>' + $(this).html() + '</cite>');
          });
          var html = p.html().substr(1);
          var footer = $('<footer>' + html + '</footer>');
          p.replaceWith(footer);
        }
      });
  });
};

utilJq.fixCenteredText = function() {
  return this.map(function() {
    $(this)
      .find('center')
      .replaceWith(function() {
        var p = $('<p class="text-center">');
        p.html($(this).html());
        return p;
      });
  });
};

utilJq.fixMarks = function() {
  return this.each(function() {
    var body = $(this);
    body.find('mark').each(function() {
      var mark = $(this);
      mark.addClass('mark');
      if (!mark.is('[title]')) {
        mark.attr('title', 'Highlight');
      }
    });
  });
};

utilJq.fixLinks = function() {
  return this.each(function() {
    var body = $(this);
    // fix internal links
    body.find('a[href^="#"]').each(function() {
      var link = $(this);
      var href = link.attr('href').replace(':', '\\:');
      var title = link.attr('title');
      // ignore aria-hidden anchors
      if (
        link.attr('aria-hidden') === 'true' ||
        href === '#' ||
        (title !== undefined && title !== '')
      ) {
        return;
      }
      var target = body.find(href);
      if (target.length <= 0) {
        return;
      }
      // set title attribute to summary of target
      target = target.first();
      var text = target.removeAria().text() || '';
      text = text.trim();
      link.attr('title', text);
    });
    // fix external links
    body.find('a').each(function() {
      var a = $(this);
      var text = a.text() || '';
      text = text.trim();
      var href = a.attr('href') || '';
      href = href.trim();
      if (href === undefined || href === '') {
        // not a link: do nothing
        return;
      }
      // add .url class for URL links
      if (
        text !== '' &&
        text.match(/[a-z]+:\//i) &&
        (text === href ||
          text.match(/^[a-z]+:\//i) ||
          text === decodeURIComponent(href))
      ) {
        a.addClass('url');
      }
      // add index.html to end of link
      if (
        util.isLocalFile() &&
        !util.isExternalUrl(href) &&
        util.urlWithoutAnchor(href).match(/\/$/)
      ) {
        href = util.urlPlusIndexHtml(href);
        a.attr('href', href);
      }
      // open external links in a new window
      if (a.hasClass('external') || util.isExternalUrl(href)) {
        // add explanatory tooltip
        var host = URI(href)
          .host()
          .replace(/^www\./, '');
        if (!a.is('[title]')) {
          var str = 'Open ' + host + ' in a new window';
          a.attr('title', str.replace(/[ ]+/g, ' '));
        }
        // set target="_blank"
        a.attr('target', '_blank');
      }
      // add tooltip for mailto: links
      if (href.match(/^mailto:/i) && !a.is('[title]')) {
        var mail = href.replace(/^mailto:/i, '');
        a.attr('title', 'E-mail ' + mail);
        a.addClass('mail');
      }
    });
  });
};

utilJq.fixTables = function() {
  return this.each(function() {
    // add Bootstrap classes
    $(this)
      .find('table')
      .each(function() {
        var table = $(this);

        // add Bootstrap classes
        table.addClass('table table-striped table-bordered table-hover');
        // table.wrap('<div class="table-responsive"></div>')

        // remove empty table headers
        table
          .find('thead')
          .filter(function(i) {
            return (
              $(this)
                .text()
                .trim() === ''
            );
          })
          .remove();
      });
  });
};

utilJq.fixWidont = function() {
  return this.each(function() {
    $(this)
      .find('.widont')
      .replaceWith('&nbsp;');
  });
};

utilJq.removeAria = function() {
  return this.map(function() {
    return $(this)
      .clone()
      .removeAriaHidden();
  });
};

utilJq.removeAriaHidden = function() {
  return this.each(function() {
    $(this)
      .find('[aria-hidden="true"]')
      .remove();
  });
};

utilJq.addPunctuation = function() {
  return this.each(function() {
    $(this).traverseTextNodes(function(node) {
      // https://github.com/kellym/smartquotesjs
      node.nodeValue = node.nodeValue
        .replace(/([-([«\s]|^)"(\S)/g, '$1\u201c$2') // beginning "
        .replace(/"/g, '\u201d') // ending "
        .replace(/([^0-9])"/g, '$1\u201d') // remaining " at end of word
        .replace(/([0-9])('|\u2019)([0-9])/g, '$1\u2032$3') // prime
        .replace(/\b([0-9]+)(\s*)x(\s*)([0-9]+)\b/g, '$1$2\u00d7$3$4') // times
        // .replace(/([-([«\u201c\s]|^)('|\u2019)(\S)/g, '$1\u2018$3') // beginning '
        .replace(/([-([«\u201c\s]|^)(')(\S)/g, '$1\u2018$3') // beginning '
        .replace(/'/gi, '\u2019') // ending '
        .replace(/\u2019\u201d/gi, '\u2019\u00a0\u201d') // "'
        .replace(/\u201d\u2019/gi, '\u201d\u00a0\u2019')
        .replace(/\u201c\u2018/gi, '\u201c\u00a0\u2018') // '"
        .replace(/\u2018\u201c/gi, '\u2018\u00a0\u201c')
        // .replace(/((\u2018[^']*)|[a-z])'([^0-9]|$)/ig, '$1\u2019$3') // conjunction's possession
        // .replace(/(\u2018)([0-9]{2}[^\u2019]*)(\u2018([^0-9]|$)|$|\u2019[a-z])/ig, '\u2019$2$3') // abbrev. years like '93
        // .replace(/(\B|^)\u2018(?=([^\u2019]*\u2019\b)*([^\u2019\u2018]*\W[\u2019\u2018]\b|[^\u2019\u2018]*$))/ig, '$1\u2019') // backwards apostrophe
        .replace(/<-+>/g, '\u2194') // double arrow
        .replace(/<=+>/g, '\u21D4')
        .replace(/<-['\u2018\u2019]/g, '\u21A9') // left arrow with hook
        .replace(/['\u2018\u2019]->/g, '\u21AA') // right arrow with hook
        .replace(/-+>/g, '\u2192') // right arrow
        .replace(/=+>/g, '\u21D2')
        .replace(/<-+?/g, '\u2190') // left arrow
        .replace(/<=+/g, '\u21D0')
        .replace(/===/g, '\u2261')
        .replace(/---/g, '\u2014') // em-dashes
        // .replace(/([^\s]+)\u2014([^\s]+)/gi, '$1\u200a\u2014\u200a$2')
        // .replace(/\(/gi, '(\u200a')
        // .replace(/\)/gi, '\u200a)')
        // .replace(/\[/gi, '[\u200a')
        // .replace(/]/gi, '\u200a]')
        // .replace(/:/gi, '\u200a:')
        // .replace(/;/gi, '\u200a:')
        // .replace(/\?/gi, '\u200a?')
        // .replace(/!/gi, '\u200a!')
        // .replace(/\?!/gi, '\u203d') // interrobang
        .replace(/--/g, '\u2013') // en-dashes
        // .replace(/(\s)[-\u2013]([0-9])/g, '$1\u2212$2') // minus sign
        .replace(/([0-9])\u2013([0-9])/g, '$1\u2012$2') // figure dash
        .replace(/ - /g, ' \u2013 ')
        .replace(/ -$/gm, ' \u2013')
        .replace(/,-/g, ',\u2013')
        .replace(/\.\.\.\./g, '.\u2026') // ellipsis
        .replace(/\.\.\./g, '\u2026')
        .replace(/!=/g, '\u2260') // not equal
        .replace(/=</g, '\u2264') // less than or equal
        .replace(/>=/g, '\u2265') // more than or equal
        .replace(/'''/g, '\u2034') // triple prime
        .replace(/("|'')/g, '\u2033') // double prime
        .replace(/'/g, '\u2032') // prime
        .replace(/<3/g, '\u2764') // heart
        .replace(/!! :\)/g, '\u203c\u032e') // smiley
        .replace(/!!/g, '\u203c')
        .replace(/:-\)/g, '\u263a') // smiley
        .replace(/:-\(/g, '\u2639'); // frowning smiley
    });
  });
};

if ($ && $.fn) {
  $.fn.traverse = utilJq.traverse;
  $.fn.traverseNodes = utilJq.traverseNodes;
  $.fn.traverseTextNodes = utilJq.traverseTextNodes;
  $.fn.traverseTextNodesHTML = utilJq.traverseTextNodesHTML;
  $.fn.addClipboardButtons = utilJq.addClipboardButtons;
  $.fn.addAcronyms = utilJq.addAcronyms;
  $.fn.addFormulas = utilJq.addFormulas;
  $.fn.addHotkeys = utilJq.addHotkeys;
  $.fn.addPullQuotes = utilJq.addPullQuotes;
  $.fn.addSmallCaps = utilJq.addSmallCaps;
  $.fn.addTeXLogos = utilJq.addTeXLogos;
  $.fn.relativizeUrls = utilJq.relativizeUrls;
  $.fn.addBootstrapDivs = utilJq.addBootstrapDivs;
  $.fn.fixBlockquotes = utilJq.fixBlockquotes;
  $.fn.fixCenteredText = utilJq.fixCenteredText;
  $.fn.fixMarks = utilJq.fixMarks;
  $.fn.fixLinks = utilJq.fixLinks;
  $.fn.fixTables = utilJq.fixTables;
  $.fn.fixWidont = utilJq.fixWidont;
  $.fn.removeAria = utilJq.removeAria;
  $.fn.removeAriaHidden = utilJq.removeAriaHidden;
  $.fn.addPunctuation = utilJq.addPunctuation;
}

export default utilJq;
