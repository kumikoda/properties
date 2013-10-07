var Chart, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Chart = (function(_super) {
  __extends(Chart, _super);

  function Chart() {
    this.drag = __bind(this.drag, this);
    _ref = Chart.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Chart.prototype.el = '#chart';

  Chart.prototype.events = {
    'dragright': 'drag',
    'dragleft': 'drag',
    'dragend': 'dragend'
  };

  Chart.prototype.initialize = function(options) {
    this.options = options;
    this.time = (new Date()).getHours();
    this.d3 = d3.select("#chart svg");
    this.chart = nv.models.discreteBarChart().x(function(d) {
      return d.label;
    }).y(function(d) {
      return d.value;
    }).showValues(false).color(['grey']).tooltips(false);
    this.chart.yAxis.axisLabel(this.options.yLabel).axisLabelDistance(50).tickFormat(function(d, i) {
      return d;
    });
    this.chart.xAxis.axisLabel(this.options.xLabel).tickFormat(function(d, i) {
      return d;
    });
    this.$el.hammer();
    return this.level = 0;
  };

  Chart.prototype.reAdjustTime = function() {
    var dt, i, _i, _results;
    dt = this.time % 24 + 12;
    _results = [];
    for (i = _i = 0; 0 <= dt ? _i < dt : _i > dt; i = 0 <= dt ? ++_i : --_i) {
      _results.push(this.data[0].values.push(this.data[0].values.shift()));
    }
    return _results;
  };

  Chart.prototype.render = function(data, adjust) {
    this.data = data;
    if (adjust == null) {
      adjust = true;
    }
    if (adjust) {
      this.reAdjustTime();
    }
    this.d3.datum(this.data).transition().duration(500).call(this.chart);
    nv.addGraph(function() {
      return this.chart;
    });
    return nv.utils.windowResize(this.chart.update);
  };

  Chart.prototype.select = function(time) {
    $('svg g.nv-bar').attr('class', 'nv-bar positive');
    return $('svg g[label=time]').attr('nv-bar positive selected');
  };

  Chart.prototype.drag = function(e) {
    var dx, level;
    dx = e.gesture.deltaX;
    level = Math.floor(dx / 35);
    if (level > this.level) {
      this.level = level;
      return this.shiftRight();
    } else if (level < this.level) {
      this.level = level;
      return this.shiftLeft();
    }
  };

  Chart.prototype.dragend = function(e) {
    return this.level = 0;
  };

  Chart.prototype.shiftRight = function() {
    this.data[0].values.unshift(this.data[0].values.pop());
    this.render(this.data, false);
    this.time = Math.abs((this.time - 1) % 24);
    return this.trigger('moved');
  };

  Chart.prototype.shiftLeft = function() {
    this.data[0].values.push(this.data[0].values.shift());
    this.render(this.data, false);
    this.time = (this.time + 1) % 24;
    return this.trigger('moved');
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
