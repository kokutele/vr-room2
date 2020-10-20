export const config = {
  radiusOfFloor: 90, // radius of floor 
  thetasOfSeats: [ 15, 45, 75, 105, 135, 165 ], // todo - config.js
  sizeOfChair: 10,
  attendee: {
    width: 32,
    height: 24,
    positionY: 10,
    lissajousY: 34,
  },
  screen: {
    width: 640 / 25,
    height: 480 / 25,
    position: [0, -5, 70 ],
    rotationX: 0,
  },
  screenLissajousL: {
    width: 640 / 60,
    height: 480 / 60,
    position: [-13, -2.5, 60 ],
    rotationX: 0,
  },
  screenLissajousR: {
    width: 640 / 60,
    height: 480 / 60,
    position: [13, -2.5, 60 ],
    rotationX: 0,
  },
  piano: {
    position: [5.5, -5, 50],
    pressed: 85,
    unpressed: 90,
    light: [0, 30, 45],
  },
  angles: {
    entire: { position: [4, 5, 102], lookAt: [0, 0, 0] },
    piano: { position: [1, 3, 38], lookAt: [0, -1, 50] }
  }
}