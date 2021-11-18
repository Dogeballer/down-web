import * as THREE from 'three'
import loadTexture from '../loader/textureLoader'

class MapTexture extends THREE.Object3D {
  constructor (mapImage) {
    super()

    const loadPromise = mapImage ? loadTexture(mapImage) : Promise.resolve()
    loadPromise.then((map) => {
      const geometry = new THREE.PlaneGeometry(100, 100, 1, 1)
      const material = new THREE.MeshBasicMaterial({map, transparent: true, opacity: map ? 1 : 0})
      const plane = new THREE.Mesh(geometry, material)
      this.add(plane)
    })
  }

  dispose = () => {

  }
}

export default MapTexture
