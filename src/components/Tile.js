import React from 'react'
import ReactKonva from 'react-konva'

export default React.createClass({
  componentWillMount() {
    console.log('mounting');
    let style = 'emerald'
    let { x, y, z } = this.props

    this.img = new Image()
    this.img.src = `http://api.mapbox.com/v4/mapbox.${style}/${z}/${x}/${y}.jpg?access_token=${process.env.MAPBOX_TOKEN}`;
  },
  render() {
    let { left : x, top: y } = this.props
    let img = this.img;
    return <ReactKonva.Image image={img} border="blue" x={x} y={y} width={256} height={256}  />
  }
});


