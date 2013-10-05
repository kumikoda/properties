var Chart, data1, data2, i;

data1 = [
  {
    values: (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 23; i = ++_i) {
        _results.push({
          label: i,
          value: i
        });
      }
      return _results;
    })()
  }
];

data2 = [
  {
    values: (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 23; i = ++_i) {
        _results.push({
          label: i,
          value: i * 2
        });
      }
      return _results;
    })()
  }
];

Chart = (function() {
  function Chart() {
    this.d3 = d3.select("#chart svg");
    this.chart = nv.models.discreteBarChart().x(function(d) {
      return d.label;
    }).y(function(d) {
      return d.value;
    }).tooltips(true).showValues(false).color(['red']).forceY([0, 100]);
    this.chart.yAxis.tickFormat(function(d, i) {
      return d;
    });
    this.chart.xAxis.tickFormat(function(d, i) {
      if (!(d % 2)) {
        return d;
      }
    });
    nv.utils.windowResize(this.chart.update);
  }

  Chart.prototype.render = function(data) {
    this.d3.datum(data).transition().duration(500).call(this.chart);
    return nv.addGraph(function() {
      return this.chart;
    });
  };

  return Chart;

})();
