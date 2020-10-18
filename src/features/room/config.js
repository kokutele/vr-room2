export const config = {
  radiusOfFloor: 90, // radius of floor 
  thetasOfSeats: [ 15, 45, 75, 105, 135, 165 ], // todo - config.js
  screen: {
    width: 64,
    height: 48,
    position: [0, 0, 90 ],
    rotationX: 180,
  },
  angles: {
    entire: { position: [4, 10, 102], lookAt: [0, 0, 0] },
    piano: { position: [0, 0, -3], lookAt: [0, 0, 0] }
  }
}