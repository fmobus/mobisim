import React from 'react'
import ReactKonva from 'react-konva'

export default React.createClass({
  componentWillMount() {
    let style = 'emerald'
    let { x, y, z } = this.props
    if ((x < 0) || (y < 0)) { return; }

    this.img = new Image()
    this.img.src = `http://api.mapbox.com/v4/mapbox.${style}/${z}/${x}/${y}.jpg?access_token=${process.env.MAPBOX_TOKEN}`;
  },
  render() {
    if (!this.img) { return <ReactKonva.Group></ReactKonva.Group>; }
    let { left, top, x, y, z, longitude, latitude, isCenter, onClick, inWorldHeight, inWorldWidth } = this.props
    let img = this.img;
    let debugColor = (isCenter)? 'red':'blue';
    let handleClick = function(ev) {
      ev.evt.latitude  = latitude  - inWorldHeight * (top  - ev.evt.layerY) / 256;
      ev.evt.longitude = longitude - inWorldWidth  * (left - ev.evt.layerX) / 256;
      return onClick(ev);
    }
    return (
      <ReactKonva.Group onClick={handleClick} tile={{left,top,x,y,z,longitude,latitude}}>
        <ReactKonva.Image stroke={debugColor} image={img} border={debugColor} x={left} y={top} width={254} height={254}  />
        <ReactKonva.Text text={x} x={left+5} y={top+5}  fill={debugColor} />
        <ReactKonva.Text text={y} x={left+5} y={top+25} fill={debugColor} />
        <ReactKonva.Text text={longitude} x={left+5} y={top+45} fill={debugColor} />
        <ReactKonva.Text text={latitude}  x={left+5} y={top+65} fill={debugColor} />
        <ReactKonva.Text text={z} x={left+5} y={top+85}  fill={debugColor} />
      </ReactKonva.Group>
    )
  }
});


