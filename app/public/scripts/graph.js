var chart, data, i;

data = [
  {
    values: (function() {
      var _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 23; i = ++_i) {
        _results.push({
          label: i,
          value: i * 100
        });
      }
      return _results;
    })()
  }
];

chart = nv.models.discreteBarChart().x(function(d) {
  return d.label;
}).y(function(d) {
  return d.value;
}).tooltips(true).showValues(false).color(['red']);

chart.yAxis.axisLabel(" Cost (Hundreds USD per capita )").tickFormat(function(d, i) {
  return "$" + Math.round(d / 100);
});

chart.xAxis.tickFormat(function(d, i) {
  if (!(d % 2)) {
    return d;
  }
});

d3.select("#chart1 svg").datum(data).transition().duration(500).call(chart);

nv.utils.windowResize(chart.update);

nv.addGraph(function() {
  return chart;
});
