import * as THREE from 'three'
import MapTexture from './lib3d/instance/mapTexture'
import CameraController from './lib3d/cameraController'
import { clearThree } from './lib3d/utils'

import MapArea from './instance/mapArea'
import {
  calcCenterPos,
  calcMapScale,
  findBoundBoxFromGeojson
} from './lib3d/mercator'
import geojson from './assets/fuzhou.json'
import { changeMaterailFromColor } from './utils'

class ThreeJsMap {
  constructor (htmlRoot, width = 800, height = 800, optionConfig) {
    this.optionConfig = optionConfig
    this.width = width
    this.height = height
    const { cityData, activeColor, interval, onChangeActiveData, optionMap } = this.optionConfig

    let boundBox = findBoundBoxFromGeojson(geojson)

    // 中国地图中心经纬度转网络墨卡托，用于移动转换后的地图到中心
    const centerPos = calcCenterPos([boundBox.centLng, boundBox.centLat])

    // 缩放因子,将地图最后 适应 100x100 的网格坐标
    const mapScale = calcMapScale([boundBox.maxLng, boundBox.maxLat], [boundBox.centLng, boundBox.centLat])

    this.clock = new THREE.Clock()
    this.sceneMap = new THREE.Scene()

    this.scene = new THREE.Scene()
    this.curMap = new MapArea(geojson, mapScale, centerPos, optionMap)

    this.curMap.getLineMaterial().resolution.set(width, height) // important, for now...

    this.sceneMap.add(this.curMap)

    let map = new MapTexture()
    this.sceneMap.add(map)

    this.cameraController = new CameraController(width, height, htmlRoot, process.env.NODE_ENV !== 'production')

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, precision: 'highp' })
    this.renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2))
    this.renderer.setSize(width, height)
    htmlRoot.appendChild(this.renderer.domElement)

    // this.renderer.domElement.addEventListener('mousemove', this.onMouseMove)
    this.renderer.domElement.addEventListener('click', this.onClick)

    let filterProviceData = cityData.filter(v => this.curMap.getStandarData()[v.name])
    if (filterProviceData.length) {
      let widthHalf = width / 2
      let heightHalf = height / 2
      let index = 0
      const loop = () => {
        if (Date.now() - (this.lastClick || 0) < interval) {
          return
        }

        let activeData = filterProviceData[index]

        const name = activeData.name
        const curMesh = this.curMap.getMeshGroup().getObjectByName(name)
        let pos = this.curMap.getStandarData()[name].pos.clone()
        pos.project(this.cameraController.getCamera())
        pos.x = (pos.x * widthHalf) + widthHalf
        pos.y = -(pos.y * heightHalf) + heightHalf
        onChangeActiveData(pos, activeData)

        if (this.lastMesh) {
          changeMaterailFromColor(this.lastMesh.material, optionMap.color)
        }

        this.lastMesh = curMesh
        changeMaterailFromColor(curMesh.material, activeColor)

        index = index + 1 >= filterProviceData.length ? 0 : index + 1
      }
      loop()
      this.timerTipKey = setInterval(loop, interval)
    }

    const animate = () => {
      const delta = this.clock.getDelta()

      this.cameraController.updateCamera(delta)

      let camera = this.cameraController.getCamera()

      this.renderer.autoClear = true
      this.renderer.render(this.sceneMap, camera)

      this.renderer.autoClear = false
      this.renderer.render(this.scene, camera)

      this.timerKey = window.requestAnimationFrame(animate)
    }
    animate()
  }

  onClick = (event) => {
    if (!this.curMap) return
    const { cityData, onChangeActiveData, optionMap, activeColor} = this.optionConfig

    let intersects = this._getIntersects(event)
    if (intersects.length <= 0) {
      onChangeActiveData(null, null)
      return
    }

    this.lastClick = Date.now()

    let widthHalf = this.width / 2
    let heightHalf = this.height / 2

    const name = intersects[0].object.name
    let pos = this.curMap.getStandarData()[name].pos.clone()
    pos.project(this.cameraController.getCamera())
    pos.x = (pos.x * widthHalf) + widthHalf
    pos.y = -(pos.y * heightHalf) + heightHalf

    let activeData = cityData.find(v => v.name === name)

    if (activeData) {
      const curMesh = this.curMap.getMeshGroup().getObjectByName(name)

      if (this.lastMesh) {
        changeMaterailFromColor(this.lastMesh.material, optionMap.color)
      }

      this.lastMesh = curMesh
      changeMaterailFromColor(curMesh.material, activeColor)
    }

    onChangeActiveData(pos, activeData)
  }

  _getIntersects = (event) => {
    let camera = this.cameraController.getCamera()

    let raycaster = new THREE.Raycaster() // create once
    let mouse = new THREE.Vector2() // create once

    let x = event.clientX
    let y = event.clientY

    let rect = event.target.getBoundingClientRect()
    x -= rect.left
    y -= rect.top

    let clientRect = this.renderer.domElement.getBoundingClientRect()

    mouse.x = (x / clientRect.width) * 2 - 1
    mouse.y = -(y / clientRect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    return raycaster.intersectObjects(this.curMap.getMeshGroup().children)
  }

  dispose = () => {
    clearThree(this.sceneMap)
    clearThree(this.scene)
    this.cameraController.dispose()
    window.cancelAnimationFrame(this.timerKey)
    clearInterval(this.timerTipKey)

    this.renderer.domElement.removeEventListener('click', this.onClick)
  }
}

export default ThreeJsMap
