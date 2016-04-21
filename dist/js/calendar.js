requirejs.config({
  baseUrl: '../js/',
  paths: {
    jquery: 'lib/jquery',
    backbone: 'lib/backbone',
    underscore: 'lib/underscore',
    calendar: 'lib/calendar',

    // modules
    ccalendar: 'modules/ccalendar'
  }
});

requirejs(['ccalendar'], function(CCalendar) {
  $('.calendar').each(function(){
    new CCalendar({
      el: this
    });
  });
});