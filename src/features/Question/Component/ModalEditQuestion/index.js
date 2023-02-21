import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Utils from "general/utils/Utils";
import MdEditor from "react-markdown-editor-lite";
import MDEditor from "@uiw/react-md-editor";
import { thunkEditQuestion, thunkGetDetailQuestion } from "features/Question/questionSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BaseSearchBar from "general/components/Form/BaseSearchBar";
import CellTag from "features/TagScreen/components/CellTag";
import AppResource from "general/constants/AppResource";
import Empty from "general/components/Empty";
import { thunkGetTagList } from "features/TagScreen/tagSlice";
import Loading from "general/components/Loading";

ModalEditQuestion.propTypes = {
    questionItem: PropTypes.object,
    show: PropTypes.bool,
    onClose: PropTypes.func,
};

ModalEditQuestion.defaultProps = {
    questionItem: null,
    show: false,
    onClose: null,
};

function ModalEditQuestion(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // MARK: --- Params ---
    const { questionItem, show, onClose } = props;
    const [showing, setShowing] = useState(true);
    const { tags, isGettingTags } = useSelector((state) => state?.tag);
    const [tagFilters, setTagFilter] = useState({
        q: "",
    });
    const needToRefreshTagList = useRef(null);

    const [selectedTags, setSelectedTags] = useState([]);
    const formik = useFormik({
        initialValues: {
            title: "",
            contentTextProblem: "",
            contentTextExpect: "",
            tagIds: [],
        },
        onSubmit: async (values) => {
            const params = { _id: questionItem?._id, ...values };
            // console.log(params);
            try {
                const res = await dispatch(thunkEditQuestion(params));
                
                if (res) {
                    navigate(`/question/detail/${questionItem?._id}`);
                    await dispatch(thunkGetDetailQuestion({ _id: questionItem?._id }));
                }
            } catch (err) {
                console.log(`${err.message}`);
            }
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .trim()
                .required("Bạn chưa nhập tiêu đề câu hỏi"),
            contentTextProblem: Yup.string()
                .trim()
                .required("Bạn chưa nhập chi tiết vấn đề"),
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
    // MARK --- Hooks: ---
    useEffect(() => {
        if (questionItem) {
            setSelectedTags(questionItem?.tagIds);
            formik.getFieldHelpers("title").setValue(questionItem?.title);
            formik
                .getFieldHelpers("contentTextProblem")
                .setValue(questionItem?.contentTextProblem);
            formik
                .getFieldHelpers("contentTextExpect")
                .setValue(questionItem?.contentTextExpect);
            formik.getFieldHelpers("tagIds").setValue(questionItem?.tagIds?.map(item => item._id));
        }
    }, [questionItem]);

    // MARK: --- Functions ---
    function handleClose() {
        if (onClose) {
            onClose();
        }
    }
    return (
        <div className="ModalEditQuestion">
            <Modal
                className=""
                show={show && showing}
                size="lg"
                onHide={handleClose}
                centered
                onExited={() => {
                    // formik.handleReset();
                }}
            >
                {/* header */}
                <Modal.Header className="px-5 py-5 d-flex align-items-center justify-content-center position-relative">
                    <Modal.Title className="">Chỉnh sửa câu hỏi</Modal.Title>
                    <div
                        className="btn btn-xs btn-icon btn-light btn-hover-secondary cursor-pointer position-absolute right-0 mr-5"
                        onClick={handleClose}
                    >
                        <i className="far fa-times"></i>
                    </div>
                </Modal.Header>
                {/* body */}
                <Modal.Body className="bg-light">
                    <form className="w-100">
                        <div>
                            <div>
                                <div className="d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded">
                                    <div className="fs-5 fw-bold mb-3">
                                        Tiêu đề
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            className="InputTitle"
                                            placeholder="Nhập tiêu đề câu hỏi..."
                                            value={
                                                formik.getFieldProps("title")
                                                    .value || ""
                                            }
                                            onChange={(e) => {
                                                formik
                                                    .getFieldHelpers("title")
                                                    .setValue(e.target.value);
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* input Tag */}
                            <div>
                                <div className="d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded">
                                    <div className="fs-5 fw-bold mb-3">Thẻ</div>
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
                                                placeholder="Câu hỏi của bạn liên quan đến thể loại nào"
                                                name="tag_filter"
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
                                            <div className="position-relative">
                                                <div
                                                    className="border row m-0 p-5 position-absolute bg-white zindex-5 w-100 overflow-auto max-h-400px"
                                                    style={{
                                                        boxShadow:
                                                            "rgba(0, 0, 0, 0.4) 0px 0px 10px",
                                                    }}
                                                >
                                                    {isGettingTags ? (
                                                        <div className="d-flex align-items-center justify-content-center">
                                                            <Loading
                                                                showBackground={
                                                                    false
                                                                }
                                                                message="Đang lấy dữ liệu"
                                                            />
                                                        </div>
                                                    ) : tags?.length > 0 ? (
                                                        tags?.map(
                                                            (item, index) => {
                                                                return (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="col-12 col-md-4 mb-7 cursor-pointer"
                                                                        onClick={() => {
                                                                            formik
                                                                                .getFieldHelpers(
                                                                                    "tagIds"
                                                                                )
                                                                                .setValue(
                                                                                    [
                                                                                        ...formik.getFieldProps(
                                                                                            "tagIds"
                                                                                        )
                                                                                            .value,
                                                                                        item._id,
                                                                                    ]
                                                                                );
                                                                            setSelectedTags(
                                                                                [
                                                                                    ...selectedTags,
                                                                                    item,
                                                                                ]
                                                                            );
                                                                            setTagFilter(
                                                                                {
                                                                                    q: "",
                                                                                }
                                                                            );
                                                                        }}
                                                                    >
                                                                        <CellTag
                                                                            name={
                                                                                item?.name
                                                                            }
                                                                            description={
                                                                                item?.description
                                                                            }
                                                                            numberOfQuestion={
                                                                                item?.numberOfQuestion
                                                                            }
                                                                            questionPerWeek={
                                                                                item?.questionPerWeek
                                                                            }
                                                                            questionThisDay={
                                                                                item?.questionThisDay
                                                                            }
                                                                        />
                                                                    </div>
                                                                );
                                                            }
                                                        )
                                                    ) : (
                                                        <div>
                                                            <Empty
                                                                text="Không có kết quả phù hợp"
                                                                buttonText="Làm mới"
                                                                visible={false}
                                                                imageEmpty={
                                                                    AppResource
                                                                        .images
                                                                        .errorStates
                                                                        .noSearchFound
                                                                }
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {selectedTags?.length > 0 ? (
                                            <div className="mt-4 d-flex flex-wrap">
                                                {selectedTags?.map(
                                                    (item, index) => {
                                                        return (
                                                            <div
                                                                key={index}
                                                                className="badge badge-secondary mr-4 d-flex align-items-center"
                                                            >
                                                                <span>
                                                                    {item?.name}
                                                                </span>
                                                                <i
                                                                    className="fas fa-times text-remaining fa-md ml-2 cursor-pointer"
                                                                    onClick={() => {
                                                                        setSelectedTags(
                                                                            selectedTags?.filter(
                                                                                (
                                                                                    tag
                                                                                ) =>
                                                                                    tag._id !==
                                                                                    item._id
                                                                            )
                                                                        );
                                                                        formik
                                                                            .getFieldHelpers(
                                                                                "tagIds"
                                                                            )
                                                                            .setValue(
                                                                                formik
                                                                                    .getFieldProps(
                                                                                        "tagIds"
                                                                                    )
                                                                                    .value.filter(
                                                                                        (
                                                                                            tag
                                                                                        ) =>
                                                                                            tag !==
                                                                                            item._id
                                                                                    )
                                                                            );
                                                                    }}
                                                                ></i>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className="d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded">
                                    <div className="fs-5 fw-bold mb-3">
                                        Chi tiết vấn đề của bạn là gì?
                                    </div>
                                    <div data-color-mode="light">
                                        <MdEditor
                                            view={{ html: false }}
                                            canView={{ fullScreen: false }}
                                            onImageUpload={onImageUpload}
                                            allowPasteImage={true}
                                            placeholder="Nhập chi tiết vấn đề của bạn tại đây..."
                                            style={{
                                                minHeight: "300px",
                                                maxHeight: "600px",
                                            }}
                                            renderHTML={(text) => (
                                                <MDEditor.Markdown
                                                    source={text}
                                                />
                                            )}
                                            value={
                                                formik.getFieldProps(
                                                    "contentTextProblem"
                                                ).value
                                            }
                                            onChange={
                                                handleEditTextProblemChange
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded">
                                    <div
                                        data-color-mode="light"
                                        className="fs-5 fw-bold mb-3"
                                    >
                                        Bạn đã thử những gì và bạn đang mong đợi
                                        điều gì?
                                    </div>
                                    <MdEditor
                                        view={{ html: false }}
                                        canView={{ fullScreen: false }}
                                        onImageUpload={onImageUpload}
                                        allowPasteImage={true}
                                        placeholder="Nhập những cách bạn đã thử và mong đợi của bạn tại đây..."
                                        style={{
                                            minHeight: "300px",
                                            maxHeight: "600px",
                                        }}
                                        renderHTML={(text) => (
                                            <MDEditor.Markdown source={text} />
                                        )}
                                        value={
                                            formik.getFieldProps(
                                                "contentTextExpect"
                                            ).value
                                        }
                                        onChange={handleEditTextExpectChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                {/* footer */}
                <Modal.Footer>
                    <div className="w-100 d-flex row">
                        <Button
                            className="font-weight-bold flex-grow-1 col mr-3 AppButton"
                            variant="secondary"
                            onClick={handleClose}
                        >
                            {`Huỷ`}
                        </Button>
                        <Button
                            className={`font-weight-bold flex-grow-1 col ml-3 AppButton`}
                            variant="primary"
                            onClick={() => {
                                handleClose();
                                formik.handleSubmit();
                            }}
                        >
                            Lưu lại
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ModalEditQuestion;
