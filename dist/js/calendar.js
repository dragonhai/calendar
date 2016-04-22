!function(a){"function"==typeof define&&define.amd?define(["jquery"],a):"object"==typeof exports?module.exports=a:a(jQuery)}(function(a){"use strict";Date.prototype.addDays=function(a){var b=new Date(this.valueOf());return b.setDate(b.getDate()+a),b};var b=function(){this.ui={parents:".calendar",title:".calendar-title",events:".inner",table:".table",th:".th",td:".td",tbody:".tbody",thead:".thead",inner:".inner",event:".event",eventsNumber:".events-number"},this.months=["January","February","March","April","May","June","July","August","September","October","November","December"],this.timeCurrent=new Date,this.typeEvents=["holiday","start","finish","general","working"],this.mileStones=["holiday","start","finish","general","working"]};return b.prototype.getTypeEvents=function(){return this.typeEvents},b.prototype.addTypeEvents=function(a){this.typeEvents.push(a)},b.prototype.setTypeEvents=function(a){this.typeEvents=a},b.prototype.addPrefixTypeEvents=function(b){var c=[],b=b||"event-type-";return a(this.typeEvents).each(function(a,d){c.push(b+d)}),c},b.prototype.init=function(b,c){var d=this;b?(c=c||"GET",a.ajax({url:b,type:c}).success(function(a){d.events=a.events,self.events=d.events,d.startCalendar()}).error(function(a){console.log(a)})):this.startCalendar()},b.prototype.setEvents=function(){var b=this;this.ui.events;a(this.events).each(function(a,c){b.processingEvents.call(b,c)})},b.prototype.processingEvents=function(b){var c=this,d=[],e=j,f=b.processing,g=b.specialize,h="event-type-"+b.gType,i="calendar-cell-type-"+b.gType,j=b.title,k=b.mileStone,l=h||"event-type-general",i=i||"calendar-cell-type-general";if(0!=f.length){var m=new Date(f[0].start),n=new Date(f[0].end),o=f[0].exclude||[];d=this.getDates(m,n,o)}for(var p=0;p<g.length;p++)d.push(new Date(g[p]));for(var p=0;p<d.length;p++){var q,r=d[p],s=r.getMonth()+1,t=r.getDate(),u=r.getFullYear(),v='[date-day="'+t+'"][date-month="'+s+'"][date-year="'+u+'"]',w=v+" .events";a(k).each(function(a,b){var c=new Date(b.point);return r.getDate()==c.getDate()&&r.getMonth()==c.getMonth()&&r.getFullYear()==c.getFullYear()?(e=b.message,q=b.priority||0,!1):void 0}),a(c.ui.parents).find(w).append('<div class="event '+l+'" data-priority='+q+" data-type="+b.gType+">"+e+"</div>");var x=0,y="";a(c.ui.parents).find(w).find(".event").each(function(){var b=parseInt(a(this).data("priority"));x=b>x?b:x,b==x&&(y="general"==a(this).data("type")?r<c.timeCurrent?"calendar-cell-type-past":i:"calendar-cell-type-"+a(this).data("type"))}),a(c.ui.parents).find(v).addClass(y);var z=a(c.ui.parents).find(w).find(".event").length;z>1&&(a(c.ui.parents).find(v).append('<div class="events-number"><div class="inner-number">'+z+"</div></div>"),a(c.ui.parents).find(w).hide()),e="&nbsp;"}},b.prototype.getDates=function(b,c,d){for(var e=[],f=b,g=a.map(d,function(a){return new Date(a)});c>=f;){if(0!=f.getDay()&&6!=f.getDay()){var h=f,i=!0;a.each(g,function(a,b){return b.getDate()==h.getDate()&&b.getMonth()==h.getMonth()&&b.getFullYear()==h.getFullYear()?(i=!1,!1):void 0}),i&&e.push(f)}f=f.addDays(1)}return e},b.prototype.displayEvent=function(){a(this.ui.parents).find(".tbody.event-calendar .td").on("click",function(a){})},b.prototype.setUI=function(b){return this.ui=a.extend(this.ui,b)},b.prototype.startCalendar=function(){var a=this.timeCurrent.getFullYear(),b=this.timeCurrent.getMonth()+1;this.setTitle(b,a),this.setEvents(),this.behaviors()},b.prototype.getMonthName=function(a){return this.months[a-1]},b.prototype.setTitle=function(b,c){var d=a(this.ui.parents).find(this.ui.title),e=c+"年"+b+"月";d.text(e),d.attr({"data-month":b,"data-year":c}),this.show(b,c)},b.prototype.behaviors=function(){this.next(),this.prev(),this.displayEvent()},b.prototype.next=function(){var b=this;a(this.ui.parents).find(".btn-next").on("click",function(c){b.firing(c);var d=a(b.ui.parents).find(b.ui.title),e=parseInt(d.attr("data-month")),f=parseInt(d.attr("data-year"));return f=e>11?f+1:f,e=e>11?1:e+1,b.setTitle(e,f),b.setEvents(),b.fired(c),!1})},b.prototype.prev=function(){var b=this;a(b.ui.parents).find(".btn-prev").on("click",function(c){b.firing.call(b,c);var d=a(b.ui.parents).find(b.ui.title),e=parseInt(d.attr("data-month")),f=parseInt(d.attr("data-year"));return f=2>e?f-1:f,e=2>e?12:e-1,b.setTitle(e,f),b.setEvents.call(b),b.fired.call(b,c),!1})},b.prototype.firing=function(a){},b.prototype.fired=function(a){},b.prototype.getDaysInMonth=function(a,b){for(var c=new Date(b,a,1),d=[];c.getMonth()===a;)d.push(new Date(c)),c.setDate(c.getDate()+1);return d},b.prototype.show=function(b,c){var d=this;a(this.ui.parents).find(".date, .events").each(function(b){a(this).empty()}),a(this.ui.events).removeAttr("date-month"),a(this.ui.events).removeAttr("date-day"),a(this.ui.events).removeAttr("date-year"),a(d.ui.parents).find(d.ui.events).removeClass("calendar-cell-type-general calendar-cell-type-holiday calendar-cell-type-past"),a(d.ui.parents).find(".events-number").remove();var e=1;a(this.getDaysInMonth(b-1,c)).each(function(f,g){var h=g.getDay(),i=g.getDate(),j=".tbody.event-calendar .tr:nth-child("+e+") .td:nth-child("+(h+1)+")",k=j+" "+d.ui.events,l=j+" .date";a(d.ui.parents).find(k).attr({"date-month":b,"date-day":i,"date-year":c}),(h+1)%7==0&&e++,a(d.ui.parents).find(l).append(i)}),this.setCurrentDay()},b.prototype.setCurrentDay=function(b){var b=b||new Date,c=b.getDate(),d=b.getMonth()+1,e=b.getFullYear(),f='[date-day="'+c+'"][date-month="'+d+'"][date-year="'+e+'"]';a(this.ui.parents).find(this.ui.events).removeClass("current-day"),a(this.ui.parents).find(f).addClass("current-day")},self.Calendar=new b,b});