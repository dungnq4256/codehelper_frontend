import React from "react";
import PropTypes from "prop-types";
import HeaderLandingPage from "general/components/HeaderLandingPage";
import "./style.scss";
import AuthContent from "../components/AuthContent";
import AppResource from "general/constants/AppResource";
import { useFormik } from "formik";
import BaseTextField from "general/components/Form/BaseTextField";
import AppButton from "general/components/AppButton";
import * as Yup from 'yup';
import ToastHelper from "general/helpers/ToastHelper";
import Utils from "general/utils/Utils";
import { useNavigate } from "react-router-dom";
import authApi from "api/authApi";
import PreferenceKeys from "general/constants/PreferenceKey";
import BaseDropdown from "general/components/Form/BaseDropdown";
import AppData from "general/constants/AppData";
SignUpScreen.propTypes = {};

const sTag = '[SignUpScreen]'

function SignUpScreen(props) {
    const navigate = useNavigate();
    const formik = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
        onSubmit: async (values) => {
            const params = {
                ...values
            };
            delete params?.confirmPassword;
            let hashPassword = Utils.sha256(params.password);
            params.password = hashPassword;
            console.log(`${sTag} on submit: ${JSON.stringify(params)}`);
            try {
                const res = await authApi.signUp(params);
                if (res) {
                    localStorage.setItem(PreferenceKeys.savedEmail, values.email);
                    localStorage.setItem(PreferenceKeys.savedPassword, /*values.password*/ '');
                    ToastHelper.showSuccess('Đăng ký tài khoản mới thành công');
                    navigate('/sign-in');
                }
            } catch (err) {
                console.log(`${sTag} sign up account error: ${err.message}`);
            }
        },
        validationSchema: Yup.object({
            email: Yup.string().required('Bạn chưa nhập email').email('Email không hợp lệ'),
            password: Yup.string().required('Bạn chưa nhập mật khẩu').min(6, 'Mật khẩu phải chứa ít nhất 6 kí tự').matches(/^\S*$/, 'Mật khẩu không được chứa khoảng trắng'),
            fullname: Yup.string().required('Bạn chưa nhập họ tên'),
            confirmPassword: Yup.string()
            .required('Bạn chưa xác nhận mật khẩu')
            .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
        }),
    });

    function handleNavigate(url){
        navigate(url);
    }
    return (
        <div className="SignUpScreen min-vh-100">
            <HeaderLandingPage logo={true} searchBar={false} menu={true} buttonSign={false} buttonAddQuestion={false}/>
            <AuthContent 
                leftTitle="Tham gia vào cộng đồng CodeHelper"
                leftDescription="Học hỏi và thu nạp nhiều kiến thức hơn với cộng đồng của những lập trình viên vừa có tâm vừa có tầm"
                authImage={AppResource.images.imgSignUp}
                leftElement={(
                   <form onSubmit={formik.handleSubmit}>
                        <div>
                            <div>
                                <BaseTextField 
                                    require={true}
                                    name='fullname'
                                    placeholder='Nhập Họ tên...'
                                    label='Họ tên'
                                    fieldHelper={formik.getFieldHelpers('fullname')}
                                    fieldProps={formik.getFieldProps('fullname')}
                                    fieldMeta={formik.getFieldMeta('fullname')}
                                />
                            </div>
                            <div>
                                <BaseTextField 
                                    require={true}
                                    name='email'
                                    placeholder='hi@example.com'
                                    label='Email'
                                    fieldHelper={formik.getFieldHelpers('email')}
                                    fieldProps={formik.getFieldProps('email')}
                                    fieldMeta={formik.getFieldMeta('email')}
                                />
                            </div>
                            <div className="row m-0">
                                <div className="col-6 pl-0">
                                    <BaseDropdown
                                        labelClassName="pt-0 pb-2"
                                        dropdownInitialValue="chọn"
                                        name={"job"}
                                        fieldProps={formik.getFieldProps("job")}
                                        fieldMeta={formik.getFieldMeta("job")}
                                        fieldHelpers={formik.getFieldHelpers("job")}
                                        label="Vai trò"
                                        options={AppData.jobs}
                                        onValueChanged={(value) => {
                                        formik.getFieldHelpers("job").setValue(value);
                                        }}
                                    />
                                </div>
                                <div className="col-6 pr-0">
                                    <BaseTextField 
                                        name='dob'
                                        // placeholder='hi@example.com'
                                        type="date"
                                        label='Ngày sinh'
                                        fieldHelper={formik.getFieldHelpers('dob')}
                                        fieldProps={formik.getFieldProps('dob')}
                                        fieldMeta={formik.getFieldMeta('dob')}
                                    />
                                </div>
                            </div>
                            <div>
                                <BaseTextField 
                                    require={true}
                                    type="password"
                                    name='password'
                                    placeholder='Nhập mật khẩu...'
                                    label='Mật khẩu'
                                    fieldHelper={formik.getFieldHelpers('password')}
                                    fieldProps={formik.getFieldProps('password')}
                                    fieldMeta={formik.getFieldMeta('password')}
                                />
                            </div>
                            <div>
                                <BaseTextField 
                                    require={true}
                                    type="password"
                                    name='confirmPassword'
                                    placeholder='Nhập lại mật khẩu...'
                                    label='Nhập lại mật khẩu'
                                    fieldHelper={formik.getFieldHelpers('confirmPassword')}
                                    fieldProps={formik.getFieldProps('confirmPassword')}
                                    fieldMeta={formik.getFieldMeta('confirmPassword')}
                                />
                            </div>
                            <div className="text-center font-weight-bolder cursor-pointer text-center" style={{color: AppResource.colors.featureColor}} >Quên mật khẩu ?</div>
                            <AppButton 
                                className="btn-orange mt-5 w-100"
                                text="Đăng ký"
                            />
                            <div className="text-center mt-5">Bạn đã có tài khoản CodeHelper? <span onClick={()=>handleNavigate('/sign-in')} className="cursor-pointer" style={{color: AppResource.colors.featureColor, textDecoration: "underline"}}>Đăng nhập</span></div>
                        </div>
                   </form>
                )}
            />
        </div>
    );
}

export default SignUpScreen;
