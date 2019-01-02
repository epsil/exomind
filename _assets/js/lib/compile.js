import matter from 'gray-matter';
import md5 from 'md5';
import typogr from 'typogr';
import URI from 'urijs';
import _ from 'lodash';
import markdown from './markdown';
import social from './social';
import util from './util';
import toc from './toc';
import utilJq from './util-jq';
// import document from '../templates/document';
// import body from '../templates/body';
// import index from '../templates/index';
import settings from '../json/settings.json';

function parse(data) {
  // Allow the initial '---' to be omitted.
  // Note: this hack does not allow the block
  // to contain blank lines, although YAML
  // does support such expressions!
  let dataStr = data;
  if (!dataStr.match(/^---/) && dataStr.match(/^([\s\S]*)[\r\n]+---/)) {
    dataStr = '---\n' + dataStr;
  }
  let view = matter(dataStr);
  const props = view.data;
  view = _.assign(view, props);
  view.content = markdown(view.content, view);
  return view;
}

function addArrays(view) {
  const v = view;
  if (v.css && !Array.isArray(v.css)) {
    v.css = [v.css];
  }
  if (v.stylesheet && !Array.isArray(v.stylesheet)) {
    v.stylesheet = [v.stylesheet];
  }
  if (v.js && !Array.isArray(v.js)) {
    v.js = [v.js];
  }
  if (v.script && !Array.isArray(v.script)) {
    v.script = [v.script];
  }
  return v;
}

function addI18n(view) {
  const v = view;
  if (v.lang === undefined || v.lang === '' || settings[v.lang] === undefined) {
    v.lang = 'no';
  }
  return _.assign({}, settings[v.lang], v);
}

function dynamic(view, path) {
  const v = _.assign(
    {
      bitbucket: social.bitbucket.url(path),
      'bitbucket-history': social.bitbucket.history.url(path),
      facebook: social.facebook.url(path),
      github: social.github.url(path),
      'github-edit': social.github.edit.url(path),
      'github-history': social.github.history.url(path),
      'github-raw': social.github.raw.url(path),
      linkedin: social.linkedin.url(path),
      twitter: social.twitter.url(path),
      mail: social.mail.url(path)
    },
    view
  );
  if (v.toc !== false) {
    v.toc = '<div id="toc-placeholder"></div>';
  }
  // if (v.content.match(/[\\][(]/g)) {
  //   v.mathjax = true
  // }
  if (v.mathjax) {
    // typogr.js doesn't work well with MathJax
    // https://github.com/ekalinin/typogr.js/issues/31
    v.typogr = false;
  }
  return v;
}

function title(view) {
  const v = view;
  if (v.title === undefined || v.title === '') {
    v.content = utilJq.dojQuery(v.content, function(body) {
      const heading = body.find('h1').first();
      if (heading.length > 0) {
        v.title = heading
          .removeAriaHidden()
          .html()
          .trim();
        heading.remove();
      }
    });
  }
  return v;
}

function footnotes(view) {
  const v = view;
  if (v.sidenotes === undefined) {
    v.sidenotes = true;
  }
  if (v.footnotes === undefined || v.footnotes === '') {
    v.content = utilJq.dojQuery(v.content, function(body) {
      const section = body.find('section.footnotes').first();
      if (section.length > 0) {
        const hr = body.find('hr.footnotes-sep');
        v.footnotes = section.html().trim();
        section.remove();
        hr.remove();
      }
    });
  }
  return v;
}

function addToC(view) {
  const v = view;
  if (v.toc !== false) {
    v.content = utilJq.dojQuery(v.content, function(body) {
      // let placeholder = body.find('#toc-placeholder');
      // let content = body.find('.e-content');
      // v.toc = content.tableOfContents();
      // if (v.toc !== '') {
      //   placeholder.replaceWith(v.toc);
      // }
      v.toc = body.tableOfContents();
    });
  }
  return v;
}

function typography(view) {
  const v = view;
  if (v.typogr) {
    // typogr.js doesn't understand unescaped quotation marks
    v.content = v.content
      .replace(/\u2018/gi, '&#8216;')
      .replace(/\u2019/gi, '&#8217;')
      .replace(/\u201c/gi, '&#8220;')
      .replace(/\u201d/gi, '&#8221;')
      // FIXME: this belongs in util.js
      .replace(/&#8220;&#8216;/gi, '&#8220;&nbsp;&#8216;')
      .replace(/&#8216;&#8220;/gi, '&#8216;&nbsp;&#8220;');
    v.content = typogrify(v.content);
  }
  return v;
}

function typogrify(text) {
  let txt = typogr.amp(text);
  // txt = typogr.widont(txt)
  txt = typogr.smartypants(txt);
  txt = typogr.caps(txt);
  txt = typogr.initQuotes(txt);
  txt = typogr.ord(txt);
  return txt;
}

function links(view, path) {
  const v = view;
  if (v.plain !== true) {
    v.content = utilJq.dojQuery(v.content, function(body) {
      body.relativizeUrls(path);
      body.fixLinks();
    });
  }
  return v;
}

function compile(data, path) {
  let file = URI(path).filename();
  if (file === '') {
    file = 'index.md';
  }

  let view = _.assign({}, settings, {
    file: file,
    path: path,
    url: path
  });

  const dataStr = data.trim();
  if (dataStr === '') {
    // return index(view);
  }

  view = _.assign(view, parse(dataStr), {
    md5: md5(dataStr)
  });

  view.date = view.date || view.created;

  view = addArrays(view);
  view = addI18n(view);
  view = dynamic(view, path);
  view = title(view);

  // if (view.content !== '') {
  //   if (view.plain) {
  //     view.content = '<section>' + view.content + '</section>';
  //   }
  //   // view.content = body(view);
  // }

  view = addToC(view);
  view = typography(view);
  view = links(view, path);

  if (view.plain) {
    view.content = utilJq.processSimple(view.content);
  } else {
    view.content = utilJq.process(view.content);
  }

  view = footnotes(view);

  // view.content = document(view);
  // return view.content;
  return view;
}

export default compile;
