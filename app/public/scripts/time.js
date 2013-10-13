var Timepicker, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Timepicker = (function(_super) {
  __extends(Timepicker, _super);

  function Timepicker() {
    this.setApm = __bind(this.setApm, this);
    this.setMinute = __bind(this.setMinute, this);
    this.setHour = __bind(this.setHour, this);
    _ref = Timepicker.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Timepicker.prototype.el = '#time';

  Timepicker.prototype.events = {
    'click .hour': 'setHour',
    'click .minute': 'setMinute',
    'click .apm': 'setApm'
  };

  Timepicker.prototype.initialize = function() {
    var minute, now, r;
    now = new Date();
    this.hour = now.getHours();
    if (this.hour > 12) {
      this.hour = this.hour - 12;
      this.apm = 'PM';
    } else {
      this.apm = 'AM';
    }
    minute = now.getMinutes();
    r = minute % 5;
    if (r > 2) {
      this.minute = minute - r + 5;
    } else {
      this.minute = minute - r;
    }
    if (this.minute < 10) {
      this.minute = '0' + this.minute;
    }
    this.$hour = this.$el.find('.selected-hour');
    this.$minute = this.$el.find('.selected-minute');
    this.$apm = this.$el.find('.selected-apm');
    return this.render();
  };

  Timepicker.prototype.setHour = function(e) {
    this.hour = $(e.currentTarget).data('value');
    return this.render();
  };

  Timepicker.prototype.setMinute = function(e) {
    this.minute = $(e.currentTarget).data('value');
    return this.render();
  };

  Timepicker.prototype.setApm = function(e) {
    this.apm = $(e.currentTarget).data('value');
    return this.render();
  };

  Timepicker.prototype.getTime = function() {
    if (this.apm === 'PM') {
      return this.hour + 12;
    } else {
      return this.hour;
    }
  };

  Timepicker.prototype.render = function() {
    this.$hour.text(this.hour);
    this.$minute.text(this.minute);
    this.$apm.text(this.apm);
    return this.trigger('time', this.getTime());
  };

  return Timepicker;

})(Backbone.View);
