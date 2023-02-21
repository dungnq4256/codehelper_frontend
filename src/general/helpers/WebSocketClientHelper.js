import { deleteAnswer, reactAnswer, setAnswers, updateAnswer } from "features/Question/questionSlice";

// import store from 'app/store';
let store;

var W3CWebSocket = require("websocket").w3cwebsocket;

const sTag = "[WebsocketHelper]";

class WebsocketHelper {
    // MARK: --- Params ---
    wsClient = null;
    mTimeout = null;

    // MARK: --- Functions ---
    // constructor
    constructor() {
        this.initWebsocket();
    }

    initWebsocket() {
        // console.log(AppConfigs.wsUrl);
        // this.wsClient = new W3CWebSocket("wss://cnwebg8server.onrender.com/", "");
        this.wsClient = new W3CWebSocket("ws://localhost:5000", "");

        this.wsClient.onerror = () => {
            console.log(`${sTag} connection error`);
            // store?.dispatch(setOnlineStatus(false));
            this.autoReconnect();
        };

        this.wsClient.onopen = () => {
            console.log(`${sTag} websocket client connected`);

            // auto re login
            // const current = store?.getState()?.auth?.currentAccount;
            // if (current && current.email) {
            //     this.loginByToken(current.email, localStorage.getItem(PreferenceKeys.accessToken));
            // }
        };

        this.wsClient.onclose = () => {
            console.log(`${sTag} echo-protocol client closed`);
            // store?.dispatch(setOnlineStatus(false));
            this.autoReconnect();
        };

        this.wsClient.onmessage = (e) => {
            const data = e.data;
            if (typeof data === "string") {
                try {
                    this.processReceivedMessage(JSON.parse(data));
                } catch (error) {}
            }
        };
    }

    // auto reconnect websocket
    autoReconnect() {
        if (this.mTimeout) {
            clearTimeout(this.mTimeout);
            this.mTimeout = null;
        }
        this.mTimeout = setTimeout(() => {
            this.initWebsocket();
        }, 5000);
    }

    sendAnswer(answer) {
        if (this.wsClient.readyState === 1) {
            const data = {
                code: "00",
                answer: answer,
            };

            this.wsClient.send(JSON.stringify(data));
        }
    }

    updateAnswer(answer) {
        if (this.wsClient.readyState === 1) {
            const data = {
                code: "01",
                answer: answer,
            };

            this.wsClient.send(JSON.stringify(data));
        }
    }

    deleteAnswer(answerId) {
        if (this.wsClient.readyState === 1) {
            const data = {
                code: "02",
                answer: answerId,
            };

            this.wsClient.send(JSON.stringify(data));
        }
    }

    reactAnswer(props) {
        if (this.wsClient.readyState === 1) {
            const data = {
                code: "03",
                answer: props.answer,
                accountId: props.accountId,
                reactType: props.reactType,
            };

            this.wsClient.send(JSON.stringify(data));
        }
    }

    // MARK: --- Utils functions ---
    processReceivedMessage(data) {
        try {
            // console.log(`${sTag} received: ${JSON.stringify(data)}`);
        } catch (error) {}

        if (data) {
            let { code, answer, accountId, reactType } = data;
            // console.log({ data });
            switch (code) {
                case "00":
                    store?.dispatch(setAnswers(answer));
                    break;
                case "01":
                    store?.dispatch(updateAnswer(answer));
                    break;
                case "02":
                    store?.dispatch(deleteAnswer(answer));
                    break;
                case "03":
                    store?.dispatch(reactAnswer({ answer: answer, accountId: accountId, reactType: reactType }));
                    break;

                default:
                    break;
            }
            // switch (
            //     code
            // case "01":
            //   if (result === "success") {
            //     store?.dispatch(setOnlineStatus(false));
            //   }
            //   break;
            // case "403":
            //   if (result === "failed") {
            //     ToastHelper.showError(message);
            //     store?.dispatch(setShowModalSigning(false));
            //   }
            //   break;
            // case "03":
            //   store.dispatch(thunkGetAccountInfor());
            //   store.dispatch(setPaymentDoneFlag({}));
            //   const paymentId = data.paymentId;
            //   if (result === "success") {
            //     ToastHelper.showSuccess(message);
            //   } else {
            //     ToastHelper.showError(message);
            //   }
            //   break;
            // case "04":
            //   const contractId = data.contractId;
            //   if (result === "success") {
            //     ToastHelper.showSuccess(message);
            //     Global.g_signingSuccess = true;

            //     const jwtToken = sessionStorage.getItem(PreferenceKeys.jwtToken);
            //     const navigateUrl = jwtToken
            //       ? `/contract/contract-result/${contractId}?jwtToken=${jwtToken}`
            //       : `/contract/contract-result/${contractId}`;

            //     store?.dispatch(setShowModalSigning(false));

            //     if (Utils.isValidNumber(contractId)) history.push(navigateUrl);
            //   } else {
            //     ToastHelper.showError(message);
            //     store?.dispatch(setShowModalSigning(false));

            //     // Cờ để biết quá trình ký thất bại
            //     store?.dispatch(setSigningFailed(true));
            //   }
            //   break;
            // case "06":
            //   store?.dispatch(toggleFlagEKYC(result == "success"));
            //   if (result === "success") {
            //     ToastHelper.showSuccess(message);
            //   } else {
            //     ToastHelper.showError(message);
            //     store?.dispatch(setShowModalSigning(false));
            //   }

            //   break;
            // case "07":
            //   if (!tag) {
            //     store?.dispatch(toggleFlagEKYCESignCloud(result == "success"));
            //   }

            //   if (tag == "PREPARE_CERTIFICATE_FOR_SIGN_CLOUD") {
            //     store?.dispatch(
            //       toggleFlagPrepareCeritificateESignCloudSuccess(
            //         result == "success"
            //       )
            //     );
            //   }
            //   if (result === "success") {
            //     ToastHelper.showSuccess(message);
            //   } else {
            //     ToastHelper.showError(message);

            //     // Cờ để biết quá trình ký thất bại
            //     store?.dispatch(setSigningFailed(true));
            //   }

            //   break;
            // case "08":
            //   if (result === "success") {
            //     const contractId = data.contractId;
            //     const jwtToken = sessionStorage.getItem(PreferenceKeys.jwtToken);
            //     store
            //       ?.dispatch(thunkGetContractDetail({ contractId, jwtToken }))
            //       .then(() => {
            //         store?.dispatch(changeHistoryListenStatus(2));
            //       });
            //   }
            //   break;
            // case "207":
            //   if (result === "failed") {
            //     store?.dispatch(changeHistoryListenStatus(3));
            //   }
            // case "600":
            //   // co thong bao moi
            //   // load lai danh sach thong bao
            //   // dispatch...
            //   const { title, content } = data;
            //   // ToastHelper.showSuccess(`${title} - ${content}`);
            //   store.dispatch(
            //     thunkGetAccountNotification({
            //       params: { page: 0, limit: Global.gDefaultPagination },
            //     })
            //   );
            //   break;
            // default:
            //   break;
            // ) {
            // }

            // if (result === 'success') {
            //     switch (command) {
            //         case 'login':
            //             store?.dispatch(setOnlineStatus(true));
            //             break;
            //         case 'message':
            //             {
            //                 const message = data.message;
            //                 if (message) {
            //                     store?.dispatch(updateSessionMessage(message));
            //                     store?.dispatch(addNewMessageSessionId(message.sessionId));
            //                 }
            //             }
            //             break;
            //         case 'on_message':
            //             {
            //                 const message = data.message;
            //                 if (message) {
            //                     store?.dispatch(updateSessionMessage(message));
            //                     store?.dispatch(addNewMessageSessionId(message.sessionId));
            //                 }
            //             }
            //             break;
            //         default:
            //             break;
            //     }
            // }
        }
    }
}

// prevents modification to properties and values of an object
const wsHelperInstance = new WebsocketHelper();

// Object.freeze(wsHelperInstance);

// export
export default wsHelperInstance;

export const injectStore = (_store) => {
    store = _store;
};
