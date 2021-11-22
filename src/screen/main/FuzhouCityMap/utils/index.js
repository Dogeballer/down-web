import * as THREE from 'three'

let colorCache = {}
export function changeMaterailFromColor (material, color, setAlpha = true) {
  if (typeof color === 'number') {
    material.color.setHex(color)
    material.opacity = 1
  } else if (color instanceof THREE.Color) {
    material.color.set(color)
    material.opacity = 1
  } else if (typeof color === 'string') {
    if (color.startsWith('0x')) {
      color = color.replace('0x', '#')
    }
    material.opacity = 1
    if (color.startsWith('rgba') && setAlpha) {
      let alpha = parseFloat((color).split(',')[3])

      !isNaN(alpha) && (material.opacity = alpha)
    }

    if (!colorCache[color]) {
      colorCache[color] = new THREE.Color(color)
    }
    let threeColor = colorCache[color]
    material.color.set(threeColor)
  }
}
