// Semantic sections
//
// Inspired by Pandoc's --section-divs option:
// http://pandoc.org/MANUAL.html#extension-auto_identifiers

import $ from 'jquery';
import util from './util';

const section = {};

section.addSections = function() {
  return this.each(function() {
    const body = $(this);
    // process innermost sections first
    $.each(['h6', 'h5', 'h4', 'h3', 'h2', 'h1'], function(i, el) {
      body.find(el).each(function() {
        const header = $(this);
        // h1 ends at next h1, h2 ends at next h1 or h2,
        // h3 ends at next h1, h2 or h3, and so on
        const stop = [];
        const idx = parseInt(header.prop('tagName').match(/\d+/)[0], 10);
        for (let j = 1; j <= idx; j++) {
          stop.push('h' + j);
        }
        const end = stop.join(', ');
        let sec = header.nextUntil(end).addBack();
        if (sec.length > 1) {
          sec = sec.wrapAll('<section>').parent();
          let id = header.attr('id');
          if (id === undefined || id === '') {
            id = util.generateUniqueId(header);
            header.attr('id', id);
          }
          sec.attr('id', id);
          header.removeAttr('id');
        }
      });
    });
    // add missing sections
    const sections = body.find('section');
    if (sections.length <= 0) {
      body.wrapInner('<section>');
    } else {
      sections.each(function(i, el) {
        const sec = $(this);
        let prevSection = sec.prevUntil('header, h1, h2, h3, h4, h5, h6, section');
        if (prevSection.length > 0) {
          // prevUntil() returns elements in reverse order
          prevSection = prevSection
            .last()
            .nextUntil(sec)
            .addBack();
          prevSection.wrapAll('<section>');
        }
      });
    }
  });
};

if ($ && $.fn) {
  $.fn.addSections = section.addSections;
}

export default section;
