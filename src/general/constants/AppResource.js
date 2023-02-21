// App resources: icons, images, fonts...

const AppResource = {
    // images
    images: {
        img404NotFound: require("assets/images/img_404_notfound.png"),
        imgNoData: require("assets/images/img_no_data.png"),
        imgSignIn: require("assets/images/ImageLogin.png"),
        imgSignUp: require("assets/images/ImageRegister.png"),
        imgForgotPassword: require("assets/images/ImageForgotPassword.png"),
        imgDefaultAvatar: require("assets/images/img_default_avatar.jpg"),
        imgPageNotFound: require("assets/images/Page-not-found.png"),
        Logo: require("assets/images/icon.png"),
        noDataContact: require("assets/images/empty.svg"),
        errorStates: {
            noMatchFound: require('assets/images/ErrorStates/No-match-found.png'),
            error404: require('assets/images/ErrorStates/404.png'),
            lostConnection: require('assets/images/ErrorStates/Lost-connection.png'),
            noSearchFound: require('assets/images/ErrorStates/No-search-found.png'),
            pageNotFound: require('assets/images/ErrorStates/Page-not-found.png'),
            paymentFailed: require('assets/images/ErrorStates/Payment-failed.png'),
            permanentlyDelete: require('assets/images/ErrorStates/Permanently-delete.png'),
            somethingWentWrong: require('assets/images/ErrorStates/Something-went-wrong.png'),
            unsubscribe: require('assets/images/ErrorStates/Unsubscribe.png'),
        }
    },
    icons: {
        icPageUp: require("assets/icons/PageUp.png"),
        icTrash: require("assets/icons/ic_trash.png"),
    },

    // colors
    colors: {
        mainBGColor: "#F2F6FD",
        featureColor: "#F48023",
    },
};

export default AppResource;
