var App, app, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

App = (function(_super) {
  __extends(App, _super);

  function App() {
    this.redrawMap = __bind(this.redrawMap, this);
    _ref = App.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  App.prototype.initialize = function() {
    var d;
    this.properties = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        _results.push(new Property(d, null));
      }
      return _results;
    })();
    this.chart = new Chart;
    this.map = new Map;
    this.time = new Timepicker;
    this.now = this.time.getTime();
    this.redrawChart(this.now);
    this.redrawMap(this.now);
    this.updateValue(this.currentValue);
    this.map.showInfo();
    return this.listen();
  };

  App.prototype.listen = function() {
    this.listenTo(this.map, 'moved', function() {
      this.redrawChart();
      return this.updateValue(this.currentValue);
    });
    return this.listenTo(this.time, 'time', function(newTime) {
      this.now = newTime;
      this.redrawMap(newTime);
      return this.redrawChart(newTime);
    });
  };

  App.prototype.redrawChart = function(time) {
    var current, data, hour, p, properties, values,
      _this = this;
    if (time == null) {
      time = this.now;
    }
    properties = this.properties.filter(function(p) {
      return p.containsPoint(_this.map.map.getCenter());
    });
    values = (function() {
      var _i, _j, _len, _ref1, _results;
      _results = [];
      for (hour = _i = 0; _i <= 23; hour = ++_i) {
        current = void 0;
        for (_j = 0, _len = properties.length; _j < _len; _j++) {
          p = properties[_j];
          if (p.containsTime(hour)) {
            if (!current || p.weight > current.weight) {
              current = p;
            }
          }
        }
        _results.push({
          label: hour,
          value: (_ref1 = current != null ? current.options.value : void 0) != null ? _ref1 : null
        });
      }
      return _results;
    })();
    data = [
      {
        values: values
      }
    ];
    this.currentValue = values[time].value;
    return this.chart.render(data, time);
  };

  App.prototype.redrawMap = function(time) {
    var p, _i, _len, _ref1, _results;
    if (time == null) {
      time = this.time;
    }
    _ref1 = this.properties;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      p = _ref1[_i];
      if (p.containsTime(time)) {
        _results.push(p.render(this.map.map));
      } else {
        _results.push(p.remove());
      }
    }
    return _results;
  };

  App.prototype.updateValue = function(value) {
    return this.map.setInfoContent(value);
  };

  return App;

})(Backbone.Router);

app = new App;
