var Legend, Map, Property, colors, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Map = (function(_super) {
  __extends(Map, _super);

  function Map() {
    this.centerMap = __bind(this.centerMap, this);
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
    this.legend = new Legend;
    this.legend.render();
    this.map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(document.getElementById('title'));
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('values'));
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(document.getElementById('legend'));
    nv.utils.windowResize(this.centerMap);
    google.maps.event.addListener(this.map, 'dragend', function() {
      return _this.trigger('moved');
    });
    return google.maps.event.addListener(this.map, 'drag', this.redrawPointer);
  };

  Map.prototype.redrawPointer = function() {
    return this.marker.setPosition(this.map.getCenter());
  };

  Map.prototype.updateValues = function(time, value) {
    $('#values .currentTime').html(time);
    return $('#values .currentValue').text(value);
  };

  Map.prototype.centerMap = function() {
    return this.map.setCenter(this.marker.getPosition());
  };

  return Map;

})(Backbone.View);

Legend = (function(_super) {
  __extends(Legend, _super);

  function Legend() {
    _ref1 = Legend.__super__.constructor.apply(this, arguments);
    return _ref1;
  }

  Legend.prototype.el = '#legend';

  Legend.prototype.initialize = function() {
    return console.log('new legend');
  };

  Legend.prototype.render = function() {
    var color, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = colors.length; _i < _len; _i++) {
      color = colors[_i];
      _results.push(this.$el.append("<icon class='icon-sign-blank'></icon>"));
    }
    return _results;
  };

  return Legend;

})(Backbone.View);

colors = ['F7F4F9', 'E7E1EF', 'D4B9DA', 'C994C7', 'DF65B0', 'E7298A', 'CE1256', '980043', '67001F'];

Property = (function() {
  function Property(options, map) {
    var paths, point;
    this.options = options;
    this.map = map;
    paths = (function() {
      var _i, _len, _ref2, _results;
      _ref2 = this.options.geofences;
      _results = [];
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        point = _ref2[_i];
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
