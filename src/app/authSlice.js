import { updateAxiosAccessToken } from "api/axiosClient";
// import PreferenceKeys from "general/constants/PreferenceKeys";
// import WebsocketHelper from 'general/helpers/WebsocketHelper';
import ToastHelper from "general/helpers/ToastHelper";
import authApi from "api/authApi";
import PreferenceKeys from "general/constants/PreferenceKey";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const thunkSignIn = createAsyncThunk(
    "auth/sign-in",
    async (params, thunkApi) => {
        const res = await authApi.signIn(params);
        console.log(res);
        return res;
    }
);

export const thunkGetAccountInfor = createAsyncThunk(
    "account/get-account-infor",
    async (params, thunkApi) => {
        const res = await authApi.getAccountInfor(params);
        return res;
    }
);


export const thunkRequestToResetPassword = createAsyncThunk(
    "account/request-reset-password",
    async (params, thunkApi) => {
        const res = await authApi.requestToResetPassword(params);
        return res;
    }
);

export const thunkChangePassword = createAsyncThunk(
    "account/change-password",
    async (params, thunkApi) => {
        const res = await authApi.changePassword(params);
        return res;
    }
);
// export const thunkEditProfile = createAsyncThunk(
//   "account/edit-profile",
//   async (params) => {
//     const res = await authApi.updateProfile(params);
//     return res;
//   }
// );

export const thunkSignOut = createAsyncThunk(
    "auth/sign-out",
    async (params) => {
        const res = await authApi.signOut(params);
        return res;
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        loggedIn: false,
        isSigningIn: false,
        isChangingPassword: false,
        currentAccount: {},
        isOnlineStatus: false,
    },
    reducers: {
        updateCurrentAccountInfor: (state, action) => {
            return {
                ...state,
                currentAccount: {
                    ...state.currentAccount,
                    ...action.payload,
                },
            };
        },

        setOnlineStatus: (state, action) => {
            state.isOnlineStatus = action.payload;
        },
    },
    extraReducers: {
        //sign in
        [thunkSignIn.pending]: (state, action) => {
            state.isSigningIn = true;
        },

        [thunkSignIn.rejected]: (state, action) => {
            state.isSigningIn = false;
        },

        [thunkSignIn.fulfilled]: (state, action) => {
            state.isSigningIn = false;
            const { account } = action.payload;
            state.loggedIn = true;
            state.currentAccount = account;
            const { accessToken, expirationDateToken } = account;
            if (accessToken) {
                localStorage.setItem(PreferenceKeys.accessToken, accessToken);
                // localStorage.setItem(
                //   PreferenceKeys.accessTokenExpired,
                //   expirationDateToken
                // );
                updateAxiosAccessToken(accessToken);
            }
            // const { email, password } = account;
            // if (email && password) {
            //   WebsocketHelper.login(email, password);
            // }
        },
        //get current account infor
        [thunkGetAccountInfor.pending]: (state, action) => {
            state.isGettingInfor = true;
        },

        [thunkGetAccountInfor.rejected]: (state, action) => {
            state.isGettingInfor = false;
        },

        [thunkGetAccountInfor.fulfilled]: (state, action) => {
            state.isGettingInfor = false;
            const { account } = action.payload;
            if (account) {
                state.currentAccount = account;
                state.loggedIn = true;

                const { accessToken, expirationDateToken, email } = account;
                if (accessToken) {
                    localStorage.setItem(
                        PreferenceKeys.accessToken,
                        accessToken
                    );
                    //   localStorage.setItem(
                    //     PreferenceKeys.accessTokenExpired,
                    //     expirationDateToken
                    //   );
                    updateAxiosAccessToken(accessToken);
                }
                // if (email) {
                //   WebsocketHelper.loginByToken(email, localStorage.getItem(PreferenceKeys.accessToken));
                // }
            }
        },

        //edit profile
        // [thunkGetAccountInfor.pending]: (state, action) => {
        //   state.isGettingInfor = true;
        // },

        // [thunkGetAccountInfor.rejected]: (state, action) => {
        //   state.isGettingInfor = false;
        // },

        // [thunkEditProfile.fulfilled]: (state, action) => {
        //   state.isGettingInfor = false;
        //   const { result, account } = action.payload;
        //   if (result === "success") {
        //     state.currentAccount = { ...state.currentAccount, ...account };
        //   }
        // },

        //Request to reset password
        [thunkRequestToResetPassword.fulfilled]: (state, action) => {
            const { result } = action.payload;
            if (result === "success") {
                ToastHelper.showSuccess("Mật khẩu mới đã được gửi tới email của bạn. Vui lòng kiểm tra hòm thư (bao gồm cả hòm thư rác).")
            }
        },

        //Change password
        [thunkChangePassword.pending]: (state, action) => {
            state.isChangingPassword = true;
        },

        [thunkChangePassword.rejected]: (state, action) => {
            state.isChangingPassword = false;
        },
        [thunkChangePassword.fulfilled]: (state, action) => {
            state.isChangingPassword = false;
            const { result } = action.payload;
            if (result === "success") {
                ToastHelper.showSuccess("Đổi mật khẩu thành công")
            }
        },

        // log out
        [thunkSignOut.fulfilled]: (state, action) => {
            const { result } = action.payload;
            if (result === "success") {
                localStorage.removeItem(PreferenceKeys.accessToken);
                state.currentAccount = {};
                state.loggedIn = false;
            }
        },

        //
    },
});

const { reducer, actions } = authSlice;
export const { updateCurrentAccountInfor, setOnlineStatus } = actions;
export default reducer;
