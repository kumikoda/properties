var createCoords, createPolygon, initialize, properties, propertiesByTimeRange, propertiesByWeight;

properties = crossfilter([
  {
    "type": "maxDispatchDistanceMiles",
    "value": 3,
    "weight": 1,
    "timeRange": [10, 16],
    "geofences": [[37.7749295, -122.4194155], [37.7900295, -122.4194155], [37.7900295, -122.4704155], [37.7749295, -122.4704155], [37.7749295, -122.4194155]]
  }, {
    "type": "maxDispatchDistanceMiles",
    "value": 5,
    "weight": 2,
    "timeRange": [14, 8],
    "geofences": [[37.7859295, -122.4304155], [37.7609295, -122.4504155], [37.7459295, -122.4304155], [37.7709295, -122.4154155], [37.7859295, -122.4304155]]
  }
]);

createCoords = function(points) {
  var point, _i, _len, _results;
  _results = [];
  for (_i = 0, _len = points.length; _i < _len; _i++) {
    point = points[_i];
    _results.push(new google.maps.LatLng(point[0], point[1]));
  }
  return _results;
};

createPolygon = function(property) {
  return new google.maps.Polygon({
    paths: createCoords(property.geofences),
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });
};

propertiesByWeight = properties.dimension(function(d) {
  return d.weight;
});

propertiesByTimeRange = properties.dimension(function(d) {
  return d.timeRnage;
});

initialize = function() {
  var center, zoom;
  center = new google.maps.LatLng(37.7749295, -122.4194155);
  return zoom = 13;
};

google.maps.event.addDomListener(window, "load", initialize);
