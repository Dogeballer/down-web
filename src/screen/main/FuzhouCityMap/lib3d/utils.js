import * as THREE from 'three'

export function clearThree (obj) {
  while (obj.children.length > 0) {
    clearThree(obj.children[0])
    obj.remove(obj.children[0])
  }
  if (obj instanceof THREE.Scene) return

  if (obj.dispose) obj.dispose()
  if (obj.geometry && obj.geometry.dispose) obj.geometry.dispose()
  if (obj.material && obj.material.dispose) obj.material.dispose()
  if (obj.texture && obj.texture.dispose) obj.texture.dispose()
}
