import { createSlice } from '@reduxjs/toolkit';

export const STATUS = {
  INIT: 'INIT',
  CONNECTING: 'CONNECTING',
  READY: 'READY'
}

export const roomSlice = createSlice({
  name: 'room',
  initialState: {
    status: STATUS.INITIALIZED,
    angleName: 'entire',
    numAttendees: 0,
  },
  reducers: {
    setStatus: function( state, action ) {
      state.status = action.payload
    },
    setAngleName: ( state, action ) => {
      state.angleName = action.payload
    },
    addAttendee:( state ) => {
      ++state.numAttendees
    },
    remAttendee:( state ) => {
      --state.numAttendees
    }
  },
});

export const { 
  setStatus, 
  setAngleName,
  addAttendee,
  remAttendee,
} = roomSlice.actions;

export const selectStatus = state => state.room.status;
export const selectAngleName = state => state.room.angleName;
export const selectNumAttendees = state => state.room.numAttendees

export default roomSlice.reducer;
