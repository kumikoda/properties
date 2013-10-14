var Properties, Property;

Property = (function() {
  function Property(options, map) {
    var paths, point;
    this.options = options;
    this.map = map;
    paths = (function() {
      var _i, _len, _ref, _results;
      _ref = this.options.geofences;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        point = _ref[_i];
        _results.push(new google.maps.LatLng(point[0], point[1]));
      }
      return _results;
    }).call(this);
    this.polygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: 'black',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'black',
      fillOpacity: 0.7
    });
    this.setColor();
    google.maps.event.addListener(this.polygon, 'click', this.showInfo);
  }

  Property.prototype.render = function(map) {
    return this.polygon.setMap(map);
  };

  Property.prototype.remove = function() {
    return this.polygon.setMap(null);
  };

  Property.prototype.containsPoint = function(point) {
    return google.maps.geometry.poly.containsLocation(point, this.polygon);
  };

  Property.prototype.spansTime = function(time) {
    var time1, time2;
    time1 = this.options.timeRange[0];
    time2 = this.options.timeRange[1];
    if (time2 > time1) {
      return (time1 <= time && time <= time2);
    } else {
      return !((time2 < time && time < time1));
    }
  };

  Property.prototype.getValue = function() {
    return this.options.value;
  };

  Property.prototype.getCenter = function() {
    var bounds;
    bounds = new google.maps.LatLngBounds();
    this.polygon.getPath().forEach(function(point) {
      return bounds.extend(point);
    });
    return bounds.getCenter();
  };

  Property.prototype.setColor = function(color) {
    return this.polygon.setOptions({
      strokeColor: color,
      fillColor: color
    });
  };

  return Property;

})();

Properties = (function() {
  function Properties(data) {
    var d;
    this.list = (function() {
      var _i, _len, _results;
      _results = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        d = data[_i];
        _results.push(new Property(d, null));
      }
      return _results;
    })();
  }

  Properties.prototype.intersecting = function(point) {
    var _this = this;
    return this.list.filter(function(p) {
      return p.containsPoint(point);
    });
  };

  Properties.prototype.getCenter = function() {
    var bounds, p, _i, _len, _ref;
    bounds = new google.maps.LatLngBounds();
    _ref = this.list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      p = _ref[_i];
      bounds.extend(p.getCenter());
    }
    return bounds.getCenter();
  };

  Properties.prototype.getRange = function() {
    var max, min, property, _i, _j, _len, _len1, _ref, _ref1;
    max = 0;
    _ref = this.list;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      property = _ref[_i];
      if (property.getValue() > max) {
        max = property.getValue();
      }
    }
    min = max;
    _ref1 = this.list;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      property = _ref1[_j];
      if (property.getValue() < min) {
        min = property.getValue();
      }
    }
    return [min, max];
  };

  return Properties;

})();
