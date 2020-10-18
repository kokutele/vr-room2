import { config } from '../config'
import * as THREE from 'three'

export function setScreen( scene ){
  const { width, height } = config.screen
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 480

  const ctx = canvas.getContext('2d')

  const texture = new THREE.Texture( canvas )
  const geometry = new THREE.PlaneGeometry( width, height )
  const material = new THREE.MeshBasicMaterial({ map: texture })
  // texture.needsUpdate = true

  const plane = new THREE.Mesh( geometry, material )

  // plane.rotateX( Math.PI * config.rotationX / 180 )
  plane.rotateY( -Math.PI )
  plane.position.set.apply(plane.position, config.screen.position)

  scene.add( plane )

  return { ctx, texture }
}
