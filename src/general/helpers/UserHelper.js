import { removeAxiosAccessToken } from "api/axiosClient";
import axios from "axios";
import AppResource from "general/constants/AppResource";
import PreferenceKeys from "general/constants/PreferenceKey";
import Utils from "general/utils/Utils";
import _ from "lodash";
import moment from "moment";
import { AvatarGenerator } from "random-avatar-generator";

const UserHelper = {
    // Get random avatar url
    getRandomAvatarUrl: () => {
        const generator = new AvatarGenerator();
        // return 'https://blenderartists.org/uploads/default/original/4X/6/a/d/6adcaac6f7378fbf998f5ea0490724cea82eb01f.jpeg';
        return generator.generateRandomAvatar();
    },

    // Check access token valid
    checkAccessTokenValid: () => {
        const accessToken = localStorage.getItem(PreferenceKeys.accessToken);
        // const accessTokenExpired = localStorage.getItem(PreferenceKeys.accessTokenExpired);
        if (accessToken) {
            // const momentExpired = moment.utc(accessTokenExpired);
            // const momentNow = moment.utc();
            // return momentExpired.isAfter(momentNow);
            return true;
        }

        return false;
    },

    // Get display name
    getDisplayName: (account) => {
        if (account) {
            return account.fullname ?? account.email ?? "Unknown";
        }
        return "";
    },

    // Get avatar
    getAvatar: (account) => {
        if (account) {
            return account.avatar ?? UserHelper.getRandomAvatarUrl();
        }
        return UserHelper.getRandomAvatarUrl();
    },

    // Sign out
    signOut: () => {
        localStorage.removeItem(PreferenceKeys.accessToken);
        localStorage.removeItem(PreferenceKeys.accessTokenExpired);
        removeAxiosAccessToken();
    },

    isHSMAuthen: (account) => {
        const isAuthen =
            !_.isEmpty(account?.hsmAgreementUUID) &&
            !_.isEmpty(account?.hsmPasscode);
        return isAuthen;
    },

    isHasRemoteSigning: (account) => {
        return account?.hasRemoteSigningP12 ?? false;
    },

    getAccountAvatar: (account) => {
        const avatar = account?.avatar;
        if (avatar) {
            return Utils.getFullUrl(avatar);
        } else {
            return AppResource.images.imgDefaultAvatar;
        }
    },

    renderGender: (gender) => {
        switch (gender) {
            case "MALE":
                return "Nam";
            case "FEMALE":
                return "Nữ";
            case "UNKNOWN":
                return "Không xác định";
            default:
                break;
        }
    },
};

export default UserHelper;
