var createCoords, createPolygon, initialize, properties;

properties = [
  {
    "type": "maxDispatchDistanceMiles",
    "value": 3,
    "weight": 1,
    "timeRange": [10, 16],
    "geofences": [[37.7749295, -122.4194155], [37.7900295, -122.4194155], [37.7900295, -122.4704155], [37.7749295, -122.4704155], [37.7749295, -122.4194155]]
  }, {
    "type": "maxDispatchDistanceMiles",
    "value": 3,
    "weight": 1,
    "timeRange": [10, 16],
    "geofences": [[37.7749295, -122.4194155], [37.7900295, -122.4194155], [37.7900295, -122.4704155], [37.7749295, -122.4704155], [37.7749295, -122.4194155]]
  }
];

createCoords = function(points) {
  var point, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = points.length; _i < _len; _i++) {
    point = points[_i];
    _results.push(new google.maps.LatLng(point[0], point[1]));
  }
  return _results;
};

createPolygon = function(coords) {
  return new google.maps.Polygon({
    paths: coords,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });
};

initialize = function() {
  var $map, coord, map, myLatLng, polygon, property, _i, _len, _results;
  $map = $('#map-canvas')[0];
  myLatLng = new google.maps.LatLng(37.7749295, -122.4194155);
  map = new google.maps.Map($map, {
    zoom: 5,
    center: myLatLng,
    mapTypeId: google.maps.MapTypeId.TERRAIN
  });
  _results = [];
  for (_i = 0, _len = properties.length; _i < _len; _i++) {
    property = properties[_i];
    coord = createCoords(property.geofences);
    polygon = createPolygon(coord);
    _results.push(polygon.setMap(map));
  }
  return _results;
};

google.maps.event.addDomListener(window, "load", initialize);
