var Chart, _ref,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Chart = (function(_super) {
  __extends(Chart, _super);

  function Chart() {
    _ref = Chart.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Chart.prototype.el = '#chart';

  Chart.prototype.initialize = function(options) {
    this.options = options;
    this.time = 0;
    this.d3 = d3.select("#chart svg");
    this.chart = nv.models.discreteBarChart().x(function(d) {
      return d.label;
    }).y(function(d) {
      return d.value;
    }).showValues(false).color(['#666']).forceY([0, 15]).margin({
      left: 25
    });
    this.chart.yAxis.tickFormat(function(d, i) {
      return d;
    });
    return this.chart.xAxis.tickFormat(function(d, i) {
      return d;
    });
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
