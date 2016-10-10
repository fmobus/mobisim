import expect from 'expect.js';

import { Part, Tracer } from '../src/lib/tracer.js';

describe("Tracer operations", () => {
  describe("Part parser", () => {
    let straight = Part.build("F30");
    let curveRight = Part.build("R30,100");
    let curveLeft  = Part.build("L60,90");
    let heading    = Part.build("H45");

    describe("heading", () => {
      it("has toString", () => {
        expect(heading.toString()).to.be("H45");
      });
      it("rounds to nearest integer", () => {
        let fractional = Part.build("H57.3");
        expect(fractional.toString()).to.be("H57");
      });
    });

    describe("straight", () => {
      it("has F as command", () => {
        expect(straight.cmd).to.be('F');
      });
      it("first argument is dist", () => {
        expect(straight.dist).to.be(30);
      });
      it("merges with other straight segments", () => {
        let other = Part.build("F400");
        let result = straight.merge(other);
        expect(result.cmd).to.be('F');
        expect(result.dist).to.be(430);
      });
      it("is mergeable any other straight", () => {
        let other = Part.build("F400");
        expect(straight.mergeable(other)).to.be.ok();
      });
      it("is unlike any other command", () => {
        let other = Part.build("R400,100");
        expect(straight.mergeable(other)).to.not.be.ok();
      });
      it("has toString", () => {
        expect(straight.toString()).to.be("F30");
      });
      it("plots points and final heading for the shape", () => {
        expect(straight.plot(90).points).to.eql([ [0, 0], [ 30,   0] ]);
        expect(straight.plot(45).points).to.eql([ [0, 0], [ 21, -21] ]);
        expect(straight.plot( 0).points).to.eql([ [0, 0], [  0, -30] ]);

        expect(straight.plot(90).heading).to.eql(90);
        expect(straight.plot(45).heading).to.eql(45);
        expect(straight.plot( 0).heading).to.eql( 0);
      });
      it("can be expanded and contracted in length", () => {
        expect(straight.longer(100).toString()).to.be("F130");
        expect(straight.shorter(10).toString()).to.be("F20");
      });
    });

    describe("curves", () => {
      it("right curve has R as command", () => {
        expect(curveRight.cmd).to.be('R');
      });
      it("left curve has L as command", () => {
        expect(curveLeft.cmd).to.be('L');
      });
      it("first argument is radius", () => {
        expect(curveRight.radius).to.be(30)
        expect(curveLeft.radius).to.be(60)
      });
      it("only mergeable if same radii and direction", () => {
        let other = Part.build("R30,200");
        expect(curveRight.mergeable(other)).to.be.ok();
      });
      it("unlike if different radii same direction", () => {
        let other = Part.build("R500,200");
        expect(curveRight.mergeable(other)).to.not.be.ok();
      });
      it("unlike if same radii different direction", () => {
        expect(curveRight.mergeable(curveLeft)).to.not.be.ok();
      });

      it("merges two curves of same radii and direction", () => {
        let other = Part.build("R30,200");
        let result = curveRight.merge(other);
        expect(result.radius).to.be(30);
        expect(result.dist).to.be(300);
      });
      it("has toString", () => {
        expect(curveRight.toString()).to.be("R30,100");
        expect(curveLeft.toString()).to.be("L60,90");
      });

      it("change of heading", () => {
        expect(curveRight.changeOfHeading()).to.be.eql(190.9859317102744);
        expect(curveLeft.changeOfHeading()).to.be(-85.94366926962348);
      });

      it("plots points and final heading for the shape", () => {
        expect(curveRight.plot(0).heading).to.be(190.9859317102744);
        expect(curveLeft.plot(0).heading).to.be(-85.94366926962348);

        let crPoints = curveRight.plot(0).points;
        expect(crPoints.length).to.be(9);
        expect(crPoints[0]).to.eql([  0,  0 ]);
        expect(crPoints[1]).to.eql([ 12,  3 ]);
        expect(crPoints[2]).to.eql([ 22, 10 ]);
        expect(crPoints[3]).to.eql([ 28, 21 ]);
        expect(crPoints[4]).to.eql([ 30, 33 ]);
        expect(crPoints[5]).to.eql([ 26, 45 ]);
        expect(crPoints[6]).to.eql([ 18, 54 ]);
        expect(crPoints[7]).to.eql([  7, 59 ]);
        expect(crPoints[8]).to.eql([ -6, 59 ]);
      });

      it("can be expanded and contracted in length", () => {
        expect(curveLeft.longer(100).toString()).to.be("L60,190");
        expect(curveLeft.shorter(10).toString()).to.be("L60,80");
      });

      xit("can be bent by changing the radius", () => {
        expect(curveRight.bend(10).toString()).to.be("R40,100");
        expect(curveLeft.bend(-20).toString()).to.be("R40,100");
      });
    });

  });

  describe("Construction", () => {
    let straight = new Tracer("H0 F100");
    let curve    = new Tracer("H0 R100,100");
    let mixed    = new Tracer("H100 L60,90 R30,100 F100");

    it("trace must start with heading", () => {
      let fn = function() { return new Tracer("F200"); };
      expect(fn).to.throwException();
    });
    it("always has an end-cap heading", () => {
      expect(straight.parts.length).to.be(3);
    });
    it("end-cap heading has the final direction", () => {
      expect(straight.toString()).to.be("H0 F100 H0");
      expect(curve.toString()).to.be("H0 R100,100 H57");
      expect(mixed.toString()).to.be("H100 L60,90 R30,100 F100 H205");
    });
    it("change of heading sums up all changes of heading from a trace's parts", () => {
      expect(straight.changeOfHeading()).to.be(0);
      expect(curve.changeOfHeading()).to.be(57.29577951308232);
      expect(mixed.changeOfHeading()).to.be(105.04226244065092);
    });
  });

  describe("Appending", () => {
    xit("same operations are merged", () => {
      let result = base.append("F30");
      expect(result.toString(), "H0 F130 H0");
    });
  });
});
