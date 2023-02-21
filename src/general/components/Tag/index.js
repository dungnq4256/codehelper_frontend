import React from "react";
import PropTypes from "prop-types";
import "./style.scss";
import { NavLink } from "react-router-dom";

Tag.propTypes = {
    className: PropTypes.string,
    tagName: PropTypes.object,
};

Tag.defaultProps = {
    className: "",
    tagName: "",
};
function Tag(props) {
    const { tagName, className } = props;
    return (
        <NavLink to={`/dashboard/tagged/${tagName}`} className={`TagElement d-inline-flex justify-content-center align-items-center ms-2 rounded ${className}`}>
            <span className="badge rounded-pill text-secondary">
                {tagName}
            </span>
        </NavLink>
    );
}

export default Tag;
