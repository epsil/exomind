import header from '../json/header.json';
import footer from '../json/footer.json';

// markdown-it-attrs kludge
function escapeCurlyBraces(str) {
  // return str.replace(/^{{(.*)}}$/gm, '&#123;&#123;$1&#125;&#125;')
  return str.replace(/^{{(.*)}}$/gm, '{{$1}}\\');
}

function makePhoneLinks(str) {
  return str.replace(/<(\+?[-\s0-9]+)>/gi, function(match, num) {
    const number = num.trim();
    const digits = number.replace(/[-\s]/gi, '');
    const link = '[' + number + '](tel:' + digits + ' "Call ' + number + '")';
    return link;
  });
}

function preprocessor(str) {
  let result = str;
  // remove whitespace
  result = result.trim();
  // escape curly braces
  result = escapeCurlyBraces(result);
  // make phone links
  result = makePhoneLinks(result);
  // add header and footer
  result = header + '\n\n' + result + '\n\n' + footer;
  return result.trim();
}

export default preprocessor;
