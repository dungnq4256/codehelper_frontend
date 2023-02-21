import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import BaseSearchBar from "../Form/BaseSearchBar";
import "./style.scss";
import UserHelper from "general/helpers/UserHelper";
import DialogModal from "../DialogModal";
import { useDispatch, useSelector } from "react-redux";
import { thunkChangePassword, thunkSignOut } from "app/authSlice";
import Utils from "general/utils/Utils";
import { useFormik } from "formik";
import * as Yup from "yup";
import BaseTextField from "../Form/BaseTextField";
import ToastHelper from "general/helpers/ToastHelper";
import Loading from "../Loading";
import { LogoIcon } from "../../../assets/icons/Icons";
HeaderLandingPage.propTypes = {
    loggedIn: PropTypes.bool,
    searchBar: PropTypes.bool,
    logo: PropTypes.bool,
    menu: PropTypes.bool,
    buttonAddQuestion: PropTypes.bool,
    buttonSign: PropTypes.bool,
};

HeaderLandingPage.defaultProps = {
    loggedIn: false,
    searchBar: true,
    logo: false,
    menu: false,
    buttonAddQuestion: true,
    buttonSign: true,
};

function HeaderLandingPage(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isChangingPassword, currentAccount } = useSelector((state) => state?.auth);
    const loggedIn = UserHelper.checkAccessTokenValid();
    const { logo, menu, buttonAddQuestion, buttonSign } = props;
    let [showSearchBar, setShowSearchBar] = useState(false);
    const [showLogOutModal, setShowLogOutModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const handleShowSearchBar = () => {
        setShowSearchBar(!showSearchBar);
    };

    function handleNavigate(url) {
        navigate(url);
    }

    const formik = useFormik({
        initialValues: {
            password: "",
            newPassword: "",
            confirmPassword: "",
        },
        onSubmit: async (values, { resetForm }) => {
            const params = { ...values };
            let inputPassword = params.password;
            params.password = Utils.sha256(inputPassword);
            delete params?.confirmPassword;
            let hashPassword = Utils.sha256(params.newPassword);
            params.newPassword = hashPassword;
            // console.log(` on submit: ${JSON.stringify(params)}`);
            try {
                const res = await dispatch(thunkChangePassword(params));
                // console.log(res);
                if (res.payload.result === "failed") {
                    ToastHelper.showError(`${res.payload.message}`);
                } else {
                    setShowChangePasswordModal(false);
                    resetForm({ values: "" });
                    navigate("/");
                }
            } catch (error) {
                console.log(` error: ${error.message}`);
            }
        },
        validationSchema: Yup.object({
            password: Yup.string().trim().required("Bạn chưa nhập mật khẩu"),
            newPassword: Yup.string()
                .required("Bạn chưa nhập mật khẩu")
                .min(6, "Mật khẩu phải chứa ít nhất 6 kí tự")
                .matches(/^\S*$/, "Mật khẩu không được chứa khoảng trắng"),
            confirmPassword: Yup.string()
                .required("Bạn chưa xác nhận mật khẩu")
                .oneOf([Yup.ref("newPassword"), null], "Mật khẩu không khớp"),
        }),
    });

    return (
        <div
            className='HeaderLandingPage d-flex sticky-top justify-content-between align-items-center shadow-sm px-5 py-4 ps-5 bg-body'
            style={{ zIndex: "1000" }}>
            {logo && (
                <NavLink
                    to="/"
                    className="d-flex align-items-center fs-5 fw-normal "
                >
                    {/* <i
                        className="fab fa-forumbee d-flex fa-2x ms-sm-2"
                        style={{ color: "#F48023" }}
                    ></i> */}
                    <LogoIcon className="ms-sm-2" />
                    <div className="d-none d-sm-flex ms-2 text-black">
                        Code<div className="fw-bolder">Helper</div>
                    </div>
                </NavLink>
            )}
            <div className='d-flex flex-fill justify-content-end'>
                {menu && (
                    <div className='HeaderLandingPageNav d-none d-md-flex align-items-center justify-content-end'>
                        <a href='#home' className='HeaderLandingPageNavItem'>
                            <span onClick={() => handleNavigate("/#home")}>Trang chủ</span>
                        </a>
                        <a href='#introduction' className='HeaderLandingPageNavItem'>
                            <span onClick={() => handleNavigate("/#introduction")}>Giới thiệu</span>
                        </a>
                        <a href='#contact' className='HeaderLandingPageNavItem'>
                            <span onClick={() => handleNavigate("/#contact")}>Liên hệ</span>
                        </a>
                        <a className='HeaderLandingPageNavItem'>
                            <span onClick={() => handleNavigate("/question")}>Câu hỏi</span>
                        </a>
                    </div>
                )}
                {buttonAddQuestion && (
                    <div className='d-none d-md-flex justify-content-end'>
                        <button
                            onClick={() => {
                                if (UserHelper.checkAccessTokenValid()) {
                                    navigate("/question/create");
                                } else {
                                    navigate("/sign-in");
                                }
                            }}
                            type='button'
                            className='ButtonPrimary d-flex mx-4'
                            title='Tạo câu hỏi'>
                            <i className='far fa-plus-circle text-white'></i>
                            <div className='d-flex ms-3'>Tạo câu hỏi</div>
                        </button>
                    </div>
                )}
            </div>

            {!loggedIn && (
                <div>
                    {/* Screen >= 576px */}
                    {buttonSign && (
                        <div className='d-none d-lg-block'>
                            <NavLink to='/sign-up'>
                                <button type='button' className='ButtonPrimary'>
                                    <i className='far fa-user-plus me-2 text-white'></i>
                                    Đăng ký
                                </button>
                            </NavLink>
                            <NavLink to='/sign-in'>
                                <button type='button' className='ButtonCancel ms-3'>
                                    Đăng nhập
                                </button>
                            </NavLink>
                        </div>
                    )}
                    {/* Screen < 576px */}
                    <div className='d-flex d-lg-none'>
                        <input type='checkbox' id='dropdownMenu-notLoggedIn' />
                        <label htmlFor='dropdownMenu-notLoggedIn' id='overlay-button'>
                            <span></span>
                        </label>
                        <div id='overlay'>
                            <ul className='d-flex flex-column justify-content-center align-items-center ps-0 m-0'>
                                {menu && (
                                    <li className='d-flex d-md-none'>
                                        <a className='dropdownMenuItem' href='#home'>
                                            Trang chủ
                                        </a>
                                    </li>
                                )}
                                {menu && (
                                    <li className='d-flex d-md-none'>
                                        <a className='dropdownMenuItem' href='#introduction'>
                                            Giới thiệu
                                        </a>
                                    </li>
                                )}
                                {menu && (
                                    <li className='d-flex d-md-none'>
                                        <a className='dropdownMenuItem' href='#contact'>
                                            Liên hệ
                                        </a>
                                    </li>
                                )}
                                {menu && (
                                    <li className='d-flex d-md-none'>
                                        <NavLink className='dropdownMenuItem' to='/question'>
                                            Câu hỏi
                                        </NavLink>
                                    </li>
                                )}
                                {buttonAddQuestion && (
                                    <li className='d-flex d-md-none'>
                                        <NavLink className='dropdownMenuItem ' to='/question/create'>
                                            <i className='far fa-plus-circle mr-4'></i>
                                            Tạo câu hỏi
                                        </NavLink>
                                    </li>
                                )}
                                {buttonSign && (
                                    <li className='border-bottom-0 py-4'>
                                        <NavLink to='/sign-up'>
                                            <button type='button' className='ButtonPrimary py-2 px-7'>
                                                Đăng ký
                                            </button>
                                        </NavLink>
                                        <NavLink to='/sign-in'>
                                            <button type='button' className='ButtonCancel py-2 ms-3'>
                                                Đăng nhập
                                            </button>
                                        </NavLink>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {loggedIn && (
                <div className='d-flex justify-content-center ms-auto align-items-center'>
                    {/* Screen >= 768px */}
                    <div className="d-none d-md-flex align-items-center">
                        {/* <div className="bell mx-5">
                            <i className="far fa-bell"></i>
                            <div></div>
                        </div> */}
                        <label className="d-flex" htmlFor="dropdownMenuButton">
                            <div className="HeaderLandingPage_Avatar">
                                <img
                                    src={currentAccount?.avatar?.path || UserHelper.getRandomAvatarUrl()}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = UserHelper.getRandomAvatarUrl();
                                    }}
                                    alt='avatar'
                                />
                            </div>
                            <button
                                className='show-option'
                                id='dropdownMenuButton'
                                data-bs-toggle='dropdown'
                                aria-expanded='false'>
                                <i className='fas fa-sort-down'></i>
                            </button>

                            <ul className='dropdown-menu my-4' aria-labelledby='dropdownMenuButton'>
                                <li>
                                    <a
                                        className='dropdown-item pe-5'
                                        href='#'
                                        onClick={() => navigate(`/account/${currentAccount?._id}`)}>
                                        Thông tin cá nhân
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className='dropdown-item'
                                        href='#'
                                        onClick={() => setShowChangePasswordModal(true)}>
                                        Đổi mật khẩu
                                    </a>
                                </li>
                                <li>
                                    <a className='dropdown-item' href='#' onClick={() => setShowLogOutModal(true)}>
                                        Đăng xuất
                                    </a>
                                </li>
                            </ul>
                        </label>
                    </div>

                    {/* Screen < 768px */}
                    {menu && (
                        <div className='dropdownMenuLandingPage d-block d-md-none'>
                            <button className='btn_dropdown'>
                                <i className='fas fa-sort-down '></i>
                            </button>
                            <div className='dropdownMenuDetail'>
                                <a href='#home'>Trang chủ</a>
                                <a href='#introduction'>Giới thiệu</a>
                                <a href='#contact'>Liên hệ</a>
                                <NavLink to='/question'>Câu hỏi</NavLink>
                            </div>
                        </div>
                    )}
                    <div className='d-flex d-md-none ms-auto'>
                        <input type='checkbox' id='dropdownMenu-loggedIn' />
                        <label htmlFor='dropdownMenu-loggedIn' id='overlay-button'>
                            <span></span>
                        </label>
                        <div id='overlay'>
                            <ul className='d-flex flex-column justify-content-center align-items-center ps-0 m-0 text-start'>
                                <li>
                                    <div className='d-flex flex-column align-items-center py-4'>
                                        <img
                                            className='header-sm-avatar'
                                            onClick={() => navigate(`/account/${currentAccount?._id}`)}
                                            src={currentAccount?.avatar?.path || UserHelper.getRandomAvatarUrl()}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = UserHelper.getRandomAvatarUrl();
                                            }}
                                            alt='avatar'
                                        />
                                        <div className='fs-6 fw-bold pt-2' onClick={() => navigate(`/account/${currentAccount?._id}`)}>{currentAccount?.fullname}</div>
                                    </div>
                                </li>
                                <li>
                                    <NavLink className='dropdownMenuItem' to = {`/account/${currentAccount?._id}`}>
                                        <i className='far fa-user-circle mr-4'></i>
                                        Thông tin cá nhân
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className='dropdownMenuItem' to='/question/create'>
                                        <i className='far fa-plus-circle mr-4'></i>
                                        Tạo câu hỏi
                                    </NavLink>
                                </li>
                                {/* <li>
                                    <NavLink
                                        className="dropdownMenuItem"
                                        to="#"
                                    >
                                        <i className="far fa-bell mr-4"></i>
                                        Thông báo
                                        <div className='notificationNumber ms-auto text-white rounded-circle'>2</div>
                                    </NavLink>
                                </li> */}
                                <li>
                                    <NavLink
                                        className='dropdownMenuItem'
                                        onClick={() => setShowChangePasswordModal(true)}>
                                        <i className='far fa-unlock-alt mr-4'></i>
                                        Đổi mật khẩu
                                    </NavLink>
                                </li>
                                <li className='border-bottom-0'>
                                    <NavLink className='dropdownMenuItem' onClick={() => setShowLogOutModal(true)}>
                                        <i className='far fa-sign-out mr-4'></i>
                                        Đăng xuất
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
            <DialogModal
                show={showLogOutModal}
                onClose={() => setShowLogOutModal(false)}
                icon='fad fa-user text-danger'
                title='Đăng xuất'
                description='Bạn có chắc chắn muốn đăng xuất?'
                onExecute={async () => {
                    await dispatch(thunkSignOut()).then(() => {
                        UserHelper.signOut();
                    });
                    navigate("/");
                }}
            />
            <DialogModal
                show={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
                icon='fad fa-user-lock text-danger'
                title='Đổi mật khẩu'
                close={false}
                onExecute={formik.handleSubmit}>
                <form className='w-100' onSubmit={formik.handleSubmit}>
                    <div>
                        <div>
                            <BaseTextField
                                require={true}
                                type='password'
                                name='password'
                                placeholder='Nhập mật khẩu cũ...'
                                label='Mật khẩu cũ'
                                fieldHelper={formik.getFieldHelpers("password")}
                                fieldProps={formik.getFieldProps("password")}
                                fieldMeta={formik.getFieldMeta("password")}
                            />
                        </div>
                        <div>
                            <BaseTextField
                                require={true}
                                type='password'
                                name='newPassword'
                                placeholder='Nhập mật khẩu mới...'
                                label='Mật khẩu mới'
                                fieldHelper={formik.getFieldHelpers("newPassword")}
                                fieldProps={formik.getFieldProps("newPassword")}
                                fieldMeta={formik.getFieldMeta("newPassword")}
                            />
                        </div>
                        <div>
                            <BaseTextField
                                require={true}
                                type='password'
                                name='confirmPassword'
                                placeholder='Nhập lại mật khẩu mới...'
                                label='Nhập lại mật khẩu mới'
                                fieldHelper={formik.getFieldHelpers("confirmPassword")}
                                fieldProps={formik.getFieldProps("confirmPassword")}
                                fieldMeta={formik.getFieldMeta("confirmPassword")}
                            />
                        </div>
                    </div>
                    {isChangingPassword && (
                        <div className='d-flex align-items-center justify-content-center m-4'>
                            <Loading showBackground={false} message='Vui lòng đợi trong ít phút' />
                        </div>
                    )}
                </form>
            </DialogModal>
        </div>
    );
}

export default HeaderLandingPage;
