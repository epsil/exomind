/* global jQuery:true */
/* exported jQuery */

/**
 * Collapsible headers, based on Bootstrap's collapse plugin.
 *
 * Invoke with: $('body').addCollapsibleSections()
 *
 * TODO:
 *
 * - Require bootstrap as a dependency: require('bootstrap').
 * - Divide code into HTML pass and JavaScript pass:
 *   HTML pass should add Bootstrap attributes to headers,
 *   JavaScript pass should add click handlers.
 *   (perhaps JS could be replaced with CSS' :before/:after?).
 * - Should the JavaScript pass be performed automatically?
 *   I.e., $(function () { ... }). Or will this cause problems
 *   if the code is used as a Node plugin?
 * - Does the code style of Bootstrap's plugin provide any clues
 *   with regard to best practice?
 * - Add code for collapsible lists.
 * - Make links to collapsed elements auto-expand them
 * - Option like Pandoc's --section-divs
 *   (or does this belong in a plugin of its own?)
 */

import $ from 'jquery';
import S from 'string';

// let jQuery = $; // needed for Bootstrap

import 'bootstrap';

const collapse = {};

/**
 * Return unique value
 */
collapse.unique = function(fn) {
  const results = [];
  return function(arg) {
    let result = fn(arg);
    let containsResult = results.indexOf(result.valueOf()) >= 0;
    if (containsResult) {
      let i = 1;
      let newResult = '';
      do {
        i++;
        newResult = result + '-' + i;
        containsResult = results.indexOf(newResult.valueOf()) >= 0;
      } while (containsResult);
      result = newResult;
    }
    results.push(result.valueOf());
    return result;
  };
};

/**
 * Generate element ID
 */
collapse.generateId = function(el, prefix) {
  return (prefix || '') + S(el.text().trim()).slugify();
};

/**
 * Generate unique element ID
 */
collapse.generateUniqueId = collapse.unique(collapse.generateId);

collapse.collapseDoneItems = function() {
  return this.each(function() {
    const body = $(this);
    body.find('s + ul.collapse.in, s + ol.collapse.in').each(function() {
      const ul = $(this);
      const button = ul.prevAll('.collapse-button').first();
      ul.removeClass('in');
      button.attr('aria-expanded', 'false');
    });
  });
};

/**
 * Add collapsible sections, lists and click handlers
 */
collapse.addCollapsibility = function() {
  return this.each(function() {
    const body = $(this);
    body.addCollapsibleElements();
    body.addCollapsibleHandlers();
  });
};

/**
 * Add collapsible sections and lists
 */
collapse.addCollapsibleElements = function() {
  return this.each(function() {
    const body = $(this);
    body.addCollapsibleSections();
    body.addCollapsibleLists();
  });
};

/**
 * Add collapsible click handlers
 */
collapse.addCollapsibleHandlers = function() {
  return this.each(function() {
    const body = $(this);
    body.find('.collapse-button').click(function() {
      const button = $(this);
      const id = button.attr('aria-controls');
      const path = window.location.href.replace(/#[^#]*$/i, '');
      const url = path + '#' + id;
      const expanded = button.attr('aria-expanded') === 'true' ? 'false' : 'true';
      if (typeof Storage !== 'undefined') {
        window.localStorage.setItem(url, expanded);
        window.sessionStorage.setItem(url, expanded);
      }
    });
    body.find('.collapse-ellipsis').click(function() {
      const ellipsis = $(this);
      const button = ellipsis
        .prevAll()
        .filter('.collapse-button')
        .first();
      if (button.length) {
        button.click();
      }
      return false;
    });
  });
};

collapse.addLinkHandlers = function() {
  return this.each(function() {
    const body = $(this);
    body
      .find('a[href^="#"]')
      .filter(function() {
        return $(this).attr('aria-hidden') !== 'true';
      })
      .each(function() {
        try {
          const link = $(this);
          const href = link.attr('href').replace(':', '\\:');
          const target = $(href).first();

          if (target.length <= 0) {
            return;
          }

          link.click(function(event) {
            collapse.unhideElement(target);
          });
        } catch (err) {
          // swallow errors
        }
      });
  });
};

/**
 * Add collapsible lists
 */
collapse.addCollapsibleLists = function() {
  return this.each(function() {
    const body = $(this);
    body.find('ul > li').addCollapsibleListItem();
  });
};

/**
 * Add collapsible list item
 */
collapse.addCollapsibleListItem = function() {
  return this.each(function() {
    const li = $(this);
    const ul = li.find('> ol, > ul').first();
    if (ul.length > 0) {
      const prev = li.clone();
      prev.find('ol, ul').remove();
      let listId = li.attr('id');
      if (!listId) {
        listId = collapse.generateUniqueId(prev);
        li.attr('id', listId + '-item');
      }
      if (
        prev
          .text()
          .trim()
          .match(/\[(\.\.\.|\u2026)\]$/)
      ) {
        li.addClass('collapse');
        let text = ul[0].previousSibling.nodeValue;
        text = text.replace(/\s*\[(\.\.\.|\u2026)\]\s*$/, '');
        ul[0].previousSibling.nodeValue = text;
      }
      collapse.addButton(li, ul, true, listId + '-list');
      li.append('<a aria-hidden="true" class="collapse-ellipsis" href="#"></a>');
    } else {
      let id = li.attr('id');
      if (!id) {
        id = collapse.generateUniqueId(li);
        li.attr('id', id + '-item');
      }
      // let span = li.wrapInner('<span>').children().first()
      const span = $('<span>');
      li.append(span);
      collapse.addButton(li, span, true);
      li.append(' <a aria-hidden="true" class="collapse-ellipsis" href="#"></a>');
    }
    const list = li.parent();
    if (!list.hasClass('collapse')) {
      list.addClass('collapse in');
    }
  });
};

/**
 * Add collapsible sections
 */
collapse.addCollapsibleSections = function(options) {
  const opts = $.extend({}, collapse.defaults, options);
  return this.each(function() {
    const body = $(this);
    // process innermost sections first
    $.each(['h6', 'h5', 'h4', 'h3', 'h2', 'h1'], function(i, el) {
      body.find(el).each(function() {
        // add section
        const header = $(this);
        const section = collapse.addSection(header);

        // skip top-level headers
        if ($.inArray(el, opts.include) < 0) {
          return;
        }

        // add button to header
        collapse.addButton(header, section);
        // add ellipsis to header
        header.append('<a aria-hidden="true" class="collapse-ellipsis" href="#"></a>');
      });
    });
  });
};

/**
 * Add collapsible content for header
 */
collapse.addSection = function(header) {
  // h1 ends at next h1, h2 ends at next h1 or h2,
  // h3 ends at next h1, h2 or h3, and so on
  const stop = [];
  const i = parseInt(header.prop('tagName').match(/\d+/)[0], 10);

  for (let j = 1; j <= i; j++) {
    stop.push('h' + j);
  }
  const end = stop.join(', ');
  let section = header.nextUntil(end);
  if (!section.length) {
    section = $('<div>').insertAfter(header);
  } else {
    section = section.wrapAll('<div>').parent();
  }
  collapse.sectionId(header, section);
  return section;
};

/**
 * Add button to header
 */
collapse.addButton = function(header, section, prepend, sectionId) {
  // add button
  let id = sectionId;
  if (id) {
    section.attr('id', id);
  } else {
    id = collapse.sectionId(header, section);
  }
  let button = collapse.button(id);
  if (prepend) {
    header.prepend(button);
  } else {
    header.append(button);
  }

  // add Bootstrap classes
  section.addClass('collapse in');

  // allow pre-collapsed sections
  const path = window.location.href.replace(/#[^#]*$/i, '');
  const url = path + '#' + id;

  if (
    header
      .text()
      .trim()
      .match(/\[(\.\.\.|\u2026)\]$/)
  ) {
    header.addClass('collapse');
    let html = header.html();
    html = html.replace(/\s*(&nbsp;)*\[(\.\.\.|\u2026)\]\s*/g, '');
    header.html(html);
    button = header.find('.collapse-button');
  }
  if (header.hasClass('collapse') || (typeof Storage !== 'undefined' && window.localStorage.getItem(url) === 'false')) {
    header.removeClass('collapse').addClass('collapsed');
  }
  if (header.hasClass('collapsed')) {
    header.removeClass('collapsed');
    if (typeof Storage !== 'undefined' && window.sessionStorage.getItem(url) !== 'true') {
      section.removeClass('in');
      button.attr('aria-expanded', 'false');
    }
  }
};

/**
 * Button
 */
collapse.button = function(id) {
  return $(
    '<a aria-hidden="true" aria-expanded="true" role="button" class="collapse-button" data-toggle="collapse" href="#' +
      id +
      '" aria-controls="' +
      id +
      '"></a>'
  );
};

/**
 * Header ID (add if missing)
 */
collapse.headerId = function(header) {
  let id = header.attr('id');
  if (id === undefined || id === '') {
    id = collapse.generateUniqueId(header);
    header.attr('id', id);
  }
  return id;
};

/**
 * Section ID (based on header ID)
 */
collapse.sectionId = function(header, section) {
  let id = section.attr('id');
  if (id === undefined || id === '') {
    const headerId = collapse.headerId(header);
    id = headerId ? headerId + '-section' : '';
    section.attr('id', id);
  }
  return id;
};

collapse.unhideSection = function(section) {
  if (section.prop('tagName') === 'SECTION') {
    const button = section.find('.collapse-button').first();
    const id = button.attr('href');
    const div = section.find(id).first();
    const path = window.location.href.replace(/#[^#]*$/i, '');
    const url = path + id;
    if (div.hasClass('collapse') && !div.hasClass('in')) {
      button.attr('aria-expanded', 'true');
      div.addClass('in');
      div.css({ height: '' });
      div.attr('aria-expanded', 'true');
      if (typeof Storage !== 'undefined') {
        window.localStorage.setItem(url, true);
        window.sessionStorage.setItem(url, true);
      }
    }
  }
};

collapse.unhideElement = function(el) {
  collapse.unhideSection(el);
  el.parents().each(function(index, value) {
    collapse.unhideSection($(this));
  });
};

/**
 * Default options
 */
collapse.defaults = {
  include: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
};

if ($ && $.fn) {
  $.fn.collapseDoneItems = collapse.collapseDoneItems;
  $.fn.addCollapsibility = collapse.addCollapsibility;
  $.fn.addCollapsibleElements = collapse.addCollapsibleElements;
  $.fn.addCollapsibleSections = collapse.addCollapsibleSections;
  $.fn.addCollapsibleLists = collapse.addCollapsibleLists;
  $.fn.addCollapsibleListItem = collapse.addCollapsibleListItem;
  $.fn.addCollapsibleHandlers = collapse.addCollapsibleHandlers;
  $.fn.addLinkHandlers = collapse.addLinkHandlers;
  $.fn.addCollapsibleSections.addSection = collapse.addSection;
  $.fn.addCollapsibleSections.addButton = collapse.addButton;
  $.fn.addCollapsibleSections.button = collapse.button;
  $.fn.addCollapsibleSections.headerId = collapse.headerId;
  $.fn.addCollapsibleSections.sectionId = collapse.sectionId;
  $.fn.addCollapsibleSections.defaults = collapse.defaults;
}

export default collapse;
