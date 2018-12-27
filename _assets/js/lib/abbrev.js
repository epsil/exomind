import abbr from '../json/abbrev.json';

var abbrev = {};

abbrev.getAbbreviations = function() {
  return abbr;
};

export default abbrev;
