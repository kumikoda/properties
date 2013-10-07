class Map extends Backbone.View
  initialize : ->
    @map = new google.maps.Map $('#map-canvas')[0],
      zoom : 13
      center : new google.maps.LatLng 37.7749295, -122.4194155
      mapTypeId : google.maps.MapTypeId.TERRAIN

    @properties = []

    @marker = new google.maps.Marker
      position: @map.getCenter()
      map: @map

    @legend = new Legend
    @legend.render()

    # Set map title and legends
    @map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push document.getElementById('title')
    @map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push document.getElementById('values')
    @map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push document.getElementById('legend')
    
    nv.utils.windowResize @centerMap 

    # listen to drag event to update Chart  
    google.maps.event.addListener @map, 'dragend', => 
      @trigger 'moved'
      
    # listen to drag event to update marker
    google.maps.event.addListener @map, 'drag', @redrawPointer


  updateValues : (time, value) ->
    $('#values .currentTime').html time
    $('#values .currentValue').text value

  centerMap : =>
    @map.setCenter @marker.getPosition() 


class Legend extends Backbone.View
  el : '#legend'

  initialize : ->
    console.log 'new legend'

  render : ->
    for color in colors 
      @$el.append "<icon class='icon-sign-blank'></icon>"


colors = [
  'F7F4F9'
, 'E7E1EF'
, 'D4B9DA'
, 'C994C7'
, 'DF65B0'
, 'E7298A'
, 'CE1256'
, '980043'
, '67001F'
]


class Property 
  constructor : (@options, @map) ->
    paths = (new google.maps.LatLng point[0] , point[1] for point in @options.geofences)
    
    @polygon = new google.maps.Polygon
      paths : paths
      strokeColor: colors[@options.value]
      strokeOpacity: 0.8
      strokeWeight: 2
      fillColor: colors[@options.value]
      fillOpacity: 0.5
  
  render : (map) ->
    @polygon.setMap map 

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


