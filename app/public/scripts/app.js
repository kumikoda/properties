var appController;

appController = function($scope) {
  var getData, initChart, initMap, initPointer, initProperties, initialize, redrawChart, redrawMap, redrawPointer,
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
      }, {
        "type": "maxDispatchDistanceMiles",
        "value": 8,
        "weight": 3,
        "timeRange": [0, 8],
        "geofences": [[37.794329926137074, -122.39469626171876], [37.784969517158466, -122.38782980664064], [37.77330126061319, -122.40156271679689], [37.78022103035753, -122.41254904492189], [37.794329926137074, -122.39469626171876]]
      }, {
        "type": "maxDispatchDistanceMiles",
        "value": 7,
        "weight": 3,
        "timeRange": [0, 8],
        "geofences": [[37.80463856948931, -122.44688132031251], [37.808707374774876, -122.4103174470215], [37.79731415505711, -122.40619757397462], [37.79256646147798, -122.44499304516603], [37.80463856948931, -122.44688132031251]]
      }, {
        "type": "maxDispatchDistanceMiles",
        "value": 4,
        "weight": 3,
        "timeRange": [10, 20],
        "geofences": [[37.79243080860667, -122.40430929882814], [37.78822544607388, -122.40379431469728], [37.778999941586854, -122.42508032543947], [37.78849676700842, -122.42851355297853], [37.79243080860667, -122.40430929882814]]
      }, {
        "type": "maxDispatchDistanceMiles",
        "value": 6,
        "weight": 3,
        "timeRange": [0, 8],
        "geofences": [[37.768823417405684, -122.426796939209], [37.77018036822573, -122.41220572216798], [37.752809517327655, -122.41048910839845], [37.751587975877136, -122.42490866406251], [37.768823417405684, -122.426796939209]]
      }, {
        "type": "maxDispatchDistanceMiles",
        "value": 3,
        "weight": 3,
        "timeRange": [8, 22],
        "geofences": [[37.768823417405684, -122.426796939209], [37.77018036822573, -122.41220572216798], [37.752809517327655, -122.41048910839845], [37.751587975877136, -122.42490866406251], [37.768823417405684, -122.426796939209]]
      }
    ];
  };
  initialize = function() {
    console.log('init');
    initMap();
    initChart();
    initPointer();
    initProperties();
    redrawChart();
    return redrawMap();
  };
  initPointer = function() {
    $scope.marker = new google.maps.Marker({
      position: $scope.map.getCenter(),
      map: $scope.map
    });
    return nv.utils.windowResize(redrawPointer);
  };
  initProperties = function() {
    var d;
    return $scope.properties = (function() {
      var _i, _len, _ref, _results;
      _ref = getData();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        d = _ref[_i];
        _results.push(new Property(d, $scope.map));
      }
      return _results;
    })();
  };
  initMap = function() {
    $scope.map = new google.maps.Map($('#map-canvas')[0], {
      zoom: 13,
      center: new google.maps.LatLng(37.7749295, -122.4194155),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    google.maps.event.addListener($scope.map, 'dragend', function() {
      console.log([$scope.map.getCenter().lb, $scope.map.getCenter().mb]);
      redrawChart();
      return redrawMap();
    });
    return google.maps.event.addListener($scope.map, 'drag', redrawPointer);
  };
  redrawPointer = function() {
    return $scope.marker.setPosition($scope.map.getCenter());
  };
  initChart = function() {
    $scope.chart = new Chart;
    return $scope.chart.on('select', redrawMap);
  };
  redrawChart = function(time) {
    var current, data, p, properties, values;
    properties = $scope.properties.filter(function(p) {
      return p.containsPoint($scope.map.getCenter());
    });
    values = (function() {
      var _i, _j, _len, _ref, _results;
      _results = [];
      for (time = _i = 0; _i <= 23; time = ++_i) {
        current = void 0;
        for (_j = 0, _len = properties.length; _j < _len; _j++) {
          p = properties[_j];
          if (p.containsTime(time)) {
            if (!current || p.weight > current.weight) {
              current = p;
            }
          }
        }
        _results.push({
          label: time,
          value: (_ref = current != null ? current.options.value : void 0) != null ? _ref : null
        });
      }
      return _results;
    })();
    data = [
      {
        values: values
      }
    ];
    $scope.chart.render(data);
    return $scope.chart.select(time);
  };
  redrawMap = function(time) {
    var p, _i, _j, _len, _len1, _ref, _ref1, _results, _results1;
    if (time >= 0) {
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
    } else {
      console.log('null');
      _ref1 = $scope.properties;
      _results1 = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        p = _ref1[_j];
        _results1.push(p.render());
      }
      return _results1;
    }
  };
  return google.maps.event.addDomListener(window, "load", initialize);
};
