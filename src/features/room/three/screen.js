import { config } from '../config'
import * as THREE from 'three'

export function setScreen( scene, name = "screen" ){
  const { width, height } = config[name]
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 480

  const ctx = canvas.getContext('2d')

  const texture = new THREE.Texture( canvas )
  const geometry = new THREE.PlaneGeometry( width, height )
  const material = new THREE.MeshBasicMaterial({ map: texture })
  // texture.needsUpdate = true

  const plane = new THREE.Mesh( geometry, material )

  plane.rotateX( Math.PI * config[name].rotationX / 180 )
  plane.rotateY( -Math.PI )
  plane.position.set.apply(plane.position, config[name].position)

  scene.add( plane )

  return { ctx, texture }
}
