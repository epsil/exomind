import $ from 'jquery';
import URI from 'urijs';
import settings from '../json/settings.json';

const social = {};

social.bitbucket = function() {
  return social.bitbucket.url(window.location.href);
};

social.bitbucket.url = function(url) {
  let urlStr = url;
  if (URI(urlStr).protocol() === 'file') {
    return urlStr;
  }
  urlStr = urlStr.replace(/#[^#]*$/, '');
  urlStr = urlStr.replace(/index\.html?$/i, '');
  const repo = settings['bitbucket-repo'] || '';
  const bitbucket = 'https://bitbucket.org/' + repo + '/src/HEAD';
  return bitbucket + urlStr + settings.index;
};

social.bitbucket.resource = function(url) {
  return URI(url).resource();
};

social.bitbucket.path = function(url) {
  return URI(social.bitbucket.resource(url))
    .relativeTo('/')
    .toString()
    .replace(/#[^/]*$/, '')
    .replace(/index\.html?$/, '')
    .replace(/\/?$/, '');
};

social.bitbucket.history = function() {
  return social.bitbucket.history.url(window.location.href);
};

social.bitbucket.history.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }
  const repo = settings['bitbucket-repo'] || '';
  const bitbucket = 'https://bitbucket.org/' + repo + '/history-node/HEAD';
  return bitbucket + url + settings.index;
};

social.github = function() {
  return social.github.url(window.location.href);
};

social.github.history = function() {
  return social.github.history.url(window.location.href);
};

social.github.history.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const repo = settings['github-repo'] || '';
  const github = 'https://github.com/' + repo + '/commits/master';
  const path = social.github.path(url);

  return github + path + '/' + settings.index;
};

social.github.edit = function() {
  return social.github.edit.url(window.location.href);
};

social.github.edit.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const repo = settings['github-repo'] || '';
  const github = 'https://github.com/' + repo + '/edit/master';
  const path = social.github.path(url);

  return github + path + '/' + settings.index;
};

social.github.raw = function() {
  return social.github.raw.url(window.location.href);
};

social.github.raw.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const repo = settings['github-repo'] || '';
  const github = 'https://github.com/' + repo + '/raw/master';
  const path = social.github.path(url);

  return github + path + '/' + settings.index;
};

social.github.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const repo = settings['github-repo'] || '';
  const github = 'https://github.com/' + repo + '/blob/master';
  const path = social.github.path(url);

  return github + path + '/' + settings.index;
};

social.github.resource = function(url) {
  return URI(url).resource();
};

social.github.path = function(url) {
  let urlStr = URI(social.github.resource(url));
  if (urlStr.is('absolute')) {
    urlStr = urlStr.relativeTo('/');
  }
  urlStr = urlStr
    .toString()
    .replace(/index\.html?$/, '')
    .replace(/\/?$/, '');
  return urlStr;
};

social.mail = function() {
  return social.mail.url(window.location.href);
};

social.mail.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const urlStr = encodeURIComponent(url);
  return 'mailto:?body=' + urlStr;
};

social.facebook = function() {
  return social.facebook.url(window.location.href);
};

social.facebook.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const urlStr = encodeURIComponent(url);
  return 'http://www.facebook.com/share.php?u=' + urlStr;
};

social.linkedin = function() {
  return social.linkedin.url(window.location.href);
};

social.linkedin.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const urlStr = encodeURIComponent(url);
  return 'http://www.linkedin.com/shareArticle?url=' + urlStr;
};

social.twitter = function() {
  return social.twitter.url(window.location.href);
};

social.twitter.url = function(url) {
  if (URI(url).protocol() === 'file') {
    return url;
  }

  const urlStr = encodeURIComponent(url);
  return 'https://twitter.com/intent/tweet?url=' + urlStr;
};

if ($ && $.fn) {
  $.fn.bitbucket = social.bitbucket;
  $.fn.github = social.github;
  $.fn.mail = social.mail;
  $.fn.facebook = social.facebook;
  $.fn.linkedin = social.linkedin;
  $.fn.twitter = social.twitter;
}

export default social;
