import $ from 'jquery';
import Reference from './reference';
import util from './util';
var jqUtil = {};

jqUtil.dojQuery = function(html, fn) {
  var body = $('<div>');
  body.html(html);
  fn(body);
  return body.html();
};

// similar to Hakyll's relativizeUrls
jqUtil.relativizeUrls = function(path) {
  return this.each(function() {
    $(this)
      .find('a[href]')
      .each(function() {
        var a = $(this);
        var href = a.attr('href');
        if (!a.hasClass('u-url') && !a.hasClass('external')) {
          // redirect external links to local copy
          var ref = Reference.getReference(href);
          if (ref) {
            href = ref.href;
            a.attr('href', href);
            a.attr('title', a.attr('title') || ref.title || '');
          }
        }
        // make URL relative
        href = util.urlRelative(path, href);
        a.attr('href', href);

        // add index.html to end of link
        if (
          util.isLocalFile() &&
          !util.isExternalUrl(href) &&
          util.urlWithoutAnchor(href).match(/\/$/)
        ) {
          href = util.urlPlusIndexHtml(href);
          a.attr('href', href);
        }
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

if ($ && $.fn) {
  $.fn.relativizeUrls = jqUtil.relativizeUrls;
}

export default jqUtil;
