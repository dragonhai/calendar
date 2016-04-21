( function( factory ) {
  if ( typeof define === 'function' && define.amd ) {
    define( [ 'jquery' ], factory );
  } else if ( typeof exports === 'object' ) {
    module.exports = factory;
  } else {
    factory( jQuery );
  }
} ( function( $ ) {
  "use strict";

  Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf())
    date.setDate(date.getDate() + days);
    return date;
  }

  var Calendar = function() {
    this.ui = {
      parents: '.calendar',
      title: '.calendar-title',
      events: '.calendar-cell'
    }
    this.months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.timeCurrent = new Date();
    this.typeEvents = ['holiday', 'start', 'finish', 'general', 'working'];
    this.mileStones = ['holiday', 'start', 'finish', 'general', 'working'];
  };
  Calendar.prototype.getTypeEvents = function() {
    return this.typeEvents;
  };
  Calendar.prototype.addTypeEvents = function(typeEvent) {
    this.typeEvents.push(typeEvent);
  };
  Calendar.prototype.setTypeEvents = function(typeEvents) {
    this.typeEvents = typeEvents;
  };
  Calendar.prototype.addPrefixTypeEvents = function(prefix) {
    var typeEvents = [];
    var prefix = prefix || "event-type-";
    $(this.typeEvents).each(function(index, typeEvent) {
      typeEvents.push(prefix + typeEvent);
    });
    return typeEvents;
  };
  Calendar.prototype.init = function(url, method) {
    var that = this;
    if (url) {
      method = method || 'GET';
      $.ajax({
          url: url,
          type: method
      })
      .success(function(data) {
        that.events = data.events;
        self.events = that.events;
        that.startCalendar();
      })
      .error(function(data) {
        console.log(data);
      });
    } else {
      this.startCalendar();
    }
  };

  /**
   * Add events
   */
  Calendar.prototype.setEvents = function() {
    var that = this;
    
    var selector = this.ui.events;

    $(this.events).each(function(index, event) {
      var processing = event.processing;
      var specialize = event.specialize;
      var type = "event-type-"  + event.gType;
      var calendarCellType = "calendar-cell-type-"  + event.gType;
      var title = event.title;
      var mileStones = event.mileStone;
      that.processingEvents.call(that, processing, specialize, type, title, mileStones, calendarCellType);
    });
  };

  Calendar.prototype.processingEvents = function(processing, specialize, type, title, mileStones, calendarCellType) {
    var that = this;
    var dateArray = [];
    var mtitle = title;

    var eventType = type || 'event-type-general';
    var calendarCellType = calendarCellType || 'calendar-cell-type-general';

    if(processing.length != 0) {
      var start = new Date(processing[0].start);
      var end = new Date(processing[0].end);
      dateArray = this.getDates(start, end);
    }

    for (var i = 0; i < specialize.length; i ++ ) {
      dateArray.push(new Date(specialize[i]));
    }
    for (var i = 0; i < dateArray.length; i ++ ) {
      var date = dateArray[i];

      var eventMonth = date.getMonth() + 1;
      var eventDay = date.getDate();
      var eventYear = date.getFullYear();
      var eventTitle = title;

      var calendarCellSelector = '[date-day="' + eventDay + '"][date-month="' + eventMonth + '"][date-year="' + eventYear + '"]';
      var eventSelector = calendarCellSelector + ' .events'; 

      $(mileStones).each(function(index, mileStone){
        var mdate = new Date(mileStone.point);
        if(date.getDate() == mdate.getDate() && date.getMonth() == mdate.getMonth() && date.getFullYear() == mdate.getFullYear()) {
          mtitle = mileStone.message;
          return false;
        }
      });
      var mcalendarCellType = (date < this.timeCurrent) ? 'calendar-cell-type-past' : calendarCellType;
      $(that.ui.parents).find(calendarCellSelector).removeClass('calendar-cell-type-general calendar-cell-type-holiday calendar-cell-type-past');
      $(that.ui.parents).find(calendarCellSelector).addClass(mcalendarCellType);
      $(that.ui.parents).find(eventSelector).append('<div class="event ' + eventType + '">' + mtitle + '</div>');
      mtitle = '&nbsp;';
    }
  }

  Calendar.prototype.getDates = function(startDate, stopDate) {
    var dateArray = [];
    var currentDate = startDate;
    while (currentDate <= stopDate) {
      if(currentDate.getDay() != 0 && currentDate.getDay() != 6) {
        dateArray.push(currentDate);
      }
      currentDate = currentDate.addDays(1);
    }
    return dateArray;
  }

  /**
   * Display events
   */
  Calendar.prototype.displayEvent =  function() {
    $(this.ui.parents).find('tbody.event-calendar td').on('click', function(e) {
    });
  };

  Calendar.prototype.setUI = function(ui) {
    return this.ui = $.extend(this.ui, ui);
  }

  Calendar.prototype.startCalendar = function() {
    var year = this.timeCurrent.getFullYear();
    var month = this.timeCurrent.getMonth() + 1;

    this.setTitle(month, year);

    this.setEvents();

    this.behaviors();

  };

  Calendar.prototype.getMonthName = function(month){
    return this.months[month - 1];
  }

  Calendar.prototype.setTitle = function(month, year) {
    var $title = $(this.ui.parents).find(this.ui.title);
    // var content = this.getMonthName(month) + ' ' + year;
    var content = year + '年' + month + '月';
    $title.text(content);
    $title.attr({'data-month': month, 'data-year': year});
    this.show(month, year);
  }

  Calendar.prototype.behaviors = function() {
    this.next();
    this.prev();
    this.displayEvent();
  };

  Calendar.prototype.next = function() {
    var that = this;
    $(this.ui.parents).find('.btn-next').on('click', function(e) {
      // firing
      that.firing(e);

      var $title = $(that.ui.parents).find(that.ui.title);

      var month = parseInt($title.attr('data-month'));
      var year = parseInt($title.attr('data-year'));
      
      year = month > 11 ? year + 1 : year;
      month = month > 11 ? 1 : month + 1;

      that.setTitle(month, year);
      
      that.setEvents();

      // fired
      that.fired(e);
      return false;
    });
  }

  Calendar.prototype.prev = function() {
    var that = this;
    $(that.ui.parents).find('.btn-prev').on('click', function(e) {
      // firing
      that.firing.call(that, e);
      var $title = $(that.ui.parents).find(that.ui.title);
      var month = parseInt($title.attr('data-month'));
      var year = parseInt($title.attr('data-year'));

      year = month < 2 ? year - 1 : year;
      month = month < 2 ? 12 : month - 1;

      that.setTitle(month, year);

      that.setEvents.call(that);

      // fired
      that.fired.call(that, e);
      return false;
    });
  }
  Calendar.prototype.firing = function(e) {

  }
  Calendar.prototype.fired = function(e) {}
  
  /**
   * Get all dates for current month
   */
  Calendar.prototype.getDaysInMonth = function(month, year) {
    var date = new Date(year, month, 1);
    var days = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }
  Calendar.prototype.show = function(month, year) {
    var that = this;
    $(this.ui.parents).find('.date, .events').each(function(index) {
      $(this).empty();
    });
    $(this.ui.events).removeAttr('date-month');
    $(this.ui.events).removeAttr('date-day');
    $(this.ui.events).removeAttr('date-year');
    $(that.ui.parents).find('.calendar-cell').removeClass('calendar-cell-type-general calendar-cell-type-holiday calendar-cell-type-past');

    var pre = 1;

    $(this.getDaysInMonth(month - 1, year)).each(function(index, time) {

      var day = time.getDay();
      var date = time.getDate();
      var selector = 'tbody.event-calendar tr:nth-child(' + pre + ') td:nth-child(' + (day+1) + ')';


      var eventsSelector = selector + ' ' + that.ui.events;

      var dateSelector =  selector + ' .date';
      
      $(that.ui.parents).find(eventsSelector).attr({'date-month': month, 'date-day': date, 'date-year': year });

      if((day+1) % 7 == 0) pre++;

      $(that.ui.parents).find(dateSelector).append(date);

    });

    this.setCurrentDay();
    
  }

  /**
   * Set current day
   */
  Calendar.prototype.setCurrentDay = function(time) {
    var time = time || new Date();
    var date = time.getDate();
    var month = time.getMonth() + 1;
    var year = time.getFullYear();
    var eventSelector = '[date-day="' + date + '"][date-month="' + month + '"][date-year="' + year + '"]';
    $(this.ui.parents).find(this.ui.events).removeClass('current-day');
    $(this.ui.parents).find(eventSelector).addClass('current-day');
  };
  self.Calendar = new Calendar;
  return Calendar;
}));