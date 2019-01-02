import $ from 'jquery';
import _ from 'lodash';
import stringSimilarity from 'string-similarity';
import URI from 'urijs';
import page from './page';
import sort from './sort';
import references from '../json/references.json';

function Reference(label, href, title, hidden) {
  this.label = label;
  this.href = href;
  this.title = title;
  if (hidden) {
    this.hidden = hidden;
  }
}

Reference.addReferenceToDictionary = function(ref, dict, force) {
  const newDict = dict;
  const label = Reference.normalizeLabel(ref.label);
  if (!newDict[label] || force) {
    const newRef = Reference.makeUnlabeledReference(ref);
    newDict[label] = newRef;
  }
  return newDict;
};

Reference.arrayToDictionary = function(arr) {
  const dict = {};
  arr.forEach(function(ref) {
    Reference.addReferenceToDictionary(ref, dict);
  });
  return dict;
};

Reference.extractReferencesFromMarkdown = function(md) {
  let dict = {};
  dict = Reference.extractReferenceDefinitionsFromMarkdown(md, dict);
  dict = Reference.extractReferenceAnchorsFromMarkdown(md, dict);
  return dict;
};

Reference.removeUnsafeReferences = function(refs) {
  const safeRefs = refs;
  // '[x]' confuses markdown-it-task-checkbox
  delete safeRefs.X;
  // '[...]' is reserved for collapse.js
  delete safeRefs['...'];
  delete safeRefs['\u2026'];
  return safeRefs;
};

Reference.extractReferenceDefinitionsFromMarkdown = function(md, dict) {
  let newDict = dict || {};
  const lines = md.trim().split(/\r?\n/);
  lines.forEach(function(line) {
    const match = line.match(/^\[([^\]]+)]: (.*?)( "(.*)")?$/i);
    const isFootnote = match && match[1].match(/^\^/);
    if (match && !isFootnote) {
      const ref = new Reference(match[1], match[2], match[4]);
      newDict = Reference.addReferenceToDictionary(ref, newDict);
    }
  });
  return newDict;
};

Reference.extractReferenceAnchorsFromMarkdown = function(md, dict) {
  let newDict = dict || {};
  const mdStr = md.trim();
  const regexp = /\[(([^#\]]+)(#[^#\]]+))]/gi;
  let matches;
  while ((matches = regexp.exec(mdStr)) !== null) {
    const label = matches[1];
    const title = matches[2];
    const anchor = matches[3];
    let ref = Reference.getReference(title);
    if (ref) {
      const href =
        URI(ref.href)
          .fragment('')
          .toString() + anchor;
      ref = new Reference(label, href, ref.title);
      newDict = Reference.addReferenceToDictionary(ref, newDict);
    }
  }
  return newDict;
};

Reference.forEach = function(dict, fn) {
  const refs = dict || {};
  Object.keys(refs).forEach(function(label) {
    fn(Reference.makeLabeledReference(label, refs[label]));
  });
};

Reference.getReference = function(obj, dict) {
  const refs = dict || references;
  if (typeof obj === 'string') {
    return Reference.getReferenceByLabel(obj, refs);
  }
  return Reference.getReferenceByPredicate(obj, refs);
};

Reference.getReferenceByHref = function(href, dict) {
  const refs = dict || references;
  return Reference.getReferenceByPredicate(function(ref) {
    return ref.href === href;
  }, refs);
};

Reference.getReferenceByLabel = function(label, dict) {
  const refs = dict || references;
  const normLabel = Reference.normalizeLabel(label);
  if (!refs[normLabel]) {
    return null;
  }
  return Reference.makeLabeledReference(normLabel, refs[normLabel]);
};

Reference.getReferenceByPredicate = function(pred, dict) {
  const refs = dict || references;
  const labels = Object.keys(refs);
  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const ref = Reference.makeLabeledReference(label, refs[label]);
    if (pred(ref)) {
      return ref;
    }
  }
  return null;
};

Reference.getReferencesByPredicate = function(pred, dict) {
  const refs = dict || references;
  const arr = [];
  Object.keys(refs).forEach(function(label) {
    const ref = Reference.makeLabeledReference(label, refs[label]);
    if (pred(ref)) {
      arr.push(ref);
    }
  });
  return arr;
};

Reference.getReferences = function() {
  return references;
};

Reference.dictionaryToArray = function(dict) {
  const refs = dict || references;
  const arr = [];
  Reference.forEach(refs, function(ref) {
    arr.push(ref);
  });
  return arr;
};

Reference.makeReference = function(label, href, title) {
  return new Reference(label, href, title);
};

Reference.makeLabeledReference = function(label, ref) {
  const labeledRef = Object.assign({}, ref);
  labeledRef.label = label;
  return labeledRef;
};

Reference.makeUnlabeledReference = function(ref) {
  const unlabeledRef = Object.assign({}, ref);
  delete unlabeledRef.label;
  return unlabeledRef;
};

Reference.normalizeLabel = function(label) {
  return label
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
};

Reference.sortDictionary = function(dict) {
  let arr = Reference.dictionaryToArray(dict);
  arr = arr.sort(function(ref1, ref2) {
    if (ref1.label < ref2.label) {
      return -1;
    }
    return ref1.label > ref2.label ? 1 : 0;
  });
  return Reference.arrayToDictionary(arr);
};

Reference.search = function(str) {
  const searchStr = str.toUpperCase();
  if (searchStr === '') {
    return [];
  }
  let arr = Reference.dictionaryToArray();
  const isExplicit = searchStr.match(/!/);
  if (!isExplicit) {
    arr = arr.filter(function(x) {
      return x.hidden !== true;
    });
  }
  sort(
    arr,
    sort.descending(function(x) {
      const label = x.label.toUpperCase();
      return stringSimilarity.compareTwoStrings(label, searchStr);
    })
  );
  arr = _.uniqBy(arr, function(x) {
    // return x.href
    return URI(x.href)
      .fragment('')
      .toString();
  });
  arr = _.take(arr, 5);
  // sort(arr, sort.descending(function (x) {
  //   let title = x.title || x.label
  //   title = title.toUpperCase()
  //   return stringSimilarity.compareTwoStrings(title, searchStr)
  // }))
  return arr;
};

Reference.searchHandler = function(e) {
  const form = $(this);
  const input = form.find('input');
  let str = input.val();
  str = str.replace(/\s+/gi, ' ').trim();
  const matches = Reference.search(str);
  Reference.updateSearchMatches(matches);
  return false;
};

Reference.renderSearchMatches = function(matches) {
  if (matches.length === 0) {
    return '';
  }
  let counter = 1;
  return (
    '<ol>' +
    matches
      .map(function(match) {
        // if only we had some template syntax like JSX
        // to make this simpler
        const li = $('<li>');
        const a = $('<a>');
        a.attr('accesskey', counter++);
        a.attr('href', match.href);
        a.text(match.title || _.capitalize(match.label));
        li.append(a);
        return li.prop('outerHTML');
      })
      .join('') +
    '</ol>'
  );
};

Reference.updateSearchMatches = function(matches) {
  const html = Reference.renderSearchMatches(matches);
  const div = Reference.findSearchMatchesContainer();
  div.html(html);
  div.relativizeUrls(page.path());
  div.find('a').focus(function() {
    setTimeout(function() {
      Reference.hideSearchMatches();
    }, 500);
  });
  div.fixLinks();
};

Reference.hideSearchMatches = function() {
  Reference.updateSearchMatches([]);
  $('nav form input').val('');
};

Reference.findSearchMatchesContainer = function() {
  let div = $('nav .search').first();
  if (div.length === 0) {
    div = $('<div class="search container-fluid"></div>');
    const container = $('nav .container-fluid').first();
    container.after(div);
  }
  return div;
};

// Reference.breadcrumbs = function (path) {
//   let newPathSegments = []
//   let breadcrumbPaths = []
//   path = path.replace(/^\//, '')
//              .replace(/\/$/, '')
//   let pathSegments = path.split('/')
//   pathSegments.pop()
//   while (pathSegments) { // eslint-disable-line
//     let newSegment = pathSegments.shift()
//     newPathSegments.push(newSegment)
//     let breadcrumbPath = '/' + newSegment.join('/') + '/'
//     breadcrumbPaths.push(breadcrumbPath)
//   }
//   return breadcrumbPaths
// }

// Reference.breadcrumbs2 = function (path) {
//   let breadcrumbPaths = []
//   let matches = []
//   let regexp = /^(.*\/)([/]*\/)$/
//   while ((matches = path.match(regexp))) {
//     path = matches[1]
//     breadcrumbPaths.unshift(path)
//   }
//   return breadcrumbPaths
// }

// better approach: get all references first,
// THEN render
//
// alternate approach: getReferencesByHref(... regexp ...)

Reference.breadcrumbRefs = function(path) {
  const refs = Reference.getReferencesByPredicate(function(ref) {
    return path !== ref.href && path.startsWith(ref.href);
  });
  sort(
    refs,
    sort.ascending(function(ref) {
      return ref.href;
    })
  );
  return refs;
};

Reference.subPageRefs = function(path) {
  const refs = Reference.getReferencesByPredicate(function(ref) {
    return path !== ref.href && ref.href.startsWith(path);
  });
  sort(
    refs,
    sort.ascending(function(ref) {
      return ref.href;
    })
  );
  return refs;
};

// move this into the page template as a Handlebars helper?
Reference.renderBreadcrumbs = function(path) {
  const breadcrumbRefs = Reference.breadcrumbRefs(path);
  return Reference.renderLinkList(breadcrumbRefs);
};

Reference.renderSubPages = function(path) {
  const subPageRefs = Reference.subPageRefs(path);
  return Reference.renderLinkList(subPageRefs);
};

Reference.renderLinkList = function(refs, ordered) {
  const lis = refs
    .map(function(ref) {
      const li = $('<li>');
      const a = $('<a>');
      a.attr('href', ref.href);
      a.text(ref.title);
      li.append(a);
      return li.prop('outerHTML');
    })
    .join('');
  return ordered ? '<ol>' + lis + '</ol>' : '<ul>' + lis + '</ul>';
};

export default Reference;
