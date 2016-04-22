(function(definition){
  define('ccalendar', ['backbone', 'calendar'], definition);
})(function(Backbone, Calendar){
  'use strict';

  var CCalendar = Backbone.View.extend({
    initialize: function(){
      this.render();
    },
    render: function(){
      var calendar = new Calendar();
      calendar.init('/js/data/events.json');
    } 
  
  }); 
 
  return CCalendar;

});

requirejs.config({
  baseUrl: '../js/',
  paths: {
    jquery: 'vendor/jquery',
    backbone: 'vendor/backbone',
    underscore: 'vendor/underscore',

  }
});

requirejs(['ccalendar'], function(Calendar) {
  $('.calendar').each(function(){
    new Calendar({
      el: this
    });
  });
});