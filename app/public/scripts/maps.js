var Map, Property, colors, _ref,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Map = (function(_super) {
  __extends(Map, _super);

  function Map() {
    this.redrawPointer = __bind(this.redrawPointer, this);
    _ref = Map.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Map.prototype.initialize = function() {
    var _this = this;
    this.map = new google.maps.Map($('#map-canvas')[0], {
      zoom: 13,
      center: new google.maps.LatLng(37.7749295, -122.4194155),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    this.properties = [];
    this.marker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map
    });
    nv.utils.windowResize(this.redrawPointer);
    google.maps.event.addListener(this.map, 'dragend', function() {
      return _this.trigger('moved');
    });
    return google.maps.event.addListener(this.map, 'drag', this.redrawPointer);
  };

  Map.prototype.redrawPointer = function() {
    return this.marker.setPosition(this.map.getCenter());
  };

  return Map;

})(Backbone.View);

colors = ['F7F4F9', 'E7E1EF', 'D4B9DA', 'C994C7', 'DF65B0', 'E7298A', 'CE1256', '980043', '67001F'];

Property = (function() {
  function Property(options, map) {
    var paths, point;
    this.options = options;
    this.map = map;
    paths = (function() {
      var _i, _len, _ref1, _results;
      _ref1 = this.options.geofences;
      _results = [];
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        point = _ref1[_i];
        _results.push(new google.maps.LatLng(point[0], point[1]));
      }
      return _results;
    }).call(this);
    this.polygon = new google.maps.Polygon({
      paths: paths,
      strokeColor: colors[this.options.value],
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: colors[this.options.value],
      fillOpacity: 0.5
    });
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
