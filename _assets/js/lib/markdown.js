import $ from 'jquery';
import markdownit from 'markdown-it';
import attr from 'markdown-it-attrs';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import figures from 'markdown-it-implicit-figures';
import taskcheckbox from 'markdown-it-task-checkbox';
import deflist from 'markdown-it-deflist';
import emoji from 'markdown-it-emoji';
import mathjax from 'markdown-it-mathjax';
import abbr from 'markdown-it-abbr';
import container from 'markdown-it-container';
import _ from 'lodash';
import prism from './prism';
import preprocessor from './preprocessor';
import Reference from './reference';
import abbrev from './abbrev';
import util from './util';
import utilJq from './util-jq';

function markdown(str, opts) {
  let mdStr = preprocessor(str);
  const mdOpts = markdown.options(opts);
  let md = markdown.md;
  if (mdOpts && !_.isEmpty(mdOpts)) {
    md = markdown.parser(mdOpts);
  }
  // ensure that defined references have precedence
  // over wiki references
  const env = markdown.env({
    references: Reference.extractReferencesFromMarkdown(mdStr)
  });
  mdStr = md.render(mdStr, env);
  mdStr = mdStr.trim();
  // mdStr = markdown.highlightInline(mdStr).trim();
  if (mdOpts && mdOpts.inline && mdStr.match(/^<p>/) && mdStr.match(/<\/p>$/)) {
    const beg = '<p>'.length;
    const end = '</p>'.length;
    mdStr = mdStr.substring(beg, mdStr.length - end);
  }
  return mdStr;
}

markdown.env = function(env) {
  const mdEnv = env || {};
  mdEnv.references = mdEnv.references || {};
  mdEnv.abbreviations = mdEnv.abbreviations || {};
  mdEnv.references = _.assign({}, Reference.getReferences(), mdEnv.references);
  mdEnv.references = Reference.removeUnsafeReferences(mdEnv.references);
  mdEnv.abbreviations = _.assign({}, abbrev.getAbbreviations(), mdEnv.abbreviations);
  return mdEnv;
};

// markdown.highlightBlock = function(str, lang) {
//   if (lang && hljs.getLanguage(lang)) {
//     try {
//       return hljs.highlight(lang, str, true).value;
//     } catch (__) {}
//   }
//   return '';
// };

// markdown.highlightInline = function(str) {
//   return utilJq.dojQuery(str, function(body) {
//     body.find('code[class]').each(function() {
//       let code = $(this);
//       let pre = code.parent();
//       if (pre.prop('tagName') === 'PRE') {
//         return;
//       }
//       let lang = code.attr('class');
//       if (lang && hljs.getLanguage(lang)) {
//         try {
//           code.removeClass(lang);
//           code.addClass('language-' + lang);
//           let str = code.text().trim();
//           let html = hljs.highlight(lang, str, false).value;
//           code.html(html);
//         } catch (__) {}
//       }
//     });
//   });
// };

markdown.defaults = {
  html: true, // Enable HTML tags in source
  breaks: true, // Convert '\n' in paragraphs into <br>
  linkify: true, // Autoconvert URL-like text to links

  // Enable some language-neutral replacement + quotes beautification
  typographer: true

  // Highlighter function. Should return escaped HTML,
  // or '' if the source string is not changed and should be escaped externally.
  // If result starts with <pre..., internal wrapper is skipped.
  // highlight: markdown.highlightBlock
};

markdown.options = function(opts) {
  const mdOpts = opts || {};
  const options = {};
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'hard_line_breaks')) {
    options.breaks = mdOpts.hard_line_breaks;
  }
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'breaks')) {
    options.breaks = mdOpts.breaks;
  }
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'autolink_bare_uris')) {
    options.linkify = mdOpts.autolink_bare_uris;
  }
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'linkify')) {
    options.linkify = mdOpts.linkify;
  }
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'smart')) {
    options.typographer = mdOpts.smart;
  }
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'typographer')) {
    options.typographer = mdOpts.typographer;
  }
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'emoji')) {
    options.emoji = mdOpts.emoji;
  }
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'mathjax')) {
    options.mathjax = mdOpts.mathjax;
  }
  if (Object.prototype.hasOwnProperty.call(mdOpts, 'inline')) {
    options.inline = mdOpts.inline;
  }
  return options;
};

markdown.parser = function(opts) {
  let mdOpts = opts || {};
  mdOpts = _.assign({}, markdown.defaults, mdOpts);
  return markdown.plugins(markdownit(mdOpts), mdOpts);
};

markdown.plugins = function(md, opts) {
  const mdOpts = opts || {};
  let mdInstance = md.use(figures, { figcaption: true });
  // if (opts.mathjax !== true) {
  mdInstance = mdInstance.use(attr);
  // }
  mdInstance = mdInstance
    .use(sub)
    .use(sup)
    .use(footnote)
    .use(taskcheckbox, { disabled: false })
    .use(deflist);
  mdInstance = markdown.containerPlugin(mdInstance);
  if (mdOpts.emoji === true) {
    mdInstance = mdInstance.use(emoji);
    mdInstance.renderer.rules.emoji = function(token, idx) {
      return '<span class="emoji emoji_' + token[idx].markup + '">' + token[idx].content + '</span>';
    };
  }
  if (mdOpts.mathjax === true) {
    mdInstance = mdInstance.use(mathjax());
  }
  mdInstance = mdInstance.use(abbr);
  mdInstance = mdInstance.use(prism);
  return mdInstance;
};

markdown.containerPlugin = function(md) {
  const renderContainer = function(bsClass, title) {
    return function(tokens, idx) {
      const info = tokens[idx].info.trim();
      const bsClassName = bsClass || info.toLowerCase();
      const titleStr = title || _.capitalize(info);
      const isOpeningTag = tokens[idx].nesting === 1;
      return isOpeningTag
        ? '<div class="bs-callout bs-callout-' + bsClassName + '"><h4>' + titleStr + '</h4>\n'
        : '</div>\n';
    };
  };
  return md
    .use(container, 'default', { render: renderContainer() })
    .use(container, 'primary', { render: renderContainer() })
    .use(container, 'success', { render: renderContainer() })
    .use(container, 'info', { render: renderContainer() })
    .use(container, 'warning', { render: renderContainer() })
    .use(container, 'danger', { render: renderContainer() })
    .use(container, 'viktig', { render: renderContainer('warning') })
    .use(container, 'advarsel', { render: renderContainer('danger') })
    .use(container, 'note', { render: renderContainer('info') });
};

markdown.inline = function(str) {
  return markdown(str, { inline: true });
};

markdown.toText = function(str) {
  const html = markdown.inline(str);
  return utilJq.htmlToText(html);
};

markdown.md = markdown.parser();

export default markdown;
