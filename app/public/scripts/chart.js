var Chart, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Chart = (function(_super) {
  __extends(Chart, _super);

  function Chart() {
    this.setTickOptions = __bind(this.setTickOptions, this);
    _ref = Chart.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Chart.prototype.initialize = function(options) {
    this.options = options;
    this.time = 0;
    this.d3 = d3.select(this.options.el);
    this.chart = nv.models.discreteBarChart().x(function(d) {
      return d.label;
    }).y(function(d) {
      return d.value;
    }).showValues(false).color(['#666']).forceY([0, this.options.range[1]]).margin({
      left: 25
    });
    this.chart.yAxis.tickFormat(function(d, i) {
      return d;
    });
    this.chart.xAxis.axisLabel('Max Dispatch Distance over time');
    this.setTickOptions();
    return $(window).resize(this.setTickOptions);
  };

  Chart.prototype.setTickOptions = function() {
    if ($(window).width() < 767) {
      return this.chart.xAxis.tickFormat(function(d, i) {
        if (d % 2) {
          return null;
        } else {
          return d;
        }
      });
    } else {
      return this.chart.xAxis.tickFormat(function(d, i) {
        return d;
      });
    }
  };

  Chart.prototype.render = function(data, time) {
    this.data = data;
    this.time = time != null ? time : this.time;
    this.data[0].values[this.time].color = 'blue';
    this.d3.datum(this.data).transition().duration(500).call(this.chart);
    nv.addGraph(function() {
      return this.chart;
    });
    return nv.utils.windowResize(this.chart.update);
  };

  Chart.prototype.getValue = function() {
    var point;
    return ((function() {
      var _i, _len, _ref1, _results;
      _ref1 = this.data[0].values;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        point = _ref1[_i];
        if (point.label === this.time) {
          _results.push(point.value);
        }
      }
      return _results;
    }).call(this))[0];
  };

  return Chart;

})(Backbone.View);
