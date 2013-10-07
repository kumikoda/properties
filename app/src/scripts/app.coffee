class App extends Backbone.Router
  initialize : ->
    console.log 'hello world!'
    @properties = (new Property d, null for d in data)

    @chart = new Chart
    @map = new Map  

    # initial rendering
    @redrawMap()
    @redrawChart()

    @listen()

  listen : ->
    @listenTo @map, 'moved', @redrawChart
    @listenTo @chart, 'moved', @redrawMap 

  redrawChart : ->
    properties = @properties.filter (p) =>
      p.containsPoint @map.map.getCenter()
        
    values = for time in [0..23]
      
      # find the max value at this time
      current = undefined
      for p in properties when p.containsTime time
        if not current or p.weight > current.weight 
          current = p
      
      label: time
      value: current?.options.value ? null

    data = [
      values: values
    ]

    @chart.render(data)

  redrawMap : ->
    time = @chart.time 

    if time >= 0 
      for p in @properties
        if p.containsTime time
          p.render(@map.map)
        else
          p.remove()    
    else 
      p.render(@map.map) for p in @properties


app = new App