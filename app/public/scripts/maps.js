var Property, createPolygon;

Property = (function() {
  function Property(options, map) {
    this.options = options;
    this.map = map;
    this.polygon = createPolygon(this.options);
  }

  Property.prototype.render = function() {
    return this.polygon.setMap(this.map);
  };

  Property.prototype.remove = function() {
    return this.polygon.setMap(null);
  };

  Property.prototype.containsPoint = function(point) {
    return google.maps.geometry.poly.containsLocation(point, this.polygon);
  };

  Property.prototype.containsTime = function(time) {
    var time1, time2;
    time1 = this.options.timeRange[0];
    time2 = this.options.timeRange[1];
    if (time2 > time1) {
      return (time1 <= time && time <= time2);
    } else {
      return !((time2 < time && time < time1));
    }
  };

  return Property;

})();

createPolygon = function(property) {
  var paths, point;
  paths = (function() {
    var _i, _len, _ref, _results;
    _ref = property.geofences;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      point = _ref[_i];
      _results.push(new google.maps.LatLng(point[0], point[1]));
    }
    return _results;
  })();
  return new google.maps.Polygon({
    paths: paths,
    strokeColor: "#FF0000",
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: "#FF0000",
    fillOpacity: 0.35
  });
};
