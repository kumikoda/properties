var Chart,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Chart = (function(_super) {
  __extends(Chart, _super);

  function Chart() {
    this.d3 = d3.select("#chart svg");
    this.chart = nv.models.discreteBarChart().x(function(d) {
      return d.label;
    }).y(function(d) {
      return d.value;
    }).showValues(false).color(['grey']).tooltips(false);
    this.chart.yAxis.tickFormat(function(d, i) {
      return d;
    });
    this.chart.xAxis.axisLabel('Time').tickFormat(function(d, i) {
      return d;
    });
  }

  Chart.prototype.render = function(data) {
    var _this = this;
    this.d3.datum(data).transition().duration(500).call(this.chart);
    nv.addGraph(function() {
      return this.chart;
    });
    nv.utils.windowResize(this.chart.update);
    return $('svg g').on('click', function(e) {
      $('.selected').attr('class', 'nv-bar positive');
      $(e.currentTarget).attr('class', 'nv-bar positive selected');
      return _this.emit('select', $(e.currentTarget).attr('label'));
    });
  };

  Chart.prototype.select = function(time) {
    $('svg g.nv-bar').attr('class', 'nv-bar positive');
    return $('svg g[label=time]').attr('nv-bar positive selected');
  };

  return Chart;

})(EventEmitter);
