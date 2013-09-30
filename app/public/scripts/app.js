var appController;

appController = function($scope) {
  var getData, initGraph, initMap, initProperties, initialize, redrawGraph,
    _this = this;
  console.log('start');
  getData = function() {
    return [
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
    ];
  };
  initialize = function() {
    console.log('init');
    initMap();
    initProperties();
    return initGraph();
  };
  initMap = function() {
    $scope.map = new google.maps.Map($('#map-canvas')[0], {
      zoom: 13,
      center: new google.maps.LatLng(37.7749295, -122.4194155),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    return google.maps.event.addListener($scope.map, 'dragend', redrawGraph);
  };
  initGraph = function() {
    var current, p, properties, time, _i, _j, _len, _ref, _results;
    properties = (function() {
      var _i, _len, _ref, _results;
      _ref = $scope.properties;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        p = _ref[_i];
        if (p.containsPoint($scope.map.getCenter())) {
          _results.push(p);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    })();
    _results = [];
    for (time = _i = 0; _i <= 23; time = ++_i) {
      current = void 0;
      _ref = $scope.properties;
      for (_j = 0, _len = _ref.length; _j < _len; _j++) {
        p = _ref[_j];
        if (p.containsTime(time)) {
          if (!current || p.weight > current.weight) {
            current = p;
          }
        }
      }
      _results.push(console.log(p));
    }
    return _results;
  };
  initProperties = function() {
    var d, property;
    return $scope.properties = (function() {
      var _i, _len, _ref, _results;
      _ref = getData();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        property = new Property(d, $scope.map);
        property.render();
        _results.push(property);
      }
      return _results;
    })();
  };
  redrawGraph = function() {
    var p, _i, _len, _ref, _results;
    _ref = $scope.properties;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (p.containsPoint($scope.map.getCenter())) {
        _results.push(console.log('yes!'));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };
  window.redrawMap = function() {
    var p, time, _i, _len, _ref, _results;
    time = 17;
    _ref = $scope.properties;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      if (p.containsTime(time)) {
        _results.push(p.render());
      } else {
        _results.push(p.remove());
      }
    }
    return _results;
  };
  return google.maps.event.addDomListener(window, "load", initialize);
};
