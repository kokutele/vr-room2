import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux'

import {
  setAngleName,
  selectAngleName,
  setStatus,
  selectStatus,
  addAttendee,
  remAttendee,
  selectNumAttendees,
  STATUS
} from './roomSlice';

import { config } from './config'
import styles from './room.module.css';


// import libraries
// import {MediaSoupHandler} from './libs/mediasoup-handler'
import Lissajous from './libs/lissajous'

// three.js components
import { init } from './three/init'
import { setScreen } from './three/screen'
import { setChairs } from './three/chairs'
import { setFloor } from './three/floor'
import { setAttndees } from './three/attendees'
import { setAttndeesLissajous } from './three/att-lissajous'
import { setPiano, setMIDIEmulation, reqPianoAnimationId } from './three/piano'

export default function Room() {
  const roomDiv = useRef()
    , objRoom = useRef()
    , screenCtx = useRef()
    , screenTexture = useRef()
    , screenLissajousLeftCtx = useRef()
    , screenLissajousLeftTexture = useRef()
    , screenLissajousRightCtx = useRef()
    , screenLissajousRightTexture = useRef()
    , attendeeCtxs = useRef()
    , attendeeTextures = useRef()
    , attLissajousCtxs = useRef()
    , attLissajousTextures = useRef()
    , screenVideo = useRef()
    , localVideoTrack = useRef()
    , localAudioTrack = useRef()
  const lissajousArray = useRef([]) // @type Arrray<Lissajous>
  const screenLissajousLeft = useRef()
  const screenLissajousRight = useRef()

  const status = useSelector( selectStatus )
  const angleName = useSelector( selectAngleName )
  const numAttendees = useSelector( selectNumAttendees )
  const dispatch = useDispatch()
  const maxAttendees = config.thetasOfSeats.length

  // 初期化処理
  //
  // gUMでストリーム取得後、three の初期化と、必要となる 3D オブジェクトを
  // 配置する
  useEffect(() => {
    if( roomDiv.current && !localVideoTrack.current && !localAudioTrack.current  ) {
      if( window.MIDI ) {
        window.MIDI.loadPlugin({
          soundfontUrl: "/libs/soundfont/",
          instrument: "acoustic_grand_piano",
          onprogress: ( state, progress ) => {
            console.log( state, progress )
          },
          onsuccess: () => {
            console.log("succeeded to initialize MIDI.js")
          }
        })
      }
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then( stream => {
          // localStream の取得
          localVideoTrack.current = stream.getVideoTracks()[0]
          localAudioTrack.current = stream.getAudioTracks()[0]
        })
        .then( () => {
          // 3D 空間の生成
          objRoom.current = init( roomDiv.current, false ) 
        })
        .then( () => {
          // 椅子、床、ピアノの配置
          setChairs( objRoom.current.scene )
          setFloor( objRoom.current.scene )
          setPiano( objRoom.current.scene )

          // for( let i = 0; i < 6; i++ ) {
          //   const light = objRoom.current
          //     .scene.getObjectByName(`spotlight-chair-${i}`)
          //   light.color.r = 0
          //   light.color.g = 1
          //   light.color.b = 0
          // }
        })
        .then( () => {
          // バックスクリーンの配置
          const { ctx, texture } = setScreen( objRoom.current.scene ) 
          screenCtx.current = ctx; screenTexture.current = texture
        })
        .then( () => {
          // バックスクリーンリサージュ（左）の配置
          const { ctx, texture } = setScreen( objRoom.current.scene, "screenLissajousL" ) 
          screenLissajousLeftCtx.current = ctx
          screenLissajousLeftTexture.current = texture

          const lissajous = new Lissajous( {ctx})
          lissajous.start( localAudioTrack.current )
          screenLissajousLeft.current = lissajous
        })
        .then( () => {
          // バックスクリーンリサージュ（右）の配置
          const { ctx, texture } = setScreen( objRoom.current.scene, "screenLissajousR" ) 
          screenLissajousRightCtx.current = ctx
          screenLissajousRightTexture.current = texture

          const lissajous = new Lissajous( {ctx})
          lissajous.start( localAudioTrack.current )
          screenLissajousRight.current = lissajous
        })
        .then( () => {
          // local のビデオオブジェクトを生成して、バックスクリーンの ref に格納する
          // デバッグ用のブロック
          const video = document.createElement('video')
          video.srcObject = new MediaStream([ localVideoTrack.current ])
          video.autoplay = true

          screenVideo.current = video
        })
        .then( () => {
          // 各参加者を表示する canvas コンテキストと textures を配置し
          // ref に格納する
          const { ctxs, textures } = setAttndees( objRoom.current.scene )
          attendeeCtxs.current = ctxs
          attendeeTextures.current = textures
        })
        .then( () => {
          // 各参加者の音声リサージュ図形を表示する canvas コンテキストと textures を配置し
          // ref に格納する
          const { ctxs, textures } = setAttndeesLissajous( objRoom.current.scene )
          attLissajousCtxs.current = ctxs
          attLissajousTextures.current = textures
        })
        .then( () => dispatch( setStatus( STATUS.READY )) )
        .catch( err => {
          console.error(err)
          alert( err.message )
        })
    }

    return function cleanup() {
      if( reqPianoAnimationId ) cancelAnimationFrame( reqPianoAnimationId )
    }
  }, [])

  // キーボードタイプでMIDIをエミュレートする
  useEffect(() => {
    if( status === STATUS.READY ) {
      setMIDIEmulation()
    }
  }, [status])

  // アニメーション処理部
  useEffect(() => {
    let reqId
    if( status === STATUS.READY) {
      function animation() {
        reqId = requestAnimationFrame(animation)
        screenTexture.current.needsUpdate = true
        screenCtx.current.drawImage(screenVideo.current, 0, 0, 640, 480)

        screenLissajousLeftTexture.current.needsUpdate = true
        screenLissajousLeft.current.draw()

        screenLissajousRightTexture.current.needsUpdate = true
        screenLissajousRight.current.draw()

        for( let i = 0; i < maxAttendees; i++ ) {
          if( i < numAttendees ) {
            attendeeTextures.current[i].needsUpdate = true
            attendeeCtxs.current[i].drawImage(screenVideo.current, 0, 0, 640, 480)

            attLissajousTextures.current[i].needsUpdate = true
            const lissajous = lissajousArray.current[i]
            if( lissajous ) lissajous.draw()
          } else {
            attendeeTextures.current[i].needsUpdate = true
            attendeeCtxs.current[i].clearRect(0,0, 640, 480)

            attLissajousTextures.current[i].needsUpdate = true
            attLissajousCtxs.current[i].clearRect(0, 0, 640, 480)
          }
        }
        objRoom.current.renderer.render(objRoom.current.scene, objRoom.current.camera)
      }
      animation()
    }

    return function cleanup() {
      if( reqId ) cancelAnimationFrame( reqId )
    }
  }, [numAttendees, status, maxAttendees])
 
  // 表示アングルの変更
  // 全体表示 or バックスクリーン表示を切り替えている
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

  // ルーム参加者表示の開発デバッグ用
  // addAttendee, remAttendee 共に、参加者数をカウントしているだけ
  // 開発デバッグ用に、 local audio track のリサージュインスタンスも生成
  const handleClickAddAttendee = useCallback( () => {
    if( status === STATUS.READY && numAttendees < maxAttendees ) {
      dispatch( addAttendee() )
      const ctx = attLissajousCtxs.current[ numAttendees ]
      const lissajous = new Lissajous( {ctx} )
      lissajous.start( localAudioTrack.current )
      lissajousArray.current.push( lissajous )
      console.log( lissajousArray.current )
    }
  }, [numAttendees, status, maxAttendees])

  const handleClickRemAttendee = useCallback( () => {
    if( status === STATUS.READY && numAttendees > 0 ) {
      dispatch( remAttendee() )
      lissajousArray.current.splice( numAttendees - 1, 1 )
      console.log( lissajousArray.current )
    }
  }, [numAttendees, status])





  return (
    <div className={styles.room}>
      <div className={styles.vr} ref={e => roomDiv.current = e} />
      <div className={styles.buttons}>
        angle : { angleName } <br/>
        <button onClick={ changeAngle }>change angle</button><br />
        num attendees : { numAttendees }<br />
        { numAttendees < maxAttendees && (
          <button onClick={ handleClickAddAttendee }>add attendee (debug)</button>
        )}
        { numAttendees > 0 && (
          <button onClick={ handleClickRemAttendee }>rem attendee (debug)</button>
        )}
        <br />
      </div>
    </div>
  );
}
