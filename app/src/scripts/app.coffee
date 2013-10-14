class App extends Backbone.Router
  initialize : (@options)->
    @properties = new Properties @options.data

    @chart = new Chart
      el : ".chart svg"
      range : @properties.getRange()
    
    @map = new Map
      el : ".map-canvas"
      center : @properties.getCenter()
      range : @properties.getRange() 

    @time = new Timepicker
      el : ".time"

    # fill polygons with correct colors
    @colorPolygons()

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
      @updateValue @currentValue

  colorPolygons : ->
    for p in @properties.list
      p.setColor @map.legend.getColor p.options.value

  redrawChart : (time=@now) ->
    properties = @properties.intersecting @map.map.getCenter()
    
    # find the maximal weight value at each time    
    values = for hour in [0..23]
      current = undefined
      for p in properties when p.spansTime hour
        if not current or p.weight > current.weight 
          current = p
      
      label: hour
      value: current?.options.value ? null

    data = [
      values: values
    ]

    @currentValue = values[time].value
    @chart.render data, time

  redrawMap : (time=@now) =>
    # show only properties that spans current time
    for p in @properties.list
      if p.spansTime time
        p.render(@map.map)
      else
        p.remove()    

  updateValue : (value) ->
    # update the info window
    @map.setInfoContent value

$.get "/data/properties.json", (data)->
  app = new App
    data:data