import axiosClient from "./axiosClient";

const questionApi = {
    // get questions list
    getQuestionsList: (params) => {
        const url = "/question/find";
        return axiosClient.get(url, { params });
    },

    // get questions list of user
    getQuestionsListOfUser: (params) => {
        const url = "/question/find-by-person";
        return axiosClient.get(url, { params });
    },

    //get detail question
    thunkGetDetailQuestion: (params) => {
        const url = "/question/detail";
        return axiosClient.get(url, { params });
    },

    // create question
    createQuestion: (params) => {
        const url = "/question/create";
        return axiosClient.post(url, params);
    },

    // edit question
    editQuestion: (params) => {
        const url = "/question/update";
        return axiosClient.put(url, params);
    },

    //delete question
    deleteQuestion: (params) => {
        const url = "/question/delete";
        return axiosClient.delete(url, { params });
    },

    //vote question
    voteQuestion: (params) => {
        const url = "/question/react";
        return axiosClient.post(url, params);
    },
};

export default questionApi;
