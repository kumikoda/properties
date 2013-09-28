properties = [
    "type" : "maxDispatchDistanceMiles"
    "value" : 3
    "weight" : 1
    "timeRange" : [10, 16]
    "geofences" : [
      [37.7749295, -122.4194155]
      [37.7900295, -122.4194155]
      [37.7900295, -122.4704155]
      [37.7749295, -122.4704155]
      [37.7749295, -122.4194155]
    ]
  ,
    "type": "maxDispatchDistanceMiles"
    "value": 3
    "weight": 1
    "timeRange": [10, 16]
    "geofences": [
      [37.7749295, -122.4194155]
      [37.7900295, -122.4194155]
      [37.7900295, -122.4704155]
      [37.7749295, -122.4704155]
      [37.7749295, -122.4194155]
    ]

]

createCoords = (points) ->
  (new google.maps.LatLng point[0] , point[1] for point in points) 

createPolygon = (coords) ->
  new google.maps.Polygon
    paths : coords
    strokeColor: "#FF0000"
    strokeOpacity: 0.8
    strokeWeight: 2
    fillColor: "#FF0000"
    fillOpacity: 0.35

initialize = ->
  $map = $('#map-canvas')[0]

  myLatLng = new google.maps.LatLng(37.7749295, -122.4194155)
  
  map = new google.maps.Map $map,
    zoom : 5
    center : myLatLng
    mapTypeId : google.maps.MapTypeId.TERRAIN

  for property in properties
    coord = createCoords property.geofences
    polygon = createPolygon coord
    polygon.setMap map
  


google.maps.event.addDomListener window, "load", initialize