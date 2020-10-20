import { config } from '../config'
import * as THREE from 'three'
import ColladaLoader from 'three-collada-loader'

const keyState = Object.freeze({ unpressed: 0, note_on: 1, pressed: 2, note_off: 3 });
const keys_obj = []
  , keys_down = []
const xRotation = -Math.PI / 2 // Math.PI / 6.0;
class Controls {
  key_attack_time = 9.0;
  key_max_rotation = xRotation - Math.PI / 48;
  octave = 2;
  song = "game_of_thrones.mid";
  noteOnColor = [255, 0, 0, 1.0];

  play() {
    // MIDI.Player.resume();
  };
  stop() {
    // MIDI.Player.stop();
  }
};
const controls = new Controls()
const noteOnColor = new THREE.Color().setRGB(controls.noteOnColor[0] / 256.0, controls.noteOnColor[1] / 256.0, controls.noteOnColor[2] / 256.0);
let _scene = null

export let reqPianoAnimationId = null


export function setPiano( scene ){
  function prepare_scene( collada ) {
    collada.scene.traverse(initialize_keys);
    //collada.scene.position.set( 5.5, -1, 50 )
    collada.scene.position.set.apply( collada.scene.position, config.piano.position)
    //collada.scene.position.set( 0, -1, 50 )
    collada.scene.castShadow = true

    scene.add(collada.scene);

    const spotLight = init_lights( collada.scene )
    scene.add( spotLight )
  }

  function initialize_keys(obj) {
    keys_obj.push(obj);
    // obj.rotation.x = 0 // -Math.PI / 3 // Math.PI / 4 // xRotation;
    obj.rotation.y = -Math.PI;
    obj.keyState = {};
    obj.clock = new THREE.Clock(false);
    obj.castShadow = true;
    obj.receiveShadow = true;

    // only add meshes in the material redefinition (to make keys change their color when pressed)
    if (obj instanceof THREE.Mesh) {
      const old_material = obj.material;
      obj.material = new THREE.MeshPhongMaterial({ color: old_material.color });
      obj.material.shininess = 35.0;
      obj.material.specular = new THREE.Color().setRGB(0.25, 0.25, 0.25);;
      obj.material.note_off = obj.material.color.clone();
    }
  }

  function init_lights( target ) {
    const spotlight = new THREE.SpotLight(0xffffff);

    spotlight.position.set.apply( spotlight.position, config.piano.light )
    spotlight.target = target
    spotlight.angle = Math.PI / 6
    spotlight.castShadow = true;


    return spotlight
  }

  function frame() {
    reqPianoAnimationId = requestAnimationFrame(frame)

    const delta = clock.getDelta()
    update( delta )
  }

  function smoothstep(a, b, x) {
    if (x < a) return 0.0;
    if (x > b) return 1.0;
    var y = (x - a) / (b - a);
    return y * y * (3.0 - 2.0 * y);
  }

  function mix(a, b, x) {
    return a + (b - a) * Math.min(Math.max(x, 0.0), 1.0);
  } 



  function update_key(obj, delta) {
    if (obj.keyState === keyState.note_on) {
      //obj.rotation.x = -Math.PI * config.piano.pressed / 180 // mix( xRotation, controls.key_max_rotation, smoothstep(0.0, 1.0, controls.key_attack_time * obj.clock.getElapsedTime()));
      obj.rotation.x = mix( -Math.PI * config.piano.unpressed / 180, -Math.PI * config.piano.pressed / 180, smoothstep(0.0, 1.0, controls.key_attack_time * obj.clock.getElapsedTime()));
      if (obj.rotation.x >= -Math.PI * config.piano.pressed / 180) {
        obj.keyState = keyState.pressed;
        obj.clock.elapsedTime = 0;
      }
      if( obj.children && obj.children[0].material ) {
        obj.children[0].material.color = noteOnColor;
      }
    }
    else if (obj.keyState === keyState.note_off) {
      //obj.rotation.x = -Math.PI * config.piano.unpressed / 180 // -Math.PI / 3 // mix(controls.key_max_rotation, xRotation, smoothstep(0.0, 1.0, controls.key_attack_time * obj.clock.getElapsedTime()));
      obj.rotation.x = mix(-Math.PI * config.piano.pressed / 180, -Math.PI * config.piano.unpressed / 180, smoothstep(0.0, 1.0, controls.key_attack_time * obj.clock.getElapsedTime()));
      if (obj.rotation.x <= -Math.PI * config.piano.unpressed) {
        obj.keyState = keyState.unpressed;
        obj.clock.elapsedTime = 0;
      }
      if( obj.children && obj.children[0].material ) {
        obj.children[0].material.color = obj.children[0].material.note_off;
      }
    }
  }

  function update(delta) {
    for (let obj of keys_obj) {
      update_key(obj, delta);
    }
  }



  const loader = new ColladaLoader();
  loader.load( '/assets/piano.dae', prepare_scene )
  _scene = scene

  const clock = new THREE.Clock()
  frame()
}

export function setMIDIEmulation() {
  function keyCode_to_note(keyCode):number {
    let note = -1;
    //-----------------------------------
    if (keyCode === 90) note = 0; // C 0
    if (keyCode === 83) note = 1; // C#0
    if (keyCode === 88) note = 2; // D 0
    if (keyCode === 68) note = 3; // D#0
    if (keyCode === 67) note = 4; // E 0
    if (keyCode === 86) note = 5; // F 0
    if (keyCode === 71) note = 6; // F#0
    if (keyCode === 66) note = 7; // G 0
    if (keyCode === 72) note = 8; // G#0
    if (keyCode === 78) note = 9; // A 0
    if (keyCode === 74) note = 10; // A#0
    if (keyCode === 77) note = 11; // B 0
    if (keyCode === 188) note = 12; // C 0

    //-----------------------------------
    if (keyCode === 81) note = 12; // C 1
    if (keyCode === 50) note = 13; // C#1
    if (keyCode === 87) note = 14; // D 1
    if (keyCode === 51) note = 15; // D#1
    if (keyCode === 69) note = 16; // E 1
    if (keyCode === 82) note = 17; // F 1
    if (keyCode === 53) note = 18; // F#1
    if (keyCode === 84) note = 19; // G 1
    if (keyCode === 54) note = 20; // G#1
    if (keyCode === 89) note = 21; // A 1
    if (keyCode === 55) note = 22; // A#1
    if (keyCode === 85) note = 23; // B 1
    //-----------------------------------
    if (keyCode === 73) note = 24; // C 2
    if (keyCode === 57) note = 25; // C#2
    if (keyCode === 79) note = 26; // D 2
    if (keyCode === 48) note = 27; // D#2
    if (keyCode === 80) note = 28; // E 2
    if (keyCode === 219) note = 29; // F 2
    if (keyCode === 187) note = 30; // F#2
    if (keyCode === 221) note = 31; // G 2
    // //-----------------------------------

    if (note === -1) return -1;

    return ("_" + (note + controls.octave * 12));
  }

  window.onkeyup = function (ev) {
    if (keys_down[ev.keyCode] === true) {
      const note = keyCode_to_note(ev.keyCode);
      note_off( note )
      console.log('note_off', note)
      keys_down[ev.keyCode] = false;
    }
  } 

  window.onkeydown = function(ev) {
    if (keys_down[ev.keyCode] !== true) {
      const note = keyCode_to_note(ev.keyCode);
      if (note !== -1) {
        note_on( note )
        console.log('note_on', note)
        // key_status(note, keyState.note_on);
        keys_down[ev.keyCode] = true;
      }
    }
  }     
}

export function note_on( note, velocity = 127 ) {
  key_status( note, keyState.note_on )

  const delay = 0
  if( window.MIDI ) {
    const _note = parseInt( note.slice(1) ) + 12 * 2
    console.log( _note, "note_on")

    window.MIDI.setVolume( 0, 127 )
    window.MIDI.noteOn(0, _note, velocity, delay)
  }
}

export function note_off( note, velocity = 127 ) {
  key_status( note, keyState.note_off )

  const delay = 0
  if( window.MIDI ) {
    const _note = parseInt( note.slice(1) ) + 12 * 2
    window.MIDI.setVolume( 0, 127 )
    window.MIDI.noteOff(0, _note, delay + 0.08)
  }
}

function key_status( keyName, status ) {
  const obj = _scene.getObjectByName( keyName, true )
  if( obj !== undefined ) {
    obj.clock.start()
    obj.clock.elapsedTime = 0
    obj.keyState = status
  }
}
