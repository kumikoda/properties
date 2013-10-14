class Map extends Backbone.View
  initialize : (@options)->
    @map = new google.maps.Map $(@options.el)[0],
      zoom : 13
      center : @options.center
      mapTypeId : google.maps.MapTypeId.TERRAIN

    @marker = new google.maps.Marker
      position: @map.getCenter()
      map: @map

    @infowindow = new google.maps.InfoWindow    
    
    @legend = new Legend
      range : @options.range
    @legend.render()
    @map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push $('.legend')[0]
    
    @listen()
    
  listen : ->
    # show info window on click 
    google.maps.event.addListener @marker, 'click', @showInfo

    # hide info window when dragging
    google.maps.event.addListener @map, 'dragstart', @hideInfo

    # listen to drag event to update Chart  
    google.maps.event.addListener @map, 'dragend', => 
      @trigger 'moved'
      @showInfo()
      
    # listen to drag event to update marker
    google.maps.event.addListener @map, 'drag', @redrawPointer

    # maintain map center on window resizing 
    nv.utils.windowResize =>
      @centerMap()
      @refreshInfo()

  setInfoContent : (value) ->
    if value 
      @infowindow.setContent "<span id='currentValue'> " + String value + " miles</span>"    
    else
      @infowindow.setContent "<span id='currentValue'>No Data</span>"    
     
  refreshInfo : ->
    @hideInfo()
    @showInfo()

  showInfo : =>
    @infowindow.open @map, @marker
  
  hideInfo : =>
    @infowindow.close @map, @marker

  redrawPointer : =>
    @marker.setPosition @map.getCenter()

  centerMap : =>
    @map.setCenter @marker.getPosition() 


class Legend extends Backbone.View
  el : '.legend'

  initialize : (@options) ->
    @min = @options.range[0]
    @max = @options.range[1]
    @d = @max - @min + 1
    
    # if there is a scheme that fits 
    if colorSets[@d]
      @colorSet = colorSets[@d]
      @stepSize = 1
      @ranges = (x for x in [@min .. @max])  

    else 
      if @d < 19
        @colorSet = colorSets[Math.floor(@d/2)]
        @stepSize = 2
      else
        @colorSet = colorSets[9]
        @stepSize = Math.ceil @d / 9 
      
      @ranges = for x in [0...@colorSet.length]
        low = @stepSize*x + @min  
        high = @stepSize*(x+1) - 1 + @min
        "#{low} - #{high}" 
      
  render : () ->
    for range,i in @ranges
      color = @colorSet[i] 
      @$el.find('.ranges').append "<div class='range'><span class='range-label'>#{range}</span><i class='icon-sign-blank' style='color:#"+color+"'></icon></div>"

  getColor : (x) ->
    @colorSet[ Math.floor( (x-@min) / @stepSize) ]
    
colorSets = 
  9 : ['F7FCFD', 'E0ECF4', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '810F7C', '4D004B']
  8 : ['F7FCFD', 'E0ECF4', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '6E016B']
  7 : ['EDF8FB', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '6E016B']
  6 : ['EDF8FB', 'BFD3E6', '9EBCDA', '8C96C6', '8856A7', '810F7C']
  5 : ['EDF8FB', 'B3CDE3', '8C96C6', '8856A7', '810F7C']
  4 : ['EDF8FB', 'B3CDE3', '8C96C6', '88419D']
  3 : ['E0ECF4', '9EBCDA', '8856A7']


colors = ['F7FCFD', 'E0ECF4', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '810F7C', '4D004B']