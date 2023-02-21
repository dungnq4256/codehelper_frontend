import React from "react";
import PropTypes from "prop-types";
import UserHelper from "general/helpers/UserHelper";
import AppResource from "general/constants/AppResource";
import './style.scss'

SummaryUser.propTypes = {
    avatar: PropTypes.string,
    userName: PropTypes.string,
    job: PropTypes.string,
    email: PropTypes.string,
    address: PropTypes.string,
    phone: PropTypes.string,
};
SummaryUser.defaultProps = {
    avatar: "",
    userName: "",
    job: "",
    email: "",
    address: "",
    phone: ""
};

function SummaryUser(props) {
    const { avatar, userName, job, email, address, phone } = props;
    return (
        <div className="h-100 rounded-3 card card-custom card-stretch gutter-b p-5 d-flex flex-column justify-content-between">
            <div className="d-flex">
                <div className="flex-shrink-0">
                    <img
                        className="SummaryUser_Avatar"
                        src={avatar || UserHelper.getRandomAvatarUrl()}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = UserHelper.getRandomAvatarUrl();
                        }}
                        alt="avatar"
                        style={{height: "45px", width: "45px"}}
                    />
                </div>
                <div className="flex-grow-1 mx-2">
                    <p className="fw-bold font-size-h6 my-0 q-max-line-1">{userName}</p>
                    <p className="SummaryUser_Infor q-max-line-1">{job}</p>
                </div>
            </div>
            <div className="d-flex flex-column">
                <div className="d-flex align-items-center mb-2">
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "16px" }}
                    >
                        <i
                            className="fas fa-envelope"
                            style={{
                                color: AppResource.colors.featureColor
                            }}
                        ></i>
                    </div>
                    <span className="SummaryUser_Infor ml-2 q-max-line-1">{email}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "16px" }}
                    >
                        <i
                            className="fas fa-map-marker-alt"
                            style={{
                                color: AppResource.colors.featureColor
                            }}
                        ></i>
                    </div>
                    <span className="SummaryUser_Infor ml-2 q-max-line-1">{address}</span>
                </div>
                <div className="d-flex align-items-center">
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ width: "16px" }}
                    >
                        <i
                            className="fas fa-phone"
                            style={{
                                color: AppResource.colors.featureColor
                            }}
                        ></i>
                    </div>
                    <span className="SummaryUser_Infor ml-2 q-max-line-1">{phone}</span>
                </div>
            </div>
        </div>
    );
}

export default SummaryUser;
