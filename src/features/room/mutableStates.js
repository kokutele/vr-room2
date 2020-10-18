class MutableStates {
  _user = new Map()
  _videoTracks = new Map()
  _auidoTracks = new Map()
  _consumers   = new Map()
  _producers   = new Map()
  _localStream = null

  get localAudioTrack(){
    return this._localStream.getAudioTraks[0]
  }
  get localVideoTrack(){
    return this._localStream.getVideoTraks[0]
  }
}

export default new MutableStates()