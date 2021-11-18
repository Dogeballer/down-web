import * as THREE from 'three'

import { convertGeoToPixel } from '../lib3d/mercator'
import { changeMaterailFromColor } from '../utils'

import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { Line2 } from 'three/examples/jsm/lines/Line2'

class MapArea extends THREE.Object3D {
  constructor (geojson, mapScale, centerPos, config) {
    super()

    this.config = config

    this.lineMaterial = new LineMaterial({ linewidth: config.borderWidth })

    changeMaterailFromColor(this.lineMaterial, config.borderColor)

    this.standarData = {}

    this.mapScale = mapScale
    this.centerPos = centerPos

    this.meshGroup = new THREE.Group()
    this.lineGeoGroup = new THREE.Group()
    this.add(this.meshGroup)
    this.add(this.lineGeoGroup)

    geojson.features.forEach((feature, index) => {
      let shapes = []
      feature.geometry.coordinates.forEach(coord => {
        const type = feature.geometry.type
        if (type === 'MultiPolygon') {
          shapes.push(this.getShape(coord[0]))
        } else if (type === 'Polygon') {
          shapes.push(this.getShape(coord))
        } else {
          console.error('more type')
        }
      })

      let geometry = new THREE.ShapeGeometry(shapes)

      let meshMaterial = new THREE.MeshBasicMaterial()

      changeMaterailFromColor(meshMaterial, config.color)

      let mesh = new THREE.Mesh(geometry, meshMaterial)

      this.meshGroup.add(mesh)

      if (!feature.properties.name) {
        return
      }

      let center
      if (feature.properties.centroid) {
        let textPos = convertGeoToPixel(feature.properties.centroid, this.mapScale, this.centerPos)
        center = new THREE.Vector3(textPos[0], textPos[1], 0)
      } else {
        let bbox = new THREE.Box3().setFromObject(mesh)
        center = bbox.min.lerp(bbox.max, 0.5)
      }

      const shortName = feature.properties.name
      mesh.name = shortName
      let mapFromText = createTextureFrom(shortName)
      var spriteMaterial = new THREE.SpriteMaterial({ map: mapFromText, depthTest: false, opacity: 0.5 })
      var sprite = new THREE.Sprite(spriteMaterial)
      this.add(sprite)

      const textureScale = 18
      sprite.scale.set(mapFromText.image.width / textureScale, mapFromText.image.height / textureScale, 1)
      // sprite.position.set(0,0,98);
      center.z = 0.1
      sprite.position.copy(center)

      this.standarData[shortName] = {
        pos: center,
        name: shortName
      }
    })
  }

  getLineMaterial = () => {
    return this.lineMaterial
  }

  getShape = (arr) => {
    const shape = new THREE.Shape()
    let positions = []
    // startpoint
    const zBias = 0.01
    let [x, y] = convertGeoToPixel(arr[0], this.mapScale, this.centerPos)
    shape.moveTo(x, y)
    positions.push(x, y, zBias)

    for (var i = 1; i < arr.length; i++) {
      let [x, y] = convertGeoToPixel(arr[i], this.mapScale, this.centerPos)
      shape.lineTo(x, y)
      positions.push(x, y, zBias)
    }

    let lineGeometry = new LineGeometry().setPositions(positions)
    let line2 = new Line2(lineGeometry, this.lineMaterial)

    this.lineGeoGroup.add(line2)

    return shape
  }

  getStandarData = () => {
    return this.standarData
  }

  getMeshGroup = () => {
    return this.meshGroup
  }

  dispose = () => {

  }
}

function createTextureFrom (text = 'undefined') {
  // create image
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  let span = document.createElement('span')
  span.innerText = text
  span.style.fontFamily = 'Arial'
  span.style.fontSize = '32px'
  span.style.display = 'inline-block'
  document.body.appendChild(span)
  let width = span.offsetWidth
  let height = span.offsetHeight
  span.parentNode.removeChild(span)

  // let textMeasure = ctx.measureText(text)

  canvas.width = width
  canvas.height = height

  ctx.font = '32px Arial'
  ctx.fillStyle = '#ffffff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)
  // ctx.strokeStyle = 'black'
  // ctx.strokeText(text, 0, 0)
  // document.body.appendChild(canvas)

  // canvas contents will be used for a texture
  let texture = new THREE.Texture(canvas)
  texture.needsUpdate = true
  return texture
}

export default MapArea
