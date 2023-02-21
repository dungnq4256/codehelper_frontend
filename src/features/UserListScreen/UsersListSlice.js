import authApi from "api/authApi";
import Global from "general/utils/Global";
import _ from "lodash";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const thunkGetUsersList = createAsyncThunk(
    "user/find",
    async (params) => {
        const res = await authApi.getAccountList(params);
        return res;
    }
);

const usersListSlice = createSlice({
    name: "user",
    initialState: {
        isGettingUsersList: false,
        usersList: [],
        paginationListUser: { perPage: Global.gDefaultPagination },
    },
    reducers: {
        setPaginationUserPerPage: (state, action) => {
            return {
                ...state,
                paginationListUser: {
                    ...state.paginationListUser,
                    perPage: action.payload,
                },
            };
        },
    },
    extraReducers: {
        //get users list
        [thunkGetUsersList.pending]: (state, action) => {
            state.isGettingUsersList = true;
        },
        [thunkGetUsersList.rejected]: (state, action) => {
            state.isGettingUsersList = false;
        },
        [thunkGetUsersList.fulfilled]: (state, action) => {
            state.isGettingUsersList = false;
            const { total, limit, page, accounts, count } = action.payload;
            state.usersList = accounts;
            if (!_.isNull(total) && !_.isNull(page)) {
                state.paginationListUser = {
                    ...state.paginationListUser,
                    total: total,
                    currentPage: page,
                    perPage: limit,
                    count: count,
                };
            }
            Global.g_needToRefreshUsers = false;
        },
    },
});

const { reducer, actions } = usersListSlice;
export const { setPaginationUserPerPage } = actions;
export default reducer;
