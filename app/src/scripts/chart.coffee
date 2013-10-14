class Chart extends Backbone.View

  initialize : (@options) ->
    @time = 0
    # create chart using nvd3
    @d3 = d3.select @options.el
    @chart = nv.models.discreteBarChart()
      .x((d) -> d.label)
      .y((d) -> d.value)
      .showValues(false)
      .color(['#666'])
      .forceY([0,@options.range[1]])
      .margin({left:25})

    # axis label distance to hack the label to show up
    @chart.yAxis.tickFormat (d, i) -> d
    @chart.xAxis.axisLabel('Max Dispatch Distance in Miles').tickFormat (d, i) -> d

  render : (@data, @time=@time)->
    @data[0].values[@time].color = 'blue' # set the new time
    @d3.datum(@data).transition().duration(500).call @chart
    nv.addGraph -> @chart
    nv.utils.windowResize @chart.update
    
  getValue : () -> 
    (point.value for point in @data[0].values when point.label is @time)[0]


  