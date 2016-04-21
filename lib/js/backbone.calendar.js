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
      calendar.init('../js/data/events.json');
    }
  
  }); 

  return CCalendar;

});