import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import {
  setAngleName,
  selectAngleName,
  setStatus,
  selectStatus,
  STATUS
} from './roomSlice';

import { config } from './config'
import styles from './room.module.css';

// three.js components
import { init } from './three/init'
import { setScreen } from './three/screen'

export default function Room() {
  const roomDiv = useRef()
    , objRoom = useRef()
    , screenCtx = useRef()
    , screenTexture = useRef()
    , screenVideo = useRef()
    , localVideoTrack = useRef()
    , localAudioTrack = useRef()
  const status = useSelector( selectStatus )
  const angleName = useSelector( selectAngleName )
  const dispatch = useDispatch()

  useEffect(() => {
    let reqId

    if( roomDiv.current && !localVideoTrack.current && !localAudioTrack.current  ) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then( stream => {
          console.log( stream.getVideoTracks())
          localVideoTrack.current = stream.getVideoTracks()[0]
          localAudioTrack.current = stream.getAudioTracks()[0]
        })
        .then( () => {
          objRoom.current = init( roomDiv.current ) 
        })
        .then( () => {
          const { ctx, texture } = setScreen( objRoom.current.scene ) 
          screenCtx.current = ctx; screenTexture.current = texture
          const video = document.createElement('video')
          console.log( localVideoTrack.current )
          video.srcObject = new MediaStream([ localVideoTrack.current ])
          video.autoplay = true

          screenVideo.current = video
        })
        .then( () => dispatch( setStatus( STATUS.READY )) )
        .then( () => {
          function animation() {
            reqId = requestAnimationFrame( animation )
            screenTexture.current.needsUpdate = true
            screenCtx.current.drawImage( screenVideo.current, 0, 0, 640, 480 )
            objRoom.current.renderer.render( objRoom.current.scene, objRoom.current.camera )
          }
          animation()
        })
        .catch( err => {
          console.error(err)
          alert( err.message )
        })
    }
    
    return function cleanup() {
      if( reqId ) cancelAnimationFrame( reqId )
    }
  }, [])

  const changeAngle = useCallback( () => {
    if( status === STATUS.READY ) {
      const _angleName = angleName === "entire" ? "piano" : "entire"
      const camera = objRoom.current.camera

      const angle = config.angles[ _angleName ]
      camera.position.set.apply( camera.position, angle.position )
      camera.lookAt.apply( camera, angle.lookAt )

      dispatch( setAngleName( _angleName ))
    }
  }, [angleName, status])





  return (
    <div className={styles.room}>
      <div className={styles.vr} ref={e => roomDiv.current = e} />
      <div className={styles.buttons}>
        angle : { angleName } <br/>
        <button onClick={ changeAngle }>change angle</button>
      </div>
    </div>
  );
}
