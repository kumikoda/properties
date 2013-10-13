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

    @infowindow = new google.maps.InfoWindow    
    google.maps.event.addListener @marker, 'click', @showInfo

    @legend = new Legend
    @legend.render()

    # Set Legend
    @map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push document.getElementById('legend')
    
    nv.utils.windowResize @centerMap 

    google.maps.event.addListener @map, 'dragstart', =>
      @hideInfo()

    # listen to drag event to update Chart  
    google.maps.event.addListener @map, 'dragend', => 
      @trigger 'moved'
      @showInfo()
      
    # listen to drag event to update marker
    google.maps.event.addListener @map, 'drag', @redrawPointer

  setInfoContent : (value) ->
    if value 
      @infowindow.setContent "<span id='currentValue'> " + String value + " Miles </span>"    
    else
      @infowindow.setContent "<span id='currentValue'>No Data</span>"    
     

  showInfo : =>
    @infowindow.open @map, @marker
  hideInfo : =>
    @infowindow.close @map, @marker

  redrawPointer : =>
    @marker.setPosition @map.getCenter()
  centerMap : =>
    @map.setCenter @marker.getPosition() 


class Legend extends Backbone.View
  el : '#legend'
  render : ->
    for color,i in colors
      @$el.append "<i class='icon-sign-blank' style='color:#"+color+"'></icon>"


colors = ['FFF7EC', 'FEE8C8', 'FDD49E', 'FDBB84', 'FC8D59', 'EF6548', 'D7301F', 'B30000', '7F0000']


class Property 
  constructor : (@options, @map) ->
    paths = (new google.maps.LatLng point[0] , point[1] for point in @options.geofences)
    
    @polygon = new google.maps.Polygon
      paths : paths
      strokeColor: colors[@options.value]
      strokeOpacity: 0.8
      strokeWeight: 2
      fillColor: colors[@options.value]
      fillOpacity: 0.7

    
    google.maps.event.addListener @polygon, 'click', @showInfo
  
  render : (map) ->
    @polygon.setMap map 

  remove : ->
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


