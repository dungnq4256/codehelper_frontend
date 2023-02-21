import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import BaseLayout from "general/components/BaseLayout";
import AppButton from "general/components/AppButton";
import * as Yup from "yup";
import UserHelper from "general/helpers/UserHelper";
import { useDispatch, useSelector } from "react-redux";
import "./style.scss";
import DialogModal from "general/components/DialogModal";
import { useFormik } from "formik";
import Utils from "general/utils/Utils";
import "react-markdown-editor-lite/lib/index.css";
import MdEditor from "react-markdown-editor-lite";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
// import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import MDEditor from "@uiw/react-md-editor";
import { thunkCreateQuestion } from "features/Question/questionSlice";
import { useNavigate } from "react-router-dom";
import BaseSearchBar from "general/components/Form/BaseSearchBar";
import { thunkGetTagList } from "features/TagScreen/tagSlice";
import Loading from "general/components/Loading";
import CellTag from "features/TagScreen/components/CellTag";
import Empty from "general/components/Empty";
import AppResource from "general/constants/AppResource";

CreateQuestionScreen.propTypes = {};

function CreateQuestionScreen(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isSigningIn, currentAccount } = useSelector((state) => state?.auth);
    const { tags, isGettingTags } = useSelector((state) => state?.tag);
    const [showPreviewQuestion, setShowPreviewQuestion] = useState(false);
    const [showResetQuestionModal, setShowResetQuestionModal] = useState(false);
    const [tagFilters, setTagFilter] = useState({
        q: "",
    });
    const needToRefreshTagList = useRef(null);
    const [selectedTags, setSelectedTags] = useState([]);

    const handleShowPreviewQuestion = () => {
        setShowPreviewQuestion(!showPreviewQuestion);
        document.documentElement.scrollTop = 0;
    };

    const formik = useFormik({
        initialValues: {
            title: "",
            contentTextProblem: "",
            contentTextExpect: "",
            tagIds: [],
        },
        onSubmit: async (values) => {
            const params = { ...values };
            console.log(params);
            try {
                const res = await dispatch(thunkCreateQuestion(params));
                if (res) {
                    navigate("/question/list");
                }
            } catch (err) {
                console.log(`${err.message}`);
            }
        },
        validationSchema: Yup.object({
            title: Yup.string().trim().required("Bạn chưa nhập tiêu đề câu hỏi"),
            contentTextProblem: Yup.string().trim().required("Bạn chưa nhập chi tiết vấn đề"),
            // contentTextExpect: Yup.string().trim().required("Bạn chưa nhập kết quả bạn mong đợi"),
        }),
    });

    function handleEditTextProblemChange({ html, text }) {
        formik.getFieldHelpers("contentTextProblem").setValue(text);
    }
    function handleEditTextExpectChange({ html, text }) {
        formik.getFieldHelpers("contentTextExpect").setValue(text);
    }
    async function onImageUpload(file) {
        const image = await Utils.uploadCloudinary(file);
        return image.data.secure_url;
    }

    // MARK --- Hooks: ---
    useEffect(() => {
        if (needToRefreshTagList.current) {
            dispatch(thunkGetTagList(tagFilters));
            needToRefreshTagList.current = false;
        }
    }, [tagFilters]);

    return (
        <div className='position-relative'>
            <BaseLayout selected='questions'>
                <div className='container-xxl'>
                    <div>
                        <h1>Đặt câu hỏi</h1>
                        <div className='d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded'>
                            <h4>Hướng dẫn các bước:</h4>
                            <ul>
                                <li className='mt-2 fs-5'>Tóm tắt vấn đề của bạn trong tiêu đề một dòng.</li>
                                <li className='mt-2 fs-5'>Mô tả vấn đề của bạn chi tiết hơn.</li>
                                <li className='mt-2 fs-5'>
                                    Mô tả những gì bạn đã cố gắng và những gì bạn mong đợi sẽ xảy ra.
                                </li>
                                <li className='mt-2 fs-5'>
                                    Thêm “thẻ” giúp hiển thị câu hỏi của bạn cho các thành viên của cộng đồng.
                                </li>
                                <li className='mt-2 fs-5'>Xem lại câu hỏi của bạn và đăng nó lên trang web.</li>
                            </ul>
                        </div>
                    </div>

                    <div>
                        <div className='d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded'>
                            <div className='fs-5 fw-bold mb-3'>Tiêu đề</div>
                            <div>
                                <input
                                    type='text'
                                    className='InputTitle'
                                    placeholder='Nhập tiêu đề câu hỏi...'
                                    value={formik.getFieldProps("title").value}
                                    onChange={(e) => {
                                        formik.getFieldHelpers("title").setValue(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {/* input Tag */}
                    <div>
                        <div className='d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded'>
                            <div className='fs-5 fw-bold mb-3'>Thẻ</div>
                            <div>
                                <div>
                                    {/* <input
                                        type='text'
                                        className='InputTag'
                                        value={tags}
                                        onChange={(e) => {
                                            setTags(e.target.value);
                                        }}
                                    /> */}
                                    <BaseSearchBar
                                        // onFocus={setShowTagList(true)}
                                        placeholder='Câu hỏi của bạn liên quan đến thể loại nào'
                                        name='tag_filter'
                                        value={tagFilters.q}
                                        onSubmit={(value) => {
                                            needToRefreshTagList.current = true;
                                            setTagFilter({
                                                ...tagFilters,
                                                q: value,
                                            });
                                        }}
                                    />
                                </div>

                                {tagFilters.q && (
                                    <div className='position-relative'>
                                        <div
                                            className='border row m-0 p-5 position-absolute bg-white zindex-5 w-100 overflow-auto max-h-400px'
                                            style={{ boxShadow: "rgba(0, 0, 0, 0.4) 0px 0px 10px" }}>
                                            {isGettingTags ? (
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <Loading showBackground={false} message='Đang lấy dữ liệu' />
                                                </div>
                                            ) : tags?.length > 0 ? (
                                                tags?.map((item, index) => {
                                                    return (
                                                        <div
                                                            key={index}
                                                            className='col-12 col-md-4 col-lg-3 col-xl-2 mb-7 cursor-pointer'
                                                            onClick={() => {
                                                                formik
                                                                    .getFieldHelpers("tagIds")
                                                                    .setValue([
                                                                        ...formik.getFieldProps("tagIds").value,
                                                                        item._id,
                                                                    ]);
                                                                setSelectedTags([...selectedTags, item]);
                                                                setTagFilter({ q: "" });
                                                            }}>
                                                            <CellTag
                                                                name={item?.name}
                                                                description={item?.description}
                                                                numberOfQuestion={item?.numberOfQuestion}
                                                                questionPerWeek={item?.questionPerWeek}
                                                                questionThisDay={item?.questionThisDay}
                                                            />
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div>
                                                    <Empty
                                                        text='Không có kết quả phù hợp'
                                                        buttonText='Làm mới'
                                                        visible={false}
                                                        imageEmpty={AppResource.images.errorStates.noSearchFound}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {selectedTags?.length > 0 ? (
                                    <div className='mt-4 d-flex flex-wrap'>
                                        {selectedTags?.map((item, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className='badge badge-secondary mr-4 d-flex align-items-center'>
                                                    <span>{item?.name}</span>
                                                    <i
                                                        className='fas fa-times text-remaining fa-md ml-2 cursor-pointer'
                                                        onClick={() => {
                                                            setSelectedTags(
                                                                selectedTags?.filter((tag) => tag._id !== item._id)
                                                            );
                                                            formik
                                                                .getFieldHelpers("tagIds")
                                                                .setValue(
                                                                    formik
                                                                        .getFieldProps("tagIds")
                                                                        .value.filter((tag) => tag !== item._id)
                                                                );
                                                        }}></i>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded'>
                            <div className='fs-5 fw-bold mb-3'>Chi tiết vấn đề của bạn là gì?</div>
                            <div data-color-mode='light'>
                                <MdEditor
                                    // onScroll={(e) => {
                                    //     console.log(e);
                                    // }}
                                    view={{ html: false }}
                                    canView={{ fullScreen: false }}
                                    onImageUpload={onImageUpload}
                                    allowPasteImage={true}
                                    placeholder='Nhập chi tiết vấn đề của bạn tại đây...'
                                    style={{ minHeight: "300px", maxHeight: "600px" }}
                                    renderHTML={(text) => <MDEditor.Markdown source={text} />}
                                    value={formik.getFieldProps("contentTextProblem").value}
                                    onChange={handleEditTextProblemChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className='d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded'>
                            <div data-color-mode='light' className='fs-5 fw-bold mb-3'>
                                Bạn đã thử những gì và bạn đang mong đợi điều gì?
                            </div>
                            <MdEditor
                                view={{ html: false }}
                                canView={{ fullScreen: false }}
                                onImageUpload={onImageUpload}
                                allowPasteImage={true}
                                placeholder='Nhập những cách bạn đã thử và mong đợi của bạn tại đây...'
                                style={{ minHeight: "300px", maxHeight: "600px" }}
                                renderHTML={(text) => <MDEditor.Markdown source={text} />}
                                value={formik.getFieldProps("contentTextExpect").value}
                                onChange={handleEditTextExpectChange}
                            />
                        </div>
                    </div>

                    <div>
                        <div className='d-flex justify-content-center mt-5'>
                            <AppButton className='ButtonPrimary me-5' onClick={handleShowPreviewQuestion}>
                                Xem trước câu hỏi của bạn
                            </AppButton>
                            <AppButton className='ButtonSecondary' onClick={() => setShowResetQuestionModal(true)}>
                                Hủy bản nháp
                            </AppButton>
                        </div>
                    </div>
                </div>
            </BaseLayout>
            {showPreviewQuestion && (
                <div
                    className='position-absolute top-0 w-100 h-100'
                    style={{
                        zIndex: "1002",
                        backgroundColor: " rgba(0, 0, 0, .5)",
                    }}>
                    <div
                        className='my-20 mx-5 mx-sm-10 mx-md-15 mx-lg-auto bg-white rounded p-5 p-md-10'
                        style={{ maxWidth: "800px", maxHeight: "90%", overflow: "auto" }}>
                        <div className='d-flex align-items-center'>
                            <div className='flex-shrink-0 symbol'>
                                <img
                                    className='header-avatar rounded-circle'
                                    src={currentAccount?.avatar?.path || UserHelper.getRandomAvatarUrl()}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = UserHelper.getRandomAvatarUrl();
                                    }}
                                    alt='avatar'
                                />
                            </div>
                            <div className='flex-grow-1 mx-2'>
                                <div className='fw-bold fs-5 my-0'>{currentAccount.fullname}</div>
                                <div className='fw-normal fs-6'>01-01-2023</div>
                            </div>
                        </div>
                        <div className='content'>
                            <div className='fw-bold fs-3'>{formik.getFieldProps("title").value}</div>
                        </div>
                        <div data-color-mode='light'>
                            <MDEditor.Markdown source={formik.getFieldProps("contentTextProblem").value} />
                        </div>
                        <div className='mt-5' data-color-mode='light'>
                            <MDEditor.Markdown source={formik.getFieldProps("contentTextExpect").value} />
                        </div>
                        {selectedTags?.length > 0 ? (
                            <div className='mt-4 d-flex flex-wrap'>
                                {selectedTags?.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className='badge badge-secondary mr-4 d-flex align-items-center'>
                                            <span>{item?.name}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : null}
                        <div className='container'>
                            <div className='d-flex justify-content-center mt-5'>
                                <AppButton
                                    className='ButtonPrimary me-5'
                                    width='10rem'
                                    onClick={() => formik.handleSubmit()}>
                                    Đăng câu hỏi
                                </AppButton>
                                <AppButton
                                    className='ButtonSecondary'
                                    width='10rem'
                                    onClick={handleShowPreviewQuestion}>
                                    Đóng
                                </AppButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <DialogModal
                show={showResetQuestionModal}
                onClose={() => setShowResetQuestionModal(false)}
                icon='fas fa-trash-alt text-danger'
                title='Hủy bản nháp'
                description='Bạn có chắc chắn hủy bản nháp?'
                onExecute={() => formik.handleReset()}
            />
        </div>
    );
}

export default CreateQuestionScreen;
