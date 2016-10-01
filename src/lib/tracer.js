// import { zipObject } from 'lodash';

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
    let sum = (a,b) => a + b;
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
  }
  mergeable(other) {
    return other.cmd == this.cmd
  }
  changeOfHeading() {
    return 0;
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
  changeOfHeading() {
    let sign = (this.cmd == 'L')? -1 : 1;
    return to_deg(this.dist / this.radius) * sign;
  }
}

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


