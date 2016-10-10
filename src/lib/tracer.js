const DEFAULT_STEPS = 8

export class Tracer {
  constructor(trace) {
    if (trace[0] != "H") { throw "First instruction part must be a heading"; }
    this.parts = trace.split(" ").map(Part.build);
    this.parts.push(new HeadingPart(this.changeOfHeading() + this.parts[0].heading));
  }
  toString() {
    return this.parts.map(x => x.toString()).join(" ");
  }
  changeOfHeading() {
    return this.parts.map(x => x.changeOfHeading()).reduce(sum, 0)
  }
}

export class Part {
  static build(instruction) {
    let cmd = instruction[0]
    let args = instruction.substr(1).split(",").map(parseFloat)
    switch (instruction[0]) {
      case 'F': return new StraightPart(...args);
      case 'R': return new CurvePart('R', ...args);
      case 'L': return new CurvePart('L', ...args);
      case 'H': return new HeadingPart(...args);
      default:  return new Part(instruction);
    }
  }
  constructor(cmd) {
    this.cmd = cmd;
    this.dist = 0;
  }
  mergeable(other) {
    return other.cmd == this.cmd
  }
  changeOfHeading() {
    return 0;
  }
  rangeX(heading) {
    return [ 0, 0 ];
  }
  rangeY(heading) {
    return [ 0, 0 ];
  }
  from(x, y, heading) {
    return [ x, y, heading ];
  }
}

class HeadingPart extends Part {
  constructor(heading) {
    super('H');
    this.heading = Math.round(heading);
  }
  toString() {
    return "H" + this.heading
  }
}

class StraightPart extends Part {
  constructor(dist) {
    super('F');
    this.dist = dist
  }
  merge(other) {
    return new StraightPart(this.dist + other.dist);
  }
  toString() {
    return "F" + this.dist;
  }
  plot(heading) {
    let origin = [ 0, 0 ];
    let sink   = [ øcos(heading, this.dist), øsin(heading, this.dist) ];
    let points = [ origin, sink ];
    return { points, heading }
  }
  extend(dist) {
    return new StraightPart(this.dist + dist);
  }
}

class CurvePart extends Part {
  constructor(side, radius, dist) {
    super(side);
    this.radius = radius;
    this.dist   = dist
  }
  mergeable(other) {
    return super.mergeable(other) && other.radius == this.radius;
  }
  merge(other) {
    return new CurvePart(this.cmd, this.radius, this.dist + other.dist);
  }
  toString() {
    return `${this.cmd}${this.radius},${this.dist}`
  }
  changeOfHeading(fromHeading = 0) {
    let sign = (this.cmd == 'L')? -1 : 1;
    return to_deg(this.dist / this.radius) * sign + fromHeading;
  }
  plot(heading, steps = DEFAULT_STEPS) {
    var points = [];
    let angleStep = this.changeOfHeading() / steps;
    var current = heading;
    for (var i = 0; i <= steps; i++) {
      let point = [ øcos(current, this.radius), øsin(current, this.radius) ];
      points.push(point);
      current += angleStep;
    }
    let translateToOrigin = ([x,y]) => {
      return [ x - points[0][0], y - points[0][1] ]
    };
    return {
      points: points.map(translateToOrigin),
      heading: this.changeOfHeading(heading)
    };
  }
  extend(dist) {
    return new CurvePart(this.cmd, this.radius, this.dist + dist);
  }
}

function sum(a,b) {
  return a + b;
}
function to_deg(angle) {
  return angle * 180 / Math.PI;
}
function to_rad(angle) {
  return angle * Math.PI / 180;
}
function øcos(angle, dist) {
  return Math.round(Math.cos(to_rad(angle - 90)) * dist);
}
function øsin(angle, dist) {
  return Math.round(Math.sin(to_rad(angle - 90)) * dist);
}


