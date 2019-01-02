import abbr from '../json/abbrev.json';

const abbrev = {};

abbrev.getAbbreviations = function() {
  return abbr;
};

export default abbrev;
