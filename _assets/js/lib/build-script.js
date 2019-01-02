/* global document:true, window:true */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import tidy from 'tidy-html5';
import glob from 'glob';
import _ from 'lodash';
import compile from './compile';
import markdown from './markdown';
import Reference from './reference';
import util from './util';
import settings from '../json/settings.json';

// simple filename -> URL mapping
function location(file) {
  let addr = file.substr(0, file.length - path.basename(file).length);
  addr = addr.replace(/\\/g, '/');
  addr = '/' + addr;
  return addr.trim();
}

function url(file) {
  let addr = location(file);
  addr = addr.replace(/^\//g, '');
  addr = settings.url + addr;
  return addr;
}

function htmlfile(textfile) {
  const file = textfile.replace(/\.asc$/i, '');
  return file.substr(0, file.length - path.extname(file).length) + '.html';
}

function format(html) {
  if (!tidy || !tidy.tidy_html5) {
    return html;
  }

  let newHtml = tidy.tidy_html5(html, {
    'drop-empty-elements': false,
    indent: false,
    'indent-attributes': false,
    'input-encoding': 'utf8',
    'numeric-entities': true,
    'new-inline-tags':
      'math ' +
      'annotation ' +
      'merror ' +
      'mfrac ' +
      'mi ' +
      'mn ' +
      'mo ' +
      'mover ' +
      'mphantom ' +
      'mrow ' +
      'mspace ' +
      'msqrt ' +
      'mstyle ' +
      'msub ' +
      'msubsup ' +
      'msup ' +
      'mtable ' +
      'mtd ' +
      'mtext ' +
      'mtr ' +
      'munder ' +
      'semantics',
    'output-encoding': 'ascii',
    quiet: true,
    'show-info': false,
    'show-warnings': false,
    'sort-attributes': 'alpha',
    'tidy-mark': false,
    'vertical-space': true,
    wrap: 0
  });

  // Since UTF-8 is a superset of raw ASCII, we can substitute 'utf-8'
  // for 'us-ascii' as the declared character encoding (a useful
  // safeguard if any non-ASCII characters should somehow make their
  // way into the page). In general, though, we try to keep things as
  // plain as possible by returning raw ASCII in the range 0-127 and
  // using numeric character references for the rest.
  newHtml = newHtml
    .replace(/\n<\/code>\n<\/pre>/g, '</code>\n</pre>')
    .replace(
      '<meta content="text/html; charset=us-ascii" http-equiv="Content-Type">',
      '<meta content="text/html; charset=utf-8" http-equiv="Content-Type">'
    );

  return newHtml;
}

function template(view) {
  return `<!DOCTYPE html>
<html>
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type">
${view.referrer ? `<meta content="${view.referrer}" name="referrer">` : '<meta content="no-referrer" name="referrer">'}
${view.noindex ? '<meta content="noindex" name="robots">' : ''}
<meta content="text/css" http-equiv="Content-Style-Type">
<meta content="width=device-width, initial-scale=1" name="viewport">
<link href="${util.urlRelative(view.path, '/favicon.ico')}" rel="icon" type="image/x-icon">
<link href="${util.urlRelative(view.path, '/_assets/css/wiki.css')}" rel="stylesheet">
<script src="${util.urlRelative(view.path, '/_assets/js/wiki.js')}"></script>
</head>
<body>
</body>
</html>`;
}

function convert(input, output) {
  return new Promise(function(resolve, reject) {
    fs.readFile(input, function(readErr, data) {
      if (readErr) {
        reject(readErr);
      } else {
        // if (settings.compile) {
        //   data = data ? data.toString() : '';
        // } else {
        //   data = '';
        // }
        const view = _.assign({}, settings, {
          content: '',
          path: location(input)
        });
        let html = template(view);
        if (settings.tidy) {
          html = format(html);
        }
        fs.writeFile(output, html, function(writeErr) {
          if (writeErr) {
            reject(writeErr);
          } else {
            console.log('Converted ' + input + ' to ' + output);
            resolve(html);
          }
        });
      }
    });
  });
}

function metadata(file) {
  // console.log('Reading metadata of ' + file)
  let str =
    fs
      .readFileSync(file)
      .toString()
      .trim() + '\n';
  const isYaml = file.match(/.ya?ml$/gi);
  const isIndex = file.match(/.?index(\.md|\.yml)$/i);
  if (isYaml && !str.match(/^---/)) {
    str = '---\n' + str + '\n---';
  }
  if (!str.match(/^---/) && str.match(/^([\s\S]*)[\r\n]+---/)) {
    str = '---\n' + str;
  }
  let view = {};
  try {
    view = matter(str);
  } catch (err) {
    return {};
  }
  if (typeof view.data === 'string') {
    return {};
  }
  const data = view.data;
  data.title = data.title || '';
  if (data.path) {
    // do nothing
  } else if (isYaml && !isIndex && !data.file && data.url) {
    data.path = data.url;
  } else if (data.file) {
    data.path = location(file) + encodeURIComponent(data.file);
  } else if (isIndex) {
    // FIXME: use settings.index
    data.path = location(file);
  } else {
    data.path = '/' + file.replace(/\.yml$/i, '');
  }
  return data;
}

function convertFile(file) {
  return convert(file, htmlfile(file));
}

function makeReferences(files) {
  const meta = files.map(metadata).filter(function(entry) {
    return entry && entry.path && entry.title;
  });
  let refs = meta.map(referencesEntries);
  refs = [].concat.apply([], refs); // flatten
  refs = addPathReferences(refs);
  refs = Reference.arrayToDictionary(refs);
  refs = Reference.sortDictionary(refs);
  const json = util.JSONStringify(refs, null, 2, true);
  return json.trim() + '\n';
}

function addPathReferences(refs) {
  let pathRefs = refs.filter(function(ref) {
    return ref.href.match(/\/$/) && !ref.href.match(/^https?:/i);
  });
  pathRefs = pathRefs.map(function(ref) {
    return new Reference(referencePathName(ref.href), ref.href, ref.title, ref.hidden);
  });
  const newRefs = refs.concat(pathRefs);
  return newRefs;
}

function referencesEntries(entry) {
  const entryPath = entry.path;
  const title = entry.title;
  let summary = entry.title || entry.summary || entry.subtitle || entry.abstract;
  // summary = '';
  if (summary) {
    // const render = true;
    const render = false;
    summary = getSummary(entryPath, title, summary, render);
  }
  const ref = new Reference(title, entryPath, summary, entry.hidden);
  const aliases = referencesAliasEntries(entry, summary);
  const files = referencesFileEntries(entry, summary);
  const bookmarks = referencesBookmarkEntries(entry);
  const refs = [ref]
    .concat(aliases)
    .concat(files)
    .concat(bookmarks);
  console.log('Indexed ' + entry.path);
  return refs;
}

function getSummary(entryPath, title, summary, forceRender) {
  return (!forceRender && getCachedSummary(title, entryPath)) || renderSummary(summary);
}

function renderSummary(summary) {
  return summary ? markdown.toText(summary) : '';
}

// FIXME: is caching still necessary now that the code is optimized?
function getCachedSummary(label, href) {
  const normLabel = Reference.normalizeLabel(label);
  const ref = Reference.getReference(function(r) {
    return r.label === normLabel && r.href === href;
  });
  return (ref && ref.title) || '';
}

function referencesBookmarkEntries(entry) {
  const fixedEntry = entry;
  const refs = [];
  if (fixedEntry.references) {
    if (!Array.isArray(fixedEntry.references)) {
      const refsArray = [];
      Object.keys(fixedEntry.references).forEach(function(title) {
        const refUrl = fixedEntry.references[title];
        const ref = {
          title: title,
          url: refUrl
        };
        refsArray.push(ref);
      });
      fixedEntry.references = refsArray;
    }
    fixedEntry.references.forEach(function(r) {
      const label = r.title;
      const href = util.urlResolve(fixedEntry.path, r.url);
      // let title = fixedEntry.title || r.title
      const title = util.isExternalUrl(r.url) ? r.title || fixedEntry.title : fixedEntry.title || r.title;
      const ref = new Reference(label, href, title, fixedEntry.hidden);
      refs.push(ref);
    });
  }
  return refs;
}

function referencesFileEntries(entry, summary) {
  const refSummary = summary || entry.summary;
  const files = [];

  if (entry.file) {
    const fileName = path.basename(entry.file);
    const withoutExt = fileNameWithoutExtension(fileName);
    const withoutDashes = fileNameWithoutDashes(withoutExt);

    files.push(new Reference(fileName, entry.path, refSummary, entry.hidden));
    files.push(new Reference(withoutExt, entry.path, refSummary, entry.hidden));
    files.push(new Reference(withoutDashes, entry.path, refSummary, entry.hidden));
  }

  return files;
}

function referencePathName(pathStr) {
  const defaultSegment = 'Index';
  const pathSegments = pathStr.split('/');
  if (!pathSegments) {
    return defaultSegment;
  }
  if (pathStr.match(/\/$/)) {
    pathSegments.pop();
  }
  if (!pathSegments) {
    return defaultSegment;
  }
  let lastSegment = pathSegments[pathSegments.length - 1];
  lastSegment = lastSegment || defaultSegment;
  lastSegment = _.capitalize(lastSegment);
  return lastSegment;
}

function fileNameWithoutExtension(file) {
  return path.basename(file, path.extname(file));
}

function fileNameWithoutDashes(file) {
  return file.replace(/[-_]+/g, ' ');
}

function writeReferences(files) {
  return new Promise(function(resolve, reject) {
    const refs = makeReferences(files);
    fs.writeFile('_assets/js/json/references.json', refs, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(refs);
      }
    });
  });
}

function forEachPromise(arr, fn) {
  const result = [];
  let ready = Promise.resolve(null);
  arr.forEach(function(entry) {
    ready = ready
      .then(function() {
        return fn(entry);
      })
      .then(function(value) {
        result.push(value);
      })
      .catch(function() {});
  });
  return ready.then(function() {
    return result;
  });
}

function buildPromise(files) {
  return forEachPromise(files, convertFile);
}

function referencesPromise(files) {
  return new Promise(function(resolve, reject) {
    const meta = glob.sync('**/*.yml', { dot: true, ignore: 'node_modules/**' }).sort();
    const allFiles = files.concat(meta);
    writeReferences(allFiles);
  });
}

function referencesAliasEntries(entry, summary) {
  const refSummary = summary || entry.summary;
  const aliases = [];
  const punctuationRegexp = /[\s*[!?.;:]+$/i;
  const endsWithPunctuation = entry.title.match(punctuationRegexp);
  // if (endsWithPunctuation) {
  //   let simpleTitle = entry.title.replace(punctuationRegexp, '')
  //   let simpleRef = new Reference(simpleTitle, entry.path, refSummary, entry.hidden)
  //   aliases.push(simpleRef)
  // }
  if (entry.subtitle) {
    const delimiter = endsWithPunctuation ? ' ' : ': ';
    const title = entry.title + delimiter + entry.subtitle;
    const extraRef = new Reference(title, entry.path, refSummary, entry.hidden);
    aliases.push(extraRef);
  }
  if (entry.aliases) {
    entry.aliases.forEach(function(alias) {
      const aliasRef = new Reference(alias, entry.path, refSummary, entry.hidden);
      aliases.push(aliasRef);
    });
  }
  if (entry.url && entry.url !== entry.path) {
    const urlRef = new Reference(entry.url, entry.path, refSummary, entry.hidden);
    aliases.push(urlRef);
  }
  return aliases;
}

function main() {
  if (process.argv.length > 2) {
    const input = process.argv[2] || settings.index;
    const output = process.argv[3] || htmlfile(input);
    convert(input, output);
  } else {
    let files = glob.sync('**/' + settings.index, { ignore: 'node_modules/**' }).sort();
    const files2 = glob.sync('**/' + settings.index + '.asc', { ignore: 'node_modules/**' }).sort();
    files = files.concat(files2);
    buildPromise(files).then(function() {
      return referencesPromise(files);
    });
  }
}

main();
