function to_deg(angle) {
  return angle * 180 / Math.PI;
}
function to_rad(angle) {
  return angle * Math.PI / 180;
}
function cos(angle) {
  return Math.cos(to_rad(angle));
}
function sin(angle) {
  return Math.sin(to_rad(angle));
}

function Turtle(options, self) {
  var self = self || {};
  // from here on,
  //   this has public stuff
  //   self has private stuff
  self.x = 0,
  self.y = 0,
  self.heading = 0,
  self.trace = [[ self.x, self.y ]];
  self.tags  = { };

  this.heading = function(new_heading) {
    if (arguments.length == 0) { return self.heading; }
    self.heading = new_heading
    return this;
  }
  this.position = function(new_x, new_y) {
    if (arguments.length == 0) { return [ self.x, self.y ]; }
    self.x = new_x;
    self.y = new_y;
    self.trace.pop();
    self.trace.push([ self.x, self.y ]);
    return this;
  }
  this.tag = function(label) {
    self.tags[label] = this.position();
    return this;
  }
  this.tags = function() {
    return self.tags;
  }
  this.forward = function(distance) {
    self.x = self.x + cos(self.heading) * distance;
    self.y = self.y + sin(self.heading) * distance;
    self.trace.push([ self.x, self.y ]);
    return this;
  }
  this.right = function(degrees) {
    self.heading = (self.heading + 360 + degrees % 360) % 360;
    return this;
  }
  this.left = function(degrees) {
    return this.right(-degrees);
  }
  this.trace = function() {
    return self.trace;
  }
  this.curveRight = function(radius, travel) {
    var angle = (180 / Math.PI) * (travel / radius)
    var steps = options.CURVE_STEPS;
    for (var i = 0; i < steps; i++) {
      this.right(angle / steps);
      this.forward(travel / steps);
    }
    return this;
  }
  this.curveLeft = function(radius, travel) {
    var angle = (180 / Math.PI) * (travel / radius)
    var steps = options.CURVE_STEPS;
    for (var i = 0; i < steps; i++) {
      this.left(angle / steps);
      this.forward(travel / steps);
    }
    return this;
  }

  this.fromDump = function(dump) {
    var parts = dump.split(" ");
    for (var i = 0; i < parts.length; i++) {
      var command = parts[i].slice(0,1);
      var args = parts[i].slice(1).split(",").map(parseFloat);
      switch (command) {
        case 'H': this.heading(args[0]); break;
        case 'F': this.forward(args[0]); break;
        case 'R': this.curveRight(args[0], args[1]); break;
        case 'r': this.right(args[0]); break;
        case 'L': this.curveLeft(args[0], args[1]); break;
        case 'l': this.left(args[0]); break;
      }
    }
    return this;
  }

  return this;
}

function GeoTurtle(options) {
  var self = {};
  Turtle.call(this, options, self);

  this.forward = function(distance) {
    // adapted from http://www.movable-type.co.uk/scripts/latlong.html,
    // licensed originally as CC-by
    var lon1 = to_rad(self.x);
    var lat1 = to_rad(self.y)
      var brng = to_rad(self.heading)
      var R = 6378.1370
      var d = parseFloat(distance/1000)/R;  // d = angular distance covered on earth’s surface

    var dLat = d*Math.cos(brng);
    // nasty kludge to overcome ill-conditioned results around parallels of latitude:
    if (Math.abs(dLat) < 1e-10) dLat = 0; // dLat < 1 mm

    var lat2 = lat1 + dLat;
    var dPhi = Math.log(Math.tan(lat2/2+Math.PI/4)/Math.tan(lat1/2+Math.PI/4));
    var q = (isFinite(dLat/dPhi)) ? dLat/dPhi : Math.cos(lat1);  // E-W line gives dPhi=0
    var dLon = d*Math.sin(brng)/q;

    // check for some daft bugger going past the pole, normalise latitude if so
    if (Math.abs(lat2) > Math.PI/2) lat2 = lat2>0 ? Math.PI-lat2 : -Math.PI-lat2;
    var lon2 = (lon1+dLon+3*Math.PI)%(2*Math.PI) - Math.PI;

    self.x = to_deg(lon2);
    self.y = to_deg(lat2);
    self.trace.push([ self.x, self.y ]);

    return this;
  }

  return this;
}

var DEFAULTS = {
  CURVE_STEPS: 8
}

export default {
  Turtle:    function(options) { return new Turtle({ ...DEFAULTS, options }); },
  GeoTurtle: function(options) { return new GeoTurtle({ ...DEFAULTS, options }); }
};
