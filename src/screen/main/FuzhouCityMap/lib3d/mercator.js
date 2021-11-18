// 最北端：黑龙江省漠河附近的黑龙江主航道的中心线（53°N）
// 最南端：南沙群岛南端的曾母暗沙（4°N附近）
// 最东端：黑龙江省抚远县境内黑龙江与乌苏里江主航道汇合处（135°E）
// 最西端：新疆维吾尔自治区乌恰县以西的帕米尔高原（73°E）

// 海南省地理位置介于东经108°37′—111°03′,北纬18°10′—20°10′之间

// 经纬度转网络墨卡托
export function latLng2WebMercator ([lng, lat]) {
  let x = lng * 20037508.34 / 180
  let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)
  y = y * 20037508.34 / 180
  return [x, y]
}

// 网络墨卡托转经纬度
export function webMercator2LngLat ([x, y]) { // [12727039.383734727, 3579066.6894065146]
  var lng = x / 20037508.34 * 180
  var lat = y / 20037508.34 * 180
  lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2)
  return [lng, lat] // [114.32894001591471, 30.58574800385281]
}

export function calcCenterPos (centerLngLat) {
  return latLng2WebMercator(centerLngLat)
}

export function calcMapScale ([lngMax, lanMax], [centerLng, centerLan]) {
  const [x, y] = latLng2WebMercator([lngMax, lanMax])
  const [centerX, centerY] = latLng2WebMercator([centerLng, centerLan])

  let scaleX = (x - centerX) / 50
  let scaleY = (y - centerY) / 50

  return Math.max(scaleX, scaleY)
}

export function convertGeoToPixel (lnglat, scale, centerPos) {
  let [x, y] = latLng2WebMercator(lnglat)
  return [(x - centerPos[0]) / scale, (y - centerPos[1]) / scale]
}

//  还原成 经度纬度
export function convertPixelToGeo (pixelXY, scale, centerPos) {
  let x = pixelXY[0] * scale + centerPos[0]
  let y = pixelXY[1] * scale + centerPos[1]
  return webMercator2LngLat([x, y])
}

// 从geojson格式数据中找到最大最小的经纬度，顺便计算中心点经纬度
export function findBoundBoxFromGeojson (geojson) {
  let maxLng = Number.MIN_VALUE, minLng = Number.MAX_VALUE, maxLat = Number.MIN_VALUE, minLat = Number.MAX_VALUE

  geojson.features.forEach(feature => {
    feature.geometry.coordinates.forEach((coord, index) => {
      const type = feature.geometry.type
      if (type === 'MultiPolygon') {
        coord[0].forEach(v => {
          maxLng = Math.max(maxLng, v[0])
          minLng = Math.min(minLng, v[0])
          maxLat = Math.max(maxLat, v[1])
          minLat = Math.min(minLat, v[1])
        })
      } else if (type === 'Polygon') {
        coord.forEach(v => {
          maxLng = Math.max(maxLng, v[0])
          minLng = Math.min(minLng, v[0])
          maxLat = Math.max(maxLat, v[1])
          minLat = Math.min(minLat, v[1])
        })
      } else {
        console.error('undeal type')
      }
    })
  })

  return {
    maxLat,
    maxLng,
    minLng,
    minLat,
    centLng: (maxLng + minLng) / 2,
    centLat: (maxLat + minLat) / 2
  }
}
