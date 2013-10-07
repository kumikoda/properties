class Chart extends Backbone.View
  el : '#chart'

  events : 
    'mousedown' : 'mousedown'
    'moving' : 'moving'

  initialize : () ->
    @time = (new Date).getHours()

    @d3 = d3.select("#chart svg")

    @chart = nv.models.discreteBarChart()
      .x((d) -> d.label)
      .y((d) -> d.value)
      .showValues(false)
      .color(['grey'])  
      .tooltips(false)

    @chart.yAxis.tickFormat (d, i) -> d

    @chart.xAxis.axisLabel('Time').tickFormat (d, i) -> d

  render : (data)->
    @d3.datum(data).transition().duration(500).call @chart
    nv.addGraph -> @chart
    nv.utils.windowResize @chart.update

  select : (time) ->
    $('svg g.nv-bar').attr 'class', 'nv-bar positive' 
    $('svg g[label=time]').attr 'nv-bar positive selected'
    


