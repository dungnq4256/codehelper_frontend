import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "./style.scss";

MenuItem.propTypes = {
    className: PropTypes.string,
    classNameTitle: PropTypes.string,
    icon: PropTypes.string,
    text: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string,
};

MenuItem.defaultProps = {
    className: "",
    classNameTitle: "",
    icon: "",
    text: "",
    title: "",
    url: "",
};
function MenuItem(props) {
    const { className,classNameTitle, icon, text, title, url} = props;
    const navigate = useNavigate();
    function handleNavigate(url){
        navigate(url)
    }

    return (
        <div onClick={() => handleNavigate(url)} >
            <div
                className={`MenuItem d-flex align-items-center py-4 px-lg-1  ${className}`}
                title={title}
            >
                <i className={`px-7 ${icon}`}></i>
                <div className={`MenuItemName ${classNameTitle}`}>{text}</div>
            </div>
        </div>
    );
}

export default MenuItem;
