import accountApi from "api/accountApi";
import tagApi from "api/tagApi";
import Global from "general/utils/Global";
import _ from "lodash";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const thunkGetAccountDetail = createAsyncThunk("account/detail", async (params) => {
    const res = accountApi.getAccountDetail(params);
    return res;
});

export const thunkGetTagByAccount = createAsyncThunk("account/tag", async (params) => {
    const res = await tagApi.getTagsByAccount(params);
    return res;
});

const accountSlice = createSlice({
    name: "account",
    initialState: {
        isGettingAccountInfor: false,
        account: {},

        isGettingTags: false,
        tags: [],
        paginationTags: { perPage: Global.gDefaultPagination },
    },
    reducers: {
        setPaginationTag: (state, action) => {
            return {
                ...state,
                paginationTags: {
                    ...state.paginationTags,
                    perPage: action.payload,
                },
            };
        },
    },
    extraReducers: {
        [thunkGetAccountDetail.pending]: (state, action) => {
            state.isGettingAccountInfor = true;
        },

        [thunkGetAccountDetail.rejected]: (state, action) => {
            state.isGettingAccountInfor = false;
        },

        [thunkGetAccountDetail.fulfilled]: (state, action) => {
            state.isGettingAccountInfor = false;
            const { result, account } = action.payload;
            if (result === "success") {
                state.account = account;
            }
        },

        //get tags list
        [thunkGetTagByAccount.pending]: (state, action) => {
            state.isGettingTags = true;
        },
        [thunkGetTagByAccount.rejected]: (state, action) => {
            state.isGettingTags = false;
        },
        [thunkGetTagByAccount.fulfilled]: (state, action) => {
            state.isGettingTags = false;
            const { limit, page, tags, count } = action.payload;
            state.tags = tags;
            if (!_.isNull(count) && !_.isNull(page)) {
                state.paginationTags = {
                    ...state.paginationTags,
                    currentPage: page,
                    perPage: limit,
                    count: count,
                };
            }
            Global.g_needToRefreshTags = false;
        },
    },
});

const { reducer, actions } = accountSlice;
export const {} = actions;
export default reducer;
