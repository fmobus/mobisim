import expect from 'expect.js';

import { Part, Tracer } from '../src/lib/tracer.js';

describe("Tracer operations", () => {
  describe("Part parser", () => {
    let straight = Part.build("F30");
    let curveRight = Part.build("R30,100");
    let curveLeft  = Part.build("L60,200");

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
      it("is alike any other straight", () => {
        let other = Part.build("F400");
        expect(straight.alike(other)).to.be.ok();
      });
      it("is unlike any other command", () => {
        let other = Part.build("R400,100");
        expect(straight.alike(other)).to.not.be.ok();
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
      it("only alike if same radii and direction", () => {
        let other = Part.build("R30,200");
        expect(curveRight.alike(other)).to.be.ok();
      });
      it("unlike if different radii same direction", () => {
        let other = Part.build("R500,200");
        expect(curveRight.alike(other)).to.not.be.ok();
      });
      it("unlike if same radii different direction", () => {
        expect(curveRight.alike(curveLeft)).to.not.be.ok();
      });

      it("merges two curves of same radii and direction", () => {
        let other = Part.build("R30,200");
        let result = curveRight.merge(other);
        expect(result.radius).to.be(30);
        expect(result.dist).to.be(300);
      });
    });
  });

  // let base = Tracer("H0 F100 H0");
  // describe("append", () => {
  //   it("same operations are merged", () => {
  //     let result = base.append("F30");
  //     expect(result.toString(), "H0 F130 H0");
  //   });
  // });
});
