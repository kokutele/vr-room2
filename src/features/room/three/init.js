import { config } from '../config'
import * as THREE from 'three'

export function init( room, showAxes = true ){
  // setup scene and camera
  const scene = new THREE.Scene() 
  const camera = new THREE.PerspectiveCamera( 45, room.offsetWidth / room.offsetHeight, 1, 1280 )

  const angle = config.angles.entire

  camera.position.set.apply( camera.position, angle.position )
  camera.lookAt.apply( camera, angle.lookAt )

  const ambiLight = new THREE.AmbientLight( 0x0c0c0c ) 
  scene.add(ambiLight)
  
  // setup renderer
  const renderer = new THREE.WebGLRenderer()
  renderer.setClearColor( 0x000000 )
  renderer.setSize( room.offsetWidth, room.offsetHeight )
  renderer.shadowMap.enabled = true

  // setup axes (if true)
  if( showAxes ) {
    const axes = new THREE.AxesHelper(20)
    scene.add( axes )
  }

  room.appendChild( renderer.domElement )

  return {
    scene, camera, renderer
  }
}
