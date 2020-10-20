import { config } from '../config'
import * as THREE from 'three'

export function setFloor( scene ){
  const r = config.radiusOfFloor
  {
    // base floor
    const geometry = new THREE.CircleGeometry( 0.25 * r, 250 )
    const material = new THREE.MeshLambertMaterial({ color: 0x1f1f1f })
    const plane = new THREE.Mesh( geometry, material )
    plane.rotateX( -Math.PI / 2 )
    plane.position.y = -10
    plane.position.z = 35
    plane.receiveShadow = true

    // const spotLight = new THREE.SpotLight( 0xffffff )
    // spotLight.position.set( 0, 100, 10)
    // spotLight.angle = Math.PI / 2
    // spotLight.target = plane
    // spotLight.castShadow = true

    scene.add( plane )
  }
  
  {
    const geometry = new THREE.CircleGeometry( 2 * r, 250 )
    const material = new THREE.MeshLambertMaterial({ color: 0x0a0a0a })
    const plane = new THREE.Mesh( geometry, material )
    plane.rotateX( -Math.PI / 2 )
    plane.position.y = -20
    plane.receiveShadow = true

    scene.add( plane )
  }
}

