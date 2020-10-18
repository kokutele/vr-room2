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
  },
  reducers: {
    setStatus: function( state, action ) {
      state.status = action.payload
    },
    setAngleName: ( state, action ) => {
      state.angleName = action.payload
    },
  },
});

export const { setStatus, setAngleName } = roomSlice.actions;

export const selectStatus = state => state.room.status;
export const selectAngleName = state => state.room.angleName;

export default roomSlice.reducer;
