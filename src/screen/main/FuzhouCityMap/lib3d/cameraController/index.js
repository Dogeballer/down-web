import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class CameraController {
  constructor (width, height, htmlRoot, enbleDebug = false) {
    this.createCamera(width, height, htmlRoot)
    if (enbleDebug) {
      window.addEventListener('keydown', this.changeCameraType)
    }
  }

  changeCameraType = (e) => {
    switch (e.which) {
      case 84: // t
        this.createCamera()
        break
      default:
        break
    }
  }

  createCamera = (canvasWidth = this.cWidth, canvasHeight = this.cHeight, htmlRoot = this.cRoot) => {
    this.cWidth = canvasWidth
    this.cHeight = canvasHeight
    this.cRoot = htmlRoot
    let camera = this.camera
    if (camera instanceof THREE.OrthographicCamera) {
      camera = new THREE.PerspectiveCamera(50, canvasWidth / canvasHeight, 0.1, 600)
    } else if (!camera || camera instanceof THREE.PerspectiveCamera) {
      const height = 100
      const width = canvasWidth / canvasHeight * height
      camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 0.1, 200)
    }

    camera.position.set(0, 0, 108)

    camera.lookAt(new THREE.Vector3(0, 0, 0))
    if (camera instanceof THREE.PerspectiveCamera) {
      this.orbitControls = new OrbitControls(camera, htmlRoot)
      this.orbitControls.minDistance = 0.1
      this.orbitControls.maxDistance = 400
    }
    this.camera = camera
    return this.camera
  }

  getCamera = () => {
    return this.camera
  }

  updateCamera = (delta) => {
    this.orbitControls && this.orbitControls.update(delta)
  }

  resizeCamera = (canvasWidth, canvasHeight) => {
    let camera = this.camera
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = canvasWidth / canvasHeight
    } else if (camera instanceof THREE.OrthographicCamera) {
      const height = 100 // 所有场景都在100的范围内
      const width = canvasWidth / canvasHeight * height
      camera.left = width / -2
      camera.right = width / 2
    }
    camera.updateProjectionMatrix()
  }

  dispose = () => {
    window.removeEventListener('keypress', this.changeCameraType)
  }
}
