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
      "value": 8
      "weight": 3
      "timeRange": [0, 8]
      "geofences": [
        [37.794329926137074, -122.39469626171876] 
        [37.784969517158466, -122.38782980664064] 
        [37.77330126061319, -122.40156271679689]  
        [37.78022103035753, -122.41254904492189]
        [37.794329926137074, -122.39469626171876] 
      ]
    ,
      "type": "maxDispatchDistanceMiles"
      "value": 7
      "weight": 3
      "timeRange": [0, 8]
      "geofences": [
        [37.80463856948931, -122.44688132031251] 
        [37.808707374774876, -122.4103174470215] 
        [37.79731415505711, -122.40619757397462]  
        [37.79256646147798, -122.44499304516603] 
        [37.80463856948931, -122.44688132031251] 
      ]
    ,
      "type": "maxDispatchDistanceMiles"
      "value": 4
      "weight": 3
      "timeRange": [10, 20]
      "geofences": [
        [37.79243080860667, -122.40430929882814]  
        [37.78822544607388, -122.40379431469728] 
        [37.778999941586854, -122.42508032543947]   
        [37.78849676700842, -122.42851355297853] 
        [37.79243080860667, -122.40430929882814]  
      ]
    ,
      "type": "maxDispatchDistanceMiles"
      "value": 6
      "weight": 3
      "timeRange": [0, 8]
      "geofences": [
        [37.768823417405684, -122.426796939209] 
        [37.77018036822573, -122.41220572216798] 
        [37.752809517327655, -122.41048910839845]  
        [37.751587975877136, -122.42490866406251] 
        [37.768823417405684, -122.426796939209]  
      ]
    ,
      "type": "maxDispatchDistanceMiles"
      "value": 3
      "weight": 3
      "timeRange": [8, 22]
      "geofences": [
        [37.768823417405684, -122.426796939209] 
        [37.77018036822573, -122.41220572216798] 
        [37.752809517327655, -122.41048910839845]  
        [37.751587975877136, -122.42490866406251] 
        [37.768823417405684, -122.426796939209]  
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

    nv.utils.windowResize redrawPointer

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
      console.log [$scope.map.getCenter().lb,$scope.map.getCenter().mb] 

      redrawChart()
      redrawMap()
    
    # listen to drag event to update marker
    google.maps.event.addListener $scope.map, 'drag', redrawPointer


  redrawPointer = ->
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
  
