import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        pseudo: null,
        token: null
    },
};

export const userSlice = createSlice({
    name: 'user',

    initialState,
    reducers: {
        login: (state, action) => {
            state.value.token = action.payload.token;
            state.value.pseudo = action.payload.pseudo;
        },
        logout: (state, action) => {
            state.value.token = null;
            state.value.pseudo = null;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;