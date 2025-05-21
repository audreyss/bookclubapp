import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    value: {
        pseudo: null,
        email: null,
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
            state.value.email = action.payload.email;
        },
        logout: (state, action) => {
            state.value.token = null;
            state.value.pseudo = null;
            state.value.email = null;
        },
        changePseudo : (state, action) => {
            state.value.pseudo = action.payload.pseudo;
        },
        changeEmail : (state, action) => {
            state.value.email = action.payload.email;
            state.value.token = action.payload.token;
        },
    },
});

export const { login, logout, changePseudo, changeEmail } = userSlice.actions;
export default userSlice.reducer;