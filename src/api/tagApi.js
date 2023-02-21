import axiosClient from "./axiosClient";

const tagApi = {
    createTag: (params) => {
        const url = "/tag/create";
        return axiosClient.post(url, params);
    },
    editTag: (params) => {
        const url = "/tag/update";
        return axiosClient.put(url, params);
    },
    deleteTag: (params) => {
        const url = "/tag/delete";
        return axiosClient.delete(url, {params});
    },
    getTags: (params) => {
        const url = "/tag/find";
        return axiosClient.get(url, { params });
    },
    getDetailTag: (params) => {
        const url = "/tag/detail";
        return axiosClient.get(url, { params });
    },
    getTagsListOfUser: (params) => {
        const url = "/tag/find-by-person";
        return axiosClient.get(url, { params });
    },
};

export default tagApi;
