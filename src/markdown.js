import MarkdownIt from 'markdown-it';

var md = new MarkdownIt();

function markdown (str) {
  str = str || '';
  return md.render(str);
}

markdown.inline = function (str) {
  var html = markdown(str);
  if (html.match(/^<p>/) && html.match(/<\/p>$/)) {
    html = html.substring(3, str.length - 4);
  }
  return html;
}

markdown.toText = function (str) {
  var html = markdown(str);
  var div = document.createElement('div');
  div.innerHTML = html;
  var text = div.innerText || div.textContent;
  return text.trim();
}

export default markdown;