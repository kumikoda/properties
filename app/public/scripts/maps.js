var Legend, Map, colorSets, colors, _ref, _ref1,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Map = (function(_super) {
  __extends(Map, _super);

  function Map() {
    this.centerMap = __bind(this.centerMap, this);
    this.redrawPointer = __bind(this.redrawPointer, this);
    this.hideInfo = __bind(this.hideInfo, this);
    this.showInfo = __bind(this.showInfo, this);
    _ref = Map.__super__.constructor.apply(this, arguments);
    return _ref;
  }

  Map.prototype.initialize = function(options) {
    this.options = options;
    this.map = new google.maps.Map($(this.options.el)[0], {
      zoom: 13,
      center: this.options.center,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    });
    this.marker = new google.maps.Marker({
      position: this.map.getCenter(),
      map: this.map
    });
    this.infowindow = new google.maps.InfoWindow;
    this.legend = new Legend({
      range: this.options.range
    });
    this.legend.render();
    this.map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push($('.legend')[0]);
    return this.listen();
  };

  Map.prototype.listen = function() {
    var _this = this;
    google.maps.event.addListener(this.marker, 'click', this.showInfo);
    google.maps.event.addListener(this.map, 'dragstart', this.hideInfo);
    google.maps.event.addListener(this.map, 'dragend', function() {
      _this.trigger('moved');
      return _this.showInfo();
    });
    google.maps.event.addListener(this.map, 'drag', this.redrawPointer);
    return nv.utils.windowResize(this.centerMap);
  };

  Map.prototype.setInfoContent = function(value) {
    if (value) {
      return this.infowindow.setContent("<span id='currentValue'> " + String(value + " Miles </span>"));
    } else {
      return this.infowindow.setContent("<span id='currentValue'>No Data</span>");
    }
  };

  Map.prototype.showInfo = function() {
    return this.infowindow.open(this.map, this.marker);
  };

  Map.prototype.hideInfo = function() {
    return this.infowindow.close(this.map, this.marker);
  };

  Map.prototype.redrawPointer = function() {
    return this.marker.setPosition(this.map.getCenter());
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

  Legend.prototype.el = '.legend';

  Legend.prototype.initialize = function(options) {
    var high, low, x;
    this.options = options;
    this.d = this.options.range[1] - this.options.range[0] + 1;
    if (colorSets[this.d]) {
      this.colorSet = colorSets[this.d];
      this.stepSize = 1;
      return this.ranges = (function() {
        var _i, _ref2, _ref3, _results;
        _results = [];
        for (x = _i = _ref2 = this.options.range[0], _ref3 = options.range[1]; _ref2 <= _ref3 ? _i <= _ref3 : _i >= _ref3; x = _ref2 <= _ref3 ? ++_i : --_i) {
          _results.push(x);
        }
        return _results;
      }).call(this);
    } else {
      this.colorSet = colorSets[9];
      this.stepSize = Math.round(this.d / 9);
      return this.ranges = (function() {
        var _i, _results;
        _results = [];
        for (x = _i = 0; _i <= 9; x = ++_i) {
          low = this.stepSize * x;
          high = this.stepSize * (x + 1) - 1;
          _results.push("" + low + " - " + high);
        }
        return _results;
      }).call(this);
    }
  };

  Legend.prototype.render = function() {
    var color, i, range, _i, _len, _ref2, _results;
    _ref2 = this.ranges;
    _results = [];
    for (i = _i = 0, _len = _ref2.length; _i < _len; i = ++_i) {
      range = _ref2[i];
      color = this.colorSet[i];
      _results.push(this.$el.append(("<div class='range'><span>" + range + "</span><i class='icon-sign-blank' style='color:#") + color + "'></icon></div>"));
    }
    return _results;
  };

  Legend.prototype.getColor = function(x) {
    return this.colorSet[Math.floor(x / this.stepSize) - 1];
  };

  return Legend;

})(Backbone.View);

colorSets = {
  9: ['F7FCFD', 'E0ECF4', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '810F7C', '4D004B'],
  8: ['F7FCFD', 'E0ECF4', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '6E016B'],
  7: ['EDF8FB', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '6E016B'],
  6: ['EDF8FB', 'BFD3E6', '9EBCDA', '8C96C6', '8856A7', '810F7C'],
  5: ['EDF8FB', 'B3CDE3', '8C96C6', '8856A7', '810F7C'],
  4: ['EDF8FB', 'B3CDE3', '8C96C6', '88419D'],
  3: ['E0ECF4', '9EBCDA', '8856A7']
};

colors = ['F7FCFD', 'E0ECF4', 'BFD3E6', '9EBCDA', '8C96C6', '8C6BB1', '88419D', '810F7C', '4D004B'];
