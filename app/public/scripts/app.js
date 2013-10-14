var App, _ref,
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

  App.prototype.initialize = function(options) {
    this.options = options;
    this.properties = new Properties(this.options.data);
    this.chart = new Chart({
      el: ".chart svg",
      range: this.properties.getRange()
    });
    this.map = new Map({
      el: ".map-canvas",
      center: this.properties.getCenter(),
      range: this.properties.getRange()
    });
    this.time = new Timepicker({
      el: ".time"
    });
    this.colorPolygons();
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

  App.prototype.colorPolygons = function() {
    var p, _i, _len, _ref1, _results;
    _ref1 = this.properties.list;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      p = _ref1[_i];
      _results.push(p.setColor(this.map.legend.getColor(p.options.value)));
    }
    return _results;
  };

  App.prototype.redrawChart = function(time) {
    var current, data, hour, p, properties, values;
    if (time == null) {
      time = this.now;
    }
    properties = this.properties.intersecting(this.map.map.getCenter());
    values = (function() {
      var _i, _j, _len, _ref1, _results;
      _results = [];
      for (hour = _i = 0; _i <= 23; hour = ++_i) {
        current = void 0;
        for (_j = 0, _len = properties.length; _j < _len; _j++) {
          p = properties[_j];
          if (p.spansTime(hour)) {
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
      time = this.now;
    }
    _ref1 = this.properties.list;
    _results = [];
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      p = _ref1[_i];
      if (p.spansTime(time)) {
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

$.get("/data/properties.json", function(data) {
  var app;
  return app = new App({
    data: data
  });
});
