var initialize, properties;

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

initialize = function() {
  var map, mapOptions;
  mapOptions = {
    center: new google.maps.LatLng(-34.397, 150.644),
    zoom: 8,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  return map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
};

google.maps.event.addDomListener(window, "load", initialize);
