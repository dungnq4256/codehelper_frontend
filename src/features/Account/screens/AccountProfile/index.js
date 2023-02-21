import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import Utils from "general/utils/Utils";
import UserHelper from "general/helpers/UserHelper";
import { useFormik } from "formik";
import BaseTextField from "general/components/Form/BaseTextField";
import BaseDropdown from "general/components/Form/BaseDropdown";
import AppData from "general/constants/AppData";
import * as Yup from "yup";
import authApi from "api/authApi";
import ToastHelper from "general/helpers/ToastHelper";
import { thunkGetAccountInfor } from "app/authSlice";
import Loading from "general/components/Loading";
import useRouter from "Hooks/useRouter";
import { thunkGetAccountDetail } from "features/Account/accountSlice";

AccountProfile.propTypes = {};

function AccountProfile(props) {
    // MARK --- Params ---
    const { currentAccount } = useSelector((state) => state?.auth);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [thisAccount, setThisAccount] = useState({});
    const { isGettingAccountInfor, account } = useSelector((state) => state?.account);
    const router = useRouter();
    const accountId = router.query?.accountId;
    const dispatch = useDispatch();

    const formik = useFormik({
        initialValues: {
            fullname: "",
            job: "",
            dob: "",
            phone: "",
            gender: "",
            address: "",
        },
        onSubmit: async (values) => {
            try {
                setLoading(true);
                const res = await authApi.updateProfile(values);
                const { result } = res;
                if (result === "success") {
                    dispatch(thunkGetAccountInfor());
                    setLoading(false);
                    ToastHelper.showSuccess("Cập nhật thông tin cá nhân thành công");
                    setIsEditMode(false);
                } else {
                    setLoading(false);
                    ToastHelper.showError("Cập nhật thông tin thất bại");
                }
            } catch (error) {
                console.log(error.message);
                ToastHelper.showError("Cập nhật thông tin thất bại");
            }
        },
        validationSchema: Yup.object({
            fullname: Yup.string().required("Bạn chưa nhập họ tên"),
        }),
    });

    // MARK --- Hooks: ---
    useEffect(() => {
        if (currentAccount) {
            formik.getFieldHelpers("fullname").setValue(currentAccount?.fullname);
            formik.getFieldHelpers("job").setValue(currentAccount?.job);
            formik.getFieldHelpers("dob").setValue(currentAccount?.dob);
            formik.getFieldHelpers("phone").setValue(currentAccount?.phone);
            formik.getFieldHelpers("gender").setValue(currentAccount?.gender);
            formik.getFieldHelpers("address").setValue(currentAccount?.address);
        }
    }, [currentAccount, isEditMode]);


    useEffect(() => {
        if (currentAccount?._id === account?._id) {
            setThisAccount(currentAccount);
        } else {
            setThisAccount(account);
        }
    }, [account, accountId]);

    return (
        <div className='card mb-5 mb-xl-10 position-relative'>
            {loading && (
                <div className='d-flex align-items-center justify-content-center position-absolute w-100'>
                    <Loading showBackground={false} message='Vui lòng chờ' />
                </div>
            )}
            {/* header */}
            <div className='card-header cursor-pointer d-flex flex-wrap justify-content-between align-items-center'>
                <div className='card-title m-0'>
                    <h3 className='fw-bold m-0'>Thông tin cá nhân</h3>
                </div>
                {currentAccount?._id === account?._id ? (
                    isEditMode ? (
                        <div>
                            <div
                                className='btn btn-sm btn-danger align-self-center mr-4'
                                onClick={() => setIsEditMode(false)}>
                                Hủy
                            </div>
                            <div className='btn btn-sm btn-success align-self-center' onClick={formik.handleSubmit}>
                                Lưu lại
                            </div>
                        </div>
                    ) : (
                        <div className='btn btn-sm btn-primary align-self-center' onClick={() => setIsEditMode(true)}>
                            Chỉnh sửa
                        </div>
                    )
                ) : null}
            </div>

            {/* body */}
            <div className='card-body p-9'>
                <div className='row mb-7'>
                    <label className='col-lg-4 fw-semibold text-muted'>Email</label>
                    <div className='col-lg-8'>
                        <span className='fw-bold fs-6 text-gray-800'>{thisAccount?.email}</span>
                    </div>
                </div>
                <div className='row mb-7'>
                    <label className='col-lg-4 fw-semibold text-muted'>
                        Họ tên <span className={`${isEditMode ? "text-danger" : "d-none"}`}>*</span>
                    </label>
                    <div className='col-lg-8'>
                        {!isEditMode ? (
                            <span className='fw-bold fs-6 text-gray-800'>{thisAccount?.fullname}</span>
                        ) : (
                            <div className='max-w-200px'>
                                <BaseTextField
                                    className=''
                                    name='fullname'
                                    fieldHelper={formik.getFieldHelpers("fullname")}
                                    fieldMeta={formik.getFieldMeta("fullname")}
                                    fieldProps={formik.getFieldProps("fullname")}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className='row mb-7'>
                    <label className='col-lg-4 fw-semibold text-muted'>Vai trò</label>
                    <div className='col-lg-8'>
                        {!isEditMode ? (
                            <span className='fw-bold fs-6 text-gray-800'>{thisAccount?.job}</span>
                        ) : (
                            <div className='max-w-200px'>
                                <BaseTextField
                                    className=''
                                    name='job'
                                    fieldHelper={formik.getFieldHelpers("job")}
                                    fieldMeta={formik.getFieldMeta("job")}
                                    fieldProps={formik.getFieldProps("job")}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className='row mb-7'>
                    <label className='col-lg-4 fw-semibold text-muted'>Ngày sinh</label>
                    <div className='col-lg-8'>
                        {!isEditMode ? (
                            <span className='fw-bold fs-6 text-gray-800'>
                                {Utils.formatDateTime(thisAccount?.dob, "DD-MM-YYYY")}
                            </span>
                        ) : (
                            <div className='max-w-200px'>
                                <BaseTextField
                                    className=''
                                    type='date'
                                    name='dob'
                                    fieldHelper={formik.getFieldHelpers("dob")}
                                    fieldMeta={formik.getFieldMeta("dob")}
                                    fieldProps={formik.getFieldProps("dob")}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className='row mb-7'>
                    <label className='col-lg-4 fw-semibold text-muted'>Số điện thoại</label>
                    <div className='col-lg-8'>
                        {!isEditMode ? (
                            <span className='fw-bold fs-6 text-gray-800'>{thisAccount?.phone}</span>
                        ) : (
                            <div className='max-w-200px'>
                                <BaseTextField
                                    className=''
                                    name='phone'
                                    fieldHelper={formik.getFieldHelpers("phone")}
                                    fieldMeta={formik.getFieldMeta("phone")}
                                    fieldProps={formik.getFieldProps("phone")}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className='row mb-7'>
                    <label className='col-lg-4 fw-semibold text-muted'>Giới tính</label>
                    <div className='col-lg-8'>
                        {!isEditMode ? (
                            <span className='fw-bold fs-6 text-gray-800'>
                                {UserHelper.renderGender(thisAccount?.gender)}
                            </span>
                        ) : (
                            <div className='max-w-150px'>
                                <BaseDropdown
                                    options={AppData.genderOptions}
                                    dropdownInitialValue={UserHelper.renderGender(currentAccount?.gender)}
                                    className=''
                                    name='gender'
                                    fieldHelper={formik.getFieldHelpers("gender")}
                                    fieldMeta={formik.getFieldMeta("gender")}
                                    fieldProps={formik.getFieldProps("gender")}
                                />
                            </div>
                        )}
                    </div>
                </div>
                <div className='row mb-7'>
                    <label className='col-lg-4 fw-semibold text-muted'>Địa chỉ</label>
                    <div className='col-lg-8'>
                        {!isEditMode ? (
                            <span className='fw-bold fs-6 text-gray-800'>{thisAccount?.address}</span>
                        ) : (
                            <div className='max-w-200px'>
                                <BaseTextField
                                    className=''
                                    name='address'
                                    fieldHelper={formik.getFieldHelpers("address")}
                                    fieldMeta={formik.getFieldMeta("address")}
                                    fieldProps={formik.getFieldProps("address")}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AccountProfile;
