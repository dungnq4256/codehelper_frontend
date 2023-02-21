import PreferenceKeys from "general/constants/PreferenceKey";
import ToastHelper from "general/helpers/ToastHelper";
import Global from "general/utils/Global";
import _ from "lodash";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const answerSlice = createSlice({
    name: "answer",
    initialState: {
        answers: []
    },
    reducers: {
        createAnswer: (state, action) => {

        },
    },
    extraReducers: {},
});

const { reducer, actions } = answerSlice;
export const { setPaginationAnswerPerPage } = actions;
export default reducer;
