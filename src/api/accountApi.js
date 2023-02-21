import axiosClient from "./axiosClient";

const accountApi = {
    getAccountDetail: (params) => {
        const url = "/account/detail";
        return axiosClient.get(url, { params });
    },
};

export default accountApi;
