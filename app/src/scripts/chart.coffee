# fake data
data1 = [
  values: for i in [0..23]
    label : i 
    value : i 
]


# fake data
data2 = [
  values: for i in [0..23]
    label : i 
    value : i * 2
]



class Chart 
  constructor : () ->
    @d3 = d3.select("#chart svg")

    @chart = nv.models.discreteBarChart()
      .x((d) -> d.label)
      .y((d) -> d.value)
      .tooltips(true)
      .showValues(false)
      .color(['red'])
      .forceY([0,100])

    @chart.yAxis.tickFormat (d, i) -> d

    @chart.xAxis.tickFormat (d, i) -> d if not (d%2)

    nv.utils.windowResize @chart.update

  render : (data)->

    @d3.datum(data).transition().duration(500).call @chart
    nv.addGraph -> @chart

