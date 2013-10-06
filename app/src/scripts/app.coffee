# a hacky global function because i can't figure out how to hook up events to the chart

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
    ,
      "type": "maxDispatchDistanceMiles"
      "value": 7
      "weight": 3
      "timeRange": [0, 8]
      "geofences": [
        [37.789989014339184, -122.39744284375001]
        [37.785783512835465, -122.38697149975587]
        [37.77316557237902, -122.40121939404298] 
        [37.78469818327388, -122.41272070629884]
        [37.78985335673589, -122.39744284375001]
      ]
    ]

  initialize = ->
    console.log 'init'
    initMap()
    initChart()
    initPointer()

    initProperties()

    redrawChart()
    redrawMap()
    

  initPointer = ->
    $scope.marker = new google.maps.Marker
      position: $scope.map.getCenter()
      map: $scope.map

  initProperties = ->
    $scope.properties = for d in getData()
      new Property d, $scope.map    


  initMap = ->
    $scope.map = new google.maps.Map $('#map-canvas')[0],
      zoom : 13
      center : new google.maps.LatLng 37.7749295, -122.4194155
      mapTypeId : google.maps.MapTypeId.TERRAIN

    # listen to drag event to update Chart  
    google.maps.event.addListener $scope.map, 'dragend', ->
      redrawChart()
      redrawMap()
    
    # listen to drag event to update marker
    google.maps.event.addListener $scope.map, 'drag', ->
      $scope.marker.setPosition $scope.map.getCenter()

  initChart = ->
    $scope.chart = new Chart
    $scope.chart.on 'select', redrawMap
  
  redrawChart = (time) =>

    properties = $scope.properties.filter (p) ->
      p.containsPoint $scope.map.getCenter()
        
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

    $scope.chart.render(data)
    $scope.chart.select(time)

  redrawMap = (time) =>
  
    if time >= 0 
      for p in $scope.properties
        if p.containsTime time
          p.render()
        else
          p.remove()    
    else 
      console.log 'null'
      p.render() for p in $scope.properties


  google.maps.event.addDomListener window, "load", initialize
  
