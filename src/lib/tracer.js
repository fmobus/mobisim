// import { zipObject } from 'lodash';

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
  alike(other) {
    return other.cmd == this.cmd
  }
}

class HeadingPart extends Part {
  constructor(heading) {
    super('H');
    this.heading = heading;
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
}

class CurvePart extends Part {
  constructor(side, radius, dist) {
    super(side);
    this.radius = radius;
    this.dist   = dist
  }
  alike(other) {
    return super.alike(other) && other.radius == this.radius;
  }
  merge(other) {
    return new CurvePart(this.cmd, this.radius, this.dist + other.dist);
  }
}

export const Tracer = (trace) => {
  let parts = trace.split(" ").map(Part);

  return {
    append: (other) => {

    }
  }
};
