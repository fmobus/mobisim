import expect from 'expect.js';

import reducer from '../src/reducers/graph'

describe("network graph operations", () => {
  describe("segment creation", () => {
    let GROUND_STATE = [
      { id: 1, type: 'Node', northing: 8000, easting: 5000 }
    ]

    it("creates segment from node heading East by 30 meters", () => {
      let result = reducer(GROUND_STATE, { type: "CREATE_SEGMENT", fromNode: 1, heading: 90, distance: 30 })
      expect(result).to.have.length(3);
      expect(result[0]).to.eql(GROUND_STATE[0]);
      expect(result[1]).to.eql({ id: 2, type: 'Node', northing: 8000, easting: 5030 });
      expect(result[2]).to.eql({ id: 3, type: 'Segment', nodes: [1,2], trace: 'H90 F30 H90' });
    });
    it("creates segment from node heading North by 30 meters", () => {
      let result = reducer(GROUND_STATE, { type: "CREATE_SEGMENT", fromNode: 1, heading: 0, distance: 30 })
      expect(result).to.have.length(3);
      expect(result[0]).to.eql(GROUND_STATE[0]);
      expect(result[1]).to.eql({ id: 2, type: 'Node', northing: 8030, easting: 5000 });
      expect(result[2]).to.eql({ id: 3, type: 'Segment', nodes: [1,2], trace: 'H0 F30 H0' });
    });
  });
  describe("append segment", () => {
    let GROUND_STATE = [
      { id: 1, type: 'Node', northing: 8000, easting: 5000 },
      { id: 2, type: 'Node', northing: 8100, easting: 5000 },
      { id: 3, type: 'Segment', nodes: [1,2], trace: 'H0 F100 H0' }
    ]
    describe("with a straight line", () => {
      xit("adjusts end node and segment trace", () => {
        let result = reducer(GROUND_STATE, { type: 'APPEND_SEGMENT_STRAIGHT', id: 3, distance: 30 })
        expect(result).to.have.length(3);
        expect(result[0]).to.eql(GROUND_STATE[0]);
        expect(result[1].northing).to.eql(8130);
        expect(result[2].trace).to.be('H0 F130 H0');
      });
    });
  });
});

