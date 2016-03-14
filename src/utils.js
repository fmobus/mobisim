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

export function Tiler(width, height) {
  let tileSize = 256;
  let columns  = Math.ceil(width / tileSize);
  let rows     = Math.ceil(height / tileSize);
  let xFirst = -1 * Math.ceil(columns / 2);
  let xLast  = +1 * Math.ceil(columns / 2);
  let yFirst = -1 * Math.ceil(rows / 2);
  let yLast  = +1 * Math.ceil(rows / 2);

  this.getTiles = function(lon, lat, zoom) {
    var tiles = [];
    var centerTile = { x: long2tile(lon, zoom), y: lat2tile(lat, zoom), z: zoom };
    var tileEdge = { longitude: tile2long(centerTile.x, zoom), latitude: tile2lat(centerTile.y, zoom) };
    var tileWidthInWorld  = tileEdge.longitude - tile2long(centerTile.x - 1, zoom);
    var tileHeightInWorld = tileEdge.latitude  - tile2lat(centerTile.x - 1, zoom);
    var centerOffsetX = ((lon - tileEdge.longitude) / tileWidthInWorld) * tileSize;
    var centerOffsetY = ((lat - tileEdge.latitude) / tileHeightInWorld) * tileSize;

    for (var i = xFirst; i <= xLast; i++) {
      for (var j = yFirst; j <= yLast; j++) {
        tiles.push({
          x: centerTile.x + i, y: centerTile.y + j, z: zoom,
          left: (width / 2)  + tileSize * i - centerOffsetX,
          top:  (height / 2) + tileSize * j - centerOffsetY,
          longitude: tile2long(centerTile.x + i, zoom),
          latitude:  tile2lat(centerTile.y + j, zoom),
          isCenter: (i==0) && (j == 0)
        });
      }
    }
    return tiles;
  };

  return this;
}
