var App, app, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

App = (function(_super) {
  __extends(App, _super);

  function App() {
    _ref = App.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  App.prototype.initialize = function() {
    var d;
    console.log('hello world!');
    this.properties = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        _results.push(new Property(d, null));
      }
      return _results;
    })();
    this.chart = new Chart({
      yLabel: 'Max Dispatch Distance (Miles)',
      xLabel: 'Time (hour)'
    });
    this.map = new Map;
    this.redrawMap();
    this.redrawChart();
    this.map.updateLegend(this.chart.time, this.chart.getValue());
    return this.listen();
  };

  App.prototype.listen = function() {
    this.listenTo(this.map, 'moved', function() {
      this.redrawChart();
      return this.map.updateLegend(this.chart.time, this.chart.getValue());
    });
    return this.listenTo(this.chart, 'moved', function() {
      this.map.updateLegend(this.chart.time, this.chart.getValue());
      return this.redrawMap();
    });
  };

  App.prototype.redrawChart = function() {
    var current, data, p, properties, time, values,
      _this = this;
    properties = this.properties.filter(function(p) {
      return p.containsPoint(_this.map.map.getCenter());
    });
    values = (function() {
      var _i, _j, _len, _ref1, _results;
      _results = [];
      for (time = _i = 0; _i <= 23; time = ++_i) {
        current = void 0;
        for (_j = 0, _len = properties.length; _j < _len; _j++) {
          p = properties[_j];
          if (p.containsTime(time)) {
            if (!current || p.weight > current.weight) {
              current = p;
            }
          }
        }
        _results.push({
          label: time,
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
    return this.chart.render(data);
  };

  App.prototype.redrawMap = function() {
    var p, time, value, _i, _j, _len, _len1, _ref1, _ref2, _results, _results1;
    time = this.chart.time;
    value = null;
    if (time >= 0) {
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
    } else {
      _ref2 = this.properties;
      _results1 = [];
      for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
        p = _ref2[_j];
        _results1.push(p.render(this.map.map));
      }
      return _results1;
    }
  };

  return App;

})(Backbone.Router);

app = new App;
