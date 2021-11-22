import * as THREE from 'three'

let texloader = new THREE.TextureLoader()

export default function loadTexture (url) {
  return new Promise((resolve, reject) => {
    texloader.load(url, (texture) => {
      texture.magFilter = THREE.LinearFilter
      texture.minFilter = THREE.LinearMipMapLinearFilter
      resolve(texture)
    },
    undefined,
    (err) => {
      console.error(err)
      reject(err)
    })
  })
}
