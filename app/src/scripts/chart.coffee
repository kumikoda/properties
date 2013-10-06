class Chart extends EventEmitter
  constructor : () ->
    @d3 = d3.select("#chart svg")

    @chart = nv.models.discreteBarChart()
      .x((d) -> d.label)
      .y((d) -> d.value)
      .showValues(false)
      .color(['grey'])  
      .tooltips(false)

    @chart.yAxis.tickFormat (d, i) -> d

    @chart.xAxis.tickFormat (d, i) -> d

    
  render : (data)->

    @d3.datum(data).transition().duration(500).call @chart
    nv.addGraph -> @chart
    nv.utils.windowResize @chart.update

    $('svg g').on 'click', (e) => 
      $('.selected').attr 'class', 'nv-bar positive'
      $(e.currentTarget).attr 'class', 'nv-bar positive selected'
      @emit 'select', $(e.currentTarget).attr 'label'


  select : (time) ->
    $('svg g.nv-bar').attr 'class', 'nv-bar positive' 
    $('svg g[label=time]').attr 'nv-bar positive selected'
    


