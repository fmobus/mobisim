import React from 'react'
import ReactKonva from 'react-konva'

export default React.createClass({
  componentWillMount() {
    let style = 'emerald'
    let { x, y, z } = this.props

    this.img = new Image()
    this.img.src = `http://api.mapbox.com/v4/mapbox.${style}/${z}/${x}/${y}.jpg?access_token=${process.env.MAPBOX_TOKEN}`;
  },
  render() {
    let { left, top, x, y, z, longitude, latitude, isCenter } = this.props
    let img = this.img;
    let debugColor = (isCenter)? 'red':'blue';
    return (
      <ReactKonva.Group>
        <ReactKonva.Image stroke="blue" image={img} border={debugColor} x={left} y={top} width={256} height={256}  />
        <ReactKonva.Text text={x} x={left+5} y={top+5}  fill={debugColor} />
        <ReactKonva.Text text={y} x={left+5} y={top+25} fill={debugColor} />
        <ReactKonva.Text text={longitude} x={left+5} y={top+45} fill={debugColor} />
        <ReactKonva.Text text={latitude}  x={left+5} y={top+65} fill={debugColor} />
        <ReactKonva.Text text={z} x={left+5} y={top+85}  fill={debugColor} />
      </ReactKonva.Group>
    )
  }
});


