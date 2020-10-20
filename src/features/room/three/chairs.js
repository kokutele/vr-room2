import { config } from '../config'
import * as THREE from 'three'

export function setChairs( scene ){
  const thetas = config.thetasOfSeats
    , r = config.radiusOfFloor
    , size = config.sizeOfChair
  
  for( let i = 0; i < thetas.length; i++ ) {
    const theta = thetas[i]
    const geometry = new THREE.BoxGeometry(size, size * 1.2, size)
    const material = new THREE.MeshLambertMaterial({
      color: 0xffffff
    })

    const cube = new THREE.Mesh(geometry, material)
    cube.rotateY((-90 + theta) * Math.PI / 180)
    cube.position.x = r * Math.cos(-theta * Math.PI / 180)
    cube.position.y = -15
    cube.position.z = r * Math.sin(-theta * Math.PI / 180)
    cube.castShadow = true

    scene.add(cube)

    const color = 0xf62008
    const spotLight = new THREE.SpotLight(color)
    spotLight.position.set(
      r * Math.cos(-theta * Math.PI / 180),
      75,
      r * Math.sin(-theta * Math.PI / 180),
    )
    spotLight.name = `spotlight-chair-${i}`
    spotLight.angle = Math.PI / 4
    spotLight.target = cube
    spotLight.castShadow = true

    scene.add(spotLight)
  }

}
