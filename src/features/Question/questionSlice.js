import questionApi from "api/questionApi";
import PreferenceKeys from "general/constants/PreferenceKey";
import ToastHelper from "general/helpers/ToastHelper";
import Global from "general/utils/Global";
import useRouter from "Hooks/useRouter";
import _ from "lodash";

const { createSlice, createAsyncThunk, current } = require("@reduxjs/toolkit");

export const thunkGetQuestionsList = createAsyncThunk("question/find", async (params) => {
    const res = await questionApi.getQuestionsList(params);
    return res;
});

export const thunkGetQuestionsListOfUser = createAsyncThunk("question/find-by-person", async (params) => {
    const res = await questionApi.getQuestionsListOfUser(params);
    return res;
});

export const thunkGetDetailQuestion = createAsyncThunk("question/detail", async (params) => {
    const res = await questionApi.thunkGetDetailQuestion(params);
    return res;
});

export const thunkCreateQuestion = createAsyncThunk("question/create", async (params) => {
    const res = await questionApi.createQuestion(params);
    return res;
});

export const thunkEditQuestion = createAsyncThunk("question/update", async (params) => {
    const res = await questionApi.editQuestion(params);
    return res;
});

export const thunkVoteQuestion = createAsyncThunk("question/vote", async (params) => {
    const res = await questionApi.voteQuestion(params);
    return res;
});
export const thunkVoteDetailQuestion = createAsyncThunk("question/vote-detail", async (params) => {
    const res = await questionApi.voteQuestion(params);
    return res;
});

const questionSlice = createSlice({
    name: "question",
    initialState: {
        isGettingQuestionsList: false,
        isGettingDetailQuestion: false,
        isGettingQuestionsListOfUser: false,
        questionsList: [],
        questionsListOfUser: [],
        detailQuestion: {},
        paginationListQuestion: { perPage: Global.gDefaultPagination },

        answers: [],
    },
    reducers: {
        setPaginationQuestionPerPage: (state, action) => {
            return {
                ...state,
                paginationListQuestion: {
                    ...state.paginationListQuestion,
                    perPage: action.payload,
                },
            };
        },
        setAnswers: (state, action) => {
            console.log(action.payload);
            const { account, content, questionId } = action.payload;
            if (questionId === state.detailQuestion._id) {
                state.answers = state.answers.concat(action.payload);
            }
        },
        deleteAnswer: (state, action) => {
            console.log(action.payload);
            if (!action.payload._id) {
                state.answers = state.answers.filter((item) => item.tempId !== action.payload.tempId);
            } else {
                state.answers = state.answers.filter((item) => item._id !== action.payload._id);
            }
        },
        reactAnswer: (state, action) => {
            let reqAnswer = state.answers.find((item) => item.tempId == action.payload.answer.tempId);
            const alreadyLike = reqAnswer.likes.includes(action.payload.accountId);
            const alreadyDislike = reqAnswer.dislikes.includes(action.payload.accountId);
            const accountId = action.payload.accountId;
            const reactType = action.payload.reactType;
            if (reactType == 1 && alreadyLike) {
                reqAnswer.likeCount = reqAnswer.likeCount - 1;
                reqAnswer.likes = reqAnswer.likes.filter((item) => item != accountId);
            } else if (reactType == 1 && !alreadyLike) {
                if (alreadyDislike) {
                    reqAnswer.likeCount = reqAnswer.likeCount + 1;
                    reqAnswer.dislikeCount = reqAnswer.dislikeCount - 1;
                    reqAnswer.dislikes = reqAnswer.dislikes.filter((item) => item != accountId);
                    reqAnswer.likes.push(accountId);
                } else {
                    reqAnswer.likeCount = reqAnswer.likeCount + 1;
                    reqAnswer.likes.push(accountId);
                }
            } else if (reactType == 0 && alreadyDislike) {
                reqAnswer.dislikeCount = reqAnswer.dislikeCount - 1;
                reqAnswer.dislikes = reqAnswer.dislikes.filter((item) => item != accountId);
            } else if (reactType == 0 && !alreadyDislike) {
                if (alreadyLike) {
                    reqAnswer.likeCount = reqAnswer.likeCount - 1;
                    reqAnswer.dislikeCount = reqAnswer.dislikeCount + 1;
                    reqAnswer.likes = reqAnswer.likes.filter((item) => item != accountId);
                    reqAnswer.dislikes.push(accountId);
                } else {
                    reqAnswer.dislikeCount = reqAnswer.likeCount + 1;
                    reqAnswer.dislikes.push(accountId);
                }
            }
            for (let i = 0; i < state.answers.length; i++) {
                if (state.answers[i].tempId == reqAnswer.tempId) {
                    state.answers[i] = reqAnswer;
                }
            }
        },
        updateAnswer: (state, action) => {
            console.log(action.payload);
            for (let i = 0; i < state.answers.length; i++) {
                if (state.answers[i].tempId === action.payload.tempId) {
                    state.answers[i].content = action.payload.content;
                }
            }
        },
    },
    extraReducers: {
        //get questions list
        [thunkGetQuestionsList.pending]: (state, action) => {
            state.isGettingQuestionsList = true;
        },
        [thunkGetQuestionsList.rejected]: (state, action) => {
            state.isGettingQuestionsList = false;
        },
        [thunkGetQuestionsList.fulfilled]: (state, action) => {
            state.isGettingQuestionsList = false;
            const { total, limit, page, questions, count } = action.payload;
            state.questionsList = questions;
            if (!_.isNull(total) && !_.isNull(page)) {
                state.paginationListQuestion = {
                    ...state.paginationListQuestion,
                    total: total,
                    currentPage: page,
                    perPage: limit,
                    count: count,
                };
                Global.g_needToRefreshQuestions = false;
            }
        },

        //get questions list of user
        [thunkGetQuestionsListOfUser.pending]: (state, action) => {
            state.isGettingQuestionsListOfUser = true;
        },
        [thunkGetQuestionsListOfUser.rejected]: (state, action) => {
            state.isGettingQuestionsListOfUser = false;
        },
        [thunkGetQuestionsListOfUser.fulfilled]: (state, action) => {
            state.isGettingQuestionsListOfUser = false;
            const { total, limit, page, questions, count } = action.payload;
            state.questionsListOfUser = questions;
            if (!_.isNull(total) && !_.isNull(page)) {
                state.paginationListQuestion = {
                    ...state.paginationListQuestion,
                    total: total,
                    currentPage: page,
                    perPage: limit,
                    count: count,
                };
                Global.g_needToRefreshQuestions = false;
            }
        },

        //get detail question
        [thunkGetDetailQuestion.pending]: (state, action) => {
            state.isGettingDetailQuestion = true;
        },
        [thunkGetDetailQuestion.rejected]: (state, action) => {
            state.isGettingDetailQuestion = false;
        },
        [thunkGetDetailQuestion.fulfilled]: (state, action) => {
            state.isGettingDetailQuestion = false;
            const { result, question } = action.payload;
            const { _id } = action.meta.arg;
            if (result === "success") {
                state.detailQuestion = question;
                state.answers = question.answer;
            }
        },

        [thunkCreateQuestion.fulfilled]: (state, action) => {
            const { result } = action.payload;
            if (result === "success") {
                ToastHelper.showSuccess("Thêm câu hỏi thành công.");
            }
        },
        //get detail question
        [thunkEditQuestion.fulfilled]: (state, action) => {
            const { result } = action.payload;
            if (result === "success") {
                ToastHelper.showSuccess("Sửa câu hỏi thành công.");
            }
        },
        [thunkVoteQuestion.fulfilled]: (state, action) => {
            const { result, question } = action.payload;
            const _id = action.meta.arg._id;
            for (let i = 0; i < state.questionsList.length; i++) {
                if (state.questionsList[i]._id === _id) {
                    state.questionsList[i] = question;
                }
            }
        },
        [thunkVoteDetailQuestion.fulfilled]: (state, action) => {
            const { result, question } = action.payload;
            state.detailQuestion = question;
        },
    },
});

const { reducer, actions } = questionSlice;
export const { setPaginationQuestionPerPage, setAnswers, deleteAnswer, reactAnswer, updateAnswer } = actions;
export default reducer;
