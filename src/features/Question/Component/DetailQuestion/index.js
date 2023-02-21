import React, { useState } from "react";
import PropTypes from "prop-types";
import UserHelper from "general/helpers/UserHelper";
import MDEditor from "@uiw/react-md-editor";
import Tag from "general/components/Tag";
import "./style.scss";
import { useSelector } from "react-redux";
import DialogModal from "general/components/DialogModal";
import questionApi from "api/questionApi";
import ToastHelper from "general/helpers/ToastHelper";
import { useNavigate } from "react-router-dom";
import ModalEditQuestion from "../ModalEditQuestion";

DetailQuestion.propTypes = {
    srcAvatar: PropTypes.string,
    fullname: PropTypes.string,
    createdAt: PropTypes.string,
    title: PropTypes.string,
    contentTextProblem: PropTypes.string,
    contentTextExpect: PropTypes.string,
    Tags: PropTypes.array,
    comments: PropTypes.string,
    likes: PropTypes.number,
    dislikes: PropTypes.number,
    clickAccount: PropTypes.func,
    clickLike: PropTypes.func,
    colorIconLike: PropTypes.string,
    clickDislike: PropTypes.func,
    colorIconDislike: PropTypes.string,
};

DetailQuestion.defaultProps = {
    srcAvatar: "",
    fullname: "",
    createdAt: "",
    title: "",
    contentTextProblem: "",
    contentTextExpect: "",
    tags: [],
    comments: "",
    likes: null,
    dislikes: null,
    clickAccount: null,
    clickLike: null,
    clickDislike: null,
    colorIconLike: "",
    colorIconDislike: "",
};

function DetailQuestion(props) {
    const {
        avatar,
        fullname,
        createdAt,
        title,
        contentTextProblem,
        contentTextExpect,
        tags,
        comments,
        likes,
        dislikes,
        clickAccount,
        clickLike,
        clickDislike,
        colorIconLike,
        colorIconDislike,
    } = props;
    const navigate = useNavigate();
    const { currentAccount } = useSelector((state) => state?.auth);
    const { detailQuestion, answers } = useSelector((state) => state?.question);
    const isMyQuestion = currentAccount?._id === detailQuestion?.account?._id;
    const [showModalEditQuestion, setShowModalEditQuestion] = useState(false);
    const [showModalDeleteQuestion, setShowModalDeleteQuestion] = useState(false);

    async function handleDeleteQuestion() {
        const res = await questionApi.deleteQuestion({ _id: detailQuestion?._id });
        if (res.result === "success") {
            ToastHelper.showSuccess(`Xóa câu hỏi với tiêu đề ${detailQuestion?.title} thành công`);
            navigate("/question/list");
        }
    }

    return (
        <div className='DetailQuestion bg-white rounded shadow p-5 p-md-10'>
            <div className='d-flex align-items-center'>
                <div className='flex-shrink-0 symbol'>
                    <img
                        className='DetailQuestion_Avatar'
                        onClick={clickAccount}
                        src={avatar || UserHelper.getRandomAvatarUrl()}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = UserHelper.getRandomAvatarUrl();
                        }}
                        alt='avatar'
                    />
                </div>
                <div className='flex-grow-1 flex-fill mx-2'>
                    <div className='fw-bold fs-5 my-0 cursor-pointer' onClick={clickAccount}>
                        {fullname}
                    </div>
                </div>
                <div>
                    {isMyQuestion ? (
                        <button
                            className='ButtonEllipsis show-option'
                            id='dropdownMenuButton'
                            data-bs-toggle='dropdown'
                            aria-expanded='false'>
                            <i className='fa-2x fal fa-ellipsis-v'></i>
                        </button>
                    ) : null}

                    {isMyQuestion && (
                        <ul className='dropdown-menu my-4' aria-labelledby='dropdownMenuButton'>
                            <li
                                className='dropdown-item cursor-pointer pe-5'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowModalEditQuestion(true);
                                }}>
                                Chỉnh sửa câu hỏi
                            </li>
                            <li
                                className='dropdown-item cursor-pointer'
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowModalDeleteQuestion(true);
                                }}>
                                Xóa câu hỏi
                            </li>
                        </ul>
                    )}
                    {/* {!isMyQuestion && (
                        <ul
                            className="dropdown-menu my-4"
                            aria-labelledby="dropdownMenuButton"
                        >
                            <li className="dropdown-item cursor-pointer">
                                Báo cáo
                            </li>
                        </ul>
                    )} */}
                </div>
            </div>
            <div className='content pt-4'>
                <div className='fw-bold fs-3'>{title}</div>
                <div className='mt-1 fw-normal fs-6'>Ngày tạo: {createdAt}</div>
            </div>
            <div
                data-color-mode='light'
                className='overflow-auto'
                style={{ display: "grid", width: "auto", minWidth: "0" }}>
                <MDEditor.Markdown source={contentTextProblem} />
            </div>
            <div
                data-color-mode='light'
                className='mt-5 overflow-auto'
                style={{ display: "grid", width: "auto", minWidth: "0" }}>
                <MDEditor.Markdown source={contentTextExpect} />
            </div>
            <div className='mt-5 d-flex justify-content-between align-items-center flex-wrap'>
                <div className='d-flex flex-fill flex-wrap'>
                    {tags?.map((item, index) => {
                        return (
                            <div
                                key={index}
                                className='DetailQuestion_Item badge badge-secondary mr-4 d-flex align-items-center cursor-pointer'
                                onClick={async () => {
                                    navigate(`/question/tagged/${item?._id}`);
                                }}>
                                <span>{item?.name}</span>
                            </div>
                        );
                    })}
                </div>
                <div className='d-flex flex-wrap ms-auto'>
                    <button className='btn DetailQuestion_Item'>
                        <i className='fas fa-comment'></i>
                        {answers?.length}
                    </button>
                    <button className='btn DetailQuestion_Item' onClick={clickLike}>
                        <i className={`fas fa-thumbs-up text-hover-primary ${colorIconLike}`}></i>
                        {likes}
                    </button>
                    <button className='btn DetailQuestion_Item' onClick={clickDislike}>
                        <i className={`fas fa-thumbs-down text-hover-danger ${colorIconDislike}`}></i>
                        {dislikes}
                    </button>
                </div>
            </div>
            <ModalEditQuestion
                onClose={() => setShowModalEditQuestion(false)}
                show={showModalEditQuestion}
                questionItem={detailQuestion}
            />
            <DialogModal
                title='Xóa câu hỏi'
                description={`Bạn có chắc muốn xóa câu hỏi với tiêu đề ${detailQuestion?.title}`}
                show={showModalDeleteQuestion}
                onClose={() => setShowModalDeleteQuestion(false)}
                onExecute={handleDeleteQuestion}
            />
        </div>
    );
}

export default DetailQuestion;
