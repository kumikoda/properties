class Property 
  constructor : (@options, @map) ->
    @polygon = createPolygon @options
  
  render : () ->
    @polygon.setMap @map

  remove : () ->
    @polygon.setMap null

  containsPoint : (point) ->
    google.maps.geometry.poly.containsLocation point , @polygon

  containsTime : (time) ->

    time1 = @options.timeRange[0]
    time2 = @options.timeRange[1]

    if time2>time1 
      time1 <= time <= time2
    else # inverse case
      not ( time2 < time < time1 )


# A convenience function to generate a new google maps polygon 
createPolygon = (property) ->

  paths = (new google.maps.LatLng point[0] , point[1] for point in property.geofences)
  
  new google.maps.Polygon
    paths : paths
    strokeColor: "#FF0000"
    strokeOpacity: 0.8
    strokeWeight: 2
    fillColor: "#FF0000"
    fillOpacity: 0.35

