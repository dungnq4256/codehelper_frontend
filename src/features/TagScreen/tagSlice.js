import tagApi from "api/tagApi";
import ToastHelper from "general/helpers/ToastHelper";
import Global from "general/utils/Global";
import _ from "lodash";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

export const thunkCreateTag = createAsyncThunk("tag/create", async (params) => {
    const res = await tagApi.createTag(params);
    return res;
});

export const thunkEditTag = createAsyncThunk("tag/update", async (params) => {
    const res = await tagApi.editTag(params);
    return res;
});

export const thunkGetTagList = createAsyncThunk("tag/find", async (params) => {
    const res = await tagApi.getTags(params);
    return res;
});

export const thunkGetTagDetail = createAsyncThunk("tag/detail", async (params) => {
    const res = await tagApi.getDetailTag(params);
    return res;
});

export const thunkGetTagListOfUser = createAsyncThunk("tag/find-by-person", async (params) => {
    const res = await tagApi.getTagsListOfUser(params);
    return res;
});

const tagSlice = createSlice({
    name: "tag",
    initialState: {
        isGettingTags: false,
        isCreatingTag: false,
        isUpdatingTag: false,
        tags: [],
        detailTag: {},
        paginationTags: { perPage: Global.gDefaultPagination },
        tagsListOfUser: [],
        paginationTagsListOfUser: { perPage: Global.gDefaultPagination },
    },
    reducers: {
        setPaginationTagPerPage: (state, action) => {
            return {
                ...state,
                paginationTags: {
                    ...state.paginationTags,
                    perPage: action.payload,
                },
            };
        },
        setPaginationTagListOfUserPerPage: (state, action) => {
            return {
                ...state,
                paginationTagsListOfUser: {
                    ...state.paginationTagsListOfUser,
                    perPage: action.payload,
                },
            };
        },
    },
    extraReducers: {
        //create tag
        [thunkCreateTag.pending]: (state, action) => {
            state.isCreatingTag = true;
        },
        [thunkCreateTag.rejected]: (state, action) => {
            state.isCreatingTag = false;
        },
        [thunkCreateTag.fulfilled]: (state, action) => {
            state.isCreatingTag = false;
            
        },

        //edit tag
        [thunkEditTag.pending]: (state, action) => {
            state.isUpdatingTag = true;
        },
        [thunkEditTag.rejected]: (state, action) => {
            state.isUpdatingTag = false;
        },
        [thunkEditTag.fulfilled]: (state, action) => {
            state.isUpdatingTag = false;
        },

        //get tags list
        [thunkGetTagList.pending]: (state, action) => {
            state.isGettingTags = true;
        },
        [thunkGetTagList.rejected]: (state, action) => {
            state.isGettingTags = false;
        },
        [thunkGetTagList.fulfilled]: (state, action) => {
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

        [thunkGetTagDetail.fulfilled]: (state, action) => {
            const { tag }  = action.payload;
            state.detailTag = tag;
        },

        //get tags list of user
        [thunkGetTagListOfUser.pending]: (state, action) => {
            state.isGettingTags = true;
        },
        [thunkGetTagListOfUser.rejected]: (state, action) => {
            state.isGettingTags = false;
        },
        [thunkGetTagListOfUser.fulfilled]: (state, action) => {
            state.isGettingTags = false;
            const { limit, page, tags, count } = action.payload;
            state.tagsListOfUser = tags;
            if (!_.isNull(count) && !_.isNull(page)) {
                state.paginationTagsListOfUser = {
                    ...state.paginationTagsListOfUser,
                    currentPage: page,
                    perPage: limit,
                    count: count,
                };
            }
            Global.g_needToRefreshTags = false;
        },
    },
});

const { reducer, actions } = tagSlice;
export const { setPaginationTagPerPage, setPaginationTagListOfUserPerPage } = actions;
export default reducer;
