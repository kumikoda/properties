class Property 
  constructor : (@options, @map) ->
    paths = (new google.maps.LatLng point[0] , point[1] for point in @options.geofences)
    
    @polygon = new google.maps.Polygon
      paths : paths
      strokeColor: 'black'
      strokeOpacity: 0.8
      strokeWeight: 2
      fillColor: 'black'
      fillOpacity: 0.7

    @setColor()

    
    google.maps.event.addListener @polygon, 'click', @showInfo
  
  render : (map) ->
    @polygon.setMap map 

  remove : ->
    @polygon.setMap null

  containsPoint : (point) ->
    google.maps.geometry.poly.containsLocation point , @polygon

  spansTime : (time) ->
    time1 = @options.timeRange[0]
    time2 = @options.timeRange[1]

    if time2>time1 
      time1 <= time <= time2
    else # inverse case
      not ( time2 < time < time1 )

  getValue : ->
    @options.value 

  getCenter : ->
    bounds = new google.maps.LatLngBounds()
    @polygon.getPath().forEach (point) ->
      bounds.extend point
    
    bounds.getCenter()

  setColor : (color) ->
    @polygon.setOptions 
      strokeColor : color
      fillColor : color


class Properties 
  constructor : (data) ->
    @list = (new Property d, null for d in data) 

  intersecting : (point) ->
    @list.filter (p) =>
      p.containsPoint point 

  # get center of centers of all properties
  getCenter : ->
    bounds = new google.maps.LatLngBounds()
    for p in @list 
      bounds.extend p.getCenter()

    bounds.getCenter()

  getRange : ->
    max = 0 
    for property in @list
      max = property.getValue() if property.getValue() > max 

    min = max 
    for property in @list 
      min = property.getValue() if property.getValue() < min

    [min,max] 


