import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Utils from "general/utils/Utils";
import MdEditor from "react-markdown-editor-lite";
import MDEditor from "@uiw/react-md-editor";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import WebsocketHelper from "../../../../general/helpers/WebSocketClientHelper";

ModalEditAnswer.propTypes = {
    answerItem: PropTypes.object,
    show: PropTypes.bool,
    onClose: PropTypes.func,
};

ModalEditAnswer.defaultProps = {
    answerItem: null,
    show: false,
    onClose: null,
};

function ModalEditAnswer(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // MARK: --- Params ---
    const { answerItem, show, onClose } = props;
    const [showing, setShowing] = useState(true);

    const formik = useFormik({
        initialValues: {
            content: "",
        },
        onSubmit: async (values) => {
            const params = { ...answerItem, content: values.content };
            try {
                WebsocketHelper.updateAnswer(params);
            } catch (err) {
                console.log(`${err.message}`);
            }
        },
        validationSchema: Yup.object({
            content: Yup.string().trim().required("Bạn chưa nhập câu trả lời"),
        }),
    });

    function handleEditMyAnswerChange({ html, text }) {
        formik.getFieldHelpers("content").setValue(text);
    }
    async function onImageUpload(file) {
        const image = await Utils.uploadCloudinary(file);
        return image.data.secure_url;
    }

    useEffect(() => {
        if (answerItem) {
            formik.getFieldHelpers("content").setValue(answerItem?.content);
        }
    }, [answerItem]);

    // MARK: --- Functions ---
    function handleClose() {
        if (onClose) {
            onClose();
        }
    }
    return (
        <div className='ModalEditAnswer'>
            <Modal
                className=''
                show={show && showing}
                size='lg'
                onHide={handleClose}
                centered
                onExited={() => {
                    // formik.handleReset();
                }}>
                {/* header */}
                <Modal.Header className='px-5 py-5 d-flex align-items-center justify-content-center position-relative'>
                    <Modal.Title className=''>Chỉnh sửa câu trả lời</Modal.Title>
                    <div
                        className='btn btn-xs btn-icon btn-light btn-hover-secondary cursor-pointer position-absolute right-0 mr-5'
                        onClick={handleClose}>
                        <i className='far fa-times'></i>
                    </div>
                </Modal.Header>
                {/* body */}
                <Modal.Body className='bg-light'>
                    <form className='w-100'>
                        <div>
                            <div>
                                <div className='d-flex flex-column mt-5 p-7 p-lg-10 border-1 bg-white shadow-sm rounded'>
                                    <div className='fs-5 fw-bold mb-3'>Câu trả lời</div>
                                    <MdEditor
                                        view={{ html: false }}
                                        canView={{ fullScreen: false }}
                                        onImageUpload={onImageUpload}
                                        allowPasteImage={true}
                                        placeholder='Nhập câu trả lời của bạn tại đây...'
                                        style={{
                                            minHeight: "300px",
                                            maxHeight: "600px",
                                        }}
                                        renderHTML={(text) => <MDEditor.Markdown source={text} />}
                                        value={formik.getFieldProps("content").value}
                                        onChange={handleEditMyAnswerChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal.Body>
                {/* footer */}
                <Modal.Footer>
                    <div className='w-100 d-flex row'>
                        <Button
                            className='font-weight-bold flex-grow-1 col mr-3 AppButton'
                            variant='secondary'
                            onClick={handleClose}>
                            {`Huỷ`}
                        </Button>
                        <Button
                            className={`font-weight-bold flex-grow-1 col ml-3 AppButton`}
                            variant='primary'
                            onClick={() => {
                                handleClose();
                                formik.handleSubmit();
                            }}>
                            Lưu lại
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ModalEditAnswer;
