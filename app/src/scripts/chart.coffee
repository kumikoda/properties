class Chart extends Backbone.View
  el : '#chart'

  events : 
    'dragright' : 'drag'
    'dragleft' : 'drag'
    'dragend' : 'dragend'

  initialize : (@options) ->
    # init time to current time 
    @time = (new Date()).getHours()

    # create chart using nvd3
    @d3 = d3.select("#chart svg")
    @chart = nv.models.discreteBarChart()
      .x((d) -> d.label)
      .y((d) -> d.value)
      .showValues(false)
      .color(['grey'])  
      .tooltips(false)

    # axis label distance to hack the label to show up
    @chart.yAxis.axisLabel(@options.yLabel).axisLabelDistance(50).tickFormat (d, i) -> d
    @chart.xAxis.axisLabel(@options.xLabel).tickFormat (d, i) -> d

    # enable touch events
    @$el.hammer()

    @level = 0

  reAdjustTime : () ->
    dt = @time%24 + 12 # the 12 is to center the current time
    for i in [0...dt]
      @data[0].values.push @data[0].values.shift()

  render : (@data, adjust=true)->
    # massage the data to match current time if neccessary (true except via time controls like set time and shiftLeft / shiftRight) 
    @reAdjustTime() if adjust

    @d3.datum(@data).transition().duration(500).call @chart
    nv.addGraph -> @chart
    nv.utils.windowResize @chart.update

    

  select : (time) ->
    $('svg g.nv-bar').attr 'class', 'nv-bar positive' 
    $('svg g[label=time]').attr 'nv-bar positive selected'
    
  
  drag : (e) =>
    dx = e.gesture.deltaX
    level = Math.floor dx/35 
    
    if level > @level
      @level = level        
      @shiftRight()
    else if level < @level 
      @level = level
      @shiftLeft()

  dragend : (e) ->
    @level = 0

  shiftRight : ->
    @data[0].values.unshift @data[0].values.pop()
    @render(@data, false)
    @time = Math.abs (@time-1)%24
    @trigger 'moved'

  shiftLeft : ->
    @data[0].values.push @data[0].values.shift()
    @render(@data, false)
    @time = (@time+1)%24
    @trigger 'moved'

  getValue : () -> 
    (point.value for point in @data[0].values when point.label is @time)[0]


  