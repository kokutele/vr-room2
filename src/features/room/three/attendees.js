import { config } from '../config'
import * as THREE from 'three'

export function setAttndees( scene ){
  const thetas = config.thetasOfSeats
  const r = config.radiusOfFloor
  const { width, height } = config.attendee
  const ctxs = []
  const textures = []

  for( let i = 0; i < thetas.length; i++ ) {
    const theta = thetas[i]
    const canvas = document.createElement('canvas')
    canvas.width = 640
    canvas.height = 480

    const ctx = canvas.getContext('2d')

    const texture = new THREE.Texture( canvas )
    const geometry = new THREE.PlaneGeometry( width, height )
    const material = new THREE.MeshBasicMaterial({ map: texture })

    const mesh = new THREE.Mesh( geometry, material )

    mesh.rotateY( ( -90 + theta ) * Math.PI / 180 )
    mesh.position.x = r * Math.cos(-theta * Math.PI / 180)
    mesh.position.y = config.attendee.positionY
    mesh.position.z = r * Math.sin(-theta * Math.PI / 180)
    mesh.castShadow = true
    scene.add(mesh)

    ctxs.push( ctx )
    textures.push( texture )
  }

  return { ctxs, textures }
}
