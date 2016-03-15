import React from 'react'
import ReactKonva from 'react-konva'

export default React.createClass({
  initialState() {
    dragCenter: {}
  },
  componentWillMount() {
    let style = 'emerald'
    let { x, y, z } = this.props
    if ((x < 0) || (y < 0)) { return; }

    this.img = new Image()
    this.img.src = `http://api.mapbox.com/v4/mapbox.${style}/${z}/${x}/${y}.jpg?access_token=${process.env.MAPBOX_TOKEN}`;
  },
  render() {
    let debug = false;

    if (!this.img) { return <ReactKonva.Group></ReactKonva.Group>; }
    let { left, top, x, y, z, longitude, latitude, isCenter, inWorldHeight, inWorldWidth } = this.props

    let img = this.img;
    let debugColor = (isCenter && debug)? 'red':'transparent';

    return (
      <ReactKonva.Group>
        <ReactKonva.Image stroke={debugColor} image={img} border={debugColor} x={left} y={top} width={256} height={256}  />
        {debug && (
          <ReactKonva.Group>
            <ReactKonva.Text text={x} x={left+5} y={top+5}  fill={debugColor} />
            <ReactKonva.Text text={y} x={left+5} y={top+25} fill={debugColor} />
            <ReactKonva.Text text={longitude} x={left+5} y={top+45} fill={debugColor} />
            <ReactKonva.Text text={latitude}  x={left+5} y={top+65} fill={debugColor} />
            <ReactKonva.Text text={z} x={left+5} y={top+85}  fill={debugColor} />
          </ReactKonva.Group>
        )}
      </ReactKonva.Group>
    )
  }
});


