class App extends Backbone.Router
  initialize : ->
    @properties = (new Property d, null for d in data)

    @chart = new Chart
    @map = new Map  
    @time = new Timepicker

    # initial rendering
    @now = @time.getTime()

    @redrawChart @now 
    @redrawMap @now 
    @updateValue @currentValue
    @map.showInfo()

    @listen()

  listen : ->
    @listenTo @map, 'moved', ->
      @redrawChart()
      @updateValue @currentValue
    @listenTo @time, 'time', (newTime) ->
      @now = newTime
      @redrawMap newTime
      @redrawChart newTime 

  redrawChart : (time=@now) ->
    properties = @properties.filter (p) =>
      p.containsPoint @map.map.getCenter()
        
    values = for hour in [0..23]
      
      # find the max value at this time
      current = undefined
      for p in properties when p.containsTime hour
        if not current or p.weight > current.weight 
          current = p
      
      label: hour
      value: current?.options.value ? null

    data = [
      values: values
    ]

    @currentValue = values[time].value
    @chart.render data, time

  redrawMap : (time=@time) =>
    # repaint the content
    for p in @properties
      if p.containsTime time
        p.render(@map.map)
      else
        p.remove()    

  updateValue : (value) ->
    # update the info window
    @map.setInfoContent value

app = new App