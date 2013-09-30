appController = ($scope) ->
  console.log 'start'
  # a fake function that returns the data
  getData = () ->
    [
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
      "value": 5
      "weight": 2
      "timeRange": [14, 8]
      "geofences": [
        [37.7859295, -122.4304155]
        [37.7609295, -122.4504155]
        [37.7459295, -122.4304155] 
        [37.7709295, -122.4154155]
        [37.7859295, -122.4304155]
      ]
    ]

  initialize = ->
    console.log 'init'
    initMap()
    initProperties()
    initGraph()

  initMap = ->
    $scope.map = new google.maps.Map $('#map-canvas')[0],
      zoom : 13
      center : new google.maps.LatLng 37.7749295, -122.4194155
      mapTypeId : google.maps.MapTypeId.TERRAIN

    # listen to drag event to update graph  
    google.maps.event.addListener $scope.map, 'dragend', redrawGraph
    
  initGraph = ->
    # all the properties that interset the center

    properties = for p in $scope.properties
      if p.containsPoint $scope.map.getCenter()
        p

    for time in [0..23]
      current = undefined
      for p in $scope.properties
        if p.containsTime time
          if not current or p.weight > current.weight 
            current = p
      console.log p
          

    

    # listen to drag event to update map

  initProperties = ->
    $scope.properties = for d in getData()
      property = new Property d, $scope.map
      property.render()
      property    

  redrawGraph = =>
    # filter through all properties that intersect this geolocation
    for p in $scope.properties
      if p.containsPoint $scope.map.getCenter()
        console.log 'yes!' 

  window.redrawMap = =>
    time = 17
    for p in $scope.properties
      if p.containsTime time
        p.render()
      else
        p.remove()    

  google.maps.event.addDomListener window, "load", initialize
  
