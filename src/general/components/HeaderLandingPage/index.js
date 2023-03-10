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
            password: Yup.string().trim().required("B???n ch??a nh???p m???t kh???u"),
            newPassword: Yup.string()
                .required("B???n ch??a nh???p m???t kh???u")
                .min(6, "M???t kh???u ph???i ch???a ??t nh???t 6 k?? t???")
                .matches(/^\S*$/, "M???t kh???u kh??ng ???????c ch???a kho???ng tr???ng"),
            confirmPassword: Yup.string()
                .required("B???n ch??a x??c nh???n m???t kh???u")
                .oneOf([Yup.ref("newPassword"), null], "M???t kh???u kh??ng kh???p"),
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
                            <span onClick={() => handleNavigate("/#home")}>Trang ch???</span>
                        </a>
                        <a href='#introduction' className='HeaderLandingPageNavItem'>
                            <span onClick={() => handleNavigate("/#introduction")}>Gi???i thi???u</span>
                        </a>
                        <a href='#contact' className='HeaderLandingPageNavItem'>
                            <span onClick={() => handleNavigate("/#contact")}>Li??n h???</span>
                        </a>
                        <a className='HeaderLandingPageNavItem'>
                            <span onClick={() => handleNavigate("/question")}>C??u h???i</span>
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
                            title='T???o c??u h???i'>
                            <i className='far fa-plus-circle text-white'></i>
                            <div className='d-flex ms-3'>T???o c??u h???i</div>
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
                                    ????ng k??
                                </button>
                            </NavLink>
                            <NavLink to='/sign-in'>
                                <button type='button' className='ButtonCancel ms-3'>
                                    ????ng nh???p
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
                                            Trang ch???
                                        </a>
                                    </li>
                                )}
                                {menu && (
                                    <li className='d-flex d-md-none'>
                                        <a className='dropdownMenuItem' href='#introduction'>
                                            Gi???i thi???u
                                        </a>
                                    </li>
                                )}
                                {menu && (
                                    <li className='d-flex d-md-none'>
                                        <a className='dropdownMenuItem' href='#contact'>
                                            Li??n h???
                                        </a>
                                    </li>
                                )}
                                {menu && (
                                    <li className='d-flex d-md-none'>
                                        <NavLink className='dropdownMenuItem' to='/question'>
                                            C??u h???i
                                        </NavLink>
                                    </li>
                                )}
                                {buttonAddQuestion && (
                                    <li className='d-flex d-md-none'>
                                        <NavLink className='dropdownMenuItem ' to='/question/create'>
                                            <i className='far fa-plus-circle mr-4'></i>
                                            T???o c??u h???i
                                        </NavLink>
                                    </li>
                                )}
                                {buttonSign && (
                                    <li className='border-bottom-0 py-4'>
                                        <NavLink to='/sign-up'>
                                            <button type='button' className='ButtonPrimary py-2 px-7'>
                                                ????ng k??
                                            </button>
                                        </NavLink>
                                        <NavLink to='/sign-in'>
                                            <button type='button' className='ButtonCancel py-2 ms-3'>
                                                ????ng nh???p
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
                                        Th??ng tin c?? nh??n
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className='dropdown-item'
                                        href='#'
                                        onClick={() => setShowChangePasswordModal(true)}>
                                        ?????i m???t kh???u
                                    </a>
                                </li>
                                <li>
                                    <a className='dropdown-item' href='#' onClick={() => setShowLogOutModal(true)}>
                                        ????ng xu???t
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
                                <a href='#home'>Trang ch???</a>
                                <a href='#introduction'>Gi???i thi???u</a>
                                <a href='#contact'>Li??n h???</a>
                                <NavLink to='/question'>C??u h???i</NavLink>
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
                                        Th??ng tin c?? nh??n
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className='dropdownMenuItem' to='/question/create'>
                                        <i className='far fa-plus-circle mr-4'></i>
                                        T???o c??u h???i
                                    </NavLink>
                                </li>
                                {/* <li>
                                    <NavLink
                                        className="dropdownMenuItem"
                                        to="#"
                                    >
                                        <i className="far fa-bell mr-4"></i>
                                        Th??ng b??o
                                        <div className='notificationNumber ms-auto text-white rounded-circle'>2</div>
                                    </NavLink>
                                </li> */}
                                <li>
                                    <NavLink
                                        className='dropdownMenuItem'
                                        onClick={() => setShowChangePasswordModal(true)}>
                                        <i className='far fa-unlock-alt mr-4'></i>
                                        ?????i m???t kh???u
                                    </NavLink>
                                </li>
                                <li className='border-bottom-0'>
                                    <NavLink className='dropdownMenuItem' onClick={() => setShowLogOutModal(true)}>
                                        <i className='far fa-sign-out mr-4'></i>
                                        ????ng xu???t
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
                title='????ng xu???t'
                description='B???n c?? ch???c ch???n mu???n ????ng xu???t?'
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
                title='?????i m???t kh???u'
                close={false}
                onExecute={formik.handleSubmit}>
                <form className='w-100' onSubmit={formik.handleSubmit}>
                    <div>
                        <div>
                            <BaseTextField
                                require={true}
                                type='password'
                                name='password'
                                placeholder='Nh???p m???t kh???u c??...'
                                label='M???t kh???u c??'
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
                                placeholder='Nh???p m???t kh???u m???i...'
                                label='M???t kh???u m???i'
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
                                placeholder='Nh???p l???i m???t kh???u m???i...'
                                label='Nh???p l???i m???t kh???u m???i'
                                fieldHelper={formik.getFieldHelpers("confirmPassword")}
                                fieldProps={formik.getFieldProps("confirmPassword")}
                                fieldMeta={formik.getFieldMeta("confirmPassword")}
                            />
                        </div>
                    </div>
                    {isChangingPassword && (
                        <div className='d-flex align-items-center justify-content-center m-4'>
                            <Loading showBackground={false} message='Vui l??ng ?????i trong ??t ph??t' />
                        </div>
                    )}
                </form>
            </DialogModal>
        </div>
    );
}

export default HeaderLandingPage;
