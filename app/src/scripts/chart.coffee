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
      .margin({left:50})
      .tooltips(false)

    # axis label distance to hack the label to show up
    @chart.yAxis.axisLabelDistance(50).axisLabel('Max Dispatch Distance (miles)').tickFormat (d, i) -> d
    @chart.xAxis.axisLabel('Time (hours)')
    @setTickOptions()

    # adjust display options based on window resize
    $( window ).resize @setTickOptions
    
  setTickOptions : =>
    if $(window).width() < 767
      @chart.xAxis.tickFormat (d,i) -> 
        if d%2 
          null 
        else 
          d 
    else
      @chart.xAxis.tickFormat (d,i) -> d


  render : (@data, @time=@time)->
    @data[0].values[@time].color = 'blue' # set the new time
    @d3.datum(@data).transition().duration(500).call @chart
    nv.addGraph -> @chart
    nv.utils.windowResize @chart.update
    
  getValue : () -> 
    (point.value for point in @data[0].values when point.label is @time)[0]


  