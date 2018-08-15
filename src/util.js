import moment from 'moment';
var util = {};

util.dateFormat = function(context, block) {
  if (moment) {
    var date = moment(context)
      .format('YYYY-MM-DD')
      .trim();
    if (date === 'Invalid date' || date === '1970-01-01') {
      return context;
    } else {
      return date;
    }
  } else {
    return context;
  }
};

export default util;
