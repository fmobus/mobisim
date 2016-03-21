function long2tile(lon,zoom) {
  return (Math.floor((lon+180)/360*Math.pow(2,zoom)));
}
function lat2tile(lat,zoom) {
  return (Math.floor((1-Math.log(Math.tan(lat*Math.PI/180) + 1/Math.cos(lat*Math.PI/180))/Math.PI)/2 *Math.pow(2,zoom)));
}
function tile2long(x,z) {
  return (x/Math.pow(2,z)*360-180);
}
function tile2lat(y,z) {
  var n=Math.PI-2*Math.PI*y/Math.pow(2,z);
  return (180/Math.PI*Math.atan(0.5*(Math.exp(n)-Math.exp(-n))));
}

function appendCoords(tile) {
  return { ...tile, longitude: tile2long(tile.x, tile.z), latitude: tile2lat(tile.y, tile.z) };
}

const Tiler = function(width, height) {
  this.width = width;
  this.height = height;

  let tileSize = 256;
  let columns  = Math.ceil(width / tileSize);
  let rows     = Math.ceil(height / tileSize);
  let xFirst = -1 * Math.ceil(columns / 2);
  let xLast  = +1 * Math.ceil(columns / 2);
  let yFirst = -1 * Math.ceil(rows / 2);
  let yLast  = +1 * Math.ceil(rows / 2);

  this.tileSetupFor = function(lon, lat, zoom) {
    var tiles = [];
    var centerTile = { x: long2tile(lon, zoom), y: lat2tile(lat, zoom), z: zoom };
    var tileEdge = { longitude: tile2long(centerTile.x, zoom), latitude: tile2lat(centerTile.y, zoom) };
    var inWorldWidth  = tileEdge.longitude - tile2long(centerTile.x - 1, zoom);
    var inWorldHeight = tileEdge.latitude  - tile2lat(centerTile.y - 1, zoom);
    var centerOffsetX = ((lon - tileEdge.longitude) / inWorldWidth) * tileSize;
    var centerOffsetY = ((lat - tileEdge.latitude) / inWorldHeight) * tileSize;

    for (var i = xFirst; i <= xLast; i++) {
      for (var j = yFirst; j <= yLast; j++) {
        let longitude = tile2long(centerTile.x + i, zoom)
        let latitude  = tile2lat(centerTile.y + j, zoom)
        let isCenter = latitude == tileEdge.latitude && longitude == tileEdge.longitude;
        tiles.push({
          x: centerTile.x + i, y: centerTile.y + j, z: zoom,
          left: (width / 2)  + tileSize * i - centerOffsetX,
          top:  (height / 2) + tileSize * j - centerOffsetY,
          inWorldHeight, inWorldWidth, longitude, latitude, isCenter,
          width: tileSize, height: tileSize
        })
      }
    }

    return new TileSetup(tiles);
  };

  return this;
}

var instance = null;

const TileSetup = function(tiles) {
  this.centerTile = function() {
    return tiles.filter((t) => t.isCenter)[0];
  }
  this.tiles = function() {
    return tiles;
  }
  return this;
}

export default function(width, height) {
  if (!instance) {
    instance = new Tiler(width, height);
  } else if ((instance.width != width) || (instance.height != height)) {
    instance = new Tiler(width, height);
  }
  return instance;

};
