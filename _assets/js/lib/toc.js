import $ from 'jquery';
import util from './util';

const toc = {};

toc.addTableOfContents = function() {
  return this.map(function() {
    const body = $(this);
    const placeholder = body.find('#toc-placeholder');
    const tocEl = body.tableOfContents();
    if (tocEl !== '') {
      placeholder.replaceWith(tocEl);
    }
    return body;
  });
};

toc.tableOfContents = function(title) {
  const body = $(this);
  const lst = body.listOfContents();

  if (lst === '') {
    return '';
  }

  const tocEl = $('<div id="toc" class="collapse">' + lst + '</div>');
  tocEl.find('li ul').each(function(i, el) {
    const ul = $(this);
    const a = ul.prev();
    const id = util.generateUniqueId(a);
    const span = a.wrap('<span class="collapse" id="' + id + '">').parent();
    $.fn.addCollapsibleSections.addButton(span, ul);
  });

  return tocEl.prop('outerHTML');
};

toc.listOfContents = function() {
  const body = $(this);
  let currentLevel = 0;
  let str = '';
  const stack = [];

  const currentElement = function() {
    const i = stack.length - 1;
    if (i < 0) {
      return '';
    }
    return stack[i];
  };

  const openTag = function(el, tag) {
    stack.push(el);
    str += tag;
  };

  const openElement = function(el) {
    const tag = '<' + el + '>';
    openTag(el, tag);
  };

  const closeElement = function() {
    const el = stack.pop();
    const tag = '</' + el + '>';
    str += tag;
    return el;
  };

  const openListElement = function() {
    closeListElement(); // don't allow li elements to nest
    openElement('li');
  };

  const closeListElement = function() {
    if (currentElement() === 'li') {
      closeElement();
    }
  };

  const addLink = function(id, html) {
    const a = $('<a href="#' + id + '"></a>');
    a.html(html);
    a.find('a').replaceWith(function() {
      return $(this).html();
    });
    a.html(a.html().trim());
    str += a.prop('outerHTML');
  };

  const startList = function(level) {
    while (currentLevel < level) {
      if (currentElement() === 'ul') {
        openListElement();
      }
      openElement('ul');
      currentLevel++;
    }
  };

  const endList = function(level) {
    while (currentLevel > level) {
      const el = closeElement();
      if (el === 'ul') {
        currentLevel--;
      }
    }
  };

  // generate ID if missing
  const headerId = function(header) {
    let id = header.attr('id');

    if (id === undefined || id === '') {
      const section = header.parent();
      if (section.prop('tagName') === 'SECTION') {
        id = section.attr('id');
      }
    }

    if (id === undefined || id === '') {
      const clone = header.clone();
      clone.find('[aria-hidden="true"]').remove();
      id = util.generateUniqueId(header);
      header.attr('id', id);
    }
    return id;
  };

  let headers = body.find('h1, h2, h3, h4, h5, h6');

  if (headers.length === 0) {
    return '';
  }

  const exclude = '.title'; // should be parametrized
  headers = headers.filter(function() {
    return !$(this).is(exclude);
  });
  headers.each(function(i, el) {
    const header = $(this);
    const id = headerId(header);
    const html = header.html();
    const level = parseInt(header.prop('tagName').match(/\d+/)[0], 10);
    endList(level);
    startList(level);
    openListElement();
    addLink(id, html);
  });

  // close all tags
  endList(0);

  // remove superfluous ul elements
  while (str.match(/^<ul><li><ul><li>/) && str.match(/<\/li><\/ul><\/li><\/ul>$/)) {
    str = str.substring(8, str.length - 10);
  }

  return str;
};

if ($ && $.fn) {
  $.fn.addTableOfContents = toc.addTableOfContents;
  $.fn.tableOfContents = toc.tableOfContents;
  $.fn.listOfContents = toc.listOfContents;
}

export default toc;
