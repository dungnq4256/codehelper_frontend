import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import Utils from "general/utils/Utils";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
    thunkCreateTag,
    thunkGetTagListOfUser,
} from "features/TagScreen/tagSlice";
import Loading from "general/components/Loading";
import ToastHelper from "general/helpers/ToastHelper";
import BaseTextField from "general/components/Form/BaseTextField";

ModalCreateTag.propTypes = {
    show: PropTypes.bool,
    onClose: PropTypes.func,
};

ModalCreateTag.defaultProps = {
    show: false,
    onClose: null,
};

function ModalCreateTag(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // MARK: --- Params ---
    const { show, onClose } = props;
    const [showing, setShowing] = useState(true);

    const formik = useFormik({
        initialValues: {
            name: "",
            description: "",
        },
        onSubmit: async (values) => {
            const params = { ...values };
            try {
                const res = await dispatch(thunkCreateTag(params));
                console.log(res);
                if (res.payload) {
                    handleClose();
                    formik.handleReset();
                    ToastHelper.showSuccess("Thêm thẻ mới thành công");
                    await dispatch(thunkGetTagListOfUser());
                }
            } catch (err) {
                console.log(`${err.message}`);
            }
        },
        validationSchema: Yup.object({
            name: Yup.string().trim().required("Bạn chưa nhập tên thẻ"),
            description: Yup.string()
                .trim()
                .required("Bạn chưa nhập mô tả chi tiết thẻ"),
        }),
    });

    // MARK: --- Functions ---
    function handleClose() {
        if (onClose) {
            onClose();
        }
    }
    return (
        <div className="ModalCreateTag">
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
                    <Modal.Title className="">Thêm thẻ mới</Modal.Title>
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
                                    <div>
                                        <BaseTextField
                                            require={true}
                                            name="name"
                                            placeholder="Nhập tên thẻ..."
                                            label="Tên thẻ"
                                            fieldHelper={formik.getFieldHelpers(
                                                "name"
                                            )}
                                            fieldProps={formik.getFieldProps(
                                                "name"
                                            )}
                                            fieldMeta={formik.getFieldMeta(
                                                "name"
                                            )}
                                        />
                                    </div>
                                    <div>
                                        {/* <BaseTextField
                                            name="description"
                                            placeholder="Nhập mô tả chi tiết thẻ"
                                            label="Mô tả thẻ"
                                            fieldHelper={formik.getFieldHelpers(
                                                "description"
                                            )}
                                            fieldProps={formik.getFieldProps(
                                                "description"
                                            )}
                                            fieldMeta={formik.getFieldMeta(
                                                "description"
                                            )}
                                        /> */}
                                        
                                        <div className="d-flex flex-row">
                                            <label
                                                className="text-muted"
                                                htmlFor="description"
                                            >
                                                Mô tả thẻ
                                            </label>
                                            <span
                                                className="font-weight-boldest ml-1"
                                                style={{ color: "#E92E4E" }}
                                            >{`*`}</span>
                                        </div>
                                        <div>
                                            <textarea
                                                id="description"
                                                name="description"
                                                rows={6}
                                                className="InputTitle"
                                                placeholder="Nhập mô tả chi tiết thẻ..."
                                                value={
                                                    formik.getFieldProps(
                                                        "description"
                                                    ).value
                                                }
                                                onChange={(e) => {
                                                    formik
                                                        .getFieldHelpers(
                                                            "description"
                                                        )
                                                        .setValue(
                                                            e.target.value
                                                        );
                                                }}
                                            />
                                        </div>
                                    </div>
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

export default ModalCreateTag;
