import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
    thunkGetDetailQuestion,
    thunkGetQuestionsListOfUser,
} from "features/Question/questionSlice";
import Tag from "general/components/Tag";
import Utils from "general/utils/Utils";
import { useNavigate } from "react-router-dom";
import DialogModal from "general/components/DialogModal";
import AppResource from "general/constants/AppResource";
import Empty from "general/components/Empty";
import Loading from "general/components/Loading";
import questionApi from "api/questionApi";
import ToastHelper from "general/helpers/ToastHelper";
import ModalEditQuestion from "features/Question/Component/ModalEditQuestion";
import useRouter from "Hooks/useRouter";

AccountQuestionScreen.propTypes = {};

function AccountQuestionScreen(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { questionsListOfUser, isGettingQuestionsListOfUser } = useSelector(
        (state) => state?.question
    );
    const [showModalEditQuestion, setShowModalEditQuestion] = useState(false);
    const [showModalDeleteQuestion, setShowModalDeleteQuestion] =
        useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState({});
    const [thisAccount, setThisAccount] = useState({});
    const { isGettingAccountInfor, account } = useSelector(
        (state) => state?.account
    );
    const router = useRouter();
    const accountId = router.query?.accountId;
    const { currentAccount } = useSelector((state) => state?.auth);

    useEffect(() => {
        dispatch(thunkGetQuestionsListOfUser({ _id: account?._id }));
    }, [account]);

    async function handleDeleteQuestion() {
        const res = await questionApi.deleteQuestion({
            _id: selectedQuestion?._id,
        });
        if (res.result === "success") {
            ToastHelper.showSuccess(
                `Xóa câu hỏi với tiêu đề ${selectedQuestion?.title} thành công`
            );
            await dispatch(thunkGetQuestionsListOfUser());
        }
    }

    useEffect(() => {
        if (currentAccount?._id === account?._id) {
            setThisAccount(currentAccount);
        } else {
            setThisAccount(account);
        }
    }, [account, accountId]);

    return (
        <div className="card mb-5 mb-xl-10 position-relative">
            {/* header */}
            <div className="card-header cursor-pointer d-flex flex-wrap justify-content-between align-items-center">
                <div className="card-title m-0 d-flex align-items-center">
                    <h3 className="fw-bold m-0">Câu hỏi: </h3>
                    {!isGettingQuestionsListOfUser ? (
                        <h3
                            className="fw-bold m-0 pl-2"
                            style={{ color: AppResource.colors.featureColor }}
                        >
                            {questionsListOfUser.length}
                        </h3>
                    ) : (
                        <div className="ml-2">
                            <span className="spinner spinner-loader spinner-primary"></span>
                        </div>
                    )}
                </div>
            </div>
            {/* body */}
            <div className="card-body p-0">
                {isGettingQuestionsListOfUser ? (
                    <div className="d-flex align-items-center justify-content-center my-10">
                        <Loading
                            showBackground={false}
                            message="Đang lấy dữ liệu"
                        />
                    </div>
                ) : questionsListOfUser?.length > 0 ? (
                    questionsListOfUser?.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className="d-flex flex-column p-5"
                                style={{ borderBottom: " 1px solid #EBEDF3" }}
                            >
                                <div className="d-flex flex-wrap justify-content-between">
                                    <div
                                        className="fs-5 my-2 font-weight-bolder"
                                        onClick={() => {
                                            navigate(
                                                `/question/detail/${item?._id}`
                                            );
                                        }}
                                        style={{ cursor: "pointer" }}
                                    >
                                        {item.title}
                                    </div>
                                    {currentAccount?._id === accountId ? (
                                        <div className="d-flex align-items-center">
                                            <a
                                                className="btn btn-icon btn-sm btn-light-primary btn-hover-primary mr-2"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedQuestion(item);
                                                    setShowModalEditQuestion(
                                                        true
                                                    );
                                                }}
                                            >
                                                <i className="far fa-pen p-0 icon-1x" />
                                            </a>
                                            <a
                                                className="btn btn-icon btn-sm btn-light-danger btn-hover-danger"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setSelectedQuestion(item);
                                                    setShowModalDeleteQuestion(
                                                        true
                                                    );
                                                }}
                                            >
                                                <i className="far fa-trash p-0 icon-1x" />
                                            </a>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="d-flex mt-4">
                                    {item?.tagIds?.map((tag, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className="badge badge-secondary mr-4 d-flex align-items-center"
                                            >
                                                <span>{tag?.name}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="d-flex mt-4 justify-content-between flex-wrap">
                                    <div className="d-flex">
                                        <div className="p-2 me-3">
                                            <i className="fas fa-comment me-2 text-hover-success cursor-pointer"></i>
                                            2
                                        </div>
                                        <div className="p-2 me-3">
                                            <i className="fas fa-thumbs-up me-2 text-hover-primary cursor-pointer"></i>
                                            {item?.likeCount
                                                ? item?.likeCount
                                                : 0}
                                        </div>
                                        <div className="p-2 me-3">
                                            <i className="fas fa-thumbs-down me-2 text-hover-danger cursor-pointer"></i>
                                            {item?.dislikeCount
                                                ? item?.dislikeCount
                                                : 0}
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        Ngày tạo:{" "}
                                        {Utils.formatDateTime(
                                            item?.createdAt,
                                            "DD-MM-YYYY"
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="mt-8">
                        <Empty
                            text="Không có kết quả phù hợp"
                            buttonText="Làm mới"
                            visible={false}
                            imageEmpty={
                                AppResource.images.errorStates.noMatchFound
                            }
                        />
                    </div>
                )}
            </div>
            <ModalEditQuestion
                onClose={() => setShowModalEditQuestion(false)}
                show={showModalEditQuestion}
                questionItem={selectedQuestion}
            />
            <DialogModal
                title="Xóa câu hỏi"
                description={`Bạn có chắc muốn xóa câu hỏi với tiêu đề ${selectedQuestion?.title}`}
                show={showModalDeleteQuestion}
                onClose={() => setShowModalDeleteQuestion(false)}
                onExecute={handleDeleteQuestion}
            />
        </div>
    );
}

export default AccountQuestionScreen;
